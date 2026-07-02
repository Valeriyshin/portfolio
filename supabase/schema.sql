-- ============================================================
-- Портфолио: схема БД для Supabase
-- Выполнить в Supabase Dashboard → SQL Editor
-- ============================================================

-- Таблица проектов
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text not null default '',
  description text not null default '',
  problem text not null default '',
  role text not null default '',
  stack text[] not null default '{}',
  features text[] not null default '{}',
  result text not null default '',
  improvements text not null default '',
  github_url text,
  demo_url text,
  image_url text,
  category text not null default 'frontend'
    check (category in ('frontend', 'fullstack', 'backend', 'design')),
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Сообщения из формы обратной связи
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null default '',
  message text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.projects enable row level security;
alter table public.messages enable row level security;

-- Публичное чтение только опубликованных проектов
create policy "public read published projects"
  on public.projects for select
  using (published = true);

-- Авторизованный админ видит всё и управляет всем
create policy "auth read all projects"
  on public.projects for select
  to authenticated
  using (true);

create policy "auth insert projects"
  on public.projects for insert
  to authenticated
  with check (true);

create policy "auth update projects"
  on public.projects for update
  to authenticated
  using (true);

create policy "auth delete projects"
  on public.projects for delete
  to authenticated
  using (true);

-- Любой посетитель может отправить сообщение, читает только админ
create policy "anyone can send message"
  on public.messages for insert
  with check (true);

create policy "auth read messages"
  on public.messages for select
  to authenticated
  using (true);

-- ============================================================
-- Стартовые данные (пример — отредактируйте через админку)
-- ============================================================
insert into public.projects
  (slug, title, short_description, description, problem, role, stack, features, result, improvements, github_url, demo_url, category, sort_order)
values
  (
    'aspekt-platform',
    'Aspekt School — лендинг и CRM',
    'Платформа языковой школы: маркетинговый лендинг и внутренняя CRM для управления учениками, уроками и финансами.',
    'Полноценная платформа для языковой школы (немецкий, английский, китайский): публичный лендинг и закрытая CRM-система, заменившая AlfaCRM. Роли администратора, менеджера и преподавателя, календарь занятий, канбан лидов, абонементы и финансовый учёт.',
    'Школе требовалось заменить дорогую стороннюю CRM собственным решением, заточенным под индивидуальные уроки и реальные процессы школы.',
    'Fullstack-разработчик',
    array['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'shadcn/ui'],
    array['Авторизация и роли', 'Календарь занятий', 'Канбан лидов', 'Учёт учеников и абонементов', 'Финансовый модуль', 'Задачи команды'],
    'Школа перешла с AlfaCRM на собственную платформу: ~50 учеников и ~10 преподавателей ведутся в системе.',
    'Добавить онлайн-оплату, WhatsApp-уведомления и аналитику по преподавателям.',
    'https://github.com/Valeriyshin/aspekt-platform',
    null,
    'fullstack',
    1
  ),
  (
    'portfolio',
    'Персональное портфолио',
    'Этот сайт: Next.js App Router, Supabase и собственная админ-панель для управления проектами.',
    'Сайт-портфолио с публичной частью (проекты, навыки, контакты) и закрытой админкой, где проекты добавляются и редактируются без правки кода. Данные хранятся в Supabase, доступ к админке — по логину и паролю.',
    'Портфолио нужно регулярно пополнять кейсами — хотелось делать это через удобную форму, а не через деплой новой версии кода.',
    'Frontend-разработчик',
    array['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    array['Каталог проектов с поиском и фильтрами', 'Динамические страницы кейсов', 'Форма обратной связи с валидацией', 'Админ-панель с CRUD', 'Авторизация Supabase'],
    'Живое портфолио, которое обновляется через админку за минуту.',
    'Добавить светлую тему и загрузку скриншотов прямо в Supabase Storage.',
    'https://github.com/Valeriyshin/portfolio',
    null,
    'frontend',
    2
  ),
  (
    'demo-project',
    'Третий проект (заполните в админке)',
    'Черновик карточки — замените содержимое через админ-панель.',
    'Откройте /admin, войдите под своим логином и отредактируйте этот проект: описание, задачу, роль, стек и ссылки.',
    'По ТЗ в портфолио должно быть минимум 3 проекта.',
    'Frontend-разработчик',
    array['React', 'TypeScript'],
    array['Пример функционала'],
    'Заполните результат проекта.',
    'Заполните планы по улучшению.',
    null,
    null,
    'frontend',
    3
  );
