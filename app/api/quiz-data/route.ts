// app/api/quiz-data/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const client = await clientPromise;
    const db = client.db('quizziz');
    const collection = db.collection('quizzes');

    if (slug) {
      const quiz = await collection.findOne({ slug });
      if (!quiz) return NextResponse.json({ error: 'Not found' }, { status: 404 });

      // LÀM SẠCH DỮ LIỆU NGAY TẠI ĐÂY
      const cleanedQuiz = JSON.parse(JSON.stringify(quiz));
      
      return NextResponse.json({
        ...cleanedQuiz,
        updatedAt: cleanedQuiz.updatedAt || cleanedQuiz.createdAt || new Date().toISOString()
      });
    } 

    const quizzes = await collection.find({}).project({ questions: 0 }).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(JSON.parse(JSON.stringify(quizzes)));

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}