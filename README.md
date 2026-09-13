# ระบบติดตามทุนการศึกษา (Scholarship Tracking System)

Project วิชา COE67-331

## Project Foundation

โปรเจกต์นี้ใช้ **Next.js App Router + TypeScript + Supabase** เพื่อให้สมาชิกทุกคนสามารถเริ่มพัฒนาต่อจากโครงสร้างเดียวกันได้

### Branch

Foundation branch: `setup/project-foundation`

Pull Request: `setup/project-foundation` → `Developlop`

## Getting Started

1. Clone repository และ checkout branch ที่ต้องการทำงาน

```bash
git checkout setup/project-foundation
```

2. ติดตั้ง dependencies

```bash
npm install
```

> โปรเจกต์ไม่มี `package-lock.json` ที่สร้างจาก Vite แล้ว หลัง checkout ให้ `npm install` เพื่อสร้าง lockfile ใหม่ตาม `package.json`

3. สร้างไฟล์ environment

```bash
copy .env.example .env.local
```

บน macOS/Linux ใช้:

```bash
cp .env.example .env.local
```

4. ใส่ค่า Supabase ใน `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://arhbvuslpfdxkfshedkc.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

ห้าม commit `.env.local` และห้ามใส่ service-role/secret key ใน frontend

5. รันโปรเจกต์

```bash
npm run dev
```

แล้วเปิด `http://localhost:3000`

## Project Structure

```text
app/
├── globals.css
├── layout.tsx
└── page.tsx

lib/
└── supabase/
    └── client.ts

supabase/
├── README.md
└── migrations/
    └── 20260913_final_scholarship_schema.sql

docs/
└── project documentation
```

## Supabase

ไฟล์ migration สำหรับ schema หลักอยู่ที่:

`supabase/migrations/20260913_final_scholarship_schema.sql`

ให้ใช้ migration นี้กับ Supabase project ของระบบก่อนเริ่มพัฒนาฟีเจอร์ที่ต้องอ่าน/เขียนข้อมูล

## Development Rules

- ทำงานใน branch ของตัวเอง อย่า commit ตรงเข้า `Developlop` หรือ `main`
- Pull Request ให้ merge เข้า `Developlop` ก่อน
- อย่า commit `.env.local`
- ใช้ Supabase publishable key สำหรับ client-side เท่านั้น
- ห้ามนำ service-role key หรือ secret key ไปไว้ในโค้ด frontend
- ก่อนส่ง PR ให้รัน `npm run build` และแก้ error ให้เรียบร้อย
