-- Add Telegram bot credentials to profiles for scheduled auto-posting
alter table profiles
  add column if not exists telegram_bot_token text,
  add column if not exists telegram_chat_id text;

-- Track when a scheduled post was actually sent to Telegram
alter table generations
  add column if not exists telegram_published_at timestamptz;

-- Feedback table for user suggestions and bug reports
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text,
  type text not null default 'general',
  message text not null,
  created_at timestamptz not null default now()
);

-- Only the user and admins (service role) can see feedback
alter table feedback enable row level security;

create policy "Users can insert own feedback"
  on feedback for insert
  with check (auth.uid() = user_id);

create policy "Users can view own feedback"
  on feedback for select
  using (auth.uid() = user_id);
