import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { analyzeUserContext } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const context = await req.json();
    const analysis = await analyzeUserContext(context);

    if (!analysis) {
      return new NextResponse('Failed to analyze data', { status: 500 });
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing user data:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}