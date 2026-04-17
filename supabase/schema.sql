-- Inbox Pipeline - Supabase Schema
-- Run this in Supabase SQL Editor

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  tone_description text default 'professional, warm, and concise',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.users enable row level security;
create policy "Users can read own data" on public.users for select using (auth.uid() = id);
create policy "Users can update own data" on public.users for update using (auth.uid() = id);
create policy "Users can insert own data" on public.users for insert with check (auth.uid() = id);

-- Connected Gmail accounts
create table public.connected_accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  provider text not null default 'gmail',
  email text not null,
  access_token text not null,
  refresh_token text not null,
  token_expiry timestamptz not null,
  last_sync_at timestamptz,
  history_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.connected_accounts enable row level security;
create policy "Users can manage own accounts" on public.connected_accounts for all using (auth.uid() = user_id);

-- Email threads fetched from Gmail
create table public.email_threads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  gmail_message_id text not null,
  gmail_thread_id text not null,
  from_name text,
  from_email text not null,
  subject text,
  snippet text,
  body_text text,
  body_html text,
  received_at timestamptz not null,
  classification text check (classification in ('business_enquiry', 'existing_client', 'newsletter', 'spam', 'needs_review', 'unclassified')),
  classification_confidence float,
  processed boolean default false,
  lead_created boolean default false,
  created_at timestamptz default now(),
  unique(user_id, gmail_message_id)
);

alter table public.email_threads enable row level security;
create policy "Users can manage own emails" on public.email_threads for all using (auth.uid() = user_id);

-- Leads (pipeline cards)
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  email_thread_id uuid references public.email_threads on delete set null,
  sender_name text,
  sender_email text not null,
  company_name text,
  service_requested text,
  summary text,
  urgency text check (urgency in ('low', 'medium', 'high', 'urgent')),
  budget_hint text,
  location text,
  meeting_intent boolean default false,
  confidence_score float,
  status text not null default 'new' check (status in ('new', 'replied', 'booked', 'lost')),
  needs_review boolean default false,
  original_email_body text,
  original_email_subject text,
  received_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.leads enable row level security;
create policy "Users can manage own leads" on public.leads for all using (auth.uid() = user_id);

-- Lead events (activity timeline)
create table public.lead_events (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid references public.leads on delete cascade not null,
  user_id uuid references public.users on delete cascade not null,
  event_type text not null check (event_type in ('created', 'reply_drafted', 'reply_sent', 'status_changed', 'note_added')),
  description text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

alter table public.lead_events enable row level security;
create policy "Users can manage own events" on public.lead_events for all using (auth.uid() = user_id);

-- Drafted replies
create table public.drafted_replies (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid references public.leads on delete cascade not null,
  user_id uuid references public.users on delete cascade not null,
  subject text,
  body text not null,
  is_sent boolean default false,
  sent_at timestamptz,
  gmail_message_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.drafted_replies enable row level security;
create policy "Users can manage own drafts" on public.drafted_replies for all using (auth.uid() = user_id);

-- Indexes
create index idx_email_threads_user on public.email_threads(user_id);
create index idx_email_threads_classification on public.email_threads(classification);
create index idx_leads_user_status on public.leads(user_id, status);
create index idx_leads_user on public.leads(user_id);
create index idx_lead_events_lead on public.lead_events(lead_id);
create index idx_drafted_replies_lead on public.drafted_replies(lead_id);

-- Function to auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_users_updated before update on public.users
  for each row execute function public.handle_updated_at();
create trigger on_leads_updated before update on public.leads
  for each row execute function public.handle_updated_at();
create trigger on_connected_accounts_updated before update on public.connected_accounts
  for each row execute function public.handle_updated_at();
create trigger on_drafted_replies_updated before update on public.drafted_replies
  for each row execute function public.handle_updated_at();

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
