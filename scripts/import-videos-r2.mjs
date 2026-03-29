import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import mime from 'mime-types';
import { PrismaClient } from '@prisma/client';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const prisma = new PrismaClient();

const SOURCE_DIR = process.env.VIDEO_IMPORT_SOURCE_DIR || 'C:\\Users\\user\\Desktop\\BilimTube_video\\new';
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL;

const CATEGORY_MAP = {
  'биология': { key: 'biology', label: 'Биология' },
  'искусство': { key: 'art', label: 'Искусство' },
  'космос': { key: 'space', label: 'Космос' },
  'матем': { key: 'math', label: 'Математика' },
  'наука': { key: 'science', label: 'Наука' },
  'природа': { key: 'nature', label: 'Природа' },
  'спорт': { key: 'sport', label: 'Спорт' },
  'творчество': { key: 'creativity', label: 'Творчество' },
  'язык': { key: 'language', label: 'Языки' }
};

const AGE_GROUP_BY_CATEGORY = {
  'Биология': '7-9',
  'Искусство': '4-6',
  'Космос': '7-9',
  'Математика': '7-9',
  'Наука': '7-9',
  'Природа': '4-6',
  'Спорт': '7-9',
  'Творчество': '4-6',
  'Языки': '4-6'
};

const CATEGORY_COPY = {
  ru: {
    'Биология': { title: 'Биология', description: 'Обучающее видео о живой природе и теле человека.' },
    'Искусство': { title: 'Искусство', description: 'Короткое видео о творчестве, цвете и форме.' },
    'Космос': { title: 'Космос', description: 'Видео о планетах, звездах и космическом мире.' },
    'Математика': { title: 'Математика', description: 'Понятное объяснение чисел, счета и логики.' },
    'Наука': { title: 'Наука', description: 'Обучающее видео с простым объяснением научной темы.' },
    'Природа': { title: 'Природа', description: 'Видео о животных, растениях и окружающем мире.' },
    'Спорт': { title: 'Спорт', description: 'Короткая спортивная активность или упражнение для детей.' },
    'Творчество': { title: 'Творчество', description: 'Видео для развития фантазии и творческих навыков.' },
    'Языки': { title: 'Языки', description: 'Видео для изучения слов, букв и разговорных фраз.' }
  },
  en: {
    'Биология': { title: 'Biology', description: 'Educational video about living nature and the human body.' },
    'Искусство': { title: 'Art', description: 'A short video about creativity, color, and form.' },
    'Космос': { title: 'Space', description: 'A video about planets, stars, and outer space.' },
    'Математика': { title: 'Math', description: 'A clear explanation of numbers, counting, and logic.' },
    'Наука': { title: 'Science', description: 'An educational video with a simple science explanation.' },
    'Природа': { title: 'Nature', description: 'A video about animals, plants, and the natural world.' },
    'Спорт': { title: 'Sports', description: 'A quick sports activity or exercise for kids.' },
    'Творчество': { title: 'Creativity', description: 'A video for imagination and creative thinking.' },
    'Языки': { title: 'Languages', description: 'A video for learning words, letters, and daily phrases.' }
  },
  ky: {
    'Биология': { title: 'Биология', description: 'Жаратылыш жана адам денеси тууралуу үйрөтүүчү видео.' },
    'Искусство': { title: 'Өнөр', description: 'Чыгармачылык, түс жана форма жөнүндө кыска видео.' },
    'Космос': { title: 'Космос', description: 'Планеталар, жылдыздар жана аалам жөнүндө видео.' },
    'Математика': { title: 'Математика', description: 'Сандар, эсеп жана логика жөнүндө түшүнүктүү видео.' },
    'Наука': { title: 'Илим', description: 'Илимий теманы жөнөкөй түшүндүргөн үйрөтүүчү видео.' },
    'Природа': { title: 'Жаратылыш', description: 'Жаныбарлар, өсүмдүктөр жана айлана-чөйрө жөнүндө видео.' },
    'Спорт': { title: 'Спорт', description: 'Балдар үчүн кыска машыгуу же спорттук көнүгүү.' },
    'Творчество': { title: 'Чыгармачылык', description: 'Элестетүүнү жана чыгармачылыкты өнүктүргөн видео.' },
    'Языки': { title: 'Тилдер', description: 'Сөздөрдү, тамгаларды жана сүйлөмдөрдү үйрөтүүчү видео.' }
  }
};

function assertEnv() {
  const missing = [
    ['R2_ACCOUNT_ID', R2_ACCOUNT_ID],
    ['R2_ACCESS_KEY_ID', R2_ACCESS_KEY_ID],
    ['R2_SECRET_ACCESS_KEY', R2_SECRET_ACCESS_KEY],
    ['R2_BUCKET_NAME', R2_BUCKET_NAME],
    ['R2_PUBLIC_BASE_URL', R2_PUBLIC_BASE_URL]
  ].filter(([, value]) => !value).map(([key]) => key);

  if (!fs.existsSync(SOURCE_DIR)) {
    throw new Error(`Source directory does not exist: ${SOURCE_DIR}`);
  }

  if (missing.length) {
    throw new Error(`Missing env vars: ${missing.join(', ')}`);
  }
}

function inferLanguage(fileName) {
  const lower = fileName.toLowerCase();
  if (lower.includes('кырг')) return 'ky';
  if (lower.includes('анг')) return 'en';
  return 'ru';
}

function parseDurationSec(filePath) {
  try {
    const folder = path.dirname(filePath).replace(/'/g, "''");
    const file = path.basename(filePath).replace(/'/g, "''");
    const script = [
      `$shell=New-Object -ComObject Shell.Application`,
      `$ns=$shell.Namespace('${folder}')`,
      `$item=$ns.ParseName('${file}')`,
      `$value=$ns.GetDetailsOf($item,27)`,
      'Write-Output $value'
    ].join(';');
    const value = execFileSync('powershell', ['-NoProfile', '-Command', script], { encoding: 'utf-8' }).trim();
    const parts = value.split(':').map((part) => Number(part));
    if (parts.length === 3 && parts.every((part) => Number.isFinite(part))) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
  } catch {
    return 60;
  }

  return 60;
}

function buildMetadata(categoryLabel, language, index) {
  const copy = CATEGORY_COPY[language][categoryLabel];
  return {
    title: `${copy.title} ${index}`,
    description: copy.description
  };
}

function buildSlug(categoryKey, language, index) {
  return `import-${categoryKey}-${language}-${String(index).padStart(2, '0')}`;
}

function buildR2Client() {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY
    }
  });
}

function buildImportEntries() {
  const entries = [];
  const directories = fs.readdirSync(SOURCE_DIR, { withFileTypes: true }).filter((entry) => entry.isDirectory());

  for (const directory of directories) {
    const mappedCategory = CATEGORY_MAP[directory.name.toLowerCase()];
    if (!mappedCategory) continue;

    const files = fs
      .readdirSync(path.join(SOURCE_DIR, directory.name), { withFileTypes: true })
      .filter((entry) => entry.isFile() && /\.(mp4|mov|webm)$/i.test(entry.name))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

    files.forEach((file, index) => {
      const filePath = path.join(SOURCE_DIR, directory.name, file.name);
      const language = inferLanguage(file.name);
      const durationSec = parseDurationSec(filePath);
      const contentType = durationSec <= 90 ? 'SHORT' : 'LONG';
      const key = `catalog/${contentType.toLowerCase()}/${language}/${mappedCategory.key}/${path.basename(file.name).replace(/\s+/g, '-').toLowerCase()}`;
      const metadata = buildMetadata(mappedCategory.label, language, index + 1);

      entries.push({
        slug: buildSlug(mappedCategory.key, language, index + 1),
        title: metadata.title,
        description: metadata.description,
        category: mappedCategory.label,
        language,
        ageGroup: AGE_GROUP_BY_CATEGORY[mappedCategory.label] ?? '7-9',
        thumbnailUrl: '/assets/bars.png',
        videoUrl: `${R2_PUBLIC_BASE_URL.replace(/\/$/, '')}/${key}`,
        storageKey: key,
        sourcePath: filePath,
        durationSec,
        viewsCount: 0,
        contentType
      });
    });
  }

  return entries;
}

async function uploadFile(client, entry) {
  const upload = new Upload({
    client,
    params: {
      Bucket: R2_BUCKET_NAME,
      Key: entry.storageKey,
      Body: fs.createReadStream(entry.sourcePath),
      ContentType: mime.lookup(entry.sourcePath) || 'application/octet-stream'
    }
  });

  await upload.done();
}

async function cleanupRemovedRows(importedSlugs) {
  const staleVideos = await prisma.video.findMany({
    where: {
      slug: { startsWith: 'import-' },
      NOT: { slug: { in: importedSlugs } }
    },
    select: {
      id: true,
      slug: true,
      videoUrl: true
    }
  });

  if (!staleVideos.length) return;

  await prisma.video.deleteMany({
    where: {
      id: { in: staleVideos.map((item) => item.id) }
    }
  });

  const client = buildR2Client();

  for (const video of staleVideos) {
    const key = video.videoUrl.replace(`${R2_PUBLIC_BASE_URL.replace(/\/$/, '')}/`, '');
    if (!key || key === video.videoUrl) continue;
    await client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
  }
}

async function main() {
  assertEnv();

  const client = buildR2Client();
  const entries = buildImportEntries();

  if (!entries.length) {
    throw new Error('No importable videos found in source directory');
  }

  for (const entry of entries) {
    console.log(`Uploading ${entry.slug} -> ${entry.storageKey}`);
    await uploadFile(client, entry);

    await prisma.video.upsert({
      where: { slug: entry.slug },
      create: {
        slug: entry.slug,
        title: entry.title,
        description: entry.description,
        category: entry.category,
        language: entry.language,
        ageGroup: entry.ageGroup,
        thumbnailUrl: entry.thumbnailUrl,
        videoUrl: entry.videoUrl,
        durationSec: entry.durationSec,
        viewsCount: entry.viewsCount,
        contentType: entry.contentType
      },
      update: {
        title: entry.title,
        description: entry.description,
        category: entry.category,
        language: entry.language,
        ageGroup: entry.ageGroup,
        thumbnailUrl: entry.thumbnailUrl,
        videoUrl: entry.videoUrl,
        durationSec: entry.durationSec,
        contentType: entry.contentType,
        isPublished: true
      }
    });
  }

  await cleanupRemovedRows(entries.map((entry) => entry.slug));

  console.log(`Imported ${entries.length} videos from ${SOURCE_DIR}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
