-- First phase: staff-provisioned TEST accounts only. No public sign-up.
begin;
create table public.client_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 80),
  is_test boolean not null default true check (is_test = true),
  created_at timestamptz not null default now()
);
create table public.client_marketing_preferences (
  user_id uuid primary key references public.client_profiles(user_id) on delete cascade,
  email_opt_in boolean not null default false,
  updated_at timestamptz not null default now()
);
create table public.client_memberships (
  user_id uuid primary key references public.client_profiles(user_id) on delete cascade,
  plan_name text,
  status text not null default 'not_enrolled' check (status in ('not_enrolled', 'trialing', 'active', 'past_due', 'cancelled')),
  billing_provider text,
  provider_subscription_id text unique,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);
create table public.client_consent_history (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.client_profiles(user_id) on delete cascade,
  email_opt_in boolean not null,
  recorded_at timestamptz not null default now(),
  source text not null default 'test_client_portal'
);
create table public.client_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.client_profiles(user_id) on delete cascade,
  event_type text not null check (event_type in ('test_login', 'profile_updated')),
  occurred_at timestamptz not null default now()
);
create function public.record_client_consent() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  new.updated_at = now();
  if tg_op = 'INSERT' or old.email_opt_in is distinct from new.email_opt_in then
    insert into public.client_consent_history(user_id, email_opt_in) values (new.user_id, new.email_opt_in);
  end if;
  return new;
end;
$$;
revoke all on function public.record_client_consent() from public, anon, authenticated;
create trigger record_client_consent before insert or update on public.client_marketing_preferences
for each row execute function public.record_client_consent();

alter table public.client_profiles enable row level security;
alter table public.client_marketing_preferences enable row level security;
alter table public.client_memberships enable row level security;
alter table public.client_consent_history enable row level security;
alter table public.client_events enable row level security;
revoke all on public.client_profiles, public.client_marketing_preferences, public.client_memberships, public.client_consent_history, public.client_events from public, anon, authenticated;
grant select on public.client_profiles, public.client_marketing_preferences, public.client_memberships, public.client_consent_history to authenticated;
grant update (display_name) on public.client_profiles to authenticated;
grant insert (user_id, email_opt_in), update (email_opt_in) on public.client_marketing_preferences to authenticated;
grant insert (user_id, event_type) on public.client_events to authenticated;
grant usage on sequence public.client_events_id_seq to authenticated;
grant all on public.client_profiles, public.client_marketing_preferences, public.client_memberships, public.client_consent_history, public.client_events to service_role;
grant usage, select on sequence public.client_consent_history_id_seq, public.client_events_id_seq to service_role;

create policy own_profile_read on public.client_profiles for select to authenticated using ((select auth.uid()) = user_id);
create policy own_profile_update on public.client_profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy own_preferences_read on public.client_marketing_preferences for select to authenticated using ((select auth.uid()) = user_id);
create policy own_preferences_insert on public.client_marketing_preferences for insert to authenticated with check ((select auth.uid()) = user_id);
create policy own_preferences_update on public.client_marketing_preferences for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy own_membership_read on public.client_memberships for select to authenticated using ((select auth.uid()) = user_id);
create policy own_consent_read on public.client_consent_history for select to authenticated using ((select auth.uid()) = user_id);
create policy own_events_insert on public.client_events for insert to authenticated with check ((select auth.uid()) = user_id);
commit;
