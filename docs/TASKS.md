# TASKS

## P0 (следующие шаги)
- [ ] Привести `docs/` и roadmap в единый changelog-формат по релизам
- [ ] Добавить `Forgot password` (email first, SMS позже)
- [ ] Добавить rate-limit для `/api/auth/*` и `/api/videos/*` write-ручек
- [ ] Добавить защиту от brute-force (ошибки логина, задержка, блокировки)
- [ ] Проверить и унифицировать desktop-адаптив в `favorites`, `video`, `parent/*`

## P1
- [ ] E2E тесты: login/register/google, switch child, favorite, history, quiz submit
- [ ] Улучшить обработку ошибок API на UI (единый error state)
- [ ] Добавить серверные audit-логи для auth и parent-control изменений
- [ ] Добавить страницу/инструмент управления контентом (CRUD видео)

## P2
- [ ] Аналитика продуктовых событий (просмотры, клики, тесты)
- [ ] Web-vitals и performance budget
- [ ] Подготовка к прод-деплою: checklist для Vercel + Postgres + OAuth

## Технический долг
- [ ] Убрать старые/лишние стили и дубли CSS-классов
- [ ] Проверить и убрать неиспользуемые компоненты
- [ ] Закрыть warning в `tailwind.config.ts` (`import/no-anonymous-default-export`)
