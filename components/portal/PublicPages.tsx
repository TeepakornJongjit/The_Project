"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { scholarships } from "@/lib/ui-data";
import { Action, Brand, Icon, Notice, Panel } from "./Shared";
export function Landing() {
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <span className="badge">
            <Icon name="cap" size={19} />
            เฉพาะทุนภายในมหาวิทยาลัย
          </span>
          <h1>
            ระบบติดตามทุนการศึกษา
            <br />
            ภายในมหาวิทยาลัย
          </h1>
          <p>
            เปิดโอกาสให้นักศึกษาเข้าถึงทุนการศึกษาของมหาวิทยาลัย
            <br />
            เพื่อพัฒนาศักยภาพ และก้าวสู่อนาคตที่ดียิ่งขึ้น
          </p>
          <div className="button-row">
            <Action href="/scholarships">
              <Icon name="search" />
              ดูทุนที่เปิดรับ
            </Action>
            <Action href="/login" secondary>
              <Icon name="arrow" />
              เข้าสู่ระบบ
            </Action>
          </div>
        </div>
      </section>
      <div className="landing-content">
        <div className="features">
          {[
            [
              "search",
              "ค้นหาทุนได้ง่าย",
              "ค้นหาทุนตามคุณสมบัติ คณะ หรือประเภททุนได้อย่างรวดเร็ว",
            ],
            [
              "file",
              "สมัครออนไลน์",
              "กรอกใบสมัครและอัปโหลดเอกสารได้ครบ จบในระบบเดียว",
            ],
            [
              "chart",
              "ติดตามผลในระบบ",
              "ตรวจสอบสถานะการสมัครและผลการพิจารณาได้ตลอดเวลา",
            ],
          ].map(([icon, title, text]) => (
            <Panel key={title}>
              <span className="feature-icon">
                <Icon name={icon} size={34} />
              </span>
              <div>
                <h2>{title}</h2>
                <p>{text}</p>
              </div>
            </Panel>
          ))}
        </div>
        <div className="section-title">
          <h2 className="underlined">ทุนที่เปิดรับ</h2>
          <Link href="/scholarships">ดูทุนทั้งหมด →</Link>
        </div>
        <div className="landing-scholarships">
          {[scholarships[0], scholarships[5], scholarships[2]].map((s, i) => (
            <article className={`landing-fund fund-${i}`} key={s.id}>
              <div className="section-title">
                <span className="feature-icon">
                  <Icon name={["trophy", "money", "people"][i]} size={30} />
                </span>
                <div>
                  <h3>
                    {
                      [
                        "ทุนเรียนดี",
                        "ทุนช่วยเหลือนักศึกษาขาดแคลนทุนทรัพย์",
                        "ทุนส่งเสริมกิจกรรม",
                      ][i]
                    }
                  </h3>
                  <p>{s.description}</p>
                </div>
                <Link className="btn secondary" href={`/scholarships/${s.id}`}>
                  ดูรายละเอียด →
                </Link>
              </div>
              <div className="fund-metrics">
                <span>
                  <Icon name="money" />
                  จำนวนเงิน<strong>{s.amount.toLocaleString()} บาท/ปี</strong>
                </span>
                <span>
                  <Icon name="people" />
                  จำนวนรับ<strong>{s.quota} ทุน</strong>
                </span>
                <span>
                  <Icon name="calendar" />
                  เปิดรับสมัคร<strong>1 – 30 เม.ย. 2568</strong>
                </span>
              </div>
            </article>
          ))}
        </div>
        <div className="columns home-lower">
          <Panel title="ขั้นตอนการสมัคร">
            <div id="steps" className="steps">
              {[
                ["search", "ค้นหาทุน", "เลือกทุนที่สนใจและตรวจสอบคุณสมบัติ"],
                [
                  "file",
                  "กรอกใบสมัคร",
                  "กรอกข้อมูลให้ครบถ้วนและตรวจสอบความถูกต้อง",
                ],
                ["upload", "อัปโหลดเอกสาร", "แนบเอกสารตามที่กำหนดในระบบ"],
                [
                  "check",
                  "ติดตามผล",
                  "ตรวจสอบสถานะการสมัครผ่านระบบได้ตลอดเวลา",
                ],
              ].map(([icon, title, text], i) => (
                <div key={title}>
                  <span className="step-number">{i + 1}</span>
                  <Icon name={icon} size={29} />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="สิ่งที่ควรเตรียม" className="prepare">
            <ul className="check-list">
              {[
                "ใบแสดงผลการศึกษา",
                "สำเนาบัตรประจำตัวนักศึกษา",
                "เอกสารรับรองรายได้ (ถ้ามี)",
                "เอกสารเพิ่มเติมตามประเภททุน",
              ].map((x) => (
                <li key={x}>
                  <Icon name="file" size={22} />
                  {x}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
        <div className="three-columns">
          <Panel title="ประกาศล่าสุด">
            <ul id="news" className="news-list">
              {[
                "เปิดรับสมัครทุนเรียนดี ประจำปีการศึกษา 2568",
                "ขยายเวลารับสมัครทุนช่วยเหลือนักศึกษา",
                "ประกาศรายชื่อผู้ผ่านการคัดเลือกทุนกิจกรรม",
              ].map((n, i) => (
                <li key={n}>
                  <Link href={`/scholarships/${scholarships[i].id}`}>{n}</Link>
                  <time>{28 - i * 3} เม.ย. 2568</time>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="ติดต่อเจ้าหน้าที่">
            <div id="contact">
              <p>กองพัฒนานักศึกษา มหาวิทยาลัย</p>
              <p>☎ 02-123-4567 ต่อ 1234</p>
              <p>✉ scholarship@university.ac.th</p>
              <p>จันทร์ – ศุกร์ 08.30 – 16.30 น.</p>
              <small>ข้อมูลติดต่อจากภาพตัวอย่าง</small>
            </div>
          </Panel>
          <Panel title="คำถามที่พบบ่อย">
            <div id="faq">
              {[
                [
                  "คุณสมบัติของผู้สมัครทุนคืออะไร",
                  "เป็นนักศึกษาปัจจุบันและมีคุณสมบัติตรงตามประกาศทุนแต่ละประเภท",
                ],
                [
                  "ต้องใช้เอกสารอะไรบ้าง",
                  "ใบแสดงผลการศึกษา บัตรนักศึกษา และเอกสารเพิ่มเติมตามประกาศทุน",
                ],
                [
                  "สามารถสมัครได้กี่ทุน",
                  "ตรวจสอบเงื่อนไขการรับทุนซ้ำซ้อนในรายละเอียดของแต่ละทุน",
                ],
              ].map(([q, a]) => (
                <details className="faq" key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
export function AuthPage({ register = false }: { register?: boolean }) {
  const [visible, setVisible] = useState(false),
    [message, setMessage] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (register && data.get("password") !== data.get("confirm")) {
      setMessage("รหัสผ่านทั้งสองช่องไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
      return;
    }
    setMessage(
      register
        ? "ตรวจสอบแบบฟอร์มเรียบร้อยแล้ว หน้าตัวอย่างนี้ยังไม่ได้สร้างบัญชีจริง คุณสามารถเปิดแดชบอร์ดตัวอย่างได้ด้านล่าง"
        : "หน้าตัวอย่างยังไม่ได้เชื่อมต่อระบบยืนยันตัวตน กรุณาเลือกบทบาทตัวอย่างด้านล่างเพื่อดูหน้าจอ",
    );
  }
  return (
    <div className="auth-page">
      <aside className="auth-art">
        <Brand />
        <div className="auth-story">
          <h1>
            {register ? (
              <>
                เริ่มต้นโอกาส
                <br />
                ทางการศึกษาของคุณ
              </>
            ) : (
              <>
                โอกาสที่ใช่
                <br />
                สร้างอนาคตที่ดีกว่าเสมอ
              </>
            )}
          </h1>
          <p>
            ค้นหาทุนการศึกษา สมัครออนไลน์
            <br />
            ติดตามสถานะ และจัดการเอกสารได้ในที่เดียว
            <br />
            เพื่ออนาคตที่ดีกว่าในรั้วมหาวิทยาลัย
          </p>
          <span className="short-line" />
          {[
            [
              "search",
              "ค้นหาทุนได้ง่าย",
              "ค้นหาทุนที่เหมาะกับคุณ จากข้อมูลที่อัปเดตเสมอ",
            ],
            [
              "file",
              "สมัครและติดตามผลได้ในที่เดียว",
              "สมัครทุนออนไลน์ และตรวจสอบความคืบหน้าได้ทันที",
            ],
            [
              "folder",
              "จัดการเอกสารสะดวก",
              "อัปโหลดและจัดเก็บเอกสารอย่างเป็นระบบ",
            ],
          ].map(([icon, title, text]) => (
            <div className="auth-feature" key={icon}>
              <span>
                <Icon name={icon} size={36} />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
        <blockquote>
          “ การศึกษาไม่ได้แค่การไปให้ถึงเป้าหมาย
          <br />
          แต่คือการเติบโตในทุกก้าวของเส้นทาง ”
        </blockquote>
      </aside>
      <div className="auth-right">
        <p className="auth-motto">
          เพื่อการเติบโตของทุกคน ในรั้วมหาวิทยาลัย{" "}
          <span>A Brighter Tomorrow Together</span>
        </p>
        <Panel>
          <h1>{register ? "สมัครสมาชิกนักศึกษา" : "เข้าสู่ระบบ"}</h1>
          <h2>ระบบติดตามทุนการศึกษา</h2>
          <p>ระบบติดตามทุนการศึกษา</p>
          <form onSubmit={submit}>
            {register && (
              <>
                <label>
                  ชื่อ–นามสกุล <b>*</b>
                  <input
                    name="name"
                    placeholder="เช่น นางสาวศิริพร ใจดี"
                    required
                    autoComplete="name"
                  />
                </label>
                <label>
                  รหัสนักศึกษา <b>*</b>
                  <input
                    name="studentId"
                    inputMode="numeric"
                    pattern="[0-9]{8,12}"
                    title="รหัสนักศึกษา 8–12 หลัก"
                    placeholder="เช่น 661234567"
                    required
                  />
                </label>
              </>
            )}
            <label>
              {register
                ? "อีเมลมหาวิทยาลัย"
                : "อีเมลมหาวิทยาลัย หรือ รหัสนักศึกษา"}{" "}
              <b>*</b>
              <input
                name="email"
                type={register ? "email" : "text"}
                placeholder="661234567@university.ac.th"
                required
                autoComplete="username"
              />
            </label>
            <label>
              รหัสผ่าน <b>*</b>
              <span className="password-field">
                <input
                  name="password"
                  type={visible ? "text" : "password"}
                  minLength={8}
                  placeholder="กรอกรหัสผ่านอย่างน้อย 8 ตัวอักษร"
                  required
                  autoComplete={register ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  aria-label={visible ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                >
                  {visible ? "ซ่อน" : "แสดง"}
                </button>
              </span>
            </label>
            {register ? (
              <>
                <label>
                  ยืนยันรหัสผ่าน <b>*</b>
                  <input
                    name="confirm"
                    type={visible ? "text" : "password"}
                    minLength={8}
                    required
                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                    autoComplete="new-password"
                  />
                </label>
                <p className="soft-box">
                  เมื่อสมัครสำเร็จ บัญชีของคุณจะอยู่ในบทบาทนักศึกษา
                </p>
                <label className="checkbox">
                  <input type="checkbox" required />
                  ฉันยอมรับเงื่อนไขการใช้งานแบบฟอร์มตัวอย่าง
                </label>
              </>
            ) : (
              <button
                className="text-button forgot"
                type="button"
                onClick={() =>
                  setMessage(
                    "หากเป็นบัญชีใช้งานจริง โปรดติดต่อเจ้าหน้าที่มหาวิทยาลัย หน้าตัวอย่างนี้ยังไม่สามารถส่งอีเมลตั้งรหัสผ่านใหม่ได้",
                  )
                }
              >
                ลืมรหัสผ่าน?
              </button>
            )}
            <button className="btn" type="submit">
              {register ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
              <Icon name="arrow" />
            </button>
            {message && <Notice>{message}</Notice>}
          </form>
          <p className="auth-switch">
            {register ? "มีบัญชีอยู่แล้ว?" : "ยังไม่มีบัญชี?"}{" "}
            <Link href={register ? "/login" : "/register"}>
              {register ? "เข้าสู่ระบบ" : "สมัครสมาชิกนักศึกษา"}
            </Link>
          </p>
          <div className="demo-entry">
            <small>ทดลองดูหน้าจอโดยไม่ใช้บัญชีจริง</small>
            <div className="button-row">
              <Action secondary href="/dashboard">
                นักศึกษา
              </Action>
              <Action secondary href="/staff">
                เจ้าหน้าที่
              </Action>
              <Action secondary href="/staff/evaluation">
                กรรมการ
              </Action>
            </div>
          </div>
        </Panel>
        <Link href="/">← กลับหน้าแรก</Link>
      </div>
    </div>
  );
}
