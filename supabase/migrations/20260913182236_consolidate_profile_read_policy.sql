drop policy "Members can read their own profile" on public.portal_profiles;
drop policy "Admins read member accounts" on public.portal_profiles;
create policy "Members read own profile or admins read all" on public.portal_profiles for select to authenticated using ((select auth.uid())=id or (select private.portal_is_admin()));
