---
name: sync-develop
description: Fetch the latest Developlop branch and safely sync or merge it into the current feature branch. Use when the user asks to sync Developlop, update the branch, fetch Developlop, merge Developlop, or bring recent development changes into the current branch.
---

# Sync Developlop

ใช้สำหรับซิงค์อัปเดตล่าสุดจาก `origin/Developlop` เข้าสู่ feature branch ปัจจุบันอย่างปลอดภัย

## กฎสำคัญ

1. ตรวจ `git status` ก่อนเสมอ ห้าม overwrite หรือ discard งานที่ยังไม่ commit
2. ห้าม sync ขณะอยู่บน `main` หรือ `Developlop` ให้ทำบน feature branch เท่านั้น
3. หาก working tree ไม่สะอาด ให้หยุดและแจ้งผู้ใช้ให้ commit หรือ stash ก่อน
4. หากเกิด merge conflict ให้หยุดทันที ห้ามเลือกทับโค้ดหรือลบงานของผู้อื่นเอง และรายงานไฟล์ที่ conflict
5. หลัง merge สำเร็จ ให้รัน quality gates ที่มีในโปรเจกต์
6. ห้าม push โดยอัตโนมัติ เว้นแต่ผู้ใช้สั่งชัดเจน

## Workflow

### 1. ตรวจ branch และ working tree

รัน:

```bash
git status --short --branch
git branch --show-current
```

ถ้ามี modified, staged หรือ untracked files ให้หยุดก่อน sync และรายงานรายการไฟล์ให้ผู้ใช้ทราบ

### 2. Fetch Developlop ล่าสุด

รัน:

```bash
git fetch origin Developlop
git log -n 1 --oneline origin/Developlop
```

### 3. ตรวจความแตกต่าง

รัน:

```bash
git log -n 3 --oneline HEAD
git log HEAD..origin/Developlop --oneline
git rev-list --left-right --count origin/Developlop...HEAD
```

ถ้าไม่มี commit ใหม่จาก `origin/Developlop` ให้รายงานว่า branch เป็นปัจจุบันและไม่ต้อง merge

### 4. Merge

ถ้า working tree สะอาดและมี commit ใหม่ ให้รัน:

```bash
git merge origin/Developlop
```

ถ้าเกิด conflict:

```bash
git status
```

หยุดทันที รายงานไฟล์ที่ conflict และรอให้ผู้ใช้หรือเจ้าของโมดูลตัดสินใจแก้ไข

### 5. Quality gates

หลัง merge สำเร็จ ให้ตรวจคำสั่งที่มีอยู่ใน `package.json` แล้วรันอย่างน้อย:

```bash
npx --no-install tsc --noEmit
npm test
```

ถ้าไม่มี script `test` หรือคำสั่งใดใช้ไม่ได้ ให้รายงานตามจริง ห้ามสรุปว่าผ่านโดยไม่มีผลตรวจ

### 6. สรุปผล

รายงานสั้น ๆ:

- branch ปัจจุบัน
- commit ล่าสุดของ `origin/Developlop` ที่ถูกนำเข้า
- ผล typecheck และ test
- สถานะ conflict

ถามผู้ใช้ก่อน push ด้วย:

```bash
git push origin <current-branch>
```
