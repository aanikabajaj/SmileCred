import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const leaderboard = await db.user.findMany({
      select: {
        username: true,
        points: true
      },
      orderBy: {
        points: 'desc'
      },
      take: 10, // PHASE 8 Requirement: TOP 10 users
    });

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Fetch leaderboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
