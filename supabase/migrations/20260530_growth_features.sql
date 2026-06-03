-- Conversion tracking: users mark leads/sales from their content
create table if not exists conversions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  generation_id uuid references generations(id) on delete set null,
  type text not null check (type in ('lead', 'sale', 'subscriber')),
  notes text,
  created_at timestamptz not null default now()
);

alter table conversions enable row level security;

create policy "Users can manage own conversions"
  on conversions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists conversions_user_id_idx on conversions(user_id);
create index if not exists conversions_generation_id_idx on conversions(generation_id);

-- Knowledge base: cloud storage for brand knowledge
create table if not exists knowledge_bases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table knowledge_bases enable row level security;

create policy "Users can manage own knowledge base"
  on knowledge_bases for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Extend profiles with new plan values (if using check constraint)
-- alter table profiles drop constraint if exists profiles_plan_check;
-- alter table profiles add constraint profiles_plan_check
--   check (plan in ('free', 'starter', 'growth', 'premium', 'pro'));

-- Free tier: update limit reference (handled in app code via PLAN_LIMITS)
