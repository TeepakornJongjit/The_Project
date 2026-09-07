# Data and ER
## ระบบติดตามทุนการศึกษา

เอกสารนี้อธิบายข้อมูลหลักของระบบในระดับแนวคิด (Conceptual Level) ยังไม่ใช่การออกแบบฐานข้อมูลจริง

## 1. Student
- Student ID
- Name
- Faculty
- Department
- Program
- Year
- Contact Information

## 2. User
- User ID
- Username
- Account Status
- Role

## 3. Scholarship
- Scholarship ID
- Scholarship Name
- Description
- Scholarship Type
- Amount
- Number of Awards
- Application Period
- Status

## 4. Scholarship Criteria
- Criteria ID
- Scholarship ID
- Academic Requirements
- Eligibility Requirements
- Required Conditions

## 5. Application
- Application ID
- Student ID
- Scholarship ID
- Application Date
- Status

## 6. Application Document
- Document ID
- Application ID
- Document Type
- Document Status

## 7. Evaluation
- Evaluation ID
- Application ID
- Evaluator
- Score
- Comment
- Evaluation Status

## 8. Award
- Award ID
- Student ID
- Scholarship ID
- Award Status
- Award Date

## 9. Follow-up
- Follow-up ID
- Award ID
- Follow-up Date
- Follow-up Status
- Result
- Remark

## 10. Notification
- Notification ID
- User ID
- Notification Type
- Message
- Status
- Created Date

## 11. Conceptual Relationship
```text
User
 │
 └── Student
       │
       ├── Application ───── Scholarship
       │       │                  │
       │       ├── Documents      └── Criteria
       │       │
       │       └── Evaluation
       │
       └── Award
              │
              └── Follow-up
```

ความสัมพันธ์ข้างต้นใช้สำหรับอธิบายโครงสร้างข้อมูลในระดับแนวคิดเท่านั้น ยังไม่กำหนด Table, Column Type, Primary Key, Foreign Key หรือ Database Technology
