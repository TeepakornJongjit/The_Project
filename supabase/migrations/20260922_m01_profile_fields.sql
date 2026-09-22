-- M01 - Student Profile Fields

alter table public.student_profiles
  add column if not exists major text,
  add column if not exists education_level text,
  add column if not exists year_level integer,
  add column if not exists address text,
  add column if not exists parent_status text,
  add column if not exists family_members integer,
  add column if not exists parent_occupation text,
  add column if not exists siblings integer,
  add column if not exists emergency_contact_name text,
  add column if not exists emergency_contact_relation text,
  add column if not exists emergency_contact_phone text,
  add column if not exists emergency_contact_email text,
  add column if not exists bank_name text,
  add column if not exists bank_account_number text,
  add column if not exists bank_account_name text,
  add column if not exists bank_account_type text;

alter table public.student_profiles
  drop constraint if exists student_profiles_year_level_check;

alter table public.student_profiles
  add constraint student_profiles_year_level_check
  check (
    year_level is null
    or year_level between 1 and 8
  );

alter table public.student_profiles
  drop constraint if exists student_profiles_family_members_check;

alter table public.student_profiles
  add constraint student_profiles_family_members_check
  check (
    family_members is null
    or family_members >= 0
  );

alter table public.student_profiles
  drop constraint if exists student_profiles_siblings_check;

alter table public.student_profiles
  add constraint student_profiles_siblings_check
  check (
    siblings is null
    or siblings >= 0
  );
