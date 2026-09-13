"use client";
import Link from "next/link";
import { useState } from "react";
import type { Viewer } from "@/lib/auth/types";
import { scholarships, type Scholarship, money, demoDate } from "@/lib/ui-data";
import {
  Action,
  Badge,
  Banner,
  Donut,
  Heading,
  Icon,
  Notice,
  Panel,
  Photo,
  Quote,
  ScholarshipCard,
  Stats,
  Timeline,
} from "./Shared";

export function Dashboard({ viewer }: { viewer: Viewer }) {
  return (
    <>
      <Banner title={viewer.fullName} />
      <Stats />
      <div className="columns">
        <div className="stack">
          <Panel
            title="★ ทุนแนะนำสำหรับคุณ"
            action={<Link href="/scholarships">ดูทั้งหมด ›</Link>}
          >
            <p className="section-subtitle">
              ทุนที่น่าสนใจและเหมาะกับคุณ จากข้อมูลของโปรไฟล์และประวัติการศึกษา
            </p>
            <div className="scholar-grid">
              {scholarships.slice(0, 3).map((s) => (
                <ScholarshipCard key={s.id} item={s} />
              ))}
            </div>
          </Panel>
          <Panel
            title="ประกาศล่าสุด"
            action={<Link href="/#news">ดูทั้งหมด ›</Link>}
          >
            <ul className="news-list">
              {[
                "ประกาศรายชื่อผู้ได้รับทุนการศึกษา ประจำปีการศึกษา 2567",
                "เปิดรับสมัครทุนพัฒนาทักษะดิจิทัลเพื่ออนาคต",
                "กำหนดการสัมภาษณ์ทุนส่งเสริมผลการเรียนดี 2568",
              ].map((n, i) => (
                <li key={n}>
                  <Link href={`/scholarships/${scholarships[i].id}`}>{n}</Link>
                  <time>{8 - i * 2} เม.ย. 2568　›</time>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
        <aside className="stack">
          <Panel
            title="สถานะใบสมัครของฉัน"
            action={<Link href="/applications">ดูทั้งหมด ›</Link>}
          >
            <Donut />
          </Panel>
          <Panel title="กำหนดการสำคัญ">
            <Timeline />
          </Panel>
          <Quote />
        </aside>
      </div>
    </>
  );
}

export function SearchPage() {
  const [query, setQuery] = useState(""),
    [search, setSearch] = useState(""),
    [type, setType] = useState("ทั้งหมด"),
    [gpa, setGpa] = useState("ทั้งหมด"),
    [sort, setSort] = useState("latest");
  const filtered = scholarships
    .filter(
      (s) =>
        (s.title + s.type + s.description).includes(search) &&
        (type === "ทั้งหมด" || s.type === type) &&
        (gpa === "ทั้งหมด" || s.gpa <= Number(gpa)),
    )
    .sort((a, b) =>
      sort === "amount"
        ? b.amount - a.amount
        : sort === "soon"
          ? a.date.localeCompare(b.date)
          : b.date.localeCompare(a.date),
    );
  return (
    <div className="columns search-layout">
      <div>
        <Heading
          title="ทุนการศึกษา"
          description="ค้นหาทุนที่เหมาะกับคุณ เพื่อสนับสนุนการเรียนรู้ พัฒนาตนเอง และสร้างโอกาสในอนาคต"
        />
        <form
          className="panel search-bar"
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(query);
          }}
        >
          <Icon name="search" />
          <input
            aria-label="ค้นหาทุน"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อทุน หรือคำสำคัญ เช่น ความสามารถพิเศษ นวัตกรรม เรียนดี"
          />
          <button className="btn">ค้นหา</button>
        </form>
        <div className="filters">
          <label>
            ประเภททุน
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {["ทั้งหมด", ...scholarships.map((s) => s.type)].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            เกรดเฉลี่ยของคุณ
            <select value={gpa} onChange={(e) => setGpa(e.target.value)}>
              <option>ทั้งหมด</option>
              {[2, 2.5, 3, 3.5, 4].map((g) => (
                <option key={g} value={g}>
                  {g.toFixed(2)}
                </option>
              ))}
            </select>
          </label>
          <label>
            สถานะรับสมัคร
            <select aria-label="สถานะรับสมัคร">
              <option>เปิดรับสมัคร (ข้อมูลตัวอย่าง)</option>
            </select>
          </label>
        </div>
        <div className="result-bar">
          <span>
            พบทุนการศึกษา <strong>{filtered.length}</strong> รายการ
          </span>
          <select
            aria-label="เรียงตาม"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="latest">วันปิดรับสมัคร (ล่าสุดก่อน)</option>
            <option value="soon">ใกล้ปิดรับสมัครก่อน</option>
            <option value="amount">จำนวนเงินมากที่สุด</option>
          </select>
        </div>
        <div className="scholar-grid">
          {filtered.map((s) => (
            <ScholarshipCard key={s.id} item={s} />
          ))}
        </div>
        {!filtered.length && (
          <Panel className="empty">
            <h2>ไม่พบทุนที่ตรงกับการค้นหา</h2>
            <p>ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
            <button
              className="btn secondary"
              onClick={() => {
                setQuery("");
                setSearch("");
                setType("ทั้งหมด");
                setGpa("ทั้งหมด");
              }}
            >
              ล้างตัวกรอง
            </button>
          </Panel>
        )}
      </div>
      <aside className="stack">
        <Panel title="ขั้นตอนการสมัครทุน">
          <ol className="help-steps">
            {[
              ["ค้นหาทุนที่สนใจ", "ใช้ตัวกรองเพื่อค้นหาทุนที่เหมาะกับคุณ"],
              [
                "ดูรายละเอียด",
                "ศึกษาคุณสมบัติ เอกสารที่ใช้ และเงื่อนไขการรับทุน",
              ],
              ["กรอกใบสมัคร", "กรอกข้อมูลและอัปโหลดเอกสารให้ครบถ้วน"],
              ["ติดตามผล", "ตรวจสอบสถานะการสมัครได้ที่เมนู ใบสมัครของฉัน"],
            ].map(([t, p]) => (
              <li key={t}>
                <h3>{t}</h3>
                <p>{p}</p>
              </li>
            ))}
          </ol>
        </Panel>
        <Panel title="ต้องการความช่วยเหลือ?">
          <p>หากมีข้อสงสัยเกี่ยวกับการสมัครทุน ติดต่อกองพัฒนานักศึกษา</p>
          <Action href="/#contact" secondary>
            <Icon name="mail" />
            ติดต่อเจ้าหน้าที่
          </Action>
        </Panel>
        <Quote />
      </aside>
    </div>
  );
}

export function DetailPage({ item }: { item: Scholarship }) {
  const [tab, setTab] = useState(0),
    [saved, setSaved] = useState(false);
  const tabs = [
    "รายละเอียด",
    "คุณสมบัติผู้สมัคร",
    "เอกสารที่ใช้",
    "ขั้นตอนการสมัคร",
    "คำถามที่พบบ่อย",
  ];
  return (
    <>
      <div className="breadcrumb">
        <Link href="/scholarships">ทุนการศึกษา</Link>　›　รายละเอียดทุน
      </div>
      <Heading
        title="รายละเอียดทุน"
        description="ข้อมูลเกี่ยวกับทุนการศึกษาและขั้นตอนการสมัคร"
      >
        <Action href="/scholarships" secondary>
          ← กลับหน้าทุนการศึกษา
        </Action>
      </Heading>
      <div className="columns">
        <div className="stack">
          <Panel className="detail-top">
            <Banner title={item.title} text={item.description} />
            <div className="detail-metrics">
              {[
                ["money", `${money(item.amount)} บาท`, "จำนวนเงินทุน"],
                ["people", `${item.quota} ทุน`, "จำนวนทุน"],
                [
                  "calendar",
                  `ปิดรับ ${demoDate(item.date)}`,
                  "ช่วงเวลารับสมัคร",
                ],
                ["cap", "กองพัฒนานักศึกษา", "หน่วยงานรับผิดชอบ"],
              ].map(([icon, v, t]) => (
                <div key={t}>
                  <Icon name={icon} size={28} />
                  <span>
                    <strong>{v}</strong>
                    <small>{t}</small>
                  </span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel>
            <div className="tabs" role="tablist" aria-label="รายละเอียดทุน">
              {tabs.map((x, i) => (
                <button
                  role="tab"
                  aria-selected={tab === i}
                  aria-controls="detail-tab"
                  id={`detail-tab-${i}`}
                  className={tab === i ? "active" : ""}
                  key={x}
                  onClick={() => setTab(i)}
                >
                  {x}
                </button>
              ))}
            </div>
            <div
              role="tabpanel"
              id="detail-tab"
              aria-labelledby={`detail-tab-${tab}`}
              className="detail-copy"
            >
              <h2>{tabs[tab]}</h2>
              {tab === 0 ? (
                <>
                  <p>
                    {item.description}{" "}
                    มหาวิทยาลัยจัดสรรทุนนี้เพื่อให้นักศึกษาสามารถศึกษาได้อย่างเต็มศักยภาพ
                    พร้อมเติบโตเป็นกำลังสำคัญในการพัฒนาสังคมต่อไป
                  </p>
                  <h2>วัตถุประสงค์ของทุน</h2>
                  <ul className="check-list">
                    {[
                      "ส่งเสริมและสนับสนุนศักยภาพของนักศึกษา",
                      "สร้างแรงจูงใจในการพัฒนาตนเองอย่างต่อเนื่อง",
                      "ปลูกฝังคุณธรรม จริยธรรม และความรับผิดชอบต่อสังคม",
                    ].map((x) => (
                      <li key={x}>
                        <Icon name="check" />
                        {x}
                      </li>
                    ))}
                  </ul>
                  <h2>ลักษณะการให้ทุน</h2>
                  <p>
                    ทุนการศึกษาแบบให้เปล่า จำนวนเงิน {money(item.amount)} บาท
                    ต่อคน ต่อปีการศึกษา สามารถใช้สำหรับค่าเล่าเรียน ค่าครองชีพ
                    หรือค่าใช้จ่ายที่เกี่ยวข้องกับการศึกษา
                  </p>
                </>
              ) : tab === 1 ? (
                <ul className="check-list">
                  {[
                    "เป็นนักศึกษาปัจจุบันของมหาวิทยาลัย",
                    `มีผลการเรียนเฉลี่ยสะสม (GPAX) ตั้งแต่ ${item.gpa.toFixed(2)} ขึ้นไป`,
                    "ไม่มีประวัติการถูกลงโทษทางวินัย",
                    "ไม่อยู่ระหว่างการรับทุนประเภทเดียวกัน",
                  ].map((x) => (
                    <li key={x}>
                      <Icon name="check" />
                      {x}
                    </li>
                  ))}
                </ul>
              ) : tab === 2 ? (
                <ul className="check-list">
                  {[
                    "ใบแสดงผลการศึกษา",
                    "สำเนาบัตรประจำตัวนักศึกษา",
                    "หนังสือรับรองรายได้ของครอบครัว",
                    "แฟ้มสะสมผลงาน (ถ้ามี)",
                  ].map((x) => (
                    <li key={x}>
                      <Icon name="file" />
                      {x}
                    </li>
                  ))}
                </ul>
              ) : tab === 3 ? (
                <ol className="help-steps">
                  {[
                    "ตรวจสอบคุณสมบัติ",
                    "กรอกข้อมูลให้ครบถ้วน",
                    "แนบเอกสารประกอบ",
                    "ยืนยันและติดตามผล",
                  ].map((x) => (
                    <li key={x}>
                      <h3>{x}</h3>
                    </li>
                  ))}
                </ol>
              ) : (
                <>
                  <details className="faq">
                    <summary>ต้องคืนเงินทุนหรือไม่?</summary>
                    <p>ทุนนี้เป็นทุนให้เปล่าตามเงื่อนไขในประกาศ</p>
                  </details>
                  <details className="faq">
                    <summary>ติดตามผลได้ที่ไหน?</summary>
                    <p>ไปที่เมนูใบสมัครของฉัน เพื่อตรวจสอบสถานะล่าสุด</p>
                  </details>
                </>
              )}
              <div className="contact-line">
                ติดต่อสอบถาม　☎ 02-123-4567 ต่อ 1234　กองพัฒนานักศึกษา
              </div>
            </div>
          </Panel>
        </div>
        <aside className="stack">
          <Panel title="สถานะคุณสมบัติของคุณ">
            <p className="section-subtitle">
              ข้อมูลตัวอย่างสำหรับแสดงขั้นตอนการตรวจคุณสมบัติ
            </p>
            {[
              "เป็นนักศึกษาปัจจุบันของมหาวิทยาลัย",
              `มีผลการเรียนเฉลี่ย ≥ ${item.gpa.toFixed(2)}`,
              "ไม่มีประวัติถูกลงโทษทางวินัย",
              "ไม่อยู่ระหว่างรับทุนการศึกษาอื่นที่มีลักษณะเดียวกัน",
              "มีผลการเข้าร่วมกิจกรรมตามเกณฑ์",
            ].map((x) => (
              <div className="eligibility" key={x}>
                <span>✓</span>
                {x}
                <strong>ผ่าน</strong>
              </div>
            ))}
            <div className="soft-box">
              คุณสมบัติครบถ้วน สามารถทดลองกรอกใบสมัครได้
            </div>
            <div className="stack">
              <Action href={`/apply?scholarship=${item.id}`}>
                <Icon name="edit" />
                สมัครทุนนี้
              </Action>
              <button
                className="btn secondary"
                aria-pressed={saved}
                onClick={() => setSaved(!saved)}
              >
                <Icon name="bookmark" />
                {saved ? "บันทึกทุนนี้แล้ว" : "บันทึกทุนนี้"}
              </button>
            </div>
          </Panel>
          <Panel title="กำหนดการสำคัญ">
            <Timeline />
            <Notice>กำหนดการจากภาพตัวอย่าง กรุณาตรวจประกาศจริงก่อนสมัคร</Notice>
          </Panel>
        </aside>
      </div>
    </>
  );
}

export function Applications() {
  const [selected, setSelected] = useState(0);
  const labels = [
    "กำลังพิจารณา",
    "อนุมัติแล้ว",
    "ไม่ผ่านการคัดเลือก",
    "เสร็จสิ้น",
  ];
  return (
    <>
      <Heading
        title="ใบสมัครของฉัน"
        description="ติดตามสถานะและรายละเอียดใบสมัครทุนการศึกษาของคุณ (เฉพาะทุนภายในมหาวิทยาลัยเท่านั้น)"
      />
      <div className="columns applications-layout">
        <Panel title="ใบสมัครทั้งหมด" action={<span>4 รายการ</span>}>
          <div className="application-list">
            {scholarships.slice(0, 4).map((s, i) => (
              <button
                key={s.id}
                className={`application-item ${selected === i ? "selected" : ""}`}
                onClick={() => setSelected(i)}
              >
                <Photo index={s.image} />
                <div>
                  <h3>{s.title}</h3>
                  <p>กองพัฒนานักศึกษา</p>
                  <small>ยื่นใบสมัคร 15 เม.ย. 2568</small>
                  <Badge>{labels[i]}</Badge>
                </div>
                <span>›</span>
              </button>
            ))}
          </div>
        </Panel>
        <div className="stack">
          <Panel>
            <div className="application-summary">
              <Photo index={selected} />
              <div>
                <h2>{scholarships[selected].title}</h2>
                <p>กองพัฒนานักศึกษา</p>
                <Badge>{labels[selected]}</Badge>
              </div>
            </div>
            <div className="detail-metrics">
              <div>
                <Icon name="people" />
                <span>
                  <small>จำนวนทุน</small>
                  <strong>{scholarships[selected].quota} ทุน</strong>
                </span>
              </div>
              <div>
                <Icon name="money" />
                <span>
                  <small>ทุนละ</small>
                  <strong>{money(scholarships[selected].amount)} บาท</strong>
                </span>
              </div>
              <div>
                <Icon name="calendar" />
                <span>
                  <small>ปิดรับสมัคร</small>
                  <strong>{demoDate(scholarships[selected].date)}</strong>
                </span>
              </div>
            </div>
          </Panel>
          <Panel title="ความคืบหน้าใบสมัคร">
            {selected === 0 ? (
              <Timeline tracking />
            ) : (
              <>
                <Notice>
                  {selected === 1
                    ? "ใบสมัครของคุณผ่านการอนุมัติแล้ว โปรดติดตามกำหนดการยืนยันสิทธิ์"
                    : selected === 2
                      ? "ใบสมัครนี้ไม่ผ่านการคัดเลือกในรอบปัจจุบัน สามารถค้นหาทุนอื่นที่เหมาะกับคุณได้"
                      : "ใบสมัครนี้ดำเนินการเสร็จสิ้นแล้ว"}
                </Notice>
                <Action
                  secondary
                  href={`/scholarships/${scholarships[selected].id}`}
                >
                  ดูรายละเอียดทุน
                </Action>
              </>
            )}
          </Panel>
          <div className="three-columns application-notices">
            <Panel title="การดำเนินการถัดไป">
              <p>
                {selected === 0
                  ? "อยู่ระหว่างการพิจารณา กรุณารอผลจากคณะกรรมการ"
                  : selected === 1
                    ? "ติดตามกำหนดการยืนยันสิทธิ์และการจ่ายทุน"
                    : "ค้นหาโอกาสทางการศึกษาเพิ่มเติม"}
              </p>
            </Panel>
            <Panel title="ข้อความจากกองทุนการศึกษา">
              <p>
                เอกสารในใบสมัครของคุณได้รับการตรวจสอบเรียบร้อยแล้ว
                ขอบคุณที่สมัครทุนนะคะ
              </p>
            </Panel>
          </div>
        </div>
      </div>
    </>
  );
}
