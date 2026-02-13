create table if not exists public.live_questions (
  id uuid default gen_random_uuid() primary key,
  author_id uuid not null references auth.users(id) on delete cascade,
  topic text not null default 'General',
  question text not null,
  votes integer not null default 0 check (votes >= 0),
  is_answered boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.live_questions replica identity full;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_live_questions_updated_at on public.live_questions;
create trigger trg_live_questions_updated_at
before update on public.live_questions
for each row
execute procedure public.set_updated_at();

alter table public.live_questions enable row level security;

drop policy if exists "Authenticated users can read questions" on public.live_questions;
create policy "Authenticated users can read questions"
on public.live_questions
for select
to authenticated
using (true);

drop policy if exists "Users can create their own questions" on public.live_questions;
create policy "Users can create their own questions"
on public.live_questions
for insert
to authenticated
with check (auth.uid() = author_id);

drop policy if exists "Authenticated users can update questions" on public.live_questions;
create policy "Authenticated users can update questions"
on public.live_questions
for update
to authenticated
using (true)
with check (true);

create or replace function public.upvote_live_question(question_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  update public.live_questions
  set votes = votes + 1
  where id = question_id;
end;
$$;

grant execute on function public.upvote_live_question(uuid) to authenticated;
