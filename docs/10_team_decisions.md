# 10 — Team Decisions

## 1. Purpose

เอกสารนี้ใช้บันทึกข้อตกลงสำคัญของทีมสำหรับโครงการระบบติดตามทุนการศึกษา เพื่อให้สมาชิกทุกคนทำงานบนขอบเขตและแนวทางเดียวกัน

## 2. Team Members

| # | ชื่อ | รหัสนักศึกษา | Email |
|---|---|---|---|
| 1 | กิตยาภา วารี | 67112268 | kkpio.iuray@gmail.com |
| 2 | อัฑฒพร ให้เจริญสุข | 67124834 | moooomfilm@gmail.com |
| 3 | ธีปกรณ์ จงจิตต์ | 67124875 | teepakorn.jong@gmail.com.wu.ac.th |
| 4 | กฤษณะ ภิรมย์ | 67109116 | woqwri@gmail.com |
| 5 | ปกรณ์ บุญคงมาก | 67110577 | boonkoingmak@gmail.com |
| 6 | อชิระ กาลสุวรรณ์ | 67111823 | ddphone8149@gmail.com |

## 3. Confirmed Decisions

| ID | Decision | รายละเอียด | Status |
|---|---|---|---|
| TD-01 | Project scope | ระบบติดตามทุนการศึกษา ครอบคลุมตั้งแต่ประกาศทุน การสมัคร การตรวจสอบ การพิจารณา การประกาศผล และการติดตามผู้ได้รับทุน | Confirmed |
| TD-02 | Documentation first | ช่วงปัจจุบันเน้นการกำหนด requirement, scope, module และแผนการพัฒนา ยังไม่เริ่มลงรายละเอียด implementation | Confirmed |
| TD-03 | Module structure | ระบบแบ่งเป็น M01–M06 ตามขอบเขตงานหลักของระบบ | Confirmed |
| TD-04 | Team size | ทีมมีสมาชิก 6 คน และแบ่ง Module หลักคนละ 1 Module | Confirmed |
| TD-05 | Module ownership | กำหนดผู้รับผิดชอบตามลำดับสมาชิก 1–6 ให้ตรงกับ M01–M06 | Confirmed |

## 4. Team Allocation

| สมาชิก | Module | Status |
|---|---|---|
| กิตยาภา วารี | M01 — User & Student Management | Confirmed |
| อัฑฒพร ให้เจริญสุข | M02 — Scholarship Management | Confirmed |
| ธีปกรณ์ จงจิตต์ | M03 — Application & Document Management | Confirmed |
| กฤษณะ ภิรมย์ | M04 — Scholarship Review & Evaluation | Confirmed |
| ปกรณ์ บุญคงมาก | M05 — Award & Follow-up Management | Confirmed |
| อชิระ กาลสุวรรณ์ | M06 — Dashboard, Report & Notification | Confirmed |

## 5. Working Rules

1. เจ้าของ Module ต้องเข้าใจ requirement และขอบเขตของ Module ที่ตนรับผิดชอบ
2. งานที่เชื่อมโยงหลาย Module ต้องสื่อสารและตกลงข้อมูลร่วมกันก่อนพัฒนา
3. การเปลี่ยนแปลง scope หรือกติกาหลักของระบบควรบันทึกไว้ในเอกสารนี้
4. รายละเอียด Technology, Database, Architecture และ Interface จะกำหนดในขั้น System Design
5. การแบ่ง Module ไม่ได้หมายความว่าแต่ละ Module ทำงานแยกขาดจากกัน แต่ต้องรองรับกระบวนการหลักร่วมกัน

## 6. Decisions Pending

รายการที่ยังต้องตัดสินใจในระยะถัดไป:
- Technology / Framework
- Database
- Architecture
- Interface / API
- Integration strategy
- Deployment / Infrastructure

## 7. Change Log

| วันที่ | รายการ | เหตุผล | ผู้ดำเนินการ |
|---|---|---|---|
| 2026-09-07 | เพิ่มข้อมูลสมาชิกทีมทั้ง 6 คนลงในเอกสารโครงการ | ใช้เป็นข้อมูลประกอบการแบ่ง Module และเชื่อมโยงการทำงานบน GitHub | Team |
| 2026-09-07 | กำหนดผู้รับผิดชอบ Module ตามลำดับสมาชิก 1–6 | สมาชิกยืนยันให้การแบ่งงานเป็นไปตามลำดับรายชื่อ โดยสมาชิก 1 รับ M01 และไล่ตามลำดับถึงสมาชิก 6 รับ M06 | Team |
