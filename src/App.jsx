import { useState } from "react";
import AppLayout from "./layouts/AppLayout";
import CreateScholarship from "./pages/CreateScholarship";
import "./styles/global.css";

const statistics = [
  { label: "ทุนที่เปิดรับ", value: 12, unit: "ทุน" },
  { label: "ใบสมัครทั้งหมด", value: 243, unit: "รายการ" },
  { label: "รอตรวจเอกสาร", value: 28, unit: "รายการ" },
  { label: "รอจ่ายทุน", value: 47, unit: "รายการ" },
];

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <AppLayout
      activePage={activePage}
      onNavigate={setActivePage}
    >
      {activePage === "dashboard" ? (
        <>
          <section className="welcome-banner">
            <h1>ระบบจัดการทุนการศึกษา</h1>
            <p>
              ร่วมดูแลและสนับสนุนนักศึกษา
              ให้เข้าถึงโอกาสทางการศึกษา
            </p>
          </section>

          <p>
            ข้อมูลด้านล่างเป็นข้อมูลตัวอย่างสำหรับออกแบบหน้าจอ
          </p>

          <section
            className="stats-grid"
            aria-label="สถิติทุนการศึกษา"
          >
            {statistics.map((item) => (
              <article className="card" key={item.label}>
                <span>{item.label}</span>
                <strong className="stat-value">
                  {item.value}
                </strong>
                <span>{item.unit}</span>
              </article>
            ))}
          </section>

          <section className="card">
            <h2>จัดการประกาศทุน</h2>
            <p>
              เพิ่มรายละเอียดทุน จำนวนเงิน โควตา
              และวันสิ้นสุดการรับสมัคร
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                setActivePage("create-scholarship")
              }
            >
              สร้างทุนการศึกษา
            </button>
          </section>
        </>
      ) : (
        <CreateScholarship />
      )}
    </AppLayout>
  );
}