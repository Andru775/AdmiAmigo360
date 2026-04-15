create extension if not exists pgcrypto;

do $$
begin
  create type public.app_role as enum ('admin', 'resident');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.resident_kind as enum ('owner', 'tenant');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.account_status as enum ('paid', 'overdue', 'pending');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.payment_status as enum ('paid', 'pending', 'due');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.reservation_status as enum ('pending', 'confirmed', 'cancelled');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.tone_name as enum ('gold', 'violet', 'teal');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.agreement_status as enum ('pending', 'approved', 'rejected');
exception
  when duplicate_object then null;
end $$;

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  city text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  role public.app_role not null,
  full_name text not null,
  title text,
  phone text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  tower text not null,
  level_label text not null,
  unit_code text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (property_id, tower, unit_code)
);

create table if not exists public.residents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references auth.users(id) on delete set null,
  property_id uuid not null references public.properties(id) on delete cascade,
  unit_id uuid not null references public.units(id) on delete cascade,
  slug text not null unique,
  full_name text not null,
  email text not null unique,
  phone text,
  resident_type public.resident_kind not null,
  status public.account_status not null default 'pending',
  balance numeric(12, 2) not null default 0,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  unit_id uuid not null references public.units(id) on delete cascade,
  resident_id uuid not null references public.residents(id) on delete cascade,
  title text not null,
  amount numeric(12, 2) not null,
  status public.payment_status not null default 'paid',
  due_date date,
  paid_at timestamptz,
  payment_method text,
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  title text not null,
  note text not null,
  tone public.tone_name not null default 'gold',
  published_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.assemblies (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  title text not null,
  starts_at timestamptz not null,
  location text not null,
  topic text not null,
  summary text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.amenities (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  title text not null,
  description text not null,
  next_slot text,
  icon text not null default 'event_note',
  color public.tone_name not null default 'gold',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  resident_id uuid not null references public.residents(id) on delete cascade,
  amenity_id uuid not null references public.amenities(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.reservation_status not null default 'pending',
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.payment_agreements (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  resident_id uuid not null references public.residents(id) on delete cascade,
  requested_amount numeric(12, 2) not null,
  installment_count integer not null default 1,
  status public.agreement_status not null default 'pending',
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.operations (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  title text not null,
  note text not null,
  priority text not null,
  icon text not null,
  status text not null,
  created_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists handle_profiles_updated_at on public.profiles;
create trigger handle_profiles_updated_at
before update on public.profiles
for each row
execute function public.handle_updated_at();

drop trigger if exists handle_units_updated_at on public.units;
create trigger handle_units_updated_at
before update on public.units
for each row
execute function public.handle_updated_at();

drop trigger if exists handle_residents_updated_at on public.residents;
create trigger handle_residents_updated_at
before update on public.residents
for each row
execute function public.handle_updated_at();

create or replace function public.current_app_role()
returns text
language sql
stable
as $$
  select role::text from public.profiles where id = auth.uid()
$$;

create or replace function public.current_property_id()
returns uuid
language sql
stable
as $$
  select property_id from public.profiles where id = auth.uid()
$$;

create or replace function public.current_resident_id()
returns uuid
language sql
stable
as $$
  select id from public.residents where profile_id = auth.uid()
$$;

alter table public.properties enable row level security;
alter table public.profiles enable row level security;
alter table public.units enable row level security;
alter table public.residents enable row level security;
alter table public.payments enable row level security;
alter table public.announcements enable row level security;
alter table public.assemblies enable row level security;
alter table public.amenities enable row level security;
alter table public.reservations enable row level security;
alter table public.payment_agreements enable row level security;
alter table public.operations enable row level security;

drop policy if exists "properties_select_by_property" on public.properties;
create policy "properties_select_by_property"
on public.properties
for select
to authenticated
using (id = public.current_property_id());

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or (
    public.current_app_role() = 'admin'
    and property_id = public.current_property_id()
  )
);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "units_select_property" on public.units;
create policy "units_select_property"
on public.units
for select
to authenticated
using (property_id = public.current_property_id());

drop policy if exists "units_manage_admin" on public.units;
create policy "units_manage_admin"
on public.units
for all
to authenticated
using (
  public.current_app_role() = 'admin'
  and property_id = public.current_property_id()
)
with check (
  public.current_app_role() = 'admin'
  and property_id = public.current_property_id()
);

drop policy if exists "residents_select_admin_or_self" on public.residents;
create policy "residents_select_admin_or_self"
on public.residents
for select
to authenticated
using (
  (
    public.current_app_role() = 'admin'
    and property_id = public.current_property_id()
  )
  or profile_id = auth.uid()
);

drop policy if exists "residents_manage_admin" on public.residents;
create policy "residents_manage_admin"
on public.residents
for all
to authenticated
using (
  public.current_app_role() = 'admin'
  and property_id = public.current_property_id()
)
with check (
  public.current_app_role() = 'admin'
  and property_id = public.current_property_id()
);

drop policy if exists "payments_select_admin_or_self" on public.payments;
create policy "payments_select_admin_or_self"
on public.payments
for select
to authenticated
using (
  (
    public.current_app_role() = 'admin'
    and property_id = public.current_property_id()
  )
  or resident_id = public.current_resident_id()
);

drop policy if exists "payments_manage_admin" on public.payments;
create policy "payments_manage_admin"
on public.payments
for all
to authenticated
using (
  public.current_app_role() = 'admin'
  and property_id = public.current_property_id()
)
with check (
  public.current_app_role() = 'admin'
  and property_id = public.current_property_id()
);

drop policy if exists "announcements_select_property" on public.announcements;
create policy "announcements_select_property"
on public.announcements
for select
to authenticated
using (property_id = public.current_property_id());

drop policy if exists "announcements_manage_admin" on public.announcements;
create policy "announcements_manage_admin"
on public.announcements
for all
to authenticated
using (
  public.current_app_role() = 'admin'
  and property_id = public.current_property_id()
)
with check (
  public.current_app_role() = 'admin'
  and property_id = public.current_property_id()
);

drop policy if exists "assemblies_select_property" on public.assemblies;
create policy "assemblies_select_property"
on public.assemblies
for select
to authenticated
using (property_id = public.current_property_id());

drop policy if exists "assemblies_manage_admin" on public.assemblies;
create policy "assemblies_manage_admin"
on public.assemblies
for all
to authenticated
using (
  public.current_app_role() = 'admin'
  and property_id = public.current_property_id()
)
with check (
  public.current_app_role() = 'admin'
  and property_id = public.current_property_id()
);

drop policy if exists "amenities_select_property" on public.amenities;
create policy "amenities_select_property"
on public.amenities
for select
to authenticated
using (property_id = public.current_property_id());

drop policy if exists "amenities_manage_admin" on public.amenities;
create policy "amenities_manage_admin"
on public.amenities
for all
to authenticated
using (
  public.current_app_role() = 'admin'
  and property_id = public.current_property_id()
)
with check (
  public.current_app_role() = 'admin'
  and property_id = public.current_property_id()
);

drop policy if exists "reservations_select_admin_or_self" on public.reservations;
create policy "reservations_select_admin_or_self"
on public.reservations
for select
to authenticated
using (
  (
    public.current_app_role() = 'admin'
    and property_id = public.current_property_id()
  )
  or resident_id = public.current_resident_id()
);

drop policy if exists "reservations_insert_resident" on public.reservations;
create policy "reservations_insert_resident"
on public.reservations
for insert
to authenticated
with check (
  resident_id = public.current_resident_id()
  and property_id = public.current_property_id()
);

drop policy if exists "reservations_manage_admin" on public.reservations;
create policy "reservations_manage_admin"
on public.reservations
for all
to authenticated
using (
  public.current_app_role() = 'admin'
  and property_id = public.current_property_id()
)
with check (
  public.current_app_role() = 'admin'
  and property_id = public.current_property_id()
);

drop policy if exists "agreements_select_admin_or_self" on public.payment_agreements;
create policy "agreements_select_admin_or_self"
on public.payment_agreements
for select
to authenticated
using (
  (
    public.current_app_role() = 'admin'
    and property_id = public.current_property_id()
  )
  or resident_id = public.current_resident_id()
);

drop policy if exists "agreements_insert_resident" on public.payment_agreements;
create policy "agreements_insert_resident"
on public.payment_agreements
for insert
to authenticated
with check (
  resident_id = public.current_resident_id()
  and property_id = public.current_property_id()
);

drop policy if exists "agreements_manage_admin" on public.payment_agreements;
create policy "agreements_manage_admin"
on public.payment_agreements
for all
to authenticated
using (
  public.current_app_role() = 'admin'
  and property_id = public.current_property_id()
)
with check (
  public.current_app_role() = 'admin'
  and property_id = public.current_property_id()
);

drop policy if exists "operations_select_property" on public.operations;
create policy "operations_select_property"
on public.operations
for select
to authenticated
using (property_id = public.current_property_id());

drop policy if exists "operations_manage_admin" on public.operations;
create policy "operations_manage_admin"
on public.operations
for all
to authenticated
using (
  public.current_app_role() = 'admin'
  and property_id = public.current_property_id()
)
with check (
  public.current_app_role() = 'admin'
  and property_id = public.current_property_id()
);

insert into public.properties (id, name, code, city)
values
  ('11111111-1111-4111-8111-111111111111', 'AdmiAmigo Residencial', 'admiamigo-360', 'Bogota')
on conflict (id) do update
set
  name = excluded.name,
  code = excluded.code,
  city = excluded.city;

insert into public.units (id, property_id, tower, level_label, unit_code)
values
  ('11111111-1111-4111-8111-00000000012a', '11111111-1111-4111-8111-111111111111', 'Torre A', 'Nivel 12', '12A'),
  ('11111111-1111-4111-8111-00000000012b', '11111111-1111-4111-8111-111111111111', 'Torre A', 'Nivel 12', '12B'),
  ('11111111-1111-4111-8111-000000000f01', '11111111-1111-4111-8111-111111111111', 'Torre B', 'Penthouse', 'PH1'),
  ('11111111-1111-4111-8111-000000000210', '11111111-1111-4111-8111-111111111111', 'Torre B', 'Nivel 2', '210')
on conflict (id) do update
set
  tower = excluded.tower,
  level_label = excluded.level_label,
  unit_code = excluded.unit_code;

insert into public.residents (
  id,
  property_id,
  unit_id,
  slug,
  full_name,
  email,
  phone,
  resident_type,
  status,
  balance,
  notes
)
values
  ('22222222-2222-4222-8222-00000000012a', '11111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-00000000012a', '12a', 'Alexander Wright', 'alexander@wright.com', '+1 234 567 890', 'owner', 'paid', 0, 'Owner profile with current dues and no active incidents.'),
  ('22222222-2222-4222-8222-00000000012b', '11111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-00000000012b', '12b', 'Elena Rodriguez', 'residente@admiamigo360.com', '+1 876 543 210', 'tenant', 'overdue', 450, 'Resident demo account with community notices and pending cartera.'),
  ('22222222-2222-4222-8222-000000000f01', '11111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-000000000f01', 'ph1', 'Marcus Sterling', 'm.sterling@luxury.com', '+1 302 991 881', 'owner', 'paid', 0, 'Premium owner with concierge requests and annual payment on time.'),
  ('22222222-2222-4222-8222-000000000210', '11111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-000000000210', '210', 'Juan Camilo Ortega', 'juan.ortega@correo.com', '+57 310 442 9918', 'tenant', 'pending', 225, 'Pending payment validation through electronic transfer.')
on conflict (id) do update
set
  unit_id = excluded.unit_id,
  slug = excluded.slug,
  full_name = excluded.full_name,
  email = excluded.email,
  phone = excluded.phone,
  resident_type = excluded.resident_type,
  status = excluded.status,
  balance = excluded.balance,
  notes = excluded.notes;

insert into public.announcements (id, property_id, title, note, tone, published_at)
values
  ('33333333-3333-4333-8333-000000000001', '11111111-1111-4111-8111-111111111111', 'Asamblea extraordinaria', 'Se convoca a propietarios para revisar presupuesto y mejoras del conjunto.', 'gold', timezone('utc', now()) - interval '2 days'),
  ('33333333-3333-4333-8333-000000000002', '11111111-1111-4111-8111-111111111111', 'Mantenimiento de ascensor', 'El ascensor de Torre B tendra una ventana de mantenimiento el viernes.', 'violet', timezone('utc', now()) - interval '1 day'),
  ('33333333-3333-4333-8333-000000000003', '11111111-1111-4111-8111-111111111111', 'Cancha habilitada', 'La cancha vuelve a estar disponible a partir del sabado en la tarde.', 'teal', timezone('utc', now()))
on conflict (id) do update
set
  title = excluded.title,
  note = excluded.note,
  tone = excluded.tone,
  published_at = excluded.published_at;

insert into public.assemblies (id, property_id, title, starts_at, location, topic, summary)
values
  ('44444444-4444-4444-8444-000000000001', '11111111-1111-4111-8111-111111111111', 'Asamblea de cartera', timezone('utc', now()) + interval '5 days', 'Salon social', 'Revision de indicadores de cobranza y presupuesto.', 'Sesion ordinaria con corte financiero del semestre.'),
  ('44444444-4444-4444-8444-000000000002', '11111111-1111-4111-8111-111111111111', 'Comite de convivencia', timezone('utc', now()) + interval '12 days', 'Lobby Torre A', 'Seguimiento a normas internas y agenda comunitaria.', 'Encuentro de residentes y administracion.')
on conflict (id) do update
set
  title = excluded.title,
  starts_at = excluded.starts_at,
  location = excluded.location,
  topic = excluded.topic,
  summary = excluded.summary;

insert into public.amenities (id, property_id, title, description, next_slot, icon, color)
values
  ('55555555-5555-4555-8555-000000000001', '11111111-1111-4111-8111-111111111111', 'Salon social', 'Espacio para reuniones privadas y celebraciones familiares.', 'Sabado 5:00 PM', 'event_note', 'gold'),
  ('55555555-5555-4555-8555-000000000002', '11111111-1111-4111-8111-111111111111', 'Cancha multiple', 'Reserva para actividades deportivas y recreativas.', 'Domingo 10:00 AM', 'event_note', 'teal'),
  ('55555555-5555-4555-8555-000000000003', '11111111-1111-4111-8111-111111111111', 'Terraza BBQ', 'Zona para reuniones sociales con aforo controlado.', 'Viernes 7:00 PM', 'event_note', 'violet')
on conflict (id) do update
set
  title = excluded.title,
  description = excluded.description,
  next_slot = excluded.next_slot,
  icon = excluded.icon,
  color = excluded.color;

insert into public.reservations (id, property_id, resident_id, amenity_id, starts_at, ends_at, status, notes)
values
  ('66666666-6666-4666-8666-000000000001', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-00000000012b', '55555555-5555-4555-8555-000000000001', timezone('utc', now()) + interval '3 days', timezone('utc', now()) + interval '3 days 2 hours', 'confirmed', 'Reserva aprobada para reunion familiar.'),
  ('66666666-6666-4666-8666-000000000002', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-000000000210', '55555555-5555-4555-8555-000000000002', timezone('utc', now()) + interval '7 days', timezone('utc', now()) + interval '7 days 2 hours', 'pending', 'Pendiente de aprobacion por disponibilidad.')
on conflict (id) do update
set
  resident_id = excluded.resident_id,
  amenity_id = excluded.amenity_id,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  status = excluded.status,
  notes = excluded.notes;

insert into public.payments (id, property_id, unit_id, resident_id, title, amount, status, paid_at, payment_method, note)
values
  ('77777777-7777-4777-8777-000000000001', '11111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-000000000f01', '22222222-2222-4222-8222-000000000f01', 'Pago administracion marzo', 225, 'paid', timezone('utc', now()) - interval '1 day', 'Transferencia', 'Pago confirmado por banco aliado.'),
  ('77777777-7777-4777-8777-000000000002', '11111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-00000000012a', '22222222-2222-4222-8222-00000000012a', 'Pago administracion marzo', 225, 'paid', timezone('utc', now()) - interval '4 hours', 'PSE', 'Movimiento conciliado automaticamente.'),
  ('77777777-7777-4777-8777-000000000003', '11111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-000000000210', '22222222-2222-4222-8222-000000000210', 'Pago parcial abril', 120, 'pending', null, 'Transferencia', 'Pendiente de validacion de soporte.')
on conflict (id) do update
set
  title = excluded.title,
  amount = excluded.amount,
  status = excluded.status,
  paid_at = excluded.paid_at,
  payment_method = excluded.payment_method,
  note = excluded.note;

insert into public.operations (id, property_id, title, note, priority, icon, status)
values
  ('88888888-8888-4888-8888-000000000001', '11111111-1111-4111-8111-111111111111', 'Mantenimiento de ascensor', 'Torre B con tres solicitudes urgentes abiertas.', 'high', 'engineering', 'open'),
  ('88888888-8888-4888-8888-000000000002', '11111111-1111-4111-8111-111111111111', 'Pagos vencidos', 'Seguimiento a unidades con corte de mitad de mes.', 'medium', 'receipt_long', 'open'),
  ('88888888-8888-4888-8888-000000000003', '11111111-1111-4111-8111-111111111111', 'Actualizacion de CCTV', 'Entrada principal reparada y operativa.', 'low', 'security', 'done')
on conflict (id) do update
set
  title = excluded.title,
  note = excluded.note,
  priority = excluded.priority,
  icon = excluded.icon,
  status = excluded.status;
