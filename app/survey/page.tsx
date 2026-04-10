import type { Route } from 'next';
import Link from 'next/link';
import { ClipboardList, BarChart3 } from 'lucide-react';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { MainNavigation } from '@/components/layout/main-navigation';
import { HeaderProfileLink, PageHeader } from '@/components/layout/page-header';
import { getLocaleFromCookie, translate } from '@/lib/i18n/server';
import { SurveyRunner } from '@/features/survey/survey-runner';
import { SURVEY_VERSION, type SurveyAnswerMap } from '@/lib/survey';

export default async function SurveyPage() {
  const locale = await getLocaleFromCookie();
  const user = await getCurrentUserFromSession();
  const activeChildId = user ? await getActiveChildIdForUser(user.id) : null;
  const child =
    user && activeChildId
      ? await prisma.childProfile.findFirst({
          where: { userId: user.id, id: activeChildId },
          select: { name: true }
        })
      : null;

  const profileLetter = (child?.name?.trim()?.charAt(0) ?? 'M').toUpperCase();

  const existingResponse = user
    ? await prisma.surveyResponse.findUnique({
        where: {
          userId_version: {
            userId: user.id,
            version: SURVEY_VERSION
          }
        },
        select: {
          answers: {
            select: {
              questionKey: true,
              ratingValue: true,
              textValue: true,
              choiceValue: true
            }
          }
        }
      })
    : null;

  const initialAnswers = (existingResponse?.answers ?? []).reduce<SurveyAnswerMap>((acc, answer) => {
    if (typeof answer.ratingValue === 'number') {
      acc[answer.questionKey as keyof SurveyAnswerMap] = answer.ratingValue;
    } else if (answer.textValue) {
      acc[answer.questionKey as keyof SurveyAnswerMap] = answer.textValue;
    } else if (answer.choiceValue) {
      acc[answer.questionKey as keyof SurveyAnswerMap] = answer.choiceValue;
    }
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      <PageHeader
        center={
          <div className="flex items-center gap-2 sm:gap-3">
            <ClipboardList className="h-6 w-6 text-primary sm:h-8 sm:w-8" />
            <h1 className="text-[28px] font-bold leading-none text-primary sm:text-[34px] lg:text-[36px]">{translate(locale, 'survey.title')}</h1>
          </div>
        }
        right={<HeaderProfileLink letter={profileLetter} />}
      />

      <main className="space-y-4 px-4 py-4 pt-[88px] sm:px-5 sm:py-5 lg:max-w-5xl lg:px-6">
        <MainNavigation active="profile" />

        <div className="space-y-4 lg:ml-[220px]">
          <div className="rounded-[24px] border border-border bg-card p-5 shadow-card">
            <p className="text-[18px] text-primary/85">{translate(locale, 'survey.subtitle')}</p>
            <div className="mt-4">
              <Link
                href={'/survey/analytics' as Route}
                className="inline-flex h-11 items-center gap-2 rounded-[14px] bg-secondary px-4 text-[15px] font-semibold text-primary transition hover:brightness-95"
              >
                <BarChart3 className="h-4 w-4" />
                {translate(locale, 'survey.openAnalytics')}
              </Link>
            </div>
          </div>

          {!user ? (
            <div className="rounded-[24px] border border-border bg-card p-5 text-[16px] text-primary/85 shadow-card">
              {translate(locale, 'survey.loginRequired')}
            </div>
          ) : existingResponse ? (
            <div className="rounded-[24px] border border-border bg-card p-5 shadow-card">
              <h2 className="text-[24px] font-bold text-primary">{translate(locale, 'survey.savedTitle')}</h2>
              <p className="mt-2 text-[16px] text-primary/80">{translate(locale, 'survey.completed')}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={'/profile' as Route}
                  className="inline-flex h-11 items-center rounded-[14px] bg-primary px-4 text-[15px] font-semibold text-white transition hover:brightness-110"
                >
                  {translate(locale, 'nav.profile')}
                </Link>
              </div>
            </div>
          ) : (
            <SurveyRunner initialAnswers={initialAnswers} hasCompleted={Boolean(existingResponse)} />
          )}
        </div>
      </main>
    </div>
  );
}
