-- Assign and approve in one atomic, audited operation. Preserve legacy RPC actions for older clients.
create or replace function private.portal_admin_member(
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
    when 'set_role' then
      if p_value is null or p_value not in ('student','staff','committee') or not old_row.active then
        raise exception 'Invalid role or inactive account' using errcode='22023';
      end if;
      update public.portal_profiles set role=p_value,pending_role=null where id=p_id;
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
