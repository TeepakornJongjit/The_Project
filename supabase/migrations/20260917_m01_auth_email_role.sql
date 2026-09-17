create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  student_role_id uuid;
  new_student_code text;
  new_full_name text;
begin

  -- M01: อนุญาตเฉพาะอีเมลมหาวิทยาลัย
  if new.email is null
     or lower(new.email) !~ '^[a-z0-9._%+\-]+@mail\.wu\.ac\.th$'
  then
    raise exception
      'Only @mail.wu.ac.th email addresses are allowed';
  end if;

  -- สร้าง/อัปเดต profile
  insert into public.profiles (
    id,
    email,
    account_status
  )
  values (
    new.id,
    lower(new.email),
    'active'
  )
  on conflict (id) do update
  set email = excluded.email;

  -- หา role student
  select role_id
  into student_role_id
  from public.roles
  where role_name = 'student'
  limit 1;

  if student_role_id is null then
    raise exception 'student role not found';
  end if;

  -- User ใหม่เริ่มต้นเป็น student
  if not exists (
    select 1
    from public.user_roles
    where user_id = new.id
      and role_id = student_role_id
  ) then
    insert into public.user_roles (
      user_id,
      role_id
    )
    values (
      new.id,
      student_role_id
    );
  end if;

  -- อ่านข้อมูลจาก Register
  new_student_code :=
    coalesce(
      new.raw_user_meta_data ->> 'student_id',
      new.raw_user_meta_data ->> 'student_code'
    );

  new_full_name :=
    new.raw_user_meta_data ->> 'full_name';

  -- สร้าง student profile เมื่อข้อมูลครบ
  if
    new_student_code is not null
    and btrim(new_student_code) <> ''
    and new_full_name is not null
    and btrim(new_full_name) <> ''
  then
    insert into public.student_profiles (
      student_id,
      student_code,
      full_name
    )
    values (
      new.id,
      btrim(new_student_code),
      btrim(new_full_name)
    )
    on conflict (student_id) do update
    set
      student_code = excluded.student_code,
      full_name = excluded.full_name;
  end if;

  return new;
end;
$$;