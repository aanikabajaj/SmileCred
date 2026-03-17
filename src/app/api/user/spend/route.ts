import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

const POINTS_PER_MILESTONE = 20;
const SESSIONS_PER_MILESTONE = 3;

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

    // Start a transaction to ensure uses aren't updated if the user doesn't have enough unlocked
    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { points: true, photobooth_uses: true }
      });

      if (!user) {
        throw new Error("User not found");
      }
      
      const totalAllowedSessions = Math.floor(user.points / POINTS_PER_MILESTONE) * SESSIONS_PER_MILESTONE;
      
      if (user.points < POINTS_PER_MILESTONE) {
         throw new Error(`You need to earn at least ${POINTS_PER_MILESTONE} smiles first!`);
      }

      if (user.photobooth_uses >= totalAllowedSessions) {
        throw new Error("No free sessions remaining! Keep smiling to unlock more.");
      }

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          photobooth_uses: { increment: 1 }
        },
        select: {
          points: true,
          photobooth_uses: true
        }
      });

      return updatedUser;
    });

    return NextResponse.json({
      message: 'Photobooth session activated!',
      points: result.points,
      photobooth_uses: result.photobooth_uses
    });

  } catch (error: any) {
    console.error('Spend credits error:', error);
    
    if (error.message.includes('free sessions remaining') || error.message.includes('earn at least')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
