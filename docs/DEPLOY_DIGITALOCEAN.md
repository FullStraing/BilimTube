## DigitalOcean

Текущее состояние:
- проект удален из `Vercel`
- локальная привязка `.vercel` удалена
- репозиторий подготовлен к деплою в `DigitalOcean App Platform`

Что уже добавлено:
- `Dockerfile`
- `.dockerignore`
- `.do/app.yaml`
- `next.config.mjs` -> `output: 'standalone'`

Что нужно сделать дальше:

1. Войти в другой аккаунт `DigitalOcean`.
2. Создать удаленную PostgreSQL.
3. В `App Platform` создать приложение из GitHub-репозитория `FullStraing/BilimTube`.
4. При создании выбрать `Dockerfile`.
5. Заполнить env:

```env
NODE_ENV=production
APP_URL=https://<your-app-domain>
NEXT_PUBLIC_API_BASE_URL=https://<your-app-domain>
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://<your-app-domain>/api/auth/google/callback
DATABASE_URL=...
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=bilimtube
R2_PUBLIC_BASE_URL=...
```

6. В Google Cloud добавить:

```text
https://<your-app-domain>
https://<your-app-domain>/api/auth/google/callback
```

Важно:
- `localhost`-база не подойдет для production
- нужен удаленный Postgres
- после этого выполнить Prisma migrations на production DB

Локально можно проверить Docker:

```bash
docker build -t bilimtube .
docker run -p 8080:8080 --env-file .env bilimtube
```
