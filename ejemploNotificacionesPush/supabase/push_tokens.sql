create table if not exists public.push_tokens (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null unique,
  device_name text,
  created_at timestamp with time zone default now()
);

alter table public.push_tokens enable row level security;

create policy "Users can insert their token"
on public.push_tokens
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their token"
on public.push_tokens
for update
to authenticated
using (auth.uid() = user_id);

create policy "Authenticated can read tokens"
on public.push_tokens
for select
to authenticated
using (true);
