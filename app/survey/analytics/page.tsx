import { cookies } from 'next/headers';
import type { Route } from 'next';
import Link from 'next/link';
import { BarChart3, ChevronRight, ClipboardList } from 'lucide-react';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { MainNavigation } from '@/components/layout/main-navigation';
import { HeaderProfileLink, PageHeader } from '@/components/layout/page-header';
import { getLocaleFromCookie, translate } from '@/lib/i18n/server';
import { getChoiceLabel, getSurveyQuestionLabel, SURVEY_VERSION, surveyQuestions } from '@/lib/survey';
import { SURVEY_ANALYTICS_COOKIE } from '@/lib/survey-auth';
import { AnalyticsAccessForm } from '@/features/survey/analytics-access-form';

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === 'ky' ? 'ky-KG' : locale === 'en' ? 'en-US' : 'ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

export default async function SurveyAnalyticsPage() {
  const locale = await getLocaleFromCookie();
  const cookieStore = await cookies();
  const hasAnalyticsAccess = cookieStore.get(SURVEY_ANALYTICS_COOKIE)?.value === 'granted';
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

  const responses = await prisma.surveyResponse.findMany({
    where: { version: SURVEY_VERSION },
    orderBy: { submittedAt: 'desc' },
    select: {
      id: true,
      submittedAt: true,
      answers: {
        select: {
          questionKey: true,
          ratingValue: true,
          textValue: true,
          choiceValue: true
        }
      }
    }
  });

  const totalResponses = responses.length;
  const lastUpdated = responses[0]?.submittedAt ?? null;

  const scaleQuestions = surveyQuestions.filter((question) => question.type === 'scale');
  const choiceQuestions = surveyQuestions.filter((question) => question.type === 'single-choice');
  const textQuestions = surveyQuestions.filter((question) => question.type === 'text');

  const scaleStats = scaleQuestions.map((question) => {
    const values = responses
      .flatMap((response) => response.answers)
      .filter((answer) => answer.questionKey === question.key && typeof answer.ratingValue === 'number')
      .map((answer) => answer.ratingValue as number);

    const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;

    return {
      question,
      average,
      count: values.length
    };
  });

  const choiceStats = choiceQuestions.map((question) => {
    const counts = new Map<string, number>();

    for (const response of responses) {
      const answer = response.answers.find((item) => item.questionKey === question.key);
      if (answer?.choiceValue) {
        counts.set(answer.choiceValue, (counts.get(answer.choiceValue) ?? 0) + 1);
      }
    }

    return {
      question,
      options: question.options.map((option) => ({
        value: option.value,
        label: getChoiceLabel(question.key, option.value, locale),
        count: counts.get(option.value) ?? 0,
        percentage: totalResponses ? Math.round(((counts.get(option.value) ?? 0) / totalResponses) * 100) : 0
      }))
    };
  });

  const textFeedback = textQuestions.map((question) => ({
    question,
    answers: responses
      .map((response) => ({
        submittedAt: response.submittedAt,
        text:
          response.answers.find((item) => item.questionKey === question.key)?.textValue?.trim() ??
          ''
      }))
      .filter((item) => item.text)
      .slice(0, 12)
  }));

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      <PageHeader
        center={
          <div className="flex items-center gap-2 py-1 sm:gap-3">
            <BarChart3 className="h-6 w-6 text-primary sm:h-8 sm:w-8" />
            <h1 className="text-[28px] font-bold leading-none text-primary sm:text-[34px] lg:text-[36px]">{translate(locale, 'survey.analyticsTitle')}</h1>
          </div>
        }
        right={<HeaderProfileLink letter={profileLetter} />}
      />

      <main className="space-y-4 px-4 py-4 pt-[88px] sm:px-5 sm:py-5 lg:max-w-6xl lg:px-6">
        <MainNavigation active="profile" />

        <div className="space-y-4 lg:ml-[220px]">
          <div className="rounded-[24px] border border-border bg-card p-5 shadow-card">
            <p className="text-[18px] text-primary/85">{translate(locale, 'survey.analyticsSubtitle')}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={'/survey' as Route}
                className="inline-flex h-11 items-center gap-2 rounded-[14px] bg-secondary px-4 text-[15px] font-semibold text-primary transition hover:brightness-95"
              >
                <ClipboardList className="h-4 w-4" />
                {translate(locale, 'survey.resume')}
              </Link>
            </div>
          </div>

          {!hasAnalyticsAccess ? (
            <AnalyticsAccessForm />
          ) : !user ? (
            <div className="rounded-[24px] border border-border bg-card p-5 text-[16px] text-primary/85 shadow-card">
              {translate(locale, 'survey.loginRequired')}
            </div>
          ) : !totalResponses ? (
            <div className="rounded-[24px] border border-border bg-card p-5 text-[16px] text-primary/85 shadow-card">
              {translate(locale, 'survey.emptyAnalytics')}
            </div>
          ) : (
            <>
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-[24px] border border-border bg-card p-5 shadow-card">
                  <p className="text-[15px] text-primary/70">{translate(locale, 'survey.totalResponses')}</p>
                  <p className="mt-2 text-[38px] font-bold leading-none text-primary">{totalResponses}</p>
                </article>
                <article className="rounded-[24px] border border-border bg-card p-5 shadow-card sm:col-span-2 xl:col-span-3">
                  <p className="text-[15px] text-primary/70">{translate(locale, 'survey.lastUpdated')}</p>
                  <p className="mt-2 text-[24px] font-bold text-primary">{lastUpdated ? formatDate(lastUpdated, locale) : 'вЂ”'}</p>
                </article>
              </section>

              <section className="grid gap-4 lg:grid-cols-3">
                {scaleStats.map(({ question, average, count }) => (
                  <article key={question.key} className="rounded-[24px] border border-border bg-card p-5 shadow-card">
                    <p className="text-[14px] text-primary/65">{question.section[locale]}</p>
                    <h2 className="mt-2 text-[20px] font-bold leading-snug text-primary">{getSurveyQuestionLabel(question, locale)}</h2>
                    <div className="mt-4 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[14px] text-primary/65">{translate(locale, 'survey.scaleAverage')}</p>
                        <p className="mt-1 text-[40px] font-bold leading-none text-primary">{average ? average.toFixed(1) : 'вЂ”'}</p>
                      </div>
                      <p className="text-[14px] text-primary/70">
                        {count} {translate(locale, 'survey.responses')}
                      </p>
                    </div>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${average ? (average / 5) * 100 : 0}%` }}
                      />
                    </div>
                  </article>
                ))}
              </section>

              <section className="grid gap-4 xl:grid-cols-3">
                {choiceStats.map(({ question, options }) => (
                  <article key={question.key} className="rounded-[24px] border border-border bg-card p-5 shadow-card">
                    <p className="text-[14px] text-primary/65">{question.section[locale]}</p>
                    <h2 className="mt-2 text-[20px] font-bold leading-snug text-primary">{getSurveyQuestionLabel(question, locale)}</h2>
                    <div className="mt-5 space-y-3">
                      {options.map((option) => (
                        <div key={option.value}>
                          <div className="mb-1 flex items-center justify-between gap-3 text-[15px] text-primary">
                            <span>{option.label}</span>
                            <span className="font-semibold">{option.count}</span>
                          </div>
                          <div className="h-3 overflow-hidden rounded-full bg-secondary">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${option.percentage}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </section>

              <section className="space-y-4">
                {textFeedback.map(({ question, answers }) => (
                  <article key={question.key} className="rounded-[24px] border border-border bg-card p-5 shadow-card">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[14px] text-primary/65">{translate(locale, 'survey.openFeedback')}</p>
                        <h2 className="mt-2 text-[20px] font-bold leading-snug text-primary">{getSurveyQuestionLabel(question, locale)}</h2>
                      </div>
                    </div>

                    {answers.length ? (
                      <div className="mt-4 space-y-3">
                        {answers.map((answer, index) => (
                          <div key={`${question.key}-${index}`} className="rounded-[18px] bg-background px-4 py-3">
                            <p className="text-[16px] leading-relaxed text-primary/90">{answer.text}</p>
                            <div className="mt-2 inline-flex items-center gap-2 text-[13px] text-primary/60">
                              <ChevronRight className="h-4 w-4" />
                              {formatDate(answer.submittedAt, locale)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-4 text-[15px] text-primary/70">{translate(locale, 'survey.noComments')}</p>
                    )}
                  </article>
                ))}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

