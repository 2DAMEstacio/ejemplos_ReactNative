create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  images text[] not null default '{}',
  created_at timestamptz not null default now()
);
