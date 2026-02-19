import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
import { buildVideoPolicyClauses, getActiveChildPolicy } from '@/lib/child-policy';
import { prisma } from '@/lib/prisma';

const submitSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      optionId: z.string().min(1)
    }),
  )
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const user = await getCurrentUserFromSession();
  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }
  const activeChildId = await getActiveChildIdForUser(user.id);
  const policy = await getActiveChildPolicy(user.id);
  const policyClauses = buildVideoPolicyClauses(policy);
  if (!activeChildId) {
    return NextResponse.json({ error: 'Сначала создайте или выберите профиль ребенка' }, { status: 409 });
  }

  const { slug } = await params;
  const body = await req.json().catch(() => null);
  const parsed = submitSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Невалидные данные' }, { status: 400 });
  }

  const video = await prisma.video.findFirst({
    where: {
      AND: [{ slug, isPublished: true }, ...policyClauses]
    },
    select: {
      id: true,
      quiz: {
        select: {
          id: true,
          questions: {
            select: {
              id: true,
              options: {
                select: {
                  id: true,
                  isCorrect: true
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

  const answersMap = new Map(parsed.data.answers.map((answer) => [answer.questionId, answer.optionId]));
  const maxScore = video.quiz.questions.length;
  if (!maxScore) {
    return NextResponse.json({ error: 'В тесте нет вопросов' }, { status: 400 });
  }

  let score = 0;

  const normalizedAnswers = video.quiz.questions.map((question) => {
    const selectedOptionId = answersMap.get(question.id) ?? null;
    const selected = question.options.find((opt) => opt.id === selectedOptionId);
    const isCorrect = Boolean(selected?.isCorrect);
    if (isCorrect) score += 1;

    return {
      questionId: question.id,
      selectedOptionId,
      isCorrect
    };
  });

  const percentage = Math.round((score / maxScore) * 100);

  const attempt = await prisma.quizAttempt.create({
    data: {
      quizId: video.quiz.id,
      userId: user.id,
      childId: activeChildId,
      score,
      maxScore,
      percentage,
      answers: {
        create: normalizedAnswers
      }
    },
    select: {
      id: true,
      score: true,
      maxScore: true,
      percentage: true,
      createdAt: true
    }
  });

  return NextResponse.json(attempt);
}
