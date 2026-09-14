# System Requirements — ระบบติดตามทุนการศึกษา

## 1. Functional Requirements

### FR-01 Authentication & Registration
- Visitor สามารถสมัครสมาชิกได้
- ระบบต้องสร้าง profile สำหรับผู้ใช้ใหม่
- Student สามารถเข้าสู่ระบบ ออกจากระบบ และรีเซ็ตรหัสผ่าน

### FR-02 Scholarship Discovery
- Visitor/Student สามารถดูทุนที่เผยแพร่แล้ว
- สามารถค้นหาและกรองทุนได้
- ระบบต้องแสดงเงื่อนไขและเอกสารที่ต้องใช้ของทุน

### FR-03 Application
- Student สามารถสร้างใบสมัครแบบร่าง
- Student สามารถแนบเอกสาร
- Student สามารถส่งใบสมัคร
- ระบบต้องป้องกันการสมัครทุนเดียวกันซ้ำตามกติกาของระบบ

### FR-04 Application Review
- Officer ตรวจสอบคุณสมบัติและเอกสารได้
- Officer ขอเอกสาร/แก้ไขใหม่ได้
- ระบบต้องเก็บประวัติการเปลี่ยนสถานะ

### FR-05 Committee Evaluation
- Officer มอบหมายกรรมการให้ใบสมัครได้
- Committee เห็นเฉพาะใบสมัครที่ได้รับมอบหมายตามสิทธิ์
- Committee บันทึกคะแนน/ความคิดเห็นได้
- Committee ดูผลประกาศของใบสมัครที่ตนเองประเมินได้

### FR-06 Result & Payment
- Officer บันทึกและประกาศผลได้
- Accounting Staff บันทึกการโอนเงินได้
- ระบบต้องเก็บเลขอ้างอิงและสถานะการโอน

### FR-07 Follow-up
- ระบบต้องรองรับการติดตามผู้ได้รับทุน
- สามารถกำหนดงานติดตาม กำหนดวันครบกำหนด และสถานะได้

### FR-08 Notification
- ระบบต้องสร้าง notification ให้ผู้เกี่ยวข้อง
- รองรับการส่งต่อไปยัง Email Service

### FR-09 Administration
- Admin จัดการผู้ใช้ บทบาท และสิทธิ์ได้
- ระบบต้องเก็บ Audit Log สำหรับเหตุการณ์สำคัญ

## 2. Non-Functional Requirements

- **Security:** ตารางที่มีข้อมูลผู้ใช้/ใบสมัครต้องใช้ RLS และ policy ตามบทบาท
- **Authorization:** ห้ามใช้เพียงการซ่อนเมนูฝั่ง UI เพื่อป้องกันสิทธิ์ ต้องบังคับที่ฐานข้อมูล/API ด้วย
- **Traceability:** การเปลี่ยนสถานะ การตรวจเอกสาร การประเมิน และการจ่ายเงินต้องตรวจสอบย้อนหลังได้
- **Data Integrity:** Foreign Key, unique constraint และ check constraint ต้องรักษาความถูกต้องของข้อมูล
- **Testability:** Development/Test environment ต้องแยกจาก Production ก่อนทีมทดสอบจริง
- **Maintainability:** การเปลี่ยน schema ต้องทำผ่าน migration ที่ version control ได้

## 3. Database Requirements

ระบบใหม่ใช้ตารางหลักตาม `12_er_diagram_updated.md` และต้องไม่ให้ application ใหม่เรียกใช้ legacy tables โดยตรง

### Legacy Data
ข้อมูลเดิมถูกเก็บใน `legacy_archive` เพื่อเปรียบเทียบ:

- `legacy_archive.scholarship_20260914`
- `legacy_archive.criterion_20260914`
- `legacy_archive.sponsor_20260914`

ข้อมูลทุนเดิม 8 รายการถูก migrate เข้า `public.scholarships` โดยคง `scholarship_id` เดิมไว้เพื่อ trace กลับไปยังข้อมูลเก่า

## 4. Environment Policy

```text
Production Supabase
  = ข้อมูลจริง
  = ห้ามใช้เป็นพื้นที่ทดลอง

Development/Test Supabase
  = ข้อมูลทดสอบ
  = ใช้สำหรับพัฒนาและทดสอบ

เมื่อผ่านการทดสอบ
  Development Migration
        ↓
  Review
        ↓
  Production Migration
```

> ปัจจุบันยังไม่ได้สร้าง Supabase Development Branch เนื่องจากยังไม่ได้ยืนยันค่าใช้จ่ายของ Branch
