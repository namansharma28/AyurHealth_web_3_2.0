import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import Razorpay from 'razorpay';
import { User } from '@/models/User';
import connectDB from '@/lib/db';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export async function POST() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const subscription = await razorpay.orders.create({
      amount: 100, // Amount in paise (₹1)
      currency: 'INR',
      payment_capture: true,
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Error creating subscription:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { paymentId, orderId, signature } = await req.json();

    // Verify payment signature here
    // Update user subscription status
    await connectDB();
    await User.findOneAndUpdate(
      { userId },
      { subscriptionStatus: 'paid' }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}