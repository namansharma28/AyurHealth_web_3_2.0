import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { User } from '@/models/User';
import connectDB from '@/lib/db';
import { analyzeSleepQuality } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { age, gender, weight, height, foodPreference, messages } = await req.json();

    // Analyze sleep quality from chat messages
    const sleepQuality = await analyzeSleepQuality(messages);

    // Prepare data for the external API
    const data = {
      age,
      gender,
      weight,
      height,
      food_preference: foodPreference,
      sleep_quality: sleepQuality
    };

    // Call external API
    const response = await fetch(process.env.BODY_NATURE_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to get body nature prediction');
    }

    const { prediction } = await response.json();

    // Update user with body nature
    await connectDB();
    const user = await User.findOneAndUpdate(
      { userId },
      { bodyNature: prediction },
      { new: true }
    );

    return NextResponse.json({ bodyNature: prediction });
  } catch (error) {
    console.error('Error predicting body nature:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}