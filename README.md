# Портфолио — Валерий Шин

## Описание

Персональный сайт: визитка + портфолио + резюме fullstack-разработчика
и digital-маркетолога на Next.js (App Router). Главная разводит на два
направления — «Разработка» и «Маркетинг»; весь контент (проекты,
маркетинг-кейсы, навыки, контакты, тексты) хранится в Supabase и
управляется через собственную админ-панель — без правки кода.

## Страницы

- Главная (`/`) — hero, два «крыла» (Разработка/Маркетинг), ключевые навыки
- Обо мне (`/about`) — опыт, цели, сильные стороны
- Разработка (`/projects`) — кейсы с поиском и фильтрацией по категориям
- Детальная страница проекта (`/projects/[slug]`) — динамический маршрут, полный кейс
- Маркетинг (`/marketing`) — кейсы digital-маркетинга (Meta/Google/TikTok Ads):
  полные кейсы с метриками + лёгкие карточки клиентов без цифр
- Детальная страница маркетинг-кейса (`/marketing/[slug]`)
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
- Админ-панель (`/admin`, `/admin/marketing`, `/admin/skills`, `/admin/contacts`,
  `/admin/content`, `/admin/messages`): CRUD проектов, маркетинг-кейсов, навыков
  (уровень — слайдер), контактов; редактирование текстов главной/about/contacts;
  просмотр заявок из формы обратной связи
- Защита `/admin/*` через `proxy.ts` (Next.js 16) + RLS-политики в Postgres
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

2. Проект Supabase уже создан (`portfolio`, ref `ejflnsbgpkvhcjijyvma`), схема
   и сид применены через MCP. Для нового окружения — создать проект в
   [Supabase](https://supabase.com) и выполнить `supabase/schema.sql` в SQL Editor.

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
  api/               REST API: projects/marketing-cases/skills/contacts CRUD, content, messages
  admin/, login/     админ-панель (проекты, маркетинг, навыки, контакты, тексты) и вход
  projects/[slug]/   динамическая страница проекта
  marketing/[slug]/  динамическая страница маркетинг-кейса
components/          переиспользуемые компоненты (Header, ProjectCard, MarketingCaseCard, ...)
hooks/               useFetch, useReveal
services/            projectsService, marketingService, contentService — запросы к Supabase
lib/supabase/        клиенты Supabase (browser / server)
proxy.ts             защита /admin/* (бывший middleware)
supabase/schema.sql  схема БД (projects, marketing_cases, skills, contacts, site_content), RLS, сид
types/               типы Project, MarketingCase, Skill, Contact, SiteContent
```

## Ссылки

- GitHub: https://github.com/Valeriyshin/portfolio
- Деплой: https://portfolio-zeta-lyart-20.vercel.app
