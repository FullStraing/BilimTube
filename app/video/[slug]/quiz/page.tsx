import type { Route } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUserFromSession } from '@/lib/auth';
import { buildVideoPolicyClauses, getActiveChildPolicy } from '@/lib/child-policy';
import { localizeQuiz } from '@/lib/content-localization';
import { getLocaleFromCookie, translate } from '@/lib/i18n/server';
import { prisma } from '@/lib/prisma';
import { QuizRunner } from '@/features/quiz/quiz-runner';

export default async function VideoQuizPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocaleFromCookie();
  const user = await getCurrentUserFromSession();
  if (!user) {
    redirect('/auth/login');
  }
  const policy = await getActiveChildPolicy(user.id);
  const policyClauses = buildVideoPolicyClauses(policy);

  const video = await prisma.video.findFirst({
    where: {
      AND: [{ slug, isPublished: true }, ...policyClauses]
    },
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
  const localizedQuiz = video.quiz ? localizeQuiz(slug, video.quiz, locale) : null;

  return (
    <div className="min-h-screen bg-background px-5 py-5">
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <Link
          href={`/video/${slug}` as Route}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-secondary"
          aria-label={translate(locale, 'quiz.back')}
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>

        {!video.quiz ? (
          <div className="rounded-[22px] border border-border bg-card p-5 shadow-card">
            <h1 className="text-[30px] font-bold text-primary">{translate(locale, 'quiz.notAddedTitle')}</h1>
            <p className="mt-2 text-[16px] text-primary/80">{translate(locale, 'quiz.notAddedDescription')}</p>
          </div>
        ) : (
          <QuizRunner
            slug={slug}
            quizTitle={localizedQuiz?.title || translate(locale, 'quiz.defaultTitle', { title: video.title })}
            quizDescription={localizedQuiz?.description}
            questions={localizedQuiz?.questions ?? []}
          />
        )}
      </div>
    </div>
  );
}
