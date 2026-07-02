# Портфолио — Валерий Шин

## Описание

Персональный сайт-портфолио frontend-разработчика на Next.js (App Router).
Публичная часть показывает проекты, навыки и контакты; проекты хранятся в
Supabase и управляются через собственную админ-панель с авторизацией по
логину и паролю — новые кейсы добавляются без правки кода.

## Страницы

- Главная (`/`) — hero-блок, позиционирование, ключевые навыки, CTA
- Обо мне (`/about`) — опыт, цели, сильные стороны
- Проекты (`/projects`) — карточки с поиском и фильтрацией по категориям
- Детальная страница проекта (`/projects/[slug]`) — динамический маршрут, полный кейс
- Навыки (`/skills`) — категории Frontend / Backend / Design / Tools / Soft Skills
- Контакты (`/contacts`) — форма обратной связи с валидацией
- 404 (`not-found`) — обработка несуществующих маршрутов
- Вход (`/login`) и Админ-панель (`/admin`) — закрыты авторизацией Supabase

## Функционал

- Список проектов из Supabase через REST API (route handlers)
- Динамическая страница проекта по slug + SEO-метаданные (`generateMetadata`)
- Поиск и фильтрация проектов (клиент, `useMemo`)
- Состояния загрузки (Loader), ошибки (ErrorMessage) и пустого результата (EmptyState)
- Форма обратной связи: валидация полей, ошибки под полями, success-состояние,
  сообщения сохраняются в Supabase
- Админ-панель: создание, редактирование, удаление и скрытие проектов
- Защита `/admin` через `proxy.ts` (Next.js 16) + RLS-политики в Postgres
- Анимации: плавное появление секций при скролле (IntersectionObserver), hover-эффекты
- Адаптивный интерфейс (desktop / tablet / mobile), мобильное меню

## Использованные хуки

| Хук | Где |
| --- | --- |
| `useState` | форма контактов, поиск, фильтры, мобильное меню, админ-формы |
| `useEffect` | загрузка данных в `useFetch`, IntersectionObserver в `useReveal` |
| `useParams` | детальная страница проекта `/projects/[slug]` |
| `useRouter` (`router.push` / `back`) | кнопка «назад», редиректы после логина |
| `useMemo` | фильтрация и поиск списка проектов |
| `useRef` | ссылка на DOM-элемент в `useReveal` |
| `useCallback` | стабильный `refetch` в `useFetch` |
| Кастомные хуки | `useFetch` (данные + loading/error), `useReveal` (анимация появления) |

## Технологии

- Next.js 16 (App Router, Turbopack)
- TypeScript
- Tailwind CSS v4
- Supabase (Postgres, RLS, Auth)

## Запуск проекта

1. Установить зависимости:

   ```bash
   npm install
   ```

2. Создать проект в [Supabase](https://supabase.com) и выполнить
   `supabase/schema.sql` в SQL Editor (создаёт таблицы, RLS-политики и
   стартовые проекты).

3. Создать пользователя-админа: Supabase Dashboard → Authentication → Users →
   Add user (email + пароль). Регистрация на сайте не предусмотрена — вход
   только для этого пользователя.

4. Скопировать `.env.example` в `.env.local` и заполнить ключами из
   Supabase Dashboard → Settings → API:

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

5. Запустить дев-сервер:

   ```bash
   npm run dev
   ```

Сайт: http://localhost:3000 · Админка: http://localhost:3000/admin

## Структура проекта

```
app/                 страницы (App Router) и API route handlers
  api/               REST API: projects CRUD, messages
  admin/, login/     админ-панель и вход
  projects/[slug]/   динамическая страница проекта
components/          переиспользуемые компоненты (Header, ProjectCard, ...)
hooks/               useFetch, useReveal
services/            projectsService — запросы к Supabase на сервере
data/                статические данные навыков
lib/supabase/        клиенты Supabase (browser / server)
proxy.ts             защита /admin (бывший middleware)
supabase/schema.sql  схема БД, RLS, сид
types/               типы Project, ProjectInput
```

## Ссылки

- GitHub: https://github.com/Valeriyshin/portfolio
- Деплой: —
