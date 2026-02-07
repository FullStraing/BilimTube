# BilimTube

## Ѕыстрый старт

```bash
npm install
npm run dev
```

## —крипты

- `npm run dev` Ч локальна€ разработка
- `npm run build` Ч продакшн сборка
- `npm run start` Ч запуск продакшн сервера
- `npm run lint` Ч линтинг
- `npm run format` Ч форматирование

## јрхитектура

- `app/` Ч маршруты App Router, layout и страницы
- `components/` Ч переиспользуемые UI-компоненты
- `features/` Ч фичи по доменам (auth и т.д.)
- `lib/` Ч утилиты, API слой, TanStack Query
- `styles/` Ч глобальные стили и токены
- `types/` Ч общие типы
- `public/assets/` Ч статические ассеты
- `docs/` Ч документаци€

##  ак добавить страницу

1. —оздайте папку маршрута в `app/`.
2. ƒобавьте `page.tsx`.
3. ѕри необходимости подключите в `components/layout/nav-items.ts`.

##  ак добавить компонент

1. ƒобавьте файл в `components/`.
2. Ёкспортируйте и используйте в нужной странице/фиче.
3. —тили Ч через Tailwind и CSS переменные в `styles/globals.css`.

##  ак добавить API-запрос

1. ќпишите endpoint в `lib/api/index.ts`.
2. —оздайте хук в `lib/queries.ts`.
3. »спользуйте хук в клиентских компонентах.

## ƒеплой

- Ќастройте `NEXT_PUBLIC_API_BASE_URL` в переменных окружени€.
- ¬ыполните `npm run build`.
- «апустите `npm run start`.
