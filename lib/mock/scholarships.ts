export const scholarships = [
  { scholarship_id: "sch-001", title: "ทุนเรียนดี", provider_name: "มหาวิทยาลัย", description: "ทุนสำหรับนักศึกษาที่มีผลการเรียนดี", amount: 15000, quota: 10, category: "เรียนดี", status: "open" },
  { scholarship_id: "sch-002", title: "ทุนขาดแคลน", provider_name: "กองทุนการศึกษา", description: "ทุนสำหรับนักศึกษาที่มีความจำเป็นด้านค่าใช้จ่าย", amount: 20000, quota: 15, category: "ขาดแคลน", status: "open" },
  { scholarship_id: "sch-003", title: "ทุนสนับสนุนการศึกษา", provider_name: "ผู้สนับสนุนภายนอก", description: "ทุนสนับสนุนค่าใช้จ่ายทางการศึกษา", amount: 10000, quota: 20, category: "ทั่วไป", status: "published" },
] as const;
