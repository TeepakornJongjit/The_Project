-- Mock data for development/testing only.
-- This file is intentionally separate from production migrations.
-- Use it only against a development/test database.

-- The seed is a reference dataset. IDs are deterministic so related records
-- can be connected when the canonical schema is seeded locally.

insert into public.scholarships
  (scholarship_id, title, provider_name, description, amount, quota, category, status)
values
  ('00000000-0000-0000-0000-000000000001', 'ทุนเรียนดี', 'มหาวิทยาลัย', 'ทุนสำหรับนักศึกษาที่มีผลการเรียนดี', 15000, 10, 'เรียนดี', 'open'),
  ('00000000-0000-0000-0000-000000000002', 'ทุนขาดแคลน', 'กองทุนการศึกษา', 'ทุนสำหรับนักศึกษาที่มีความจำเป็นด้านค่าใช้จ่าย', 20000, 15, 'ขาดแคลน', 'open'),
  ('00000000-0000-0000-0000-000000000003', 'ทุนสนับสนุนการศึกษา', 'ผู้สนับสนุนภายนอก', 'ทุนสนับสนุนค่าใช้จ่ายทางการศึกษา', 10000, 20, 'ทั่วไป', 'published')
on conflict (scholarship_id) do update set
  title = excluded.title,
  provider_name = excluded.provider_name,
  description = excluded.description,
  amount = excluded.amount,
  quota = excluded.quota,
  category = excluded.category,
  status = excluded.status;
