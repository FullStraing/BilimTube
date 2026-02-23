import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const longVideos = [
  {
    slug: 'solar-system-for-kids',
    title: 'Как устроена Солнечная система',
    description: 'Узнаем о планетах, звездах и удивительных явлениях в космосе.',
    category: 'Космос',
    ageGroup: '4-6',
    thumbnailUrl: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1200&q=80',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    contentType: 'LONG',
    durationSec: 420,
    viewsCount: 12500
  },
  {
    slug: 'dinosaur-world',
    title: 'Динозавры: кто они и как жили',
    description: 'Древний мир динозавров простыми словами.',
    category: 'Наука',
    ageGroup: '7-9',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501706362039-c6e08d4e5f2b?w=1200&q=80',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    contentType: 'LONG',
    durationSec: 480,
    viewsCount: 9800
  },
  {
    slug: 'fun-english-alphabet',
    title: 'Английский алфавит: весело учим',
    description: 'Учимся читать буквы и слова вместе.',
    category: 'Языки',
    ageGroup: '4-6',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&q=80',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    contentType: 'LONG',
    durationSec: 360,
    viewsCount: 22300
  },
  {
    slug: 'human-body-basics',
    title: 'Как работает наш организм',
    description: 'Интересные факты о теле человека.',
    category: 'Биология',
    ageGroup: '7-9',
    thumbnailUrl: 'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=1200&q=80',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    contentType: 'LONG',
    durationSec: 600,
    viewsCount: 15400
  },
  {
    slug: 'nature-adventure',
    title: 'Путешествие в мир природы',
    description: 'Животные, леса и океаны для детей.',
    category: 'Природа',
    ageGroup: '4-6',
    thumbnailUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1200&q=80',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    contentType: 'LONG',
    durationSec: 540,
    viewsCount: 8700
  }
];

const shortVideos = [
  {
    slug: 'short-planet-facts',
    title: '3 факта о планетах',
    description: 'Быстро узнаем необычные факты о планетах Солнечной системы.',
    category: 'Наука',
    ageGroup: '7-9',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=80',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    contentType: 'SHORT',
    durationSec: 58,
    viewsCount: 4100
  },
  {
    slug: 'short-math-trick',
    title: 'Математика за 1 минуту',
    description: 'Лайфхак для быстрого умножения на 9.',
    category: 'Математика',
    ageGroup: '10-13',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=900&q=80',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    contentType: 'SHORT',
    durationSec: 64,
    viewsCount: 5320
  },
  {
    slug: 'short-english-words',
    title: '5 английских слов на каждый день',
    description: 'Простые слова для детей с быстрым запоминанием.',
    category: 'Языки',
    ageGroup: '4-6',
    thumbnailUrl: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=900&q=80',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    contentType: 'SHORT',
    durationSec: 49,
    viewsCount: 6900
  },
  {
    slug: 'short-science-experiment',
    title: 'Домашний научный опыт',
    description: 'Безопасный мини-эксперимент, который можно повторить дома.',
    category: 'Наука',
    ageGroup: '7-9',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900&q=80',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    contentType: 'SHORT',
    durationSec: 73,
    viewsCount: 2880
  },
  {
    slug: 'short-nature-quiz',
    title: 'Угадай животное по следам',
    description: 'Короткая игра-викторина про животных.',
    category: 'Природа',
    ageGroup: '4-6',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501706362039-c6e08d4e5f2b?w=900&q=80',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    contentType: 'SHORT',
    durationSec: 55,
    viewsCount: 3470
  },
  {
    slug: 'short-music-rhythm',
    title: 'Ритм и музыка за минуту',
    description: 'Учимся ловить ритм через простое упражнение.',
    category: 'Музыка',
    ageGroup: '7-9',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=900&q=80',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    contentType: 'SHORT',
    durationSec: 62,
    viewsCount: 2710
  }
];

const videos = [...longVideos, ...shortVideos];

async function main() {
  for (const video of videos) {
    await prisma.video.upsert({
      where: { slug: video.slug },
      create: video,
      update: video
    });
  }

  const solarVideo = await prisma.video.findUnique({ where: { slug: 'solar-system-for-kids' }, select: { id: true } });
  const bodyVideo = await prisma.video.findUnique({ where: { slug: 'human-body-basics' }, select: { id: true } });

  if (solarVideo) {
    await prisma.quiz.deleteMany({ where: { videoId: solarVideo.id } });
    await prisma.quiz.create({
      data: {
        videoId: solarVideo.id,
        title: 'Тест: Солнечная система',
        description: 'Проверь, что ты запомнил из видео.',
        questions: {
          create: [
            {
              text: 'Какая звезда находится в центре Солнечной системы?',
              sortOrder: 1,
              options: {
                create: [
                  { text: 'Луна', sortOrder: 1, isCorrect: false },
                  { text: 'Солнце', sortOrder: 2, isCorrect: true },
                  { text: 'Марс', sortOrder: 3, isCorrect: false }
                ]
              }
            },
            {
              text: 'Какая планета известна своими кольцами?',
              sortOrder: 2,
              options: {
                create: [
                  { text: 'Сатурн', sortOrder: 1, isCorrect: true },
                  { text: 'Земля', sortOrder: 2, isCorrect: false },
                  { text: 'Венера', sortOrder: 3, isCorrect: false }
                ]
              }
            },
            {
              text: 'На какой планете живем мы?',
              sortOrder: 3,
              options: {
                create: [
                  { text: 'Юпитер', sortOrder: 1, isCorrect: false },
                  { text: 'Земля', sortOrder: 2, isCorrect: true },
                  { text: 'Нептун', sortOrder: 3, isCorrect: false }
                ]
              }
            }
          ]
        }
      }
    });
  }

  if (bodyVideo) {
    await prisma.quiz.deleteMany({ where: { videoId: bodyVideo.id } });
    await prisma.quiz.create({
      data: {
        videoId: bodyVideo.id,
        title: 'Тест: Наш организм',
        description: 'Вопросы по видео о теле человека.',
        questions: {
          create: [
            {
              text: 'Какой орган перекачивает кровь?',
              sortOrder: 1,
              options: {
                create: [
                  { text: 'Легкие', sortOrder: 1, isCorrect: false },
                  { text: 'Сердце', sortOrder: 2, isCorrect: true },
                  { text: 'Печень', sortOrder: 3, isCorrect: false }
                ]
              }
            },
            {
              text: 'Что помогает нам дышать?',
              sortOrder: 2,
              options: {
                create: [
                  { text: 'Легкие', sortOrder: 1, isCorrect: true },
                  { text: 'Почки', sortOrder: 2, isCorrect: false },
                  { text: 'Желудок', sortOrder: 3, isCorrect: false }
                ]
              }
            },
            {
              text: 'Как называется твердая основа тела?',
              sortOrder: 3,
              options: {
                create: [
                  { text: 'Скелет', sortOrder: 1, isCorrect: true },
                  { text: 'Кожа', sortOrder: 2, isCorrect: false },
                  { text: 'Мышцы', sortOrder: 3, isCorrect: false }
                ]
              }
            }
          ]
        }
      }
    });
  }

  console.log(`Seeded ${videos.length} videos (${shortVideos.length} shorts)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
