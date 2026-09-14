export const notifications = [
  { notification_id: "noti-001", user_id: "user-001", title: "สถานะใบสมัครเปลี่ยนแปลง", message: "ใบสมัครทุนเรียนดีอยู่ระหว่างตรวจสอบ", type: "application_status", is_read: false },
  { notification_id: "noti-002", user_id: "user-002", title: "กรุณาส่งเอกสารใหม่", message: "เอกสารรับรองรายได้ต้องแก้ไขและส่งใหม่", type: "document_revision", is_read: false },
  { notification_id: "noti-003", user_id: "user-001", title: "ประกาศผลทุน", message: "ผลการสมัครทุนสนับสนุนการศึกษาประกาศแล้ว", type: "result", is_read: true },
] as const;
