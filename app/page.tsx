import Link from "next/link";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { dashboardStatistics } from "@/lib/demo-data";

export default function Home() {
  return (
    <div className="portal-page-stack">
      <PageHeader
        eyebrow="CAMPUS SCHOLARSHIP PORTAL"
        title="ระบบจัดการทุนการศึกษา"
        description="ร่วมดูแลและสนับสนุนนักศึกษา ให้เข้าถึงโอกาสทางการศึกษา"
      />
      <p className="portal-demo-note">
        <span className="portal-badge">ข้อมูลตัวอย่าง</span>
        ข้อมูลด้านล่างใช้สำหรับออกแบบหน้าจอ ยังไม่ได้เชื่อมต่อข้อมูลจริง
      </p>
      <section className="portal-stats-grid" aria-label="สถิติทุนการศึกษา">
        {dashboardStatistics.map((item) => (
          <Card className="portal-stat-card" key={item.label}>
            <h2>{item.label}</h2>
            <strong className="portal-stat-value">{item.value}</strong>
            <span>{item.unit}</span>
          </Card>
        ))}
      </section>
      <section className="portal-grid-two" aria-label="ทางลัดการทำงาน">
        <Card className="portal-action-card">
          <span className="portal-eyebrow">ประกาศทุน</span>
          <h2>จัดการประกาศทุน</h2>
          <p>เพิ่มรายละเอียดทุน จำนวนเงิน โควตา และวันสิ้นสุดการรับสมัคร</p>
          <Link className="portal-button portal-button-primary" href="/scholarships/new">
            สร้างทุนการศึกษา <span aria-hidden="true">→</span>
          </Link>
        </Card>
        <Card className="portal-action-card">
          <span className="portal-eyebrow">ภาพรวมระบบ</span>
          <h2>ส่วนงานทุนการศึกษา</h2>
          <p>ดูส่วนงานตั้งแต่การสมัคร ตรวจเอกสาร พิจารณาผล ไปจนถึงการติดตามทุน</p>
          <Link className="portal-button portal-button-secondary" href="/menu">
            ดูเมนูระบบ <span aria-hidden="true">→</span>
          </Link>
        </Card>
      </section>
    </div>
  );
}
