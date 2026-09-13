alter table public.portal_profiles
  add column phone text check (phone is null or (phone ~ '^\+?[0-9 ()-]{7,25}$' and char_length(regexp_replace(phone,'[^0-9]','','g'))>=7)),
  add column department text check (char_length(department)<=150),
  add column position text check (char_length(position)<=150),
  add column expertise text check (char_length(expertise)<=500),
  add column avatar_path text;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('portal-avatars','portal-avatars',false,2097152,array['image/webp']);

-- Only authenticated owners can view their own images. No public URLs.
create policy "Members read own avatar objects" on storage.objects
for select to authenticated using (
  bucket_id='portal-avatars' and (storage.foldername(name))[1]=(select auth.uid())::text
  and exists(select 1 from public.portal_profiles where id=(select auth.uid()) and active)
);
create policy "Staff and committee upload own avatars" on storage.objects
for insert to authenticated with check (
  bucket_id='portal-avatars' and (storage.foldername(name))[1]=(select auth.uid())::text
  and name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.webp$'
  and exists(select 1 from public.portal_profiles where id=(select auth.uid()) and active and role in ('staff','committee'))
);
-- Old/failed uploads can be cleaned up, but the image currently in use is protected.
create policy "Members remove unused own avatars" on storage.objects
for delete to authenticated using (
  bucket_id='portal-avatars' and (storage.foldername(name))[1]=(select auth.uid())::text
  and exists(select 1 from public.portal_profiles where id=(select auth.uid()) and active and avatar_path is distinct from name)
);

create function private.portal_update_self_profile(
  p_version integer,p_phone text,p_department text,p_position text,p_expertise text,
  p_avatar_action text default 'keep',p_avatar_path text default null
) returns void language plpgsql security definer set search_path='' as $$
declare old_row public.portal_profiles; new_row public.portal_profiles; next_avatar text;
begin
  if auth.uid() is null then raise exception 'Authentication required' using errcode='42501'; end if;
  select * into old_row from public.portal_profiles where id=auth.uid() for update;
  if not found or not old_row.active or old_row.role not in ('staff','committee') then
    raise exception 'Staff or committee required' using errcode='42501';
  end if;
  if p_version is distinct from old_row.version then raise exception 'STALE_VERSION' using errcode='40001'; end if;
  if p_avatar_action is null or p_avatar_action not in ('keep','replace','remove') then raise exception 'Invalid avatar action' using errcode='22023'; end if;
  if old_row.role='staff' and nullif(btrim(p_expertise),'') is not null then raise exception 'Expertise is committee-only' using errcode='22023'; end if;
  next_avatar:=old_row.avatar_path;
  if p_avatar_action='remove' then next_avatar:=null; end if;
  if p_avatar_action='replace' then
    if p_avatar_path is null or p_avatar_path !~ ('^'||auth.uid()::text||'/[0-9a-f-]{36}\.webp$') then
      raise exception 'Invalid avatar owner' using errcode='42501';
    end if;
    perform 1 from storage.objects where bucket_id='portal-avatars' and name=p_avatar_path for key share;
    if not found then raise exception 'Avatar not uploaded' using errcode='22023'; end if;
    next_avatar:=p_avatar_path;
  end if;
  update public.portal_profiles set
    phone=nullif(btrim(p_phone),''),department=nullif(btrim(p_department),''),position=nullif(btrim(p_position),''),
    expertise=case when old_row.role='committee' then nullif(btrim(p_expertise),'') else old_row.expertise end,
    avatar_path=next_avatar,version=version+1,updated_at=now()
    where id=auth.uid() returning * into new_row;
  insert into public.portal_audit_log(actor_id,actor_name,action,entity,target_id,before_data,after_data,reason)
    values(auth.uid(),old_row.full_name,'update_self_profile','profile',auth.uid(),
      jsonb_build_object('full_name',old_row.full_name,'phone',old_row.phone,'department',old_row.department,'position',old_row.position,'expertise',old_row.expertise,'avatar_path',old_row.avatar_path),
      jsonb_build_object('full_name',new_row.full_name,'phone',new_row.phone,'department',new_row.department,'position',new_row.position,'expertise',new_row.expertise,'avatar_path',new_row.avatar_path),
      'เจ้าของบัญชีแก้ไขข้อมูลส่วนตัว');
end;
$$;
revoke all on function private.portal_update_self_profile(integer,text,text,text,text,text,text) from public,anon;
grant execute on function private.portal_update_self_profile(integer,text,text,text,text,text,text) to authenticated;
create function public.update_my_profile(p_version integer,p_phone text,p_department text,p_position text,p_expertise text,
  p_avatar_action text default 'keep',p_avatar_path text default null)
returns void language sql security invoker set search_path='' as $$
  select private.portal_update_self_profile(p_version,p_phone,p_department,p_position,p_expertise,p_avatar_action,p_avatar_path);
$$;
revoke all on function public.update_my_profile(integer,text,text,text,text,text,text) from public,anon;
grant execute on function public.update_my_profile(integer,text,text,text,text,text,text) to authenticated;
comment on function public.update_my_profile(integer,text,text,text,text,text,text) is
  'Active staff/committee update only their own optional profile fields. Identity, role and active are never inputs.';
