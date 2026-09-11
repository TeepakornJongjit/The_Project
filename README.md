# Campus Scholarship Portal — เทมเพลต UI กลาง

ใช้ `pakornbu-lang/coe-next` เป็น repository หลัก และพัฒนาต่อบนโครง Next.js App Router + TypeScript + Tailwind CSS เดิมของทีม

## เปิดโปรเจกต์

เปิดโฟลเดอร์ `coe-next` ที่มี `package.json` และ `.git` อยู่ภายใน ก่อนรันคำสั่ง Git หรือ npm หากอยู่ในโฟลเดอร์ `pro331` ให้รัน `cd coe-next` ก่อน

```bash
npm ci
npm run dev
```

เปิด http://localhost:3000 (หากพอร์ตไม่ว่าง ให้ดูพอร์ตที่ Terminal แสดง) บน Windows PowerShell สามารถใช้ `npm.cmd` แทน `npm` ได้

## หน้าตัวอย่าง

| URL | หน้าที่ |
| --- | --- |
| `/` | แดชบอร์ด พร้อมสถิติจำลองและทางลัด |
| `/scholarships/new` | ฟอร์มสร้างทุนและแสดงตัวอย่างประกาศ |
| `/menu` | เมนูหน้าที่ใช้งานได้และส่วนงานที่จะพัฒนาต่อ |
| `/about` | ข้อมูลระบบและขอบเขตหน้าตัวอย่าง |

ฟอร์มตรวจช่องบังคับ จำนวนเงินมากกว่า 0 และโควตาจำนวนเต็มตั้งแต่ 1 ขึ้นไป การกดดูตัวอย่างยังไม่บันทึกลงฐานข้อมูล ข้อมูลในฟอร์มจะหายเมื่อรีเฟรชหรือออกจากหน้า แดชบอร์ดไม่อัปเดตตามฟอร์มเพราะยังเป็นข้อมูลจำลอง

## โครงสร้างส่วนกลาง

```text
app/
  layout.tsx                 # ครอบทุกหน้าด้วย AppLayout เพียงครั้งเดียว
  globals.css                # สี ฟอนต์ ระยะห่าง และคลาส portal-* ที่ใช้ร่วมกัน
  page.tsx                   # แดชบอร์ด
  scholarships/new/page.tsx  # หน้าฟอร์มสร้างทุน
  menu/page.tsx
  about/page.tsx
layouts/AppLayout.tsx        # Header, Navbar, main และ footer
components/
  Navbar.tsx                 # Link และสถานะเมนูตาม URL ปัจจุบัน
  ui/                        # Card, Button และ PageHeader
  scholarships/ScholarshipForm.tsx
lib/
  navigation.ts              # รายการเมนูส่วนกลาง
  demo-data.ts               # ข้อมูลแดชบอร์ดจำลอง
```

## เพิ่มหน้าของสมาชิกในทีม

สร้าง `app/<ชื่อโมดูล>/page.tsx` โดยไม่ต้องครอบ AppLayout ซ้ำ เช่น:

```tsx
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";

export default function ApplicationsPage() {
  return (
    <div className="portal-page-stack">
      <PageHeader title="ใบสมัครทุน" description="จัดการและติดตามใบสมัครทุนการศึกษา" />
      <Card>เนื้อหาของโมดูล</Card>
    </div>
  );
}
```

- เพิ่มเมนูที่ `lib/navigation.ts` เมื่อหน้าเป้าหมายมีอยู่จริง
- ใช้ `next/link` สำหรับเปลี่ยนหน้า และ `Button` สำหรับการกระทำในหน้า
- หน้าที่ใช้ state หรือ event handlers ให้แยกเป็น Client Component และใส่ `"use client"` เฉพาะส่วนที่ต้องโต้ตอบ
- ใช้ CSS variables ใน `app/globals.css` ร่วมกับ Tailwind หรือ CSS Modules ของแต่ละโมดูล ชื่อ `portal-*` สงวนให้ส่วนกลาง
- ฟิลด์ใช้ `portal-field` และต้องมี label ที่เชื่อมกับ id ของ input
- ป้ายบทบาทใน header เป็นข้อความตัวอย่าง ยังไม่ใช่ระบบตรวจสิทธิ์
- ยังไม่รวม API, Auth, ฐานข้อมูล หรือการบันทึกไฟล์จริง ให้เชื่อมภายหลังตามโมดูล
- อ่าน `AGENTS.md` และเอกสาร Next.js ที่ติดตั้งใน `node_modules/next/dist/docs/` ก่อนพัฒนา

## ตรวจงานก่อนส่ง

```bash
npm run lint
npm run build
```

ทดลองเปิดทุก URL โดยตรงและรีเฟรช ตรวจ active menu กับปุ่มย้อนกลับของเบราว์เซอร์ ทดสอบฟอร์มว่าง จำนวนเงินติดลบ โควตาทศนิยม ข้อมูลถูกต้อง และปุ่มล้างข้อมูล รวมถึงหน้าจอมือถือและการใช้คีย์บอร์ด

## การจัดการ branch

- `main` เป็น branch หลักสำหรับงานที่รวมแล้ว
- สร้าง branch งานใหม่จาก `main` โดยใช้ `feature/<ชื่องาน>`, `fix/<ชื่อปัญหา>` หรือ `chore/<ชื่องาน>`
- ส่งงานผ่าน Pull Request เข้า `main` และลบ branch งานหลังรวมสำเร็จ
- ตรวจ `git status` ก่อนสลับ branch เพื่อไม่ให้มีงานค้างปะปน

สำหรับ checkout นี้ `origin` คือ `https://github.com/pakornbu-lang/coe-next.git` ตรวจ remote ของเครื่องตนเองด้วย `git remote -v` ก่อนส่งงาน

ตัวอย่างเริ่มงานใหม่เมื่อไม่มีงานค้าง:

```bash
git switch main
git pull --ff-only origin main
git switch -c feature/your-task
```

เมื่อทำงานและ commit เรียบร้อย ให้ส่ง branch ของตนเองแล้วเปิด Pull Request:

```bash
git push -u origin feature/your-task
```

หากทำงานผ่าน fork ให้ตั้ง `origin` เป็น fork ของตนเอง และเพิ่ม `upstream` ที่ชี้ไปยัง repository หลักก่อนซิงก์งาน
