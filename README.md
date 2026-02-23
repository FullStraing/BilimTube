# BilimTube

## Текущий статус

MVP в активной разработке. Уже реализованы:
- аутентификация: email/телефон + Google OAuth
- сессии через cookie и backend-сессии в PostgreSQL
- профили детей и переключение активного профиля
- родительский контроль с сохранением настроек
- лента видео, категории, поиск, избранное, профиль
- история просмотров и базовые тесты по видео

## Технологии

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query
- React Hook Form + Zod
- Prisma + PostgreSQL

## Быстрый старт

1. Установка зависимостей:
```bash
npm install
```

2. Создание env-файла:
```bash
cp .env.example .env.local
```
Windows PowerShell:
```powershell
Copy-Item .env.example .env.local
```

3. Применение миграций:
```bash
npm run prisma:migrate
```

4. Генерация Prisma Client:
```bash
npm run prisma:generate
```

5. Запуск:
```bash
npm run dev
```

## Переменные окружения

Смотри шаблон в `.env.example`.
Ключевые поля:
- `DATABASE_URL`
- `APP_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `NEXT_PUBLIC_API_BASE_URL` (опционально)

## Скрипты

- `npm run dev` — локальная разработка
- `npm run build` — production сборка
- `npm run start` — запуск production сервера
- `npm run lint` — линтинг
- `npm run format` — форматирование
- `npm run prisma:migrate` — миграции (dev)
- `npm run prisma:generate` — генерация Prisma Client
- `npm run seed` — заполнение тестовыми видео

## Структура проекта

- `app/` — страницы и API роуты
- `components/` — UI и layout-компоненты
- `features/` — бизнес-фичи (auth, videos, parent-control)
- `lib/` — инфраструктурные утилиты
- `prisma/` — schema и миграции
- `public/assets/` — статические ассеты
- `styles/` — глобальные стили
- `docs/` — документация по фазам и задачам

## Google OAuth

1. Создать OAuth Client (Web Application) в Google Cloud.
2. Добавить redirect URI:
- `http://localhost:3000/api/auth/google/callback`
- production URI вашего домена.
3. Заполнить значения в `.env.local`.
4. Перезапустить приложение.

## Деплой (MVP)

Рекомендуемый стек: Vercel + managed PostgreSQL (Neon/Supabase).

Шаги:
1. Подключить репозиторий в Vercel.
2. Добавить env-переменные в Vercel Project Settings.
3. Выполнить миграции на проде: `prisma migrate deploy`.
4. Обновить Google OAuth redirect URI на production URL.
5. Проверить login/register/google flow.
