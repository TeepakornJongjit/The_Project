import type { Metadata } from "next";
import Link from "next/link";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { navigation } from "@/lib/navigation";

export const metadata: Metadata = { title: "เมนูระบบ" };

const upcomingModules = [
  "บัญชีผู้ใช้และสิทธิ์การใช้งาน",
  "ข้อมูลนักศึกษาและใบสมัครทุน",
  "เอกสารและการตรวจสอบ",
  "การพิจารณาและประกาศผล",
  "การแจ้งเตือนและติดตามการจ่ายทุน",
];

export default function MenuPage() {
  return (
    <div className="portal-page-stack">
      <PageHeader title="เมนูระบบ" description="เข้าถึงส่วนงานต่าง ๆ ของระบบทุนการศึกษา" />
      <section className="portal-grid-two" aria-label="หน้าที่เปิดใช้งานได้">
        {navigation.filter((item) => item.href !== "/menu").map((item) => (
          <Card className="portal-action-card" key={item.href}>
            <h2>{item.label}</h2>
            <p>{item.description}</p>
            <Link className="portal-button portal-button-secondary" href={item.href}>เปิดหน้า <span aria-hidden="true">→</span></Link>
          </Card>
        ))}
      </section>
      <Card>
        <h2>ส่วนงานที่จะพัฒนาต่อ</h2>
        <p>ส่วนงานต่อไปนี้ยังไม่เปิดใช้งานในหน้าตัวอย่าง</p>
        <ul className="portal-module-list">
          {upcomingModules.map((name) => <li key={name}><span>{name}</span><span className="portal-badge portal-badge-muted">ยังไม่เปิดใช้งาน</span></li>)}
        </ul>
      </Card>
    </div>
  );
}
