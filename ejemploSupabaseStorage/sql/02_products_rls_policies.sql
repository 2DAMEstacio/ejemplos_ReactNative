alter table public.products enable row level security;

create policy "public can read products"
on public.products
for select
using (true);

create policy "authenticated can insert products"
on public.products
for insert
to authenticated
with check (true);

create policy "authenticated can update products"
on public.products
for update
to authenticated
using (true)
with check (true);

create policy "authenticated can delete products"
on public.products
for delete
to authenticated
using (true);
