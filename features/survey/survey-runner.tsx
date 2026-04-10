'use client';

import type { Route } from 'next';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/components/i18n/locale-provider';
import { useToast } from '@/components/ui/use-toast';
import { getSurveyOptionLabel, getSurveyQuestionLabel, getSurveySectionLabel, surveyQuestions, type SurveyAnswerMap } from '@/lib/survey';
import { translate } from '@/lib/i18n/messages';
import { cn } from '@/lib/utils';

type Props = {
  initialAnswers?: SurveyAnswerMap;
  hasCompleted: boolean;
};

export function SurveyRunner({ initialAnswers = {}, hasCompleted }: Props) {
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswerMap>(initialAnswers);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const question = surveyQuestions[currentIndex];
  const progress = ((currentIndex + 1) / surveyQuestions.length) * 100;

  const currentValue = answers[question.key];
  const isCurrentAnswered = useMemo(() => {
    if (question.type === 'scale') {
      return typeof currentValue === 'number' && currentValue >= 1 && currentValue <= 5;
    }
    return typeof currentValue === 'string' && currentValue.trim().length > 0;
  }, [currentValue, question.type]);

  function validateCurrent() {
    if (isCurrentAnswered) return true;
    toast({
      title: translate(locale, 'quiz.errorTitle'),
      description: translate(locale, 'survey.answerRequired')
    });
    return false;
  }

  function handleNext() {
    if (!validateCurrent()) return;
    setCurrentIndex((current) => Math.min(current + 1, surveyQuestions.length - 1));
  }

  function handlePrev() {
    setCurrentIndex((current) => Math.max(current - 1, 0));
  }

  async function handleSubmit() {
    if (!validateCurrent()) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? translate(locale, 'survey.saveError'));
      }

      toast({
        title: translate(locale, 'survey.savedTitle'),
        description: translate(locale, 'survey.savedDescription')
      });

      router.push('/survey' as Route);
      router.refresh();
    } catch (error) {
      toast({
        title: translate(locale, 'quiz.errorTitle'),
        description: error instanceof Error ? error.message : translate(locale, 'survey.saveError')
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-[28px] border border-border bg-card p-4 shadow-card sm:p-6">
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-[15px] font-semibold text-primary/65">{getSurveySectionLabel(question, locale)}</p>
            <p className="mt-1 text-[15px] text-primary/65">
              {translate(locale, 'survey.progress', { current: currentIndex + 1, total: surveyQuestions.length })}
            </p>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1 text-[13px] font-semibold text-primary">
            {translate(locale, 'survey.required')}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        {hasCompleted ? (
          <p className="mt-3 text-[14px] text-primary/70">{translate(locale, 'survey.completed')}</p>
        ) : null}
      </div>

      <div className="min-h-[360px]">
        <h2 className="text-[26px] font-bold leading-tight text-primary sm:text-[34px]">{getSurveyQuestionLabel(question, locale)}</h2>

        {question.type === 'scale' ? (
          <div className="mt-8">
            <div className="grid grid-cols-5 gap-3">
              {Array.from({ length: 5 }, (_, index) => index + 1).map((value) => {
                const active = currentValue === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, [question.key]: value }))}
                    className={cn(
                      'h-16 rounded-[18px] border text-[24px] font-bold transition sm:h-20 sm:text-[28px]',
                      active
                        ? 'border-primary bg-primary text-white shadow-card'
                        : 'border-border bg-background text-primary hover:bg-secondary'
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex justify-between gap-4 text-[14px] text-primary/70 sm:text-[15px]">
              <span>{question.minLabel[locale]}</span>
              <span>{question.maxLabel[locale]}</span>
            </div>
          </div>
        ) : null}

        {question.type === 'text' ? (
          <div className="mt-8">
            <textarea
              value={typeof currentValue === 'string' ? currentValue : ''}
              onChange={(event) => setAnswers((prev) => ({ ...prev, [question.key]: event.target.value }))}
              placeholder={question.placeholder[locale]}
              inputMode={question.inputMode}
              className="min-h-[200px] w-full resize-none rounded-[22px] border border-border bg-background px-4 py-4 text-[18px] text-primary outline-none placeholder:text-primary/45 focus:border-primary"
            />
          </div>
        ) : null}

        {question.type === 'single-choice' ? (
          <div className="mt-8 space-y-3">
            {question.options.map((option) => {
              const active = currentValue === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [question.key]: option.value }))}
                  className={cn(
                    'flex min-h-[72px] w-full items-center rounded-[20px] border px-5 text-left text-[20px] font-semibold transition',
                    active
                      ? 'border-primary bg-primary text-white shadow-card'
                      : 'border-border bg-background text-primary hover:bg-secondary'
                  )}
                >
                  {getSurveyOptionLabel(option, locale)}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0 || isSubmitting}
          className="inline-flex h-12 items-center justify-center rounded-[16px] border border-border px-5 text-[16px] font-semibold text-primary transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {translate(locale, 'survey.previous')}
        </button>

        {currentIndex === surveyQuestions.length - 1 ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center rounded-[16px] bg-primary px-6 text-[16px] font-semibold text-white transition hover:brightness-110 disabled:opacity-70"
          >
            {isSubmitting ? translate(locale, 'survey.submitting') : translate(locale, 'survey.submit')}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex h-12 items-center justify-center rounded-[16px] bg-primary px-6 text-[16px] font-semibold text-white transition hover:brightness-110"
          >
            {translate(locale, 'survey.next')}
          </button>
        )}
      </div>
    </section>
  );
}
