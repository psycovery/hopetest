-- ─────────────────────────────────────────────────────────────────────────────
-- Hope Forward — Supabase Database Schema
-- Psycovery · Run this in: Supabase Dashboard → SQL Editor → New Query
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── PROFILES ─────────────────────────────────────────────────────────────────
-- One row per user, linked to Supabase Auth
create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  first_name    text default '',
  last_name     text default '',
  preferred_name text default '',
  name          text default '',
  region        text default '',
  prison        text default '',
  bio           text default '',
  photo         text default '',  -- base64 or URL
  onboarded     boolean default false,
  purchased_hope_plan boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── GOALS ────────────────────────────────────────────────────────────────────
create table if not exists goals (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references profiles(id) on delete cascade not null,
  title       text not null,
  category    text not null,
  steps       text[] not null default '{}',
  completed   boolean[] not null default '{}',
  agency      integer default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── HOPE SCORE HISTORY ───────────────────────────────────────────────────────
create table if not exists hope_scores (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references profiles(id) on delete cascade not null,
  score       integer not null,
  recorded_at timestamptz default now()
);

-- ── USER SERVICES (community submitted) ─────────────────────────────────────
create table if not exists user_services (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references profiles(id) on delete cascade,
  name        text not null,
  category    text not null,
  city        text not null,
  address     text default '',
  phone       text default '',
  website     text default '',
  description text default '',
  created_at  timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS) — users can only see their own data
-- ─────────────────────────────────────────────────────────────────────────────

alter table profiles       enable row level security;
alter table goals           enable row level security;
alter table hope_scores     enable row level security;
alter table user_services   enable row level security;

-- Profiles: users can read/write only their own row
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Goals: users can read/write only their own goals
create policy "Users can view own goals"
  on goals for select using (auth.uid() = user_id);

create policy "Users can insert own goals"
  on goals for insert with check (auth.uid() = user_id);

create policy "Users can update own goals"
  on goals for update using (auth.uid() = user_id);

create policy "Users can delete own goals"
  on goals for delete using (auth.uid() = user_id);

-- Hope scores: users can read/write own scores
create policy "Users can view own hope scores"
  on hope_scores for select using (auth.uid() = user_id);

create policy "Users can insert own hope scores"
  on hope_scores for insert with check (auth.uid() = user_id);

-- Leaderboard: allow reading pseudonymised scores (name + score + region only)
-- This view exposes only what's needed for the leaderboard
create or replace view leaderboard_view as
  select
    p.id,
    p.preferred_name as name,
    p.region,
    p.prison,
    coalesce((
      select score from hope_scores h
      where h.user_id = p.id
      order by recorded_at desc limit 1
    ), 0) as score
  from profiles p
  where p.onboarded = true;

-- User services: anyone can read, only owner can write
create policy "Anyone can view user services"
  on user_services for select using (true);

create policy "Users can insert own services"
  on user_services for insert with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- AUTO-UPDATE updated_at TIMESTAMPS
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

create trigger goals_updated_at
  before update on goals
  for each row execute function update_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Done! Your Hope Forward database is ready.
-- ─────────────────────────────────────────────────────────────────────────────
