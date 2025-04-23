import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import connectDB from '@/lib/db';
import { WellnessCheckIn } from '@/models/WellnessCheckIn';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();
    const checkIns = await WellnessCheckIn.find({ userId }).sort({ date: -1 });
    
    return NextResponse.json(checkIns);
  } catch (error) {
    console.error('Error fetching wellness check-ins:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { date, responses } = await req.json();
    await connectDB();
    
    const checkIn = await WellnessCheckIn.create({
      userId,
      date,
      responses,
    });

    return NextResponse.json(checkIn);
  } catch (error) {
    console.error('Error creating wellness check-in:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}