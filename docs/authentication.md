# ระบบบัญชีและสิทธิ์

ใช้ Supabase Auth สำหรับอีเมล/รหัสผ่าน และตาราง `public.portal_profiles` สำหรับชื่อ รหัสนักศึกษา บทบาท และสถานะเปิดใช้งาน ไม่มีรหัสผ่านหรือคีย์ผู้ดูแลอยู่ในซอร์สโค้ด

## เริ่มใช้งานบนเครื่องของสมาชิกทีม

1. ติดตั้ง Node.js 22 ขึ้นไป แล้วรัน `npm ci` ในโฟลเดอร์ `coe-next`
2. คัดลอก `.env.example` เป็น `.env.local`
3. ใส่ Project URL และ Publishable key ของ Supabase โปรเจกต์เดียวกับทีม ขอค่าจากผู้ดูแลหรือหน้า Connect ใน Supabase ไม่ใช้ Secret key หรือ Service role key
4. รัน `npm run dev` แล้วเปิด `http://localhost:3000/login`
5. เข้าสู่ระบบด้วยอีเมลและรหัสผ่านที่ผู้ดูแลสร้างให้ ข้อมูลใน `.env.local` ไม่ถูกอัปขึ้น Git

หากเปลี่ยนค่า environment ให้เริ่ม dev server ใหม่ โฮสต์จริงต้องตั้งสองตัวแปรนี้ในระบบ environment ของโฮสต์และใช้ HTTPS

## ขอบเขตของงานนี้

ทำงานจริง: การเข้าสู่ระบบ ออกจากระบบ เซสชัน ชื่อ/รหัส/อีเมลของบัญชี และสิทธิ์เข้าหน้าเว็บ

ยังเป็นตัวอย่าง: ทุน ใบสมัคร การเก็บข้อมูลโปรไฟล์เพิ่มเติม การอัปโหลดเอกสาร การให้คะแนน การแจ้งเตือน และการจ่ายทุน ข้อมูลตัวอย่างไม่ใช่ประวัติของบัญชีที่เข้าสู่ระบบ การกดบันทึกในโมดูลเหล่านี้ยังไม่ได้บันทึกเข้าฐานข้อมูล

ตอนนี้เปิดบัญชีผ่านผู้ดูแลเท่านั้น หน้า `/register` แจ้งวิธีขอบัญชี และยังไม่มีการรีเซ็ตรหัสผ่านผ่านอีเมล ก่อนเปิดสมัครสมาชิกหรือกู้รหัสผ่านให้เพิ่ม flow ยืนยันอีเมลและตั้ง SMTP/redirect URL ให้ครบ

## บทบาทและเส้นทาง

| บทบาท | หน้าหลัก | หน้าที่อนุญาต |
| --- | --- | --- |
| student | `/dashboard` | `/profile`, `/applications`, `/apply` |
| staff | `/staff` | `/staff/scholarships`, `/staff/review`, `/scholarships/new` |
| committee | `/committee` | `/staff/evaluation` |

ทุกบัญชีเปิด `/account` ได้ ผู้ที่ยังไม่เข้าสู่ระบบเข้าหน้าทุนสาธารณะได้ แต่เข้าหน้าที่ป้องกันจะถูกส่งไป `/login` ผู้ที่เข้าสู่ระบบแล้วแต่บทบาทไม่ตรงจะถูกส่งไป `/access-denied`

## เพิ่มบัญชีหรือแก้สิทธิ์

ผู้ดูแลโปรเจกต์สร้างบัญชีใน Supabase → Authentication → Users → Add user → Create new user จากนั้นเพิ่มแถวใน `portal_profiles` โดยใช้ UUID ของบัญชีนั้น กรอก `full_name`, `student_id`, `role` และ `active` ผ่าน Supabase Dashboard ที่มีสิทธิ์ผู้ดูแล ไม่เพิ่มรหัสผ่านลงในตารางนี้หรือไฟล์ SQL

หากต้องการระงับการเข้าหน้าเว็บ ให้ตั้ง `portal_profiles.active = false` การตรวจสิทธิ์อ่านสถานะใหม่ทุก request ผู้ใช้เปลี่ยน role หรือ active ของตัวเองผ่าน client ไม่ได้

สคีมาอยู่ใน `supabase/migrations/` เวอร์ชันไฟล์ตรงกับ migration ที่ใช้จริงในโปรเจกต์ต้นทาง สำหรับโปรเจกต์ใหม่ให้ใช้ migration นี้ก่อนเพิ่มโปรไฟล์

## กติกาสำหรับพัฒนาฟีเจอร์ต่อ

- หน้า Server Component ที่ต้องล็อกอินเรียก `requireViewer()` หรือ `requireRole([...])` จาก `lib/auth/server.ts`
- ทุก Server Action/Route Handler ที่อ่านหรือเขียนข้อมูลต้องตรวจสิทธิ์อีกครั้ง แม้เมนูหรือหน้าที่เรียกจะตรวจแล้ว
- ใช้ `viewer.id` จากเซิร์ฟเวอร์เป็นเจ้าของข้อมูล ไม่รับ user ID หรือบทบาทจาก form, URL, header หรือ `user_metadata` มาเป็นสิทธิ์
- เพิ่ม RLS ให้ตารางของแต่ละโมดูลโดยตรวจเจ้าของข้อมูล/บทบาทที่เหมาะสม การล็อกหน้าเว็บอย่างเดียวไม่คุ้มครอง Data API
- ห้ามใช้ Secret/Service role key ใน `NEXT_PUBLIC_*` หรือใน Client Component
- `proxy.ts` ต่ออายุคุกกี้และป้องกันแคชหน้าเว็บ แต่การตัดสินสิทธิ์อยู่ที่เซิร์ฟเวอร์และ RLS

## การตรวจสอบ

`npm run lint` และ `npm run build` ตรวจโค้ดกับ Next.js เวอร์ชันที่ติดตั้ง

`scripts/check-auth.mjs` ทดสอบบัญชีทั้งสามบทบาทกับ Supabase และ Next.js ที่เปิดอยู่: ล็อกอิน อ่านได้เฉพาะโปรไฟล์ตัวเอง เปลี่ยนบทบาทไม่ได้ การป้องกันทุกเส้นทาง และไม่รับ role จาก header ปลอม

ทดสอบกับ production build โดยรัน `npm run build` และ `npm run start` ก่อน จากนั้นเรียก `node --env-file=.env.local scripts/check-auth.mjs` แล้วส่ง JSON array ผ่าน stdin โดยแต่ละรายการมี `email`, `password`, `role` (student/staff/committee อย่างละหนึ่งรายการ) ใช้บัญชีที่ได้รับอนุญาตให้ทดสอบเท่านั้น ไม่เก็บ JSON ที่มีรหัสผ่านใน Git โปรแกรมแสดงเฉพาะผลตรวจ ไม่พิมพ์รหัสผ่านหรือโทเคน

ถ้าใช้พอร์ตอื่น ให้ตั้ง `AUTH_TEST_BASE_URL` เป็น URL ที่เปิดทดสอบ ค่าเริ่มต้นคือ `http://localhost:3000` การทดสอบตรวจ `Cache-Control: no-store` จึงต้องใช้ production server เพราะ Next.js dev server เปลี่ยน cache header เป็น `no-cache, must-revalidate`

ยังต้องทดสอบผ่านเบราว์เซอร์: กรอกรหัสผ่านผิด ล็อกอิน เปลี่ยนหน้า รีเฟรช ออกจากระบบ และกลับเข้า URL เดิมโดยไม่มีเซสชัน

Supabase Advisor แจ้งว่าโปรเจกต์ยังไม่เปิด Leaked Password Protection ผู้ดูแลตรวจการตั้งค่าได้ตาม [เอกสารความปลอดภัยของรหัสผ่าน](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)
