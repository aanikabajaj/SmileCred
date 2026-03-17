import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// Simple in-memory rate limiting map for MVP. 
// Uses user IDs mapped to a timestamp (last credited).
const cooldownMap = new Map<string, number>();
const COOLDOWN_MS = 5000; // 5 seconds per requirement

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = payload.userId as string;
    const now = Date.now();
    const lastCreditTime = cooldownMap.get(userId) || 0;

    // Phase 6 requirement: 1 smile every 5 seconds
    if (now - lastCreditTime < COOLDOWN_MS) {
      return NextResponse.json({ 
        error: 'Cooldown active. Please wait 5 seconds between smiles.', 
        cooldownRemaining: COOLDOWN_MS - (now - lastCreditTime) 
      }, { status: 429 });
    }

    // Process valid credit
    cooldownMap.set(userId, now);

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        points: { increment: 1 }
      },
      select: {
        id: true,
        points: true
      }
    });

    return NextResponse.json({
      message: 'Points updated successfully!',
      points: updatedUser.points
    });
  } catch (error) {
    console.error('Update credits error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
