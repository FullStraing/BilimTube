import type { Locale } from '@/lib/i18n/messages';

type LocalizedCopy = {
  title: string;
  description: string;
  category?: string;
};

type VideoShape = {
  slug: string;
  title: string;
  description: string;
  category: string;
};

const videoCopies: Record<string, Partial<Record<Locale, LocalizedCopy>>> = {
  'solar-system-for-kids': {
    en: {
      title: 'How the Solar System Works',
      description: 'Learn about planets, stars, and amazing space facts.',
      category: 'Space'
    }
  },
  'dinosaur-world': {
    en: {
      title: 'Dinosaurs: Who They Were',
      description: 'A simple introduction to the world of dinosaurs.',
      category: 'Science'
    }
  },
  'fun-english-alphabet': {
    en: {
      title: 'English Alphabet for Kids',
      description: 'Learn letters and simple words in a fun way.',
      category: 'Languages'
    }
  },
  'human-body-basics': {
    en: {
      title: 'How the Human Body Works',
      description: 'Interesting facts about the human body for kids.',
      category: 'Biology'
    }
  },
  'nature-adventure': {
    en: {
      title: 'Nature Adventure',
      description: 'Animals, forests, and oceans for curious kids.',
      category: 'Nature'
    }
  },
  'short-local-01': {
    en: {
      title: 'Quick Science Trick',
      description: 'A short science idea explained in under a minute.',
      category: 'Science'
    }
  },
  'short-local-02': {
    en: {
      title: 'Math in 30 Seconds',
      description: 'A simple math hack you can use right away.',
      category: 'Math'
    }
  },
  'short-local-03': {
    en: {
      title: 'Daily English Words',
      description: 'Learn a few useful English words every day.',
      category: 'Languages'
    }
  },
  'short-local-04': {
    en: {
      title: 'Creative Art Minute',
      description: 'A fun artistic challenge for young creators.',
      category: 'Art'
    }
  },
  'short-local-05': {
    en: {
      title: 'Music Rhythm Challenge',
      description: 'Feel the beat with a short rhythm activity.',
      category: 'Music'
    }
  },
  'short-local-06': {
    en: {
      title: 'Mini Sports Drill',
      description: 'A quick movement exercise for active kids.',
      category: 'Sports'
    }
  },
  'short-local-07': {
    en: {
      title: 'Cartoon Time',
      description: 'A short animated story for kids.',
      category: 'Cartoons'
    }
  },
  'short-local-08': {
    en: {
      title: 'Game Brain Boost',
      description: 'A mini game to train attention and logic.',
      category: 'Games'
    }
  },
  'short-local-09': {
    en: {
      title: 'Creative Spark',
      description: 'One quick task to unlock your imagination.',
      category: 'Creativity'
    }
  },
  'short-local-10': {
    en: {
      title: 'Nature Facts Fast',
      description: 'Discover a cool nature fact in one minute.',
      category: 'Nature'
    }
  }
};

type QuizQuestionTranslation = {
  sortOrder: number;
  text: string;
  options: Array<{ sortOrder: number; text: string }>;
};

type QuizTranslation = {
  title: string;
  description: string;
  questions: QuizQuestionTranslation[];
};

const quizCopies: Record<string, Partial<Record<Locale, QuizTranslation>>> = {
  'solar-system-for-kids': {
    en: {
      title: 'Quiz: Solar System',
      description: 'Check what you remember from the video.',
      questions: [
        {
          sortOrder: 1,
          text: 'Which star is in the center of the Solar System?',
          options: [
            { sortOrder: 1, text: 'Moon' },
            { sortOrder: 2, text: 'Sun' },
            { sortOrder: 3, text: 'Mars' }
          ]
        },
        {
          sortOrder: 2,
          text: 'Which planet is known for its rings?',
          options: [
            { sortOrder: 1, text: 'Saturn' },
            { sortOrder: 2, text: 'Earth' },
            { sortOrder: 3, text: 'Venus' }
          ]
        },
        {
          sortOrder: 3,
          text: 'Which planet do we live on?',
          options: [
            { sortOrder: 1, text: 'Jupiter' },
            { sortOrder: 2, text: 'Earth' },
            { sortOrder: 3, text: 'Neptune' }
          ]
        }
      ]
    }
  },
  'human-body-basics': {
    en: {
      title: 'Quiz: Human Body',
      description: 'Questions based on the body video.',
      questions: [
        {
          sortOrder: 1,
          text: 'Which organ pumps blood?',
          options: [
            { sortOrder: 1, text: 'Lungs' },
            { sortOrder: 2, text: 'Heart' },
            { sortOrder: 3, text: 'Liver' }
          ]
        },
        {
          sortOrder: 2,
          text: 'What helps us breathe?',
          options: [
            { sortOrder: 1, text: 'Lungs' },
            { sortOrder: 2, text: 'Kidneys' },
            { sortOrder: 3, text: 'Stomach' }
          ]
        },
        {
          sortOrder: 3,
          text: 'What is the hard framework of the body called?',
          options: [
            { sortOrder: 1, text: 'Skeleton' },
            { sortOrder: 2, text: 'Skin' },
            { sortOrder: 3, text: 'Muscles' }
          ]
        }
      ]
    }
  }
};

export function localizeVideo<T extends VideoShape>(video: T, locale: Locale): T {
  const copy = videoCopies[video.slug]?.[locale];
  if (!copy) return video;

  return {
    ...video,
    title: copy.title,
    description: copy.description,
    category: copy.category ?? video.category
  };
}

export function localizeVideoList<T extends VideoShape>(videos: T[], locale: Locale): T[] {
  return videos.map((video) => localizeVideo(video, locale));
}

type QuizQuestionShape = {
  id: string;
  text: string;
  sortOrder: number;
  options: Array<{ id: string; text: string; sortOrder: number }>;
};

type QuizShape = {
  title: string;
  description: string | null;
  questions: QuizQuestionShape[];
};

export function localizeQuiz(slug: string, quiz: QuizShape, locale: Locale): QuizShape {
  const copy = quizCopies[slug]?.[locale];
  if (!copy) return quiz;

  const questionMap = new Map(copy.questions.map((question) => [question.sortOrder, question]));

  return {
    ...quiz,
    title: copy.title,
    description: copy.description,
    questions: quiz.questions.map((question) => {
      const translatedQuestion = questionMap.get(question.sortOrder);
      if (!translatedQuestion) return question;

      const optionMap = new Map(translatedQuestion.options.map((option) => [option.sortOrder, option.text]));

      return {
        ...question,
        text: translatedQuestion.text,
        options: question.options.map((option) => ({
          ...option,
          text: optionMap.get(option.sortOrder) ?? option.text
        }))
      };
    })
  };
}
