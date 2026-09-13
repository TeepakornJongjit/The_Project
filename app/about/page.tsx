import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "เกี่ยวกับระบบ" };

export default function AboutPage() {
  return (
    <div className="portal-page-stack">
      <PageHeader title="เกี่ยวกับระบบ" description="ร่วมดูแลทุนการศึกษา ตั้งแต่การสมัครจนถึงการติดตามผล" />
      <Card className="portal-prose">
        <h2>ระบบติดตามทุนการศึกษา</h2>
        <p>ระบบจัดการและติดตามทุนการศึกษาภายในมหาวิทยาลัย เพื่อให้นักศึกษา เจ้าหน้าที่ คณะกรรมการ และผู้ดูแลระบบทำงานร่วมกันได้อย่างเป็นขั้นตอน</p>
        <h2>สิ่งที่ทดลองได้ในขณะนี้</h2>
        <ul>
          <li>ดูแดชบอร์ดพร้อมสถิติตัวอย่าง</li>
          <li>กรอกข้อมูลทุนและดูตัวอย่างประกาศ</li>
          <li>เปิดเมนูและใช้งานหน้าจอบนคอมพิวเตอร์หรือโทรศัพท์</li>
        </ul>
        <p className="portal-demo-note">หน้าจอชุดนี้ใช้ข้อมูลจำลอง ยังไม่มีการเข้าสู่ระบบ บันทึกใบสมัคร หรือจ่ายเงินจริง</p>
      </Card>
    </div>
  );
}
