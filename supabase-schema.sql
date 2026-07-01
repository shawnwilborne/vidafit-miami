-- VidaFit Miami — Supabase / PostgreSQL Schema
-- Run in Supabase SQL Editor or via `supabase db push`

-- ─── Extensions ────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- fast fuzzy food search

-- ─── Users / Profiles ──────────────────────────────────────────────────────
create table public.profiles (
  id            uuid primary key references auth.users on delete cascade,
  full_name     text,
  neighborhood  text,                      -- 'Brickell', 'South Beach', etc.
  calorie_goal  int  not null default 2000,
  protein_goal  int  not null default 150,
  carb_goal     int  not null default 200,
  fat_goal      int  not null default 65,
  water_goal    int  not null default 10,  -- glasses
  step_goal     int  not null default 10000,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Users see own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

-- ─── Food / Nutrition ──────────────────────────────────────────────────────
create table public.foods (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  brand         text,
  restaurant    text,                      -- 'Versailles', 'Zuma Miami', etc.
  cuisine_type  text,                      -- 'Cuban', 'Caribbean', 'Mediterranean'
  calories      numeric(7,2) not null,
  protein_g     numeric(6,2),
  carbs_g       numeric(6,2),
  fat_g         numeric(6,2),
  fiber_g       numeric(6,2),
  serving_size  text,                      -- '1 cup', '200g', etc.
  serving_g     numeric(7,2),
  is_miami_local boolean default false,
  source        text default 'manual',     -- 'nutritionix', 'usda', 'manual'
  external_id   text,                      -- Nutritionix / USDA food ID
  created_at    timestamptz not null default now()
);
create index foods_name_trgm_idx on public.foods using gin (name gin_trgm_ops);
create index foods_restaurant_idx on public.foods (restaurant);
create index foods_miami_local_idx on public.foods (is_miami_local) where is_miami_local = true;

-- ─── Meal Logs ─────────────────────────────────────────────────────────────
create table public.meal_logs (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.profiles on delete cascade,
  logged_at     timestamptz not null default now(),
  meal_label    text not null,             -- 'Breakfast', 'Lunch', 'Dinner', 'Snack'
  food_id       uuid references public.foods,
  food_name     text not null,             -- denormalized for speed
  quantity      numeric(6,2) not null default 1,
  unit          text default 'serving',
  calories      numeric(7,2) not null,
  protein_g     numeric(6,2),
  carbs_g       numeric(6,2),
  fat_g         numeric(6,2),
  notes         text
);
alter table public.meal_logs enable row level security;
create policy "Users see own meals"   on public.meal_logs for all using (auth.uid() = user_id);
create index meal_logs_user_date_idx on public.meal_logs (user_id, (logged_at::date));

-- ─── Hydration Logs ────────────────────────────────────────────────────────
create table public.hydration_logs (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.profiles on delete cascade,
  logged_at     timestamptz not null default now(),
  glasses       int not null default 1
);
alter table public.hydration_logs enable row level security;
create policy "Users manage own hydration" on public.hydration_logs for all using (auth.uid() = user_id);
create index hydration_logs_user_date_idx on public.hydration_logs (user_id, (logged_at::date));

-- ─── Workouts Library ──────────────────────────────────────────────────────
create table public.workouts (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  duration_min  int not null,
  calories_est  int,
  difficulty    text check (difficulty in ('Easy','Medium','Hard')),
  tag           text,                      -- 'HIIT', 'Strength', 'Cardio', 'Mobility', 'Run'
  location_hint text,                      -- 'Bayfront Park', 'Home / Office', etc.
  neighborhood  text,                      -- Miami neighborhood slug
  equipment_needed boolean default false,
  exercises     jsonb,                     -- [{ name, reps, sets, duration_s }]
  created_at    timestamptz not null default now()
);
create index workouts_duration_idx on public.workouts (duration_min);
create index workouts_neighborhood_idx on public.workouts (neighborhood);

-- ─── Workout Logs ──────────────────────────────────────────────────────────
create table public.workout_logs (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.profiles on delete cascade,
  workout_id    uuid references public.workouts,
  workout_name  text not null,
  logged_at     timestamptz not null default now(),
  duration_min  int,
  calories_burned int,
  completed     boolean default false,
  mood_after    text,
  notes         text
);
alter table public.workout_logs enable row level security;
create policy "Users manage own workout logs" on public.workout_logs for all using (auth.uid() = user_id);
create index workout_logs_user_date_idx on public.workout_logs (user_id, (logged_at::date));

-- ─── Daily Check-ins ───────────────────────────────────────────────────────
create table public.daily_checkins (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.profiles on delete cascade,
  check_date    date not null default current_date,
  mood          text,                      -- 'Drained','Meh','Good','Great','Fired up'
  energy_level  int check (energy_level between 1 and 5),
  steps         int,
  active_min    int,
  sleep_hours   numeric(4,2),
  notes         text,
  unique (user_id, check_date)
);
alter table public.daily_checkins enable row level security;
create policy "Users manage own checkins" on public.daily_checkins for all using (auth.uid() = user_id);
create index daily_checkins_user_date_idx on public.daily_checkins (user_id, check_date);

-- ─── Streaks (materialized view) ──────────────────────────────────────────
create or replace view public.user_streaks as
with date_series as (
  select
    user_id,
    check_date,
    check_date - (row_number() over (partition by user_id order by check_date))::int as grp
  from public.daily_checkins
),
streak_groups as (
  select user_id, grp, count(*) as streak_len,
         max(check_date) as last_date
  from date_series
  group by user_id, grp
)
select
  user_id,
  case when last_date >= current_date - 1
       then streak_len else 0 end as current_streak,
  max(streak_len) over (partition by user_id) as best_streak
from streak_groups
order by user_id, last_date desc;

-- ─── AI Insights Log ───────────────────────────────────────────────────────
create table public.ai_insights (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.profiles on delete cascade,
  generated_at  timestamptz not null default now(),
  insight_text  text not null,
  insight_type  text,                      -- 'nutrition','workout','sleep','pattern'
  was_shown     boolean default false,
  was_helpful   boolean
);
alter table public.ai_insights enable row level security;
create policy "Users see own insights" on public.ai_insights for all using (auth.uid() = user_id);

-- ─── Miami Restaurants ─────────────────────────────────────────────────────
create table public.miami_restaurants (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  cuisine       text,
  neighborhood  text,
  google_place_id text,
  address       text,
  lat           numeric(9,6),
  lng           numeric(9,6),
  health_score  int check (health_score between 1 and 10),
  popular_items jsonb,                     -- [{ name, cal, protein_g }]
  created_at    timestamptz not null default now()
);
create index miami_restaurants_neighborhood_idx on public.miami_restaurants (neighborhood);
create index miami_restaurants_name_trgm_idx on public.miami_restaurants using gin (name gin_trgm_ops);

-- ─── Seed: Miami Restaurants ───────────────────────────────────────────────
insert into public.miami_restaurants (name, cuisine, neighborhood, health_score, popular_items) values
  ('Versailles', 'Cuban', 'Little Havana', 6, '[{"name":"Ropa Vieja","cal":520},{"name":"Cuban Sandwich","cal":680},{"name":"Croquetas","cal":290}]'),
  ('Zuma Miami', 'Japanese', 'Brickell', 8, '[{"name":"Salmon Sashimi","cal":180},{"name":"Edamame","cal":120},{"name":"Miso Black Cod","cal":380}]'),
  ('KYU Miami', 'Asian BBQ', 'Wynwood', 7, '[{"name":"Cauliflower","cal":240},{"name":"Duck Bao","cal":310},{"name":"Glazed Salmon","cal":420}]'),
  ('Mandolin Aegean Bistro', 'Mediterranean', 'Miami Design District', 9, '[{"name":"Greek Salad","cal":280},{"name":"Grilled Fish","cal":380},{"name":"Hummus","cal":195}]'),
  ('Coyo Taco', 'Mexican', 'Brickell', 7, '[{"name":"Carnitas Taco","cal":310},{"name":"Guacamole","cal":190},{"name":"Agua Fresca","cal":80}]');
