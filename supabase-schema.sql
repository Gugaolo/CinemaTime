create table if not exists public.movies (
  id bigint generated always as identity primary key,
  title text not null,
  year integer not null,
  genre text not null,
  duration text not null,
  description text not null,
  image_url text,
  status text not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.ratings (
  id bigint generated always as identity primary key,
  movie_id bigint not null references public.movies(id) on delete cascade,
  user_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamp with time zone default now()
);

create table if not exists public.suggestions (
  id bigint generated always as identity primary key,
  title text not null,
  description text not null,
  user_name text not null,
  status text not null default 'V pregledu',
  created_at timestamp with time zone default now()
);

alter table public.movies enable row level security;
alter table public.ratings enable row level security;
alter table public.suggestions enable row level security;

drop policy if exists "movies_select_all" on public.movies;
create policy "movies_select_all"
on public.movies
for select
to anon, authenticated
using (true);

drop policy if exists "movies_insert_all" on public.movies;
create policy "movies_insert_all"
on public.movies
for insert
to anon, authenticated
with check (true);

drop policy if exists "movies_update_all" on public.movies;
create policy "movies_update_all"
on public.movies
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "ratings_select_all" on public.ratings;
create policy "ratings_select_all"
on public.ratings
for select
to anon, authenticated
using (true);

drop policy if exists "ratings_insert_all" on public.ratings;
create policy "ratings_insert_all"
on public.ratings
for insert
to anon, authenticated
with check (true);

drop policy if exists "suggestions_select_all" on public.suggestions;
create policy "suggestions_select_all"
on public.suggestions
for select
to anon, authenticated
using (true);

drop policy if exists "suggestions_insert_all" on public.suggestions;
create policy "suggestions_insert_all"
on public.suggestions
for insert
to anon, authenticated
with check (true);

insert into public.movies (title, year, genre, duration, description, image_url, status)
values
  (
    'Dune: Part Two',
    2024,
    'Znanstvena fantastika',
    '166 min',
    'Paul Atreides sprejme svojo vlogo med puscavskimi bojevniki in se poda v vojno proti silam, ki unicujejo Arrakis.',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
    'V kinu'
  ),
  (
    'Oppenheimer',
    2023,
    'Drama',
    '180 min',
    'Portret fizicarja, ki vodi razvoj atomske bombe, in posledic odlocitev, ki spremenijo svet.',
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80',
    'Priporoceno'
  ),
  (
    'Spider-Man: Across the Spider-Verse',
    2023,
    'Animacija',
    '140 min',
    'Miles Morales odpre vrata v multiverzum, kjer spozna novo ekipo Spider-junakov in mora poiskati svojo pot.',
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80',
    'Top izbor'
  )
on conflict do nothing;
