begin;
-- All synthetic users, objects and audit entries roll back; real members are untouched.
insert into auth.users(id,email,raw_user_meta_data) values
('11111111-3310-4000-8000-000000000011','self-profile-test@example.invalid','{"full_name":"Profile test","student_id":"990033100011"}'),
('11111111-3310-4000-8000-000000000012','other-profile-test@example.invalid','{"full_name":"Other test","student_id":"990033100012"}');
update public.portal_profiles set role='staff' where id='11111111-3310-4000-8000-000000000011';
select set_config('request.jwt.claims','{"sub":"11111111-3310-4000-8000-000000000011","role":"authenticated"}',true);
set local role authenticated;
do $$ declare p public.portal_profiles; n integer; begin
 perform public.update_my_profile(1,'0812345678','Test faculty','Test officer','');
 select * into p from public.portal_profiles where id=auth.uid();
 if p.phone<>'0812345678' or p.department<>'Test faculty' or p.position<>'Test officer' or p.version<>2 or p.role<>'staff' or p.full_name<>'Profile test' or p.student_id<>'990033100011' or not p.active then raise exception 'FAIL: profile update or identity changed'; end if;
 select count(*) into n from public.portal_profiles;
 if n<>1 then raise exception 'FAIL: sees other accounts'; end if;
 begin perform public.update_my_profile(1,'','','',''); raise exception 'FAIL: stale update'; exception when serialization_failure then null; end;
 begin perform public.update_my_profile(2,'','','','Unauthorized expertise'); raise exception 'FAIL: staff expertise'; exception when invalid_parameter_value then null; end;
 begin perform public.update_my_profile(2,'-------','','',''); raise exception 'FAIL: invalid phone'; exception when check_violation then null; end;
 begin perform public.update_my_profile(2,'',repeat('x',151),'',''); raise exception 'FAIL: oversized field'; exception when check_violation then null; end;
 begin perform public.update_my_profile(2,'','','','', 'replace','11111111-3310-4000-8000-000000000012/11111111-3310-4000-8000-000000000001.webp'); raise exception 'FAIL: foreign avatar'; exception when insufficient_privilege then null; end;
 begin perform public.update_my_profile(2,'','','','', 'replace','11111111-3310-4000-8000-000000000011/11111111-3310-4000-8000-000000000001.webp'); raise exception 'FAIL: missing avatar'; exception when invalid_parameter_value then null; end;
 begin update public.portal_profiles set role='admin' where id=auth.uid(); raise exception 'FAIL: direct role write'; exception when insufficient_privilege then null; end;
 begin update public.portal_profiles set phone='0899999999' where id=auth.uid(); raise exception 'FAIL: bypass audit'; exception when insufficient_privilege then null; end;
 insert into storage.objects(bucket_id,name) values('portal-avatars','11111111-3310-4000-8000-000000000011/11111111-3310-4000-8000-000000000001.webp');
 begin insert into storage.objects(bucket_id,name) values('portal-avatars','11111111-3310-4000-8000-000000000012/11111111-3310-4000-8000-000000000001.webp'); raise exception 'FAIL: foreign upload'; exception when insufficient_privilege then null; end;
 perform public.update_my_profile(2,'0812345678','Test faculty','Test officer','', 'replace','11111111-3310-4000-8000-000000000011/11111111-3310-4000-8000-000000000001.webp');
end $$;
reset role;
update public.portal_profiles set role='committee' where id='11111111-3310-4000-8000-000000000011';
set local role authenticated;
do $$ begin
 perform public.update_my_profile(3,'','Test faculty','Test committee','Education', 'remove');
 if not exists(select 1 from public.portal_profiles where id=auth.uid() and expertise='Education' and phone is null and avatar_path is null and version=4) then raise exception 'FAIL: committee update/remove'; end if;
end $$;
reset role;
update public.portal_profiles set active=false where id='11111111-3310-4000-8000-000000000011';
set local role authenticated;
do $$ begin
 begin perform public.update_my_profile(4,'','','',''); raise exception 'FAIL: inactive member'; exception when insufficient_privilege then null; end;
 begin insert into storage.objects(bucket_id,name) values('portal-avatars','11111111-3310-4000-8000-000000000011/11111111-3310-4000-8000-000000000002.webp'); raise exception 'FAIL: inactive upload'; exception when insufficient_privilege then null; end;
end $$;
reset role;
select set_config('request.jwt.claims','{"sub":"11111111-3310-4000-8000-000000000012","role":"authenticated"}',true);
set local role authenticated;
do $$ begin
 perform public.update_my_profile(1,'0812345678','Science','','','keep',null,'{"address":"Test address","major":"Computing","education_level":"Bachelor","study_year":"2","gpa":"3.45"}');
 if not exists(select 1 from public.portal_profiles where id=auth.uid() and profile_details->>'gpa'='3.45' and version=2 and role='student') then raise exception 'FAIL: student save'; end if;
 begin perform public.update_my_profile(2,'','','','','keep',null,'{"role":"admin"}'); raise exception 'FAIL: hidden privilege field'; exception when invalid_parameter_value then null; end;
 begin perform public.update_my_profile(2,'','','','','keep',null,'{"gpa":"4.01"}'); raise exception 'FAIL: GPA range'; exception when invalid_parameter_value then null; end;
 begin perform public.update_my_profile(2,'','','','','keep',null,'{"study_year":"9"}'); raise exception 'FAIL: year range'; exception when invalid_parameter_value then null; end;
 begin perform public.update_my_profile(2,'','','','','keep',null,'{"major":[]}'); raise exception 'FAIL: JSON value type'; exception when invalid_parameter_value then null; end;
end $$;
reset role;
update public.portal_profiles set role='admin',active=true where id='11111111-3310-4000-8000-000000000011';
select set_config('request.jwt.claims','{"sub":"11111111-3310-4000-8000-000000000011","role":"authenticated"}',true);
set local role authenticated;
do $$ begin
 perform public.update_my_profile(4,'0899999999','Office','Admin','','keep',null,'{"address":"Admin contact"}');
 if not exists(select 1 from public.portal_profiles where id=auth.uid() and role='admin' and version=5 and phone='0899999999') then raise exception 'FAIL: admin own profile'; end if;
 begin perform public.update_my_profile(5,'','','','','keep',null,'{"gpa":"3.00"}'); raise exception 'FAIL: nonstudent education'; exception when insufficient_privilege then null; end;
end $$;
reset role;
do $$ begin
 if (select count(*) from public.portal_audit_log where actor_id='11111111-3310-4000-8000-000000000011' and action='update_self_profile')<>4 then raise exception 'FAIL: audit atomicity'; end if;
 if not exists(select 1 from public.portal_profiles where id='11111111-3310-4000-8000-000000000012' and version=2 and phone='0812345678' and role='student') then raise exception 'FAIL: another member changed'; end if;
end $$;
rollback;
select 'PASS: all four roles save own profile; identity, cross-account, concurrency, validation, audit, storage ownership and suspension checks' as result;
