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

-- Навыки (управляются из админки, уровень — слайдер 0..100)
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('Frontend', 'Backend', 'Design', 'Tools', 'Soft Skills')),
  name text not null,
  level integer not null default 50 check (level between 0 and 100),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Контакты (ссылки на странице контактов и в футере)
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  href text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Тексты сайта — одна строка-синглтон, редактируется из админки
create table if not exists public.site_content (
  id integer primary key default 1 check (id = 1),
  hero_eyebrow text not null default '',
  hero_title text not null default '',
  hero_highlight text not null default '',
  hero_subtitle text not null default '',
  about_intro text not null default '',
  about_facts jsonb not null default '[]',
  about_strengths text[] not null default '{}',
  contacts_intro text not null default '',
  dev_wing_title text not null default 'Разработка',
  dev_wing_text text not null default '',
  marketing_wing_title text not null default 'Маркетинг',
  marketing_wing_text text not null default ''
);

-- Маркетинг-кейсы (Meta/Google/TikTok Ads) — полные (с метриками) и лёгкие (без цифр)
create table if not exists public.marketing_cases (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  client_name text not null,
  title text not null,
  niche text not null default '',
  channels text[] not null default '{}',
  short_description text not null default '',
  description text not null default '',
  period text not null default '',
  role text not null default '',
  budget_spend text not null default '',
  metrics jsonb not null default '[]',
  tools text[] not null default '{}',
  result text not null default '',
  improvements text not null default '',
  case_type text not null default 'full' check (case_type in ('full', 'light')),
  website_url text,
  image_url text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.projects enable row level security;
alter table public.messages enable row level security;
alter table public.skills enable row level security;
alter table public.contacts enable row level security;
alter table public.site_content enable row level security;
alter table public.marketing_cases enable row level security;

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

create policy "public read skills" on public.skills for select using (true);
create policy "auth manage skills" on public.skills for all to authenticated using (true) with check (true);

create policy "public read contacts" on public.contacts for select using (true);
create policy "auth manage contacts" on public.contacts for all to authenticated using (true) with check (true);

create policy "public read site_content" on public.site_content for select using (true);
create policy "auth update site_content" on public.site_content for update to authenticated using (true) with check (true);

create policy "public read published marketing cases" on public.marketing_cases for select using (published = true);
create policy "auth read all marketing cases" on public.marketing_cases for select to authenticated using (true);
create policy "auth manage marketing cases" on public.marketing_cases for all to authenticated using (true) with check (true);

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
    'Fullstack-разработчик',
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
    'fincouple',
    'Fincouple — личный и семейный бюджет',
    'Веб-приложение для учёта личных и семейных финансов на Next.js.',
    'Fincouple — сервис для ведения личного и семейного бюджета: помогает организовать учёт доходов и расходов внутри пары или семьи в одном месте.',
    'Нужен был удобный инструмент для совместного ведения бюджета — учитывать доходы и расходы не по отдельности, а в общем семейном контексте.',
    'Frontend-разработчик',
    array['Next.js', 'React'],
    array['Учёт личного и семейного бюджета', 'Адаптивный интерфейс'],
    'Рабочий прототип, задеплоенный на Vercel.',
    'Дополнить аналитикой расходов и категориями трат.',
    null,
    'https://fincouple-brown.vercel.app',
    'frontend',
    3
  ),
  (
    'marketing-agency',
    'Marketing Agency — лендинг агентства "Линза"',
    'Многостраничный лендинг маркетингового агентства: услуги, кейсы, контакты.',
    'Сайт-визитка для B2B-агентства интернет-маркетинга "Линза": главная, о нас, услуги, контакты, а также страницы входа и регистрации для кабинета клиента. Командный проект — вёрстка совместно с напарницей.',
    'Агентству нужен был презентационный сайт, объясняющий подход к B2B-продвижению в сложных нишах и ведущий клиента к заявке.',
    'Frontend-разработчик (командный проект)',
    array['HTML', 'CSS', 'SCSS'],
    array['Главная страница', 'Страница услуг', 'О нас', 'Контакты', 'Формы входа и регистрации', 'Адаптивная вёрстка'],
    'Готовый лендинг, задеплоенный на Vercel.',
    'Перенести на React/Next.js для повторного использования компонентов.',
    'https://github.com/Valeriyshin/Marketing-Agency',
    'https://marketing-agency-lens.vercel.app',
    'frontend',
    4
  );

-- Скриншоты (через api.microlink.io — публичный сервис скриншотов, без ключей)
update public.projects set image_url = 'https://iad.microlink.io/j0fSJ2UkGGQixgdfhFLucfqi7mRA35L-1d6Nlf8cAY58p89eqvZWpGWS_XNq8oldRrqebvqmGrQbnwd2UFWUyQ.png' where slug = 'aspekt-platform';
update public.projects set image_url = 'https://iad.microlink.io/m6o85_LdMCGZyykvvMg1_vknXnhdbFOoa0AgbPvHKtQuF_O6gKHRDItcEiEHV81AqmG_dR07GSuDvFjpieu5Hw.png' where slug = 'fincouple';
update public.projects set image_url = 'https://iad.microlink.io/kGuOePKac-N8_99b_RPmYdLgMr7zPbWXX-CpZLYITQMDY4fHVJWZ4qbCIDBcTRq25TBMvkqnoUg7oRBcsmHvsA.png' where slug = 'marketing-agency';
-- 'portfolio' — добавить скриншот после деплоя на Vercel (пока сайт доступен только локально)

-- ============================================================
-- Навыки — стартовый набор
-- ============================================================
insert into public.skills (category, name, level, sort_order) values
  ('Frontend', 'HTML / CSS', 75, 1),
  ('Frontend', 'JavaScript', 75, 2),
  ('Frontend', 'TypeScript', 90, 3),
  ('Frontend', 'React', 90, 4),
  ('Frontend', 'Next.js (App Router)', 90, 5),
  ('Frontend', 'Tailwind CSS', 90, 6),
  ('Backend', 'Supabase (Postgres, RLS)', 90, 1),
  ('Backend', 'REST API / Route Handlers', 75, 2),
  ('Backend', 'SQL', 50, 3),
  ('Backend', 'Node.js', 50, 4),
  ('Design', 'Figma', 50, 1),
  ('Design', 'Адаптивная вёрстка', 75, 2),
  ('Design', 'UI-паттерны и типографика', 50, 3),
  ('Tools', 'Git / GitHub', 75, 1),
  ('Tools', 'Vite', 50, 2),
  ('Tools', 'npm', 75, 3),
  ('Tools', 'VS Code', 75, 4),
  ('Soft Skills', 'Самостоятельность в задачах', 75, 1),
  ('Soft Skills', 'Коммуникация с заказчиком', 90, 2),
  ('Soft Skills', 'Работа с обратной связью', 75, 3),
  ('Soft Skills', 'Английский (документация)', 50, 4);

-- ============================================================
-- Контакты — стартовый набор
-- ============================================================
insert into public.contacts (label, value, href, sort_order) values
  ('GitHub', 'github.com/Valeriyshin', 'https://github.com/Valeriyshin', 1),
  ('Email', 'valeriy.shin.s@gmail.com', 'mailto:valeriy.shin.s@gmail.com', 2),
  ('Telegram', '@valeriyshin', 'https://t.me/valeriyshin', 3);

-- ============================================================
-- Тексты сайта — стартовое значение синглтон-строки
-- ============================================================
insert into public.site_content
  (id, hero_eyebrow, hero_title, hero_highlight, hero_subtitle, about_intro, about_facts, about_strengths, contacts_intro, dev_wing_title, dev_wing_text, marketing_wing_title, marketing_wing_text)
values
  (
    1,
    'Fullstack-разработчик и digital-маркетолог',
    E'Привет, я Валерий.\nРазрабатываю продукты и настраиваю рекламу, которая приводит клиентов',
    'рекламу, которая приводит клиентов',
    'Fullstack-разработка на React, Next.js и Supabase — и digital-маркетинг: настройка рекламных кампаний Meta Ads, Google Ads и TikTok Ads для реального бизнеса.',
    E'Меня зовут Валерий Шин. Я работаю на стыке разработки и маркетинга: создаю продукты на React и Next.js с базой данных и админкой, а как digital-маркетолог в BAZIS-A настраиваю рекламные кампании Meta Ads, Google Ads и TikTok Ads, которые приводят реальных клиентов.\n\nВ разработку пришёл через практику: вместо учебных туториалов почти сразу начал делать реальный продукт — платформу для языковой школы, которая заменила школе платную CRM. Этот же продукт продвигаю рекламой в Meta Ads — получается замкнутый цикл: сам разрабатываю и сам привожу в него клиентов.',
    '[{"title":"Разработка","text":"Fullstack: интерфейсы на React/Next.js плюс серверная часть — база данных, авторизация, API на Supabase."},{"title":"Маркетинг","text":"Digital-маркетолог в BAZIS-A: настраиваю и веду рекламные кампании Meta Ads, Google Ads и TikTok Ads для реального бизнеса."},{"title":"Цель","text":"Коммерческая работа или стажировка в команде, где можно расти рядом с опытными разработчиками."},{"title":"Сейчас","text":"Развиваю реальный продукт — платформу языковой школы (сайт + CRM), параллельно углубляюсь в TypeScript."}]'::jsonb,
    array['Довожу проекты до рабочего состояния, а не до «почти готово»', 'Разбираюсь в чужом коде и документации самостоятельно', 'Внимателен к деталям интерфейса: отступы, состояния, адаптив', 'Умею общаться с заказчиком и переводить задачи в код'],
    'Открыт к предложениям как в разработке, так и в digital-маркетинге — по найму, фрилансу или интересным проектам. Напишите через форму или в любой из каналов.',
    'Разработка',
    'React, Next.js, Supabase — от интерфейса до базы данных и админ-панелей. Смотрите кейсы разработки: от учебного портфолио до CRM языковой школы.',
    'Маркетинг',
    'Digital-маркетолог в BAZIS-A: настройка и ведение рекламных кампаний Meta Ads, Google Ads и TikTok Ads. Привожу заявки для реального бизнеса — от языковой школы до фермерского бутика.'
  );

-- ============================================================
-- Маркетинг-кейсы — стартовый набор (реальные данные из Meta Ads Manager)
-- ============================================================
insert into public.marketing_cases
  (slug, client_name, title, niche, channels, short_description, description, period, role, budget_spend, metrics, tools, result, improvements, case_type, website_url, published, sort_order)
values
  (
    'aspekt-school-meta-ads',
    'Aspekt School',
    'Привлечение учеников через клик-ту-WhatsApp рекламу',
    'Языковая школа (немецкий, английский, китайский)',
    array['Meta Ads', 'WhatsApp'],
    'Настройка и ведение рекламных кампаний в Meta Ads с прямым переходом в WhatsApp, отдельно по каждому языку.',
    'Своя школа: нужно было получать заявки на пробные уроки без отдела продаж — сразу в WhatsApp преподавателя. Кампании разделены по языкам (немецкий, английский, китайский), чтобы у каждого направления был свой оффер и своя воронка.',
    'Июнь 2024 — по настоящее время',
    'Digital-маркетолог',
    '≈ $5 367 (за всё время)',
    '[{"label":"Начато диалогов в WhatsApp","value":"≈ 2015"},{"label":"Средняя стоимость диалога","value":"≈ $2.66"},{"label":"Кампаний","value":"14"}]'::jsonb,
    array['Meta Ads Manager', 'WhatsApp Business', 'Facebook/Instagram Feed'],
    'Стабильный поток заявок на пробные уроки по трём языкам напрямую в WhatsApp, без дополнительного отдела продаж.',
    'Добавить отдельные лид-формы и ретаргетинг по тем, кто начал диалог, но не записался.',
    'full',
    'https://github.com/Valeriyshin/aspekt-platform',
    true,
    1
  ),
  (
    'bahcha-meta-ads',
    'Бахча',
    'Заявки и трафик в Instagram для фермерского бутика',
    'Фермерский бутик (полуфабрикаты и фермерские продукты)',
    array['Meta Ads', 'WhatsApp'],
    'Небольшие тестовые кампании с прямым переходом в WhatsApp и трафиком в Instagram-профиль по Алматы.',
    'Локальный бутик с полуфабрикатами: нужно было проверить каналы продвижения на небольшом бюджете (5–15$/день) и понять, какой формат приносит заявки дешевле.',
    'Февраль 2026 — по настоящее время',
    'Digital-маркетолог',
    '≈ $1 047 (за ~5 месяцев)',
    '[{"label":"Начато диалогов в WhatsApp","value":"≈ 357"},{"label":"Переходов в Instagram-профиль","value":"≈ 2873"},{"label":"Кампаний","value":"9"}]'::jsonb,
    array['Meta Ads Manager', 'WhatsApp Business', 'Instagram'],
    'Дешёвый и предсказуемый поток заявок и переходов в профиль на маленьком бюджете — подтвердили рабочую связку для локального бизнеса.',
    'Масштабировать бюджет на кампании с лучшей стоимостью диалога, добавить ретаргетинг по посетителям профиля.',
    'full',
    null,
    true,
    2
  ),
  (
    'raceline',
    'Raceline',
    'Продвижение каталога дисков и шин',
    'Диски и шины',
    array['Meta Ads'],
    'Продвижение каталога товаров и брендов дисков/шин через таргетированную рекламу.',
    '',
    '',
    'Digital-маркетолог',
    '',
    '[]'::jsonb,
    array['Meta Ads Manager'],
    '',
    '',
    'light',
    null,
    true,
    3
  ),
  (
    'este',
    'Este',
    'Продвижение ресторана в Instagram',
    'Ресторан',
    array['Meta Ads', 'SMM'],
    'Охватные кампании и продвижение постов для ресторана Este.',
    '',
    '',
    'Digital-маркетолог',
    '',
    '[]'::jsonb,
    array['Meta Ads Manager'],
    '',
    '',
    'light',
    null,
    true,
    4
  ),
  (
    'latenightshow',
    'LateNightShow',
    'Продвижение ночного клуба',
    'Клуб',
    array['Meta Ads', 'SMM'],
    'Реклама мероприятий и афиш ночного клуба LateNightShow.',
    '',
    '',
    'Digital-маркетолог',
    '',
    '[]'::jsonb,
    array['Meta Ads Manager'],
    '',
    '',
    'light',
    null,
    true,
    5
  ),
  (
    'glamur',
    'Glamur',
    'Продвижение ресторана',
    'Ресторан',
    array['Meta Ads', 'SMM'],
    'Таргетированная реклама и продвижение постов для ресторана Glamur.',
    '',
    '',
    'Digital-маркетолог',
    '',
    '[]'::jsonb,
    array['Meta Ads Manager'],
    '',
    '',
    'light',
    null,
    true,
    6
  ),
  (
    'aestetika',
    'Aestetika',
    'Продвижение услуг дизайна и ремонта',
    'Дизайн и ремонт',
    array['Meta Ads', 'SMM'],
    'Лидогенерация и продвижение портфолио для студии дизайна и ремонта Aestetika.',
    '',
    '',
    'Digital-маркетолог',
    '',
    '[]'::jsonb,
    array['Meta Ads Manager'],
    '',
    '',
    'light',
    null,
    true,
    7
  );
