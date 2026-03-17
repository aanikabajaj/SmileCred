import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
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
    const body = await req.json();
    const { rewardId, cost, code } = body;

    if (!rewardId || !cost || !code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { points: true, unlockedRewards: true }
      });

      if (!user) {
        throw new Error("User not found");
      }
      
      if (user.points < cost) {
         throw new Error(`You need at least ${cost} smiles to unlock this reward!`);
      }

      let unlockedArray: string[] = [];
      try {
        unlockedArray = JSON.parse(user.unlockedRewards);
      } catch (e) {
        unlockedArray = [];
      }

      if (unlockedArray.includes(rewardId)) {
        throw new Error("Reward already unlocked!");
      }

      unlockedArray.push(rewardId);

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          points: { decrement: cost },
          unlockedRewards: JSON.stringify(unlockedArray)
        },
        select: {
          points: true,
          unlockedRewards: true
        }
      });

      return updatedUser;
    });

    return NextResponse.json({
      message: 'Reward unlocked successfully!',
      points: result.points,
      unlockedRewards: JSON.parse(result.unlockedRewards)
    });

  } catch (error: any) {
    console.error('Unlock reward error:', error);
    
    if (error.message.includes('not found') || error.message.includes('need at least') || error.message.includes('already unlocked')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
