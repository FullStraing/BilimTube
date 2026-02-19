import { NextResponse } from 'next/server';
import { getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const user = await getCurrentUserFromSession();
  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const { slug } = await params;

  const video = await prisma.video.findFirst({
    where: { slug, isPublished: true },
    select: {
      id: true,
      title: true,
      quiz: {
        select: {
          id: true,
          title: true,
          description: true,
          questions: {
            orderBy: { sortOrder: 'asc' },
            select: {
              id: true,
              text: true,
              sortOrder: true,
              options: {
                orderBy: { sortOrder: 'asc' },
                select: {
                  id: true,
                  text: true,
                  sortOrder: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!video) {
    return NextResponse.json({ error: 'Видео не найдено' }, { status: 404 });
  }

  if (!video.quiz) {
    return NextResponse.json({ error: 'Тест пока не добавлен' }, { status: 404 });
  }

  return NextResponse.json({
    videoTitle: video.title,
    quiz: video.quiz
  });
}
