'use client';

import { useMemo, useState } from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

type QuizQuestion = {
  id: string;
  text: string;
  sortOrder: number;
  options: { id: string; text: string; sortOrder: number }[];
};

type Props = {
  slug: string;
  quizTitle: string;
  quizDescription?: string | null;
  questions: QuizQuestion[];
};

export function QuizRunner({ slug, quizTitle, quizDescription, questions }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; maxScore: number; percentage: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isReady = useMemo(
    () => questions.every((question) => Boolean(answers[question.id])),
    [answers, questions],
  );

  const handleSubmit = async () => {
    if (!isReady || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/videos/${slug}/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: questions.map((question) => ({
            questionId: question.id,
            optionId: answers[question.id]
          }))
        })
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        toast({
          title: 'Ошибка',
          description: payload?.error ?? 'Не удалось отправить тест'
        });
        return;
      }

      setResult({
        score: payload.score,
        maxScore: payload.maxScore,
        percentage: payload.percentage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <section className="rounded-[22px] border border-border bg-card p-5 shadow-card">
        <h2 className="text-[32px] font-bold text-primary">Результат теста</h2>
        <p className="mt-2 text-[22px] text-primary">
          {result.score} из {result.maxScore} ({result.percentage}%)
        </p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => router.push(`/video/${slug}` as Route)}
            className="h-11 rounded-[14px] bg-primary px-4 text-[15px] font-semibold text-white transition hover:brightness-110"
          >
            К видео
          </button>
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setResult(null);
            }}
            className="h-11 rounded-[14px] bg-secondary px-4 text-[15px] font-semibold text-primary transition hover:brightness-95"
          >
            Пройти снова
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="rounded-[22px] border border-border bg-card p-5 shadow-card">
        <h1 className="text-[34px] font-bold text-primary">{quizTitle}</h1>
        {quizDescription ? <p className="mt-1 text-[16px] text-primary/80">{quizDescription}</p> : null}
      </div>

      {questions.map((question, index) => (
        <article key={question.id} className="rounded-[22px] border border-border bg-card p-5 shadow-card">
          <p className="text-[15px] text-primary/65">Вопрос {index + 1}</p>
          <h2 className="mt-1 text-[22px] font-semibold text-primary">{question.text}</h2>
          <div className="mt-3 space-y-2">
            {question.options.map((option) => {
              const active = answers[question.id] === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option.id }))}
                  className={`w-full rounded-[14px] border px-4 py-3 text-left text-[16px] transition ${
                    active ? 'border-primary bg-secondary text-primary' : 'border-border bg-background text-primary hover:bg-muted'
                  }`}
                >
                  {option.text}
                </button>
              );
            })}
          </div>
        </article>
      ))}

      <div className="pb-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isReady || isSubmitting}
          className="h-12 w-full rounded-[16px] bg-primary text-[16px] font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {isSubmitting ? 'Проверяем...' : 'Завершить тест'}
        </button>
      </div>
    </section>
  );
}
