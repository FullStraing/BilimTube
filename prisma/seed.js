import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';

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

const shortCategories = [
  'Наука',
  'Математика',
  'Языки',
  'Искусство',
  'Музыка',
  'Спорт',
  'Мультфильмы',
  'Игры',
  'Творчество',
  'Природа'
];

const shortAgeGroups = ['4-6', '7-9', '10-13'];

const localShortFiles = fs
  .readdirSync(path.join(process.cwd(), 'public', 'assets', 'shorts'))
  .filter((file) => /\.(mp4|mov|webm)$/i.test(file))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const shortVideos = localShortFiles.map((file, index) => ({
  slug: `short-local-${String(index + 1).padStart(2, '0')}`,
  title: `Short #${index + 1}`,
  description: `Локальное короткое видео #${index + 1}.`,
  category: shortCategories[index % shortCategories.length],
  ageGroup: shortAgeGroups[index % shortAgeGroups.length],
  thumbnailUrl: '/assets/bars.png',
  videoUrl: `/assets/shorts/${file}`,
  contentType: 'SHORT',
  durationSec: 30,
  viewsCount: 0
}));

async function main() {
  for (const video of longVideos) {
    await prisma.video.upsert({
      where: { slug: video.slug },
      create: video,
      update: video
    });
  }

  await prisma.video.deleteMany({ where: { contentType: 'SHORT' } });

  if (shortVideos.length > 0) {
    await prisma.video.createMany({ data: shortVideos });
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

  console.log(`Seeded ${longVideos.length + shortVideos.length} videos (${shortVideos.length} shorts)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
