# BUILD STEPS

## Фаза 1 — Setup
- [x] Инициализация Next.js + TypeScript + Tailwind
- [x] Базовая структура папок (`app`, `components`, `features`, `lib`, `styles`, `types`, `public/assets`)
- [x] Настройка ESLint/Prettier и абсолютных импортов

## Фаза 2 — UI Tokens
- [x] Глобальные CSS-токены (цвета, радиусы, тени, типографика)
- [x] Базовая унификация визуала под мобильный first подход
- [ ] Полная синхронизация токенов с финальным Figma UI kit

## Фаза 3 — Layouts
- [x] Единый `PageHeader`
- [x] Единый `MainNavigation` (desktop sidebar + mobile tabbar)
- [x] Исправлены основные mobile-слои (z-index / safe-area)
- [ ] Финальный desktop polish всех страниц

## Фаза 4 — Routing
- [x] Основные маршруты: home/shorts/categories/search/favorites/profile
- [x] Auth маршруты: login/register
- [x] Родительские маршруты: parent dashboard / controls / profiles
- [x] Маршруты child-профиля и переключения

## Фаза 5 — API
- [x] API для auth/login/register/logout/me
- [x] API для видео (лента, детальная, похожие, категории)
- [x] API для избранного
- [x] API для watch history
- [x] API для тестов (quiz + submit)
- [ ] Rate limiting и anti-abuse слой

## Фаза 6 — Auth
- [x] Email/phone auth
- [x] Google OAuth auth
- [x] Сессии в БД + cookie
- [ ] Forgot password flow
- [ ] Усиление security (attempt limits, lockouts)

## Фаза 7 — Polishing
- [x] Базовая адаптивность mobile/desktop
- [x] Онбординг-сплэш на home
- [ ] E2E тесты критических сценариев
- [ ] Улучшение состояния загрузки/ошибок на всех страницах
- [ ] Production observability (logs/metrics)
