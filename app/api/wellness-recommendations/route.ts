import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import connectDB from '@/lib/db';
import { WellnessRecommendation } from '@/models/WellnessRecommendation';
import { User } from '@/models/User';
import { getAyurvedicRecommendations } from '@/lib/gemini';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();
    const recommendations = await WellnessRecommendation.findOne({ userId })
      .sort({ createdAt: -1 })
      .limit(1);
    
    return NextResponse.json(recommendations || null);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();
    
    // Get user profile
    const user = await User.findOne({ userId });
    if (!user || !user.profile) {
      return new NextResponse('User profile not found', { status: 404 });
    }

    // Generate recommendations using Gemini
    const recommendations = await getAyurvedicRecommendations(user.profile);

    // Create new recommendations
    const wellnessRecommendations = await WellnessRecommendation.create({
      userId,
      recommendations,
    });

    return NextResponse.json(wellnessRecommendations);
  } catch (error) {
    console.error('Error creating recommendations:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}