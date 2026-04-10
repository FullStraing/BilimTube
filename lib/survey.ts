import type { Locale } from '@/lib/i18n/messages';

export const SURVEY_VERSION = 1;

export type SurveyQuestionKey =
  | 'videoAttention'
  | 'likedMost'
  | 'likedLeast'
  | 'learningPotential'
  | 'testsImproveLearning'
  | 'preferOverPlatforms'
  | 'wantedFeatures'
  | 'wouldRecommend'
  | 'wouldUseRegularly'
  | 'wouldPay'
  | 'monthlyPrice';

type LocalizedText = Record<Locale, string>;

type BaseQuestion = {
  key: SurveyQuestionKey;
  required: true;
  section: LocalizedText;
  title: LocalizedText;
};

export type SurveyScaleQuestion = BaseQuestion & {
  type: 'scale';
  minLabel: LocalizedText;
  maxLabel: LocalizedText;
};

export type SurveyTextQuestion = BaseQuestion & {
  type: 'text';
  placeholder: LocalizedText;
  inputMode?: 'text' | 'numeric';
};

export type SurveyChoiceOption = {
  value: string;
  label: LocalizedText;
};

export type SurveyChoiceQuestion = BaseQuestion & {
  type: 'single-choice';
  options: SurveyChoiceOption[];
};

export type SurveyQuestion = SurveyScaleQuestion | SurveyTextQuestion | SurveyChoiceQuestion;

export type SurveyAnswerValue = string | number;
export type SurveyAnswerMap = Partial<Record<SurveyQuestionKey, SurveyAnswerValue>>;

const yesNoMaybeOptions: SurveyChoiceOption[] = [
  {
    value: 'yes',
    label: { ru: 'Да', en: 'Yes', ky: 'Ооба' }
  },
  {
    value: 'no',
    label: { ru: 'Нет', en: 'No', ky: 'Жок' }
  },
  {
    value: 'neutral',
    label: { ru: 'Без разницы', en: 'No preference', ky: 'Айырмасы жок' }
  }
];

const regularUseOptions: SurveyChoiceOption[] = [
  {
    value: 'yes',
    label: { ru: 'Да', en: 'Yes', ky: 'Ооба' }
  },
  {
    value: 'no',
    label: { ru: 'Нет', en: 'No', ky: 'Жок' }
  },
  {
    value: 'unsure',
    label: { ru: 'Не уверена', en: 'Not sure', ky: 'Так эмесмин' }
  }
];

const payOptions: SurveyChoiceOption[] = [
  {
    value: 'yes',
    label: { ru: 'Да', en: 'Yes', ky: 'Ооба' }
  },
  {
    value: 'no',
    label: { ru: 'Нет', en: 'No', ky: 'Жок' }
  },
  {
    value: 'maybe',
    label: { ru: 'Возможно', en: 'Maybe', ky: 'Балким' }
  }
];

export const surveyQuestions: SurveyQuestion[] = [
  {
    key: 'videoAttention',
    type: 'scale',
    required: true,
    section: { ru: 'Видео', en: 'Video', ky: 'Видео' },
    title: {
      ru: 'Удерживает ли видео внимание ребенка?',
      en: 'Does the video keep the child’s attention?',
      ky: 'Видео баланын көңүлүн кармай алабы?'
    },
    minLabel: { ru: 'Совсем нет', en: 'Not at all', ky: 'Такыр жок' },
    maxLabel: { ru: 'Полностью удерживает', en: 'Completely', ky: 'Толугу менен' }
  },
  {
    key: 'likedMost',
    type: 'text',
    required: true,
    section: { ru: 'Видео', en: 'Video', ky: 'Видео' },
    title: {
      ru: 'Что вам понравилось в видео?',
      en: 'What did you like about the video?',
      ky: 'Видеодон эмне жакты?'
    },
    placeholder: {
      ru: 'Напишите коротко',
      en: 'Write a short answer',
      ky: 'Кыскача жазыңыз'
    }
  },
  {
    key: 'likedLeast',
    type: 'text',
    required: true,
    section: { ru: 'Видео', en: 'Video', ky: 'Видео' },
    title: {
      ru: 'Что вам не понравилось в видео?',
      en: 'What did you not like about the video?',
      ky: 'Видеодон эмне жаккан жок?'
    },
    placeholder: {
      ru: 'Что можно улучшить?',
      en: 'What should be improved?',
      ky: 'Эмнени жакшыртуу керек?'
    }
  },
  {
    key: 'learningPotential',
    type: 'scale',
    required: true,
    section: { ru: 'Обучение', en: 'Learning', ky: 'Окуу' },
    title: {
      ru: 'Кажется ли вам, что ребенок может чему-то научиться через нашу платформу?',
      en: 'Do you think a child can learn something through our platform?',
      ky: 'Бала биздин платформа аркылуу бир нерсе үйрөнө алат деп ойлойсузбу?'
    },
    minLabel: { ru: 'Нет', en: 'No', ky: 'Жок' },
    maxLabel: { ru: 'Да', en: 'Yes', ky: 'Ооба' }
  },
  {
    key: 'testsImproveLearning',
    type: 'scale',
    required: true,
    section: { ru: 'Обучение', en: 'Learning', ky: 'Окуу' },
    title: {
      ru: 'Делают ли тесты после каждого видео обучение лучше?',
      en: 'Do quizzes after each video improve learning?',
      ky: 'Ар бир видеодон кийинки тесттер окууну жакшыртабы?'
    },
    minLabel: { ru: 'Нет', en: 'No', ky: 'Жок' },
    maxLabel: { ru: 'Да', en: 'Yes', ky: 'Ооба' }
  },
  {
    key: 'preferOverPlatforms',
    type: 'single-choice',
    required: true,
    section: { ru: 'Сравнение', en: 'Comparison', ky: 'Салыштыруу' },
    title: {
      ru: 'Вы бы предпочли давать ребенку смотреть видео на Bilimtube вместо TikTok и YouTube?',
      en: 'Would you prefer Bilimtube over TikTok and YouTube for your child?',
      ky: 'Балага TikTok жана YouTube ордуна Bilimtube көргөзмөк белеңиз?'
    },
    options: yesNoMaybeOptions
  },
  {
    key: 'wantedFeatures',
    type: 'text',
    required: true,
    section: { ru: 'Сравнение', en: 'Comparison', ky: 'Салыштыруу' },
    title: {
      ru: 'Какие функции / разделы / видео вы бы хотели добавить в платформу?',
      en: 'What features, sections, or videos would you like to add to the platform?',
      ky: 'Платформага кайсы функцияларды, бөлүмдөрдү же видеолорду кошкуңуз келет?'
    },
    placeholder: {
      ru: 'Напишите ваши идеи',
      en: 'Write your ideas',
      ky: 'Оюңузду жазыңыз'
    }
  },
  {
    key: 'wouldRecommend',
    type: 'scale',
    required: true,
    section: { ru: 'Сравнение', en: 'Comparison', ky: 'Салыштыруу' },
    title: {
      ru: 'Порекомендовали бы вы Bilimtube другим?',
      en: 'Would you recommend Bilimtube to others?',
      ky: 'Bilimtube’ду башкаларга сунуштайт белеңиз?'
    },
    minLabel: { ru: 'Нет', en: 'No', ky: 'Жок' },
    maxLabel: { ru: 'Да', en: 'Yes', ky: 'Ооба' }
  },
  {
    key: 'wouldUseRegularly',
    type: 'single-choice',
    required: true,
    section: { ru: 'Метрики', en: 'Metrics', ky: 'Метрикалар' },
    title: {
      ru: 'Использовали бы вы платформу регулярно?',
      en: 'Would you use the platform regularly?',
      ky: 'Платформаны туруктуу колдонмок белеңиз?'
    },
    options: regularUseOptions
  },
  {
    key: 'wouldPay',
    type: 'single-choice',
    required: true,
    section: { ru: 'Метрики', en: 'Metrics', ky: 'Метрикалар' },
    title: {
      ru: 'Заплатили бы вы за такой продукт?',
      en: 'Would you pay for a product like this?',
      ky: 'Ушундай продукт үчүн төлөмөк белеңиз?'
    },
    options: payOptions
  },
  {
    key: 'monthlyPrice',
    type: 'text',
    required: true,
    section: { ru: 'Метрики', en: 'Metrics', ky: 'Метрикалар' },
    title: {
      ru: 'Сколько вы готовы платить в месяц?',
      en: 'How much would you be willing to pay per month?',
      ky: 'Айына канча төлөөгө даярсыз?'
    },
    placeholder: {
      ru: 'Например, 500 сом',
      en: 'For example, $5',
      ky: 'Мисалы, 500 сом'
    },
    inputMode: 'numeric'
  }
];

export function getSurveyQuestion(key: SurveyQuestionKey) {
  return surveyQuestions.find((question) => question.key === key) ?? null;
}

export function getSurveyQuestionLabel(question: SurveyQuestion, locale: Locale) {
  return question.title[locale];
}

export function getSurveyOptionLabel(option: SurveyChoiceOption, locale: Locale) {
  return option.label[locale];
}

export function getSurveySectionLabel(question: SurveyQuestion, locale: Locale) {
  return question.section[locale];
}

export function normalizeSurveyAnswers(raw: Record<string, unknown>) {
  const normalized: SurveyAnswerMap = {};

  for (const question of surveyQuestions) {
    const value = raw[question.key];
    if (question.type === 'scale') {
      const numeric = typeof value === 'number' ? value : Number(value);
      if (Number.isInteger(numeric) && numeric >= 1 && numeric <= 5) {
        normalized[question.key] = numeric;
      }
      continue;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed) {
        normalized[question.key] = trimmed;
      }
    }
  }

  return normalized;
}

export function getChoiceLabel(questionKey: SurveyQuestionKey, value: string, locale: Locale) {
  const question = getSurveyQuestion(questionKey);
  if (!question || question.type !== 'single-choice') return value;
  return question.options.find((option) => option.value === value)?.label[locale] ?? value;
}
