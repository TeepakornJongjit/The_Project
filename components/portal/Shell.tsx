"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  Brand,
  Icon,
} from "./Shared";

type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  studentId: string;
  role: string;
};

export default function Shell({
  children,
}: {
  children: ReactNode;
}) {
  const path = usePathname();

  const [open, setOpen] =
    useState(false);

  const [loggingOut, setLoggingOut] =
    useState(false);

  const [sessionUser, setSessionUser] =
    useState<SessionUser | null>(null);

  const auth =
    path === "/login" ||
    path === "/register";

  const landing =
    path === "/";

  const staff =
    path.startsWith("/staff");

  /*
   * อ่าน Session จริง
   */
  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const response = await fetch(
          "/api/auth/me",
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          if (!cancelled) {
            setSessionUser(null);
          }

          return;
        }

        const data =
          await response.json();

        if (
          !cancelled &&
          data.authenticated &&
          data.user
        ) {
          setSessionUser(
            data.user,
          );
        }
      } catch (error) {
        console.error(
          "SESSION_ERROR:",
          error,
        );

        if (!cancelled) {
          setSessionUser(null);
        }
      }
    }

    loadSession();

    return () => {
      cancelled = true;
    };
  }, [path]);

  /*
   * ถ้ายังไม่ได้ Login
   * หน้า Scholarships ต้องใช้ Header แบบ Public
   */
  const publicScholarship =
    path.startsWith("/scholarships") &&
    !sessionUser;

  const publicHeader =
    landing ||
    publicScholarship;

  const nav = publicHeader
    ? [
        [
          "/",
          "หน้าแรก",
          "home",
        ],
        [
          "/scholarships",
          "ทุนการศึกษา",
          "cap",
        ],
        [
          "/#steps",
          "ขั้นตอนการสมัคร",
          "file",
        ],
        [
          "/#news",
          "ประกาศ",
          "bell",
        ],
        [
          "/#faq",
          "คำถามที่พบบ่อย",
          "file",
        ],
        [
          "/#contact",
          "ติดต่อ",
          "mail",
        ],
      ]
    : staff
      ? [
          [
            "/staff",
            "แดชบอร์ด",
            "home",
          ],
          [
            "/staff/scholarships",
            "ทุนการศึกษา",
            "cap",
          ],
          [
            "/staff/review",
            "ตรวจเอกสาร",
            "check",
          ],
          [
            "/staff/evaluation",
            "พิจารณาทุน",
            "people",
          ],
          [
            "/staff/scholarships#results",
            "ประกาศผล / จ่ายทุน",
            "chart",
          ],
        ]
      : [
          [
            "/dashboard",
            "แดชบอร์ด",
            "home",
          ],
          [
            "/scholarships",
            "ทุนการศึกษา",
            "cap",
          ],
          [
            "/apply",
            "สมัครทุน",
            "edit",
          ],
          [
            "/applications",
            "ใบสมัครของฉัน",
            "file",
          ],
          [
            "/profile#documents",
            "เอกสาร",
            "folder",
          ],
          [
            "/profile",
            "โปรไฟล์",
            "user",
          ],
        ];

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    try {
      const response =
        await fetch(
          "/api/auth/logout",
          {
            method: "POST",
          },
        );

      if (!response.ok) {
        console.error(
          "Logout request failed",
        );
      }

      setSessionUser(null);
    } catch (error) {
      console.error(
        "LOGOUT_ERROR:",
        error,
      );
    } finally {
      window.location.href =
        "/login";
    }
  }

  /*
   * Login / Register
   * ไม่ใช้ Header หลัก
   */
  if (auth) {
    return <>{children}</>;
  }

  return (
    <div className="ui-app">
      <a
        className="skip"
        href="#main-content"
      >
        ข้ามไปเนื้อหาหลัก
      </a>

      <header className="topbar">
        <Brand />

        <button
          className="menu-toggle btn secondary"
          aria-label="เปิดหรือปิดเมนู"
          aria-expanded={open}
          onClick={() =>
            setOpen(!open)
          }
        >
          ☰
        </button>

        <nav
          className={
            open ? "open" : ""
          }
          aria-label="เมนูหลัก"
        >
          {nav.map(
            ([url, label, icon]) => (
              <Link
                key={url}
                href={url}
                onClick={() =>
                  setOpen(false)
                }
                className={
                  path === url ||
                  (
                    url ===
                      "/scholarships" &&
                    path.startsWith(
                      "/scholarships",
                    )
                  )
                    ? "active"
                    : ""
                }
                aria-current={
                  path === url
                    ? "page"
                    : undefined
                }
              >
                {!publicHeader && (
                  <Icon
                    name={icon}
                    size={20}
                  />
                )}

                <span>
                  {label}
                </span>
              </Link>
            ),
          )}
        </nav>

        {publicHeader ? (
          <div className="header-actions">
            <Link
              className="btn secondary"
              href="/register"
            >
              ลงทะเบียนนักศึกษา
            </Link>

            <Link
              className="btn"
              href="/login"
            >
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
                <strong>
                  การแจ้งเตือน
                </strong>

                <p>
                  เอกสารของคุณได้รับการตรวจสอบแล้ว
                </p>

                <Link
                  href={
                    staff
                      ? "/staff/review"
                      : "/applications"
                  }
                >
                  ดูสถานะใบสมัคร →
                </Link>
              </div>
            </details>

            <details>
              <summary>
                <span className="avatar" />

                <span>
                  <strong>
                    {sessionUser?.fullName ||
                      sessionUser?.email ||
                      (
                        staff
                          ? "เจ้าหน้าที่ทุนการศึกษา"
                          : "นักศึกษา"
                      )}
                  </strong>

                  <small>
                    {staff
                      ? "เจ้าหน้าที่ทุนการศึกษา"
                      : sessionUser?.studentId
                        ? `รหัสนักศึกษา ${sessionUser.studentId}`
                        : "นักศึกษา"}
                  </small>
                </span>

                <span>
                  ⌄
                </span>
              </summary>

              <div className="popover">
                <Link href="/profile">
                  โปรไฟล์และเอกสาร
                </Link>

                <Link href="/menu">
                  ดูหน้าจอทั้งหมด
                </Link>

                <Link href="/">
                  กลับหน้าแรก
                </Link>

                <button
                  type="button"
                  className="text-button"
                  onClick={
                    handleLogout
                  }
                  disabled={
                    loggingOut
                  }
                >
                  {loggingOut
                    ? "กำลังออกจากระบบ..."
                    : "ออกจากระบบ"}
                </button>
              </div>
            </details>
          </div>
        )}
      </header>

      <main
        id="main-content"
        className={
          landing
            ? "landing"
            : "workspace"
        }
      >
        {children}
      </main>

      <footer className="site-footer">
        <span>
          ระบบติดตามทุนการศึกษา ·
          ระบบทุนการศึกษาภายในมหาวิทยาลัย
        </span>

        <Link href="/menu">
          ดูตัวอย่างทั้ง 13 หน้า
        </Link>

        <small>
          ข้อมูลตัวอย่าง ·
          ยังไม่เชื่อมต่อระบบจริง
        </small>
      </footer>
    </div>
  );
}