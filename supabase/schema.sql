-- ============================================================
-- Depgrow WhatsApp Widget SaaS — Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ── Users (extends Supabase auth.users) ──────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  name        text not null default '',
  plan        text not null default 'free' check (plan in ('free', 'pro', 'agency')),
  created_at  timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Widgets ───────────────────────────────────────────────────────────────
create table public.widgets (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  name                text not null,
  slug                text not null unique,
  phone               text not null,
  pre_filled_message  text not null default 'Hi! I found your website and wanted to get in touch.',
  button_label        text not null default 'Chat with us',
  tooltip_text        text,
  position            text not null default 'bottom-right' check (position in ('bottom-right', 'bottom-left')),
  button_color        text not null default '#25D366',
  icon_color          text not null default '#ffffff',
  button_size         text not null default 'md' check (button_size in ('sm', 'md', 'lg')),
  show_tooltip        boolean not null default true,
  tooltip_delay       integer not null default 3000,
  allowed_domains     text[] not null default '{}',
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Generate a unique slug like "wgt_k3x9m2p"
create or replace function generate_widget_slug()
returns text language plpgsql as $$
declare
  slug text;
  exists boolean;
begin
  loop
    slug := 'wgt_' || substr(encode(gen_random_bytes(5), 'hex'), 1, 8);
    select count(*) > 0 into exists from public.widgets where widgets.slug = slug;
    exit when not exists;
  end loop;
  return slug;
end;
$$;

-- Auto-set slug and updated_at
create or replace function set_widget_defaults()
returns trigger language plpgsql as $$
begin
  if new.slug is null or new.slug = '' then
    new.slug := generate_widget_slug();
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger widget_defaults
  before insert or update on public.widgets
  for each row execute function set_widget_defaults();

-- ── Click events ──────────────────────────────────────────────────────────
create table public.click_events (
  id          uuid primary key default gen_random_uuid(),
  widget_id   uuid not null references public.widgets(id) on delete cascade,
  referrer    text,
  user_agent  text,
  country     text,
  device      text not null default 'desktop' check (device in ('mobile', 'tablet', 'desktop')),
  clicked_at  timestamptz not null default now()
);

-- Index for fast analytics queries
create index idx_click_events_widget_id   on public.click_events(widget_id);
create index idx_click_events_clicked_at  on public.click_events(clicked_at desc);
create index idx_click_events_widget_date on public.click_events(widget_id, clicked_at desc);

-- ── Row-level security ────────────────────────────────────────────────────
alter table public.profiles     enable row level security;
alter table public.widgets      enable row level security;
alter table public.click_events enable row level security;

-- Profiles: users see only their own
create policy "profiles: own row" on public.profiles
  for all using (auth.uid() = id);

-- Widgets: users manage only their own
create policy "widgets: own rows" on public.widgets
  for all using (auth.uid() = user_id);

-- Widgets: public read for active widgets (embed script uses service role, but just in case)
create policy "widgets: public read active" on public.widgets
  for select using (is_active = true);

-- Click events: owners can read; inserts open to service role via API
create policy "clicks: owner read" on public.click_events
  for select using (
    exists (
      select 1 from public.widgets w
      where w.id = click_events.widget_id
        and w.user_id = auth.uid()
    )
  );

-- ── Analytics view ────────────────────────────────────────────────────────
create or replace view public.widget_analytics as
select
  w.id                                          as widget_id,
  w.user_id,
  w.name                                        as widget_name,
  count(c.id)                                   as total_clicks,
  count(c.id) filter (where c.clicked_at >= now() - interval '1 day')   as today_clicks,
  count(c.id) filter (where c.clicked_at >= now() - interval '7 days')  as this_week_clicks,
  count(c.id) filter (where c.clicked_at >= now() - interval '30 days') as this_month_clicks
from public.widgets w
left join public.click_events c on c.widget_id = w.id
group by w.id, w.user_id, w.name;

-- ── Plan limits helper ────────────────────────────────────────────────────
-- free: 1 widget, pro: 10, agency: unlimited
create or replace function public.user_widget_count(p_user_id uuid)
returns integer language sql stable security definer as $$
  select count(*)::integer from public.widgets where user_id = p_user_id;
$$;
