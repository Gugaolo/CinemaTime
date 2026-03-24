create table if not exists movies (
  id bigint generated always as identity primary key,
  title text not null,
  year int not null,
  genre text not null,
  duration text not null,
  description text not null,
  image_url text,
  status text not null,
  created_at timestamp with time zone default now()
);

create table if not exists ratings (
  id bigint generated always as identity primary key,
  movie_id bigint not null references movies(id) on delete cascade,
  user_name text not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamp with time zone default now()
);

create table if not exists suggestions (
  id bigint generated always as identity primary key,
  title text not null,
  description text not null,
  user_name text not null,
  status text not null default 'V pregledu',
  created_at timestamp with time zone default now()
);

insert into movies (title, year, genre, duration, description, image_url, status)
values
  (
    'Dune: Part Two',
    2024,
    'Znanstvena fantastika',
    '166 min',
    'Paul Atreides sprejme svojo vlogo med puščavskimi bojevniki in se poda v vojno proti silam, ki uničujejo Arrakis.',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
    'V kinu'
  ),
  (
    'Oppenheimer',
    2023,
    'Drama',
    '180 min',
    'Portret fizičarja, ki vodi razvoj atomske bombe, in posledic odločitev, ki spremenijo svet.',
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80',
    'Priporoceno'
  );
