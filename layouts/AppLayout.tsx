import Link from "next/link";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="portal-shell">
      <a className="portal-skip-link" href="#main-content">ข้ามไปเนื้อหาหลัก</a>
      <header className="portal-header">
        <div className="portal-header-content">
          <Link className="portal-brand" href="/" aria-label="Campus Scholarship Portal — หน้าแรก">
            <span className="portal-brand-mark" aria-hidden="true">ทุน</span>
            <span>
              <strong>Campus Scholarship Portal</strong>
              <small>ระบบทุนการศึกษาภายในมหาวิทยาลัย</small>
            </span>
          </Link>
          <Navbar />
          <span className="portal-account-label">เจ้าหน้าที่ · หน้าตัวอย่าง</span>
        </div>
      </header>
      <main id="main-content" className="portal-page-container" tabIndex={-1}>
        {children}
      </main>
      <footer className="portal-footer">
        <span>Campus Scholarship Portal</span>
        <span>ร่วมสร้างโอกาสทางการศึกษา</span>
      </footer>
    </div>
  );
}
