"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Brand, Icon } from "./Shared";
export default function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const auth = path === "/login" || path === "/register",
    landing = path === "/",
    staff = path.startsWith("/staff");
  const nav = landing
    ? [
        ["/", "หน้าแรก", "home"],
        ["/scholarships", "ทุนการศึกษา", "cap"],
        ["/#steps", "ขั้นตอนการสมัคร", "file"],
        ["/#news", "ประกาศ", "bell"],
        ["/#faq", "คำถามที่พบบ่อย", "file"],
        ["/#contact", "ติดต่อ", "mail"],
      ]
    : staff
      ? [
          ["/staff", "แดชบอร์ด", "home"],
          ["/staff/scholarships", "ทุนการศึกษา", "cap"],
          ["/staff/review", "ตรวจเอกสาร", "check"],
          ["/staff/evaluation", "พิจารณาทุน", "people"],
          ["/staff/scholarships#results", "ประกาศผล / จ่ายทุน", "chart"],
        ]
      : [
          ["/dashboard", "แดชบอร์ด", "home"],
          ["/scholarships", "ทุนการศึกษา", "cap"],
          ["/apply", "สมัครทุน", "edit"],
          ["/applications", "ใบสมัครของฉัน", "file"],
          ["/profile#documents", "เอกสาร", "folder"],
          ["/profile", "โปรไฟล์", "user"],
        ];
  if (auth) return <>{children}</>;
  return (
    <div className="ui-app">
      <a className="skip" href="#main-content">
        ข้ามไปเนื้อหาหลัก
      </a>
      <header className="topbar">
        <Brand />
        <button
          className="menu-toggle btn secondary"
          aria-label="เปิดหรือปิดเมนู"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
        <nav className={open ? "open" : ""} aria-label="เมนูหลัก">
          {nav.map(([url, label, icon]) => (
            <Link
              key={url}
              href={url}
              onClick={() => setOpen(false)}
              className={
                path === url ||
                (url === "/scholarships" && path.startsWith("/scholarships/"))
                  ? "active"
                  : ""
              }
              aria-current={path === url ? "page" : undefined}
            >
              {!landing && <Icon name={icon} size={20} />}
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        {landing ? (
          <div className="header-actions">
            <Link className="btn secondary" href="/register">
              ลงทะเบียนนักศึกษา
            </Link>
            <Link className="btn" href="/login">
              เข้าสู่ระบบ
            </Link>
          </div>
        ) : (
          <div className="account">
            <details>
              <summary>
                <Icon name="bell" />
                <span className="notification-dot" />
              </summary>
              <div className="popover">
                <strong>การแจ้งเตือน</strong>
                <p>เอกสารของคุณได้รับการตรวจสอบแล้ว</p>
                <Link href={staff ? "/staff/review" : "/applications"}>
                  ดูสถานะใบสมัคร →
                </Link>
              </div>
            </details>
            <details>
              <summary>
                <span className="avatar" />
                <span>
                  <strong>
                    {staff ? "น.ส.กมลวรรณ ใจดี" : "น.ส.ณัฐธิดา ใจดี"}
                  </strong>
                  <small>
                    {staff
                      ? "เจ้าหน้าที่ทุนการศึกษา"
                      : "รหัสนักศึกษา 661234567"}
                  </small>
                </span>
                <span>⌄</span>
              </summary>
              <div className="popover">
                <Link href="/profile">โปรไฟล์และเอกสาร</Link>
                <Link href="/menu">ดูหน้าจอทั้งหมด</Link>
                <Link href={staff ? "/dashboard" : "/staff"}>
                  ดูหน้าตัวอย่าง{staff ? "นักศึกษา" : "เจ้าหน้าที่"}
                </Link>
                <Link href="/">กลับหน้าแรก</Link>
              </div>
            </details>
          </div>
        )}
      </header>
      <main id="main-content" className={landing ? "landing" : "workspace"}>
        {children}
      </main>
      <footer className="site-footer">
        <span>Campus Scholarship Portal · ระบบทุนการศึกษาภายในมหาวิทยาลัย</span>
        <Link href="/menu">ดูตัวอย่างทั้ง 13 หน้า</Link>
        <small>ข้อมูลตัวอย่าง · ยังไม่เชื่อมต่อระบบจริง</small>
      </footer>
    </div>
  );
}
