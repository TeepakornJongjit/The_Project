-- Auth owns credentials. This table owns the portal's identity and permissions.
create table public.portal_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 1 and 200),
  student_id text not null unique check (student_id ~ '^[0-9]{8,12}$'),
  role text not null check (role in ('student', 'staff', 'committee')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.portal_profiles enable row level security;
revoke all on public.portal_profiles from anon, authenticated;
grant select on public.portal_profiles to authenticated;
grant all on public.portal_profiles to service_role;

create policy "Members can read their own profile"
on public.portal_profiles for select to authenticated
using ((select auth.uid()) = id);

-- There are deliberately no client INSERT/UPDATE/DELETE grants or policies.
-- Only a trusted administrator provisions profiles and assigns/revokes roles.
comment on table public.portal_profiles is
  'Portal account identity and administrator-managed role; never store passwords here.';
