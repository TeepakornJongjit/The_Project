import Link from "next/link";
import { requireRole } from "@/lib/auth/server";

export const metadata = { title: "พื้นที่กรรมการ" };
export default async function CommitteePage() {
  const viewer = await requireRole(["committee"]);
  return (
    <section className="panel">
      <h1>พื้นที่กรรมการพิจารณาทุน</h1>
      <p>ยินดีต้อนรับ {viewer.fullName}</p>
      <p>เข้าสู่ระบบด้วยบทบาทกรรมการเรียบร้อยแล้ว ขณะนี้แบบประเมินยังใช้ข้อมูลตัวอย่าง ผลที่ทดลองกรอกยังไม่ถูกบันทึกลงฐานข้อมูล</p>
      <Link className="btn" href="/staff/evaluation">เปิดแบบประเมินตัวอย่าง</Link>
    </section>
  );
}
