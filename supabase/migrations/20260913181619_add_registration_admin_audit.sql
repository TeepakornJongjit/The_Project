-- Roles and account changes are writable only through guarded, audited RPCs.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

alter table public.portal_profiles drop constraint portal_profiles_role_check;
alter table public.portal_profiles add constraint portal_profiles_role_check
  check (role in ('student','staff','committee','admin'));
alter table public.portal_profiles
  add column email text,
  add column pending_role text check (pending_role in ('staff','committee')),
  add column version integer not null default 1,
  add column updated_at timestamptz not null default now();
update public.portal_profiles p set email = u.email from auth.users u where u.id=p.id;

create table public.portal_reference_data (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('scholarship_type','faculty','major')),
  name text not null check (char_length(btrim(name)) between 1 and 150),
  active boolean not null default true,
  version integer not null default 1,
  updated_at timestamptz not null default now(),
  unique(kind,name)
);
create table public.portal_audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid,
  actor_name text not null,
  action text not null,
  entity text not null,
  target_id uuid not null,
  before_data jsonb,
  after_data jsonb,
  reason text not null,
  created_at timestamptz not null default now()
);
create index portal_audit_log_created_idx on public.portal_audit_log(created_at desc, id desc);
create index portal_audit_log_target_idx on public.portal_audit_log(target_id);
alter table public.portal_reference_data enable row level security;
alter table public.portal_audit_log enable row level security;
revoke all on public.portal_reference_data, public.portal_audit_log from anon, authenticated;
grant select on public.portal_reference_data, public.portal_audit_log to authenticated;
grant all on public.portal_reference_data, public.portal_audit_log to service_role;

-- This narrow helper avoids recursively applying the profile SELECT policy.
create function private.portal_is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists (
    select 1 from public.portal_profiles where id=auth.uid() and active and role='admin'
  );
$$;
revoke all on function private.portal_is_admin() from public, anon;
grant execute on function private.portal_is_admin() to authenticated;
create policy "Admins read member accounts" on public.portal_profiles
  for select to authenticated using ((select private.portal_is_admin()));
create policy "Admins read audit history" on public.portal_audit_log
  for select to authenticated using ((select private.portal_is_admin()));
create policy "Active members read reference data" on public.portal_reference_data
  for select to authenticated using (
    (select private.portal_is_admin()) or
    (active and exists(select 1 from public.portal_profiles where id=(select auth.uid()) and active))
  );

-- Trigger-only function: new Auth users may not have a JWT yet. No EXECUTE grant.
-- Identity metadata is validated; metadata is NEVER used to assign permissions.
create function private.portal_register_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
declare n text := btrim(new.raw_user_meta_data->>'full_name');
        s text := btrim(new.raw_user_meta_data->>'student_id');
begin
  if n is null or char_length(n) not between 1 and 200 or
     s is null or s !~ '^[0-9]{8,12}$' then
    raise exception 'Valid full_name and student_id are required' using errcode='22023';
  end if;
  insert into public.portal_profiles(id,full_name,student_id,email,role,active)
    values(new.id,n,s,new.email,'student',true);
  insert into public.portal_audit_log(actor_id,actor_name,action,entity,target_id,after_data,reason)
    values(new.id,n,'register','profile',new.id,
      jsonb_build_object('full_name',n,'student_id',s,'role','student','active',true),'สมัครสมาชิก');
  return new;
end;
$$;
revoke all on function private.portal_register_profile() from public, anon, authenticated;
create trigger portal_register_profile after insert on auth.users
  for each row execute function private.portal_register_profile();

create function private.portal_sync_email() returns trigger
language plpgsql security definer set search_path = '' as $$
declare old_email text;
begin
  select email into old_email from public.portal_profiles where id=new.id for update;
  update public.portal_profiles set email=new.email,version=version+1,updated_at=now() where id=new.id;
  insert into public.portal_audit_log(actor_id,actor_name,action,entity,target_id,before_data,after_data,reason)
    values(new.id,'Supabase Auth','email_changed','profile',new.id,
      jsonb_build_object('email',old_email),jsonb_build_object('email',new.email),'ยืนยันการเปลี่ยนอีเมลผ่าน Auth');
  return new;
end;
$$;
revoke all on function private.portal_sync_email() from public, anon, authenticated;
create trigger portal_sync_email after update of email on auth.users
  for each row when (old.email is distinct from new.email) execute function private.portal_sync_email();

-- Privileged implementations live in a non-exposed schema; each checks the caller.
-- Public wrappers are SECURITY INVOKER. No authenticated table write grants exist.
create function private.portal_admin_member(
  p_id uuid,p_version integer,p_action text,p_value text,p_reason text,
  p_full_name text default null,p_student_id text default null
) returns void language plpgsql security definer set search_path = '' as $$
declare old_row public.portal_profiles; new_row public.portal_profiles; actor text;
begin
  if auth.uid() is null or not private.portal_is_admin() then
    raise exception 'Admin required' using errcode='42501';
  end if;
  -- Lock the actor too, so another request cannot suspend them mid-operation.
  select full_name into actor from public.portal_profiles where id=auth.uid() and active and role='admin' for share;
  if actor is null then raise exception 'Admin required' using errcode='42501'; end if;
  if p_reason is null or char_length(btrim(p_reason)) not between 3 and 500 then
    raise exception 'Reason required' using errcode='22023';
  end if;
  select * into old_row from public.portal_profiles where id=p_id for update;
  if not found then raise exception 'Account not found' using errcode='P0002'; end if;
  if p_version is distinct from old_row.version then raise exception 'STALE_VERSION' using errcode='40001'; end if;
  if old_row.role='admin' or p_id=auth.uid() then raise exception 'Admin account protected' using errcode='42501'; end if;
  case p_action
    when 'request_role' then
      if p_value is null or p_value not in ('staff','committee') or p_value=old_row.role or not old_row.active then
        raise exception 'Invalid requested role' using errcode='22023';
      end if;
      update public.portal_profiles set pending_role=p_value where id=p_id;
    when 'approve_role' then
      if old_row.pending_role is null or not old_row.active then raise exception 'No active pending request' using errcode='22023'; end if;
      update public.portal_profiles set role=pending_role,pending_role=null where id=p_id;
    when 'reject_role' then
      if old_row.pending_role is null then raise exception 'No pending request' using errcode='22023'; end if;
      update public.portal_profiles set pending_role=null where id=p_id;
    when 'set_student' then
      update public.portal_profiles set role='student',pending_role=null where id=p_id;
    when 'activate' then update public.portal_profiles set active=true where id=p_id;
    when 'suspend' then update public.portal_profiles set active=false,pending_role=null where id=p_id;
    when 'edit_identity' then
      if p_full_name is null or char_length(btrim(p_full_name)) not between 1 and 200 or
         p_student_id is null or p_student_id !~ '^[0-9]{8,12}$' then
        raise exception 'Invalid identity' using errcode='22023';
      end if;
      update public.portal_profiles set full_name=btrim(p_full_name),student_id=p_student_id where id=p_id;
    else raise exception 'Invalid action' using errcode='22023';
  end case;
  update public.portal_profiles set version=version+1,updated_at=now() where id=p_id returning * into new_row;
  insert into public.portal_audit_log(actor_id,actor_name,action,entity,target_id,before_data,after_data,reason)
    values(auth.uid(),actor,p_action,'profile',p_id,to_jsonb(old_row),to_jsonb(new_row),btrim(p_reason));
end;
$$;
revoke all on function private.portal_admin_member(uuid,integer,text,text,text,text,text) from public, anon;
grant execute on function private.portal_admin_member(uuid,integer,text,text,text,text,text) to authenticated;
create function public.admin_update_member(
  p_id uuid,p_version integer,p_action text,p_value text,p_reason text,
  p_full_name text default null,p_student_id text default null
) returns void language sql security invoker set search_path = '' as $$
  select private.portal_admin_member(p_id,p_version,p_action,p_value,p_reason,p_full_name,p_student_id);
$$;
revoke all on function public.admin_update_member(uuid,integer,text,text,text,text,text) from public, anon;
grant execute on function public.admin_update_member(uuid,integer,text,text,text,text,text) to authenticated;

create function private.portal_admin_reference(
  p_id uuid,p_version integer,p_kind text,p_name text,p_active boolean,p_reason text
) returns uuid language plpgsql security definer set search_path = '' as $$
declare old_row public.portal_reference_data; new_row public.portal_reference_data; actor text;
begin
  if auth.uid() is null or not private.portal_is_admin() then raise exception 'Admin required' using errcode='42501'; end if;
  select full_name into actor from public.portal_profiles where id=auth.uid() and active and role='admin' for share;
  if actor is null then raise exception 'Admin required' using errcode='42501'; end if;
  if p_reason is null or char_length(btrim(p_reason)) not between 3 and 500 then raise exception 'Reason required' using errcode='22023'; end if;
  if p_id is null then
    insert into public.portal_reference_data(kind,name,active) values(p_kind,btrim(p_name),p_active) returning * into new_row;
  else
    select * into old_row from public.portal_reference_data where id=p_id for update;
    if not found then raise exception 'Reference not found' using errcode='P0002'; end if;
    if p_version is distinct from old_row.version then raise exception 'STALE_VERSION' using errcode='40001'; end if;
    if p_kind is distinct from old_row.kind then raise exception 'Cannot change reference kind' using errcode='22023'; end if;
    update public.portal_reference_data set name=btrim(p_name),active=p_active,version=version+1,updated_at=now()
      where id=p_id returning * into new_row;
  end if;
  insert into public.portal_audit_log(actor_id,actor_name,action,entity,target_id,before_data,after_data,reason)
    values(auth.uid(),actor,case when p_id is null then 'create_reference' else 'update_reference' end,
      'reference',new_row.id,case when p_id is null then null else to_jsonb(old_row) end,to_jsonb(new_row),btrim(p_reason));
  return new_row.id;
end;
$$;
revoke all on function private.portal_admin_reference(uuid,integer,text,text,boolean,text) from public, anon;
grant execute on function private.portal_admin_reference(uuid,integer,text,text,boolean,text) to authenticated;
create function public.admin_save_reference(p_id uuid,p_version integer,p_kind text,p_name text,p_active boolean,p_reason text)
returns uuid language sql security invoker set search_path = '' as $$
  select private.portal_admin_reference(p_id,p_version,p_kind,p_name,p_active,p_reason);
$$;
revoke all on function public.admin_save_reference(uuid,integer,text,text,boolean,text) from public, anon;
grant execute on function public.admin_save_reference(uuid,integer,text,text,boolean,text) to authenticated;

comment on column public.portal_profiles.pending_role is 'No elevated access until an Admin explicitly approves; staff is the Officer role.';
comment on table public.portal_audit_log is 'Append-only application audit history. No client write grants. No passwords or tokens.';
