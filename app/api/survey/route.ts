import { NextResponse } from 'next/server';
import { SurveyQuestionType } from '@prisma/client';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { normalizeSurveyAnswers, SURVEY_VERSION, surveyQuestions } from '@/lib/survey';
import { getLocaleFromCookie, translate } from '@/lib/i18n/server';

export async function POST(req: Request) {
  const locale = await getLocaleFromCookie();
  const user = await getCurrentUserFromSession();

  if (!user) {
    return NextResponse.json({ error: translate(locale, 'common.notAuthorized') }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object' || !('answers' in body) || typeof body.answers !== 'object' || body.answers === null) {
    return NextResponse.json({ error: translate(locale, 'common.invalidData') }, { status: 400 });
  }

  const answers = normalizeSurveyAnswers(body.answers as Record<string, unknown>);

  for (const question of surveyQuestions) {
    const value = answers[question.key];

    if (question.type === 'scale') {
      if (typeof value !== 'number' || value < 1 || value > 5) {
        return NextResponse.json({ error: translate(locale, 'survey.answerRequired') }, { status: 400 });
      }
      continue;
    }

    if (typeof value !== 'string' || !value.trim()) {
      return NextResponse.json({ error: translate(locale, 'survey.answerRequired') }, { status: 400 });
    }

    if (question.type === 'single-choice' && !question.options.some((option) => option.value === value)) {
      return NextResponse.json({ error: translate(locale, 'common.invalidData') }, { status: 400 });
    }
  }

  const activeChildId = await getActiveChildIdForUser(user.id);

  const existingResponse = await prisma.surveyResponse.findUnique({
    where: {
      userId_version: {
        userId: user.id,
        version: SURVEY_VERSION
      }
    },
    select: { id: true }
  });

  if (existingResponse) {
    return NextResponse.json({ error: translate(locale, 'survey.alreadySubmitted') }, { status: 409 });
  }

  const saved = await prisma.$transaction(async (tx) => {
    const response = await tx.surveyResponse.create({
      data: {
        userId: user.id,
        childId: activeChildId,
        version: SURVEY_VERSION,
        submittedAt: new Date()
      },
      select: { id: true }
    });

    await tx.surveyAnswer.createMany({
      data: surveyQuestions.map((question) => {
        const value = answers[question.key]!;

        return {
          responseId: response.id,
          questionKey: question.key,
          questionType:
            question.type === 'scale'
              ? SurveyQuestionType.SCALE
              : question.type === 'text'
                ? SurveyQuestionType.TEXT
                : SurveyQuestionType.SINGLE_CHOICE,
          ratingValue: question.type === 'scale' ? Number(value) : null,
          textValue: question.type === 'text' ? String(value) : null,
          choiceValue: question.type === 'single-choice' ? String(value) : null
        };
      })
    });

    return response;
  });

  return NextResponse.json({ ok: true, responseId: saved.id });
}
