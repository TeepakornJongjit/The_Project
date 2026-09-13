"use client";
import Link from "next/link";

import { scholarships } from "@/lib/ui-data";
import { Action, Icon, Panel } from "./Shared";
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
