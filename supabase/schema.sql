-- SiamLink Database Schema & Row Level Security (RLS)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid unique not null references auth.users(id) on delete cascade,
    username text unique not null,
    display_name text,
    bio text,
    avatar_url text,
    theme text not null default 'clean_light',
    plan text not null default 'free' check (plan in ('free', 'pro')),
    created_at timestamptz not null default now(),
    constraint username_min_length check (char_length(username) >= 3)
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Allow public read access to profiles" 
    on public.profiles for select 
    using (true);

create policy "Allow individual insert access" 
    on public.profiles for insert 
    with check (auth.uid() = user_id);

create policy "Allow individual update access" 
    on public.profiles for update 
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Allow individual delete access" 
    on public.profiles for delete 
    using (auth.uid() = user_id);


-- 2. LINKS TABLE
create table if not exists public.links (
    id uuid primary key default gen_random_uuid(),
    profile_id uuid not null references public.profiles(id) on delete cascade,
    type text not null check (type in ('link', 'bank', 'line')),
    title text not null,
    url text,
    bank_number text,
    bank_name text,
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

-- Enable RLS for links
alter table public.links enable row level security;

-- Links Policies
create policy "Allow public read access to links" 
    on public.links for select 
    using (true);

create policy "Allow link insert for profile owner" 
    on public.links for insert 
    with check (
        exists (
            select 1 from public.profiles
            where id = profile_id and user_id = auth.uid()
        )
    );

create policy "Allow link update for profile owner" 
    on public.links for update 
    using (
        exists (
            select 1 from public.profiles
            where id = profile_id and user_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from public.profiles
            where id = profile_id and user_id = auth.uid()
        )
    );

create policy "Allow link delete for profile owner" 
    on public.links for delete 
    using (
        exists (
            select 1 from public.profiles
            where id = profile_id and user_id = auth.uid()
        )
    );


-- 3. CLICK LOGS TABLE
create table if not exists public.click_logs (
    id uuid primary key default gen_random_uuid(),
    link_id uuid not null references public.links(id) on delete cascade,
    clicked_at timestamptz not null default now()
);

-- Enable RLS for click logs
alter table public.click_logs enable row level security;

-- Click Logs Policies
create policy "Allow public insertions to click logs" 
    on public.click_logs for insert 
    with check (true);

create policy "Allow link owner read access to click logs" 
    on public.click_logs for select 
    using (
        exists (
            select 1 from public.links l
            join public.profiles p on l.profile_id = p.id
            where l.id = link_id and p.user_id = auth.uid()
        )
    );

-- Create index on click logs for optimization
create index if not exists click_logs_link_id_idx on public.click_logs(link_id);
create index if not exists profiles_username_idx on public.profiles(username);
