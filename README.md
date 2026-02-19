# BilimTube

## Быстрый старт

```bash
npm install
cp .env.example .env.local
npm run prisma:generate
npm run dev
```

## Скрипты

- `npm run dev` — локальная разработка
- `npm run build` — production сборка
- `npm run start` — запуск production сервера
- `npm run lint` — линтинг
- `npm run format` — форматирование
- `npm run prisma:migrate` — применить миграции локально

## Архитектура

- `app/` — App Router страницы и API роуты
- `components/` — переиспользуемые UI-компоненты
- `features/` — фичи по доменам
- `lib/` — утилиты и инфраструктура
- `prisma/` — схема и миграции PostgreSQL
- `public/assets/` — ассеты
- `docs/` — документация

## Google OAuth

1. Создайте OAuth Client в Google Cloud Console.
2. Добавьте Redirect URI:
- `http://localhost:3000/api/auth/google/callback`
- прод URL вида `https://your-domain.com/api/auth/google/callback`
3. Заполните переменные в `.env.local`:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `APP_URL`
4. Примените миграции Prisma.

## Деплой

- Настройте env-переменные в хостинге.
- Выполните `prisma migrate deploy`.
- Соберите проект: `npm run build`.
- Запустите проект: `npm run start`.
