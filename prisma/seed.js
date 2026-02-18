import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const videos = [
  {
    slug: 'solar-system-for-kids',
    title: 'Как устроена Солнечная система',
    description: 'Узнаем о планетах, звездах и удивительных явлениях в космосе.',
    category: 'Космос',
    ageGroup: '4-6',
    thumbnailUrl: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1200&q=80',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    durationSec: 420,
    viewsCount: 12500
  },
  {
    slug: 'dinosaur-world',
    title: 'Динозавры: кто они и как жили',
    description: 'Древний мир динозавров простыми словами.',
    category: 'Наука',
    ageGroup: '7-9',
    thumbnailUrl: 'https://images.unsplash.com/photo-1621886292650-52042c84f8ef?w=1200&q=80',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
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
    durationSec: 540,
    viewsCount: 8700
  }
];

async function main() {
  for (const video of videos) {
    await prisma.video.upsert({
      where: { slug: video.slug },
      create: video,
      update: video
    });
  }

  console.log(`Seeded ${videos.length} videos`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
