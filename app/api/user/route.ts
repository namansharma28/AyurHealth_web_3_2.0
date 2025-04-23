import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import connectDB from '@/lib/db';
import { User } from '@/models/User';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();
    let user = await User.findOne({ userId });

    if (!user) {
      user = await User.create({ userId });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    await connectDB();

    let updateData: any = {};

    // Handle profile updates
    if (body.weight || body.height || body.age || body.gender || body.foodPreference) {
      updateData.profile = {
        weight: body.weight,
        height: body.height,
        age: body.age,
        gender: body.gender,
        foodPreference: body.foodPreference
      };
    }

    // Handle BMI updates
    if (body.bmi) {
      updateData['profile.bmi'] = body.bmi;
    }

    const user = await User.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true }
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}