// ข้อมูลจำลองสำหรับเทมเพลต UI เท่านั้น เปลี่ยนเป็นข้อมูลจาก API เมื่อพัฒนาระบบจริง
export const dashboardStatistics = [
  { label: "ทุนที่เปิดรับ", value: 12, unit: "ทุน" },
  { label: "ใบสมัครทั้งหมด", value: 243, unit: "รายการ" },
  { label: "รอตรวจเอกสาร", value: 28, unit: "รายการ" },
  { label: "รอจ่ายทุน", value: 47, unit: "รายการ" },
] as const;
