begin;
-- Disposable records exist only inside this rolled-back transaction.
insert into auth.users(id,email,raw_user_meta_data)
values ('11111111-3310-4000-8000-000000000001','registration-test@example.invalid',
'{"full_name":"Registration test","student_id":"990033100001","role":"admin","active":true}');
do $$ begin
 if not exists(select 1 from public.portal_profiles where student_id='990033100001' and role='student') then raise exception 'FAIL: signup escalation'; end if;
end $$;
select set_config('request.jwt.claims','{"sub":"11111111-3310-4000-8000-000000000001","role":"authenticated"}',true);
set local role authenticated;
do $$
declare n int;
begin
 select count(*) into n from public.portal_profiles;
 if n<>1 then raise exception 'FAIL: student reads other accounts'; end if;
 select count(*) into n from public.portal_audit_log;
 if n<>0 then raise exception 'FAIL: student reads audit'; end if;
 begin
  perform public.admin_update_member('11111111-3310-4000-8000-000000000001',1,'set_role','staff','test reason');
  raise exception 'FAIL: student changes role';
 exception when insufficient_privilege then null; end;
 begin
  update public.portal_profiles set role='admin' where id=auth.uid();
  raise exception 'FAIL: direct role write';
 exception when insufficient_privilege then null; end;
 begin
  insert into public.portal_audit_log(actor_name,action,entity,target_id,reason) values('spoof','spoof','profile',auth.uid(),'spoof');
  raise exception 'FAIL: forged audit';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
select set_config('request.jwt.claims',jsonb_build_object('sub',(select id from public.portal_profiles where role='admin'),'role','authenticated')::text,true);
set local role authenticated;
do $$
declare p public.portal_profiles; ref uuid; n int;
begin
 perform public.admin_update_member('11111111-3310-4000-8000-000000000001',1,'request_role','staff','approval test');
 select * into p from public.portal_profiles where id='11111111-3310-4000-8000-000000000001';
 if p.role<>'student' or p.pending_role<>'staff' then raise exception 'FAIL: pending grants access'; end if;
 begin
  perform public.admin_update_member(p.id,1,'approve_role',null,'stale approval test');
  raise exception 'FAIL: stale overwrite';
 exception when serialization_failure then null; end;
 perform public.admin_update_member(p.id,2,'approve_role',null,'approve test');
 select * into p from public.portal_profiles where id=p.id;
 if p.role<>'staff' or p.pending_role is not null then raise exception 'FAIL: approve role'; end if;
 perform public.admin_update_member(p.id,3,'suspend',null,'suspend test');
 select * into p from public.portal_profiles where id=p.id;
 if p.active then raise exception 'FAIL: suspension'; end if;
 perform public.admin_update_member(p.id,4,'activate',null,'activate test');
 perform public.admin_update_member(p.id,5,'request_role','committee','committee test');
 perform public.admin_update_member(p.id,6,'reject_role',null,'reject test');
 perform public.admin_update_member(p.id,7,'set_student',null,'revert role test');
 perform public.admin_update_member(p.id,8,'edit_identity',null,'identity test','Updated test','990033100001');
 select * into p from public.portal_profiles where id=p.id;
 if p.full_name<>'Updated test' or p.role<>'student' or not p.active or p.pending_role is not null then raise exception 'FAIL: final identity'; end if;
 select count(*) into n from public.portal_audit_log where target_id=p.id;
 if n<>9 then raise exception 'FAIL: audit count %',n; end if;
 begin
  perform public.admin_update_member(auth.uid(),1,'suspend',null,'self suspend');
  raise exception 'FAIL: admin self suspend';
 exception when insufficient_privilege then null; end;
 begin
  delete from public.portal_audit_log where target_id=p.id;
  raise exception 'FAIL: deleting audit';
 exception when insufficient_privilege then null; end;
 ref:=public.admin_save_reference(null,null,'faculty','TEST rollback',true,'reference test');
 perform public.admin_save_reference(ref,1,'faculty','TEST renamed',false,'reference edit test');
 if not exists(select 1 from public.portal_reference_data where id=ref and not active and version=2) then raise exception 'FAIL: reference update'; end if;
end $$;
-- Direct assignment keeps all authorization/version guards and writes one audit row.
do $$
declare p public.portal_profiles; n int; attempted text;
begin
 select * into p from public.portal_profiles where id='11111111-3310-4000-8000-000000000001';
 foreach attempted in array array['admin','unknown',null::text] loop
   begin
     perform public.admin_update_member(p.id,p.version,'set_role',attempted,'invalid role test');
     raise exception 'FAIL: invalid or Admin role allowed';
   exception when invalid_parameter_value then null; end;
 end loop;
 begin
   perform public.admin_update_member(p.id,p.version,'set_role','staff','');
   raise exception 'FAIL: missing reason allowed';
 exception when invalid_parameter_value then null; end;
 perform public.admin_update_member(p.id,p.version,'request_role','committee','legacy pending test');
 perform public.admin_update_member(p.id,p.version+1,'set_role','staff','direct Officer test');
 select * into p from public.portal_profiles where id=p.id;
 if p.role<>'staff' or p.pending_role is not null then raise exception 'FAIL: direct Officer assignment'; end if;
 begin
   perform public.admin_update_member(p.id,p.version-1,'set_role','committee','stale role test');
   raise exception 'FAIL: stale direct assignment';
 exception when serialization_failure then null; end;
 perform public.admin_update_member(p.id,p.version,'set_role','committee','direct Committee test');
 select * into p from public.portal_profiles where id=p.id;
 if p.role<>'committee' or p.pending_role is not null then raise exception 'FAIL: direct Committee assignment'; end if;
 perform public.admin_update_member(p.id,p.version,'set_role','student','direct Student test');
 select * into p from public.portal_profiles where id=p.id;
 if p.role<>'student' or p.pending_role is not null then raise exception 'FAIL: direct Student assignment'; end if;
 select count(*) into n from public.portal_audit_log where target_id=p.id and action='set_role' and actor_id=auth.uid();
 if n<>3 then raise exception 'FAIL: direct assignment audit %',n; end if;
 perform public.admin_update_member(p.id,p.version,'suspend',null,'suspend direct test');
 begin
   perform public.admin_update_member(p.id,p.version+1,'set_role','staff','inactive role test');
   raise exception 'FAIL: inactive target assignment';
 exception when invalid_parameter_value then null; end;
 begin
   perform public.admin_update_member(auth.uid(),1,'set_role','student','Admin protection test');
   raise exception 'FAIL: Admin role modified';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
update public.portal_profiles set active=false where role='admin';
set local role authenticated;
do $$ begin
 if private.portal_is_admin() then raise exception 'FAIL: suspended admin recognized'; end if;
 begin
  perform public.admin_update_member('11111111-3310-4000-8000-000000000001',1,'set_role','staff','suspended actor test');
  raise exception 'FAIL: suspended Admin assigns role';
 exception when insufficient_privilege then null; end;
 begin
  perform public.admin_save_reference(null,null,'faculty','SHOULD FAIL',true,'suspended admin');
  raise exception 'FAIL: suspended admin mutation';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
select 'PASS: forced Student; RLS; direct role assignment; role validation; legacy pending; stale protection; audit; identity; suspension; basic data; Admin protection' as result;
