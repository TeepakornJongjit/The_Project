# Team Requirements — งานที่แต่ละคนต้องทำ

> แบ่งตาม 6 Modules เดิม โดยยังคงขอบเขตของแต่ละคนให้ชัดเจนและเชื่อมกับ Database กลาง

## Member 1 — M01 User & Student Management

### งานหลัก
- สมัครสมาชิก
- Login / Logout / Reset Password
- จัดการ Student Profile
- จัดการข้อมูลผู้ใช้ตามสิทธิ์

### Database ที่เกี่ยวข้อง
- `profiles`
- `student_profiles`
- `staff_profiles`
- `roles`
- `permissions`
- `user_roles`
- `role_permissions`

### Acceptance Criteria
- ผู้สมัครใหม่สามารถสร้างบัญชีได้
- Student สามารถแก้ไขข้อมูลของตนเองได้
- ผู้ใช้เห็นข้อมูลตามสิทธิ์
- ไม่สามารถแก้ไข profile ของผู้ใช้อื่นโดยไม่มีสิทธิ์

---

## Member 2 — M02 Scholarship Management

### งานหลัก
- สร้าง/แก้ไข/ลบข้อมูลทุน
- จัดการเงื่อนไขทุน
- จัดการเอกสารที่ต้องใช้
- เปิด/ปิดรับสมัคร
- เผยแพร่ทุน

### Database ที่เกี่ยวข้อง
- `scholarships`
- `criteria`
- `document_requirements`
- `scholarship_officers`

### Acceptance Criteria
- Officer สร้างทุนและกำหนดรายละเอียดได้
- เพิ่ม/แก้ไข criteria ได้
- ระบุเอกสารที่จำเป็นได้
- นักศึกษาเห็นเฉพาะทุนที่เผยแพร่/เปิดรับสมัคร

---

## Member 3 — M03 Application & Document Management

### งานหลัก
- สร้างใบสมัคร
- บันทึก Draft
- ส่งใบสมัคร
- Upload/Replace เอกสาร
- แก้ไขเอกสารตามคำร้องขอ
- ติดตามสถานะ

### Database ที่เกี่ยวข้อง
- `applications`
- `documents`
- `application_status_history`
- `statuses`
- `document_requirements`

### Acceptance Criteria
- Student สร้างใบสมัครได้
- ระบบป้องกันใบสมัครซ้ำตาม constraint
- เอกสารเชื่อมกับใบสมัครและ requirement ถูกต้อง
- ทุกการเปลี่ยนสถานะมีประวัติ
- Student แก้ไขเอกสารได้เมื่อถูกขอแก้ไข

---

## Member 4 — M04 Scholarship Review & Evaluation

### งานหลัก
- ตรวจสอบคุณสมบัติ
- ตรวจสอบเอกสาร
- มอบหมายกรรมการ
- Committee ดูงานที่ได้รับมอบหมาย
- ประเมินและบันทึกความคิดเห็น
- ดูผลของใบสมัครที่ตนเองประเมิน

### Database ที่เกี่ยวข้อง
- `document_reviewers`
- `review_assignments`
- `evaluations`
- `application_results`
- `applications`
- `documents`

### Acceptance Criteria
- Committee เห็นเฉพาะงานที่ได้รับมอบหมาย
- Committee บันทึก evaluation ได้
- Officer ตรวจสอบเอกสารและขอแก้ไขได้
- Committee ดูผลประกาศของงานที่ตัวเองประเมินได้

---

## Member 5 — M05 Award, Payment & Follow-up Management

### งานหลัก
- จัดการผู้ได้รับทุน
- เตรียมข้อมูลการจ่ายเงิน
- บันทึกการโอนเงิน
- ติดตามสถานะการจ่าย
- สร้างและติดตาม Follow-up

### Database ที่เกี่ยวข้อง
- `application_results`
- `disbursements`
- `accounting_staff`
- `follow_ups`
- `applications`

### Acceptance Criteria
- เฉพาะใบสมัครที่ผ่านเกณฑ์สามารถเข้าสู่กระบวนการจ่ายได้
- Accounting Staff บันทึกยอดและเลขอ้างอิงการโอนได้
- ระบบเก็บสถานะการจ่ายและวันโอน
- Follow-up มีผู้รับผิดชอบ สถานะ และกำหนดวันได้

---

## Member 6 — M06 Dashboard, Report & Notification

### งานหลัก
- Dashboard
- รายงานสถิติทุน/ใบสมัคร/ผลการพิจารณา
- Notification ในระบบ
- เตรียมการเชื่อม Email Service
- Audit Log viewer สำหรับ Admin

### Database ที่เกี่ยวข้อง
- `notifications`
- `audit_logs`
- `scholarships`
- `applications`
- `application_results`
- `disbursements`
- `follow_ups`

### Acceptance Criteria
- Dashboard คำนวณข้อมูลจากฐานข้อมูลจริงของ environment ที่กำลังใช้งาน
- Notification แยกตาม user
- Admin ตรวจสอบ Audit Log ได้
- รายงานไม่เปิดเผยข้อมูลเกินสิทธิ์ของผู้ใช้

---

## Shared Requirements — ทุกคนต้องทำร่วมกัน

1. ใช้ Next.js App Router ตามโครงสร้างโครงการ
2. เชื่อม Supabase ผ่าน environment variables เท่านั้น
3. ห้าม commit `.env.local` หรือ secret key
4. ใช้ Supabase schema กลาง ไม่สร้างตารางซ้ำโดยไม่คุยกับทีม
5. ทุกการเปลี่ยน Database ต้องมี migration
6. ทดสอบกับ Development/Test environment ก่อน Production
7. UI ต้องตรวจสิทธิ์ แต่การรักษาความปลอดภัยต้องบังคับด้วย RLS/Authorization ที่ backend/database
8. ใช้ชื่อ field/table ตาม schema กลาง
9. ก่อน Merge ต้องทดสอบ build และ flow ของ module ตัวเอง
10. ห้ามแก้ไฟล์ของ module คนอื่นโดยไม่แจ้งทีม

## Definition of Done

งานของสมาชิกถือว่าเสร็จเมื่อ:

- [ ] UI ใช้งานได้
- [ ] เชื่อม Supabase ได้
- [ ] CRUD/flow หลักทำงานจริง
- [ ] RLS/สิทธิ์ถูกต้อง
- [ ] Error state และ loading state มี
- [ ] ทดสอบกับข้อมูล test แล้ว
- [ ] ไม่มี secret อยู่ใน Git
- [ ] ผ่าน `npm run build`
- [ ] อธิบายวิธีทดสอบไว้ใน PR
