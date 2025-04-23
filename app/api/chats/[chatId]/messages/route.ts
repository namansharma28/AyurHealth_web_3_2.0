import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import connectDB from '@/lib/db';
import { Chat } from '@/models/Chat';
import mongoose from 'mongoose';

export async function POST(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { content, role } = await req.json();
    
    if (!mongoose.Types.ObjectId.isValid(params.chatId)) {
      return new NextResponse('Invalid chat ID', { status: 400 });
    }

    await connectDB();

    const chat = await Chat.findOneAndUpdate(
      { 
        _id: new mongoose.Types.ObjectId(params.chatId),
        userId 
      },
      {
        $push: {
          messages: {
            content,
            role,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!chat) {
      return new NextResponse('Chat not found', { status: 404 });
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error adding message:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}