import type { Route } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { QuizRunner } from '@/features/quiz/quiz-runner';

export default async function VideoQuizPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUserFromSession();
  if (!user) {
    redirect('/auth/login');
  }

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
    notFound();
  }

  return (
    <div className="min-h-screen bg-background px-5 py-5">
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <Link
          href={`/video/${slug}` as Route}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-secondary"
          aria-label="Назад"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>

        {!video.quiz ? (
          <div className="rounded-[22px] border border-border bg-card p-5 shadow-card">
            <h1 className="text-[30px] font-bold text-primary">Тест пока не добавлен</h1>
            <p className="mt-2 text-[16px] text-primary/80">Для этого видео тест появится позже.</p>
          </div>
        ) : (
          <QuizRunner
            slug={slug}
            quizTitle={video.quiz.title || `Тест: ${video.title}`}
            quizDescription={video.quiz.description}
            questions={video.quiz.questions}
          />
        )}
      </div>
    </div>
  );
}
