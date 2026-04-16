create table if not exists public.account_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  role public.app_role not null,
  status text not null default 'active' check (status in ('active', 'revoked')),
  granted_by uuid references public.profiles(id) on delete set null,
  revoked_by uuid references public.profiles(id) on delete set null,
  revoked_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, property_id, role)
);

create index if not exists account_roles_user_property_idx
on public.account_roles (user_id, property_id);

create index if not exists account_roles_property_role_status_idx
on public.account_roles (property_id, role, status);

drop trigger if exists handle_account_roles_updated_at on public.account_roles;
create trigger handle_account_roles_updated_at
before update on public.account_roles
for each row
execute function public.handle_updated_at();

insert into public.account_roles (user_id, property_id, role, status)
select id, property_id, role, 'active'
from public.profiles
on conflict (user_id, property_id, role) do update
set
  status = 'active',
  revoked_by = null,
  revoked_at = null,
  updated_at = timezone('utc', now());

create or replace function public.current_app_role()
returns text
language sql
stable
as $$
  with existing_role_records as (
    select 1
    from public.account_roles
    where user_id = auth.uid()
    limit 1
  ),
  active_roles as (
    select
      role::text as role,
      case role
        when 'admin' then 1
        else 2
      end as priority
    from public.account_roles
    where user_id = auth.uid()
      and status = 'active'
  ),
  fallback_profile_role as (
    select role::text as role, 3 as priority
    from public.profiles
    where id = auth.uid()
      and not exists (select 1 from existing_role_records)
  )
  select role
  from (
    select * from active_roles
    union all
    select * from fallback_profile_role
  ) roles
  order by priority
  limit 1
$$;

alter table public.account_roles enable row level security;

drop policy if exists "account_roles_select_own" on public.account_roles;
create policy "account_roles_select_own"
on public.account_roles
for select
to authenticated
using (user_id = auth.uid());
