"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { documents, people, scholarships, statuses } from "@/lib/ui-data";
import type { Viewer } from "@/lib/auth/types";
import {
  Action,
  Badge,
  Banner,
  Donut,
  Heading,
  Icon,
  Notice,
  Panel,
  Quote,
  Stats,
  Timeline,
} from "./Shared";
import { FilePicker } from "./Forms";

/* =========================================================
   STAFF DASHBOARD
========================================================= */

export function StaffDashboard({ viewer }: { viewer: Viewer }) {
  return (
    <>
      <Banner staff title={viewer.fullName} />
      <Stats staff />

      <div className="columns">
        <div className="stack">
          <Panel
            title="ใบสมัครล่าสุด"
            action={<Link href="/staff/review">ดูทั้งหมด ›</Link>}
          >
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    {[
                      "วันที่สมัคร",
                      "รหัสนักศึกษา",
                      "ชื่อ – สกุล",
                      "ทุนที่สมัคร",
                      "สถานะ",
                      "การดำเนินการ",
                    ].map((x) => (
                      <th key={x}>{x}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {people.map((p, i) => (
                    <tr key={p}>
                      <td>{10 - Math.floor(i / 2)} เม.ย. 2568</td>
                      <td>{671234567 + i}</td>
                      <td>{p}</td>
                      <td>{scholarships[i]?.type ?? "-"}</td>

                      <td>
                        <Badge>{statuses[i]}</Badge>
                      </td>

                      <td>
                        <Action secondary href={`/staff/review?applicant=${i}`}>
                          ดูรายละเอียด
                        </Action>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="ขั้นตอนการดำเนินงาน (ภาพรวม)">
            <div className="staff-process">
              {["ตรวจเอกสาร", "พิจารณา", "ประกาศผล", "จ่ายทุน"].map((x, i) => (
                <Link
                  href={
                    i === 0
                      ? "/staff/review"
                      : "/staff/scholarships#results"
                  }
                  key={x}
                >
                  <span className={i < 2 ? "current" : ""}>
                    {i === 0 ? "✓" : i + 1}
                  </span>

                  <h3>{x}</h3>

                  <p>
                    {i === 0
                      ? "เสร็จสิ้น"
                      : i === 1
                        ? "กำลังดำเนินการ"
                        : "รอดำเนินการ"}
                  </p>
                </Link>
              ))}
            </div>
          </Panel>
        </div>

        <aside className="stack">
          <Panel title="สถิติสถานะใบสมัครทั้งหมด">
            <Donut staff />
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

/* =========================================================
   SCHOLARSHIP MANAGEMENT
========================================================= */

type ManagedScholarship = {
  id: string;
  title: string;
  type: string;
  amount: string;
  quota: string;
  faculty: string;
  openDate: string;
  closeDate: string;
  description: string;
};

const DEFAULT_TITLE =
  "ทุนส่งเสริมนักศึกษาดีเด่น ประจำปีการศึกษา 2568";

const DEFAULT_DESCRIPTION =
  "เพื่อส่งเสริมนักศึกษาที่มีผลการเรียนดี มีความประพฤติดี และมีส่วนร่วมในการทำกิจกรรมเพื่อสังคมของมหาวิทยาลัย";

const DEFAULT_FACULTY = "ทุกคณะ / ทุกสาขาวิชา";

export function ManageScholarships() {
  /* -------------------------------------------------------
     FORM STATE
  ------------------------------------------------------- */

  const [title, setTitle] = useState(DEFAULT_TITLE);

  const [scholarshipType, setScholarshipType] = useState(
    scholarships[0]?.type ?? "",
  );

  const [amount, setAmount] = useState("10000");
  const [quota, setQuota] = useState("20");

  const [faculty, setFaculty] = useState(DEFAULT_FACULTY);

  const [openDate, setOpenDate] = useState("2025-04-01");
  const [closeDate, setCloseDate] = useState("2025-04-30");

  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);

  /* -------------------------------------------------------
     PAGE STATE
  ------------------------------------------------------- */

  const [tab, setTab] = useState(0);

  const [message, setMessage] = useState("");

  const [query, setQuery] = useState("");

  const [preview, setPreview] = useState(false);

  const [saved, setSaved] = useState(false);

  const [published, setPublished] = useState(false);

  /*
    editingId === null
    = กำลังสร้างทุนใหม่

    editingId มีค่า
    = กำลังแก้ไขทุน
  */
  const [editingId, setEditingId] = useState<string | null>(null);

  /* -------------------------------------------------------
     SCHOLARSHIP LIST

     ตอนนี้เป็นข้อมูลในหน้าเว็บก่อน
     ยังไม่ได้ต่อ Supabase
  ------------------------------------------------------- */

  const [managedScholarships, setManagedScholarships] = useState<
    ManagedScholarship[]
  >([
    {
      id: "SCH-001",
      title: DEFAULT_TITLE,
      type: scholarships[0]?.type ?? "ทุนเรียนดี",
      amount: "10000",
      quota: "20",
      faculty: DEFAULT_FACULTY,
      openDate: "2025-04-01",
      closeDate: "2025-04-30",
      description: DEFAULT_DESCRIPTION,
    },
  ]);

  /* -------------------------------------------------------
     RECIPIENT STATE
  ------------------------------------------------------- */

  const [recipientStates, setRecipientStates] = useState([
    "จ่ายแล้ว",
    "จ่ายแล้ว",
    "รอเบิกจ่าย",
    "รอดำเนินการ",
    "จ่ายแล้ว",
    "รอเบิกจ่าย",
  ]);

  const filtered = people
    .map((name, i) => ({
      name,
      i,
    }))
    .filter((x) =>
      (x.name + String(661234567 + x.i))
        .toLowerCase()
        .includes(query.toLowerCase()),
    );

  /* =======================================================
     RESET FORM
  ======================================================= */

  function resetForm() {
    setEditingId(null);

    setTitle(DEFAULT_TITLE);

    setScholarshipType(scholarships[0]?.type ?? "");

    setAmount("10000");

    setQuota("20");

    setFaculty(DEFAULT_FACULTY);

    setOpenDate("2025-04-01");

    setCloseDate("2025-04-30");

    setDescription(DEFAULT_DESCRIPTION);

    setPreview(false);

    setMessage("พร้อมสร้างทุนใหม่");
  }

  /* =======================================================
     CREATE / UPDATE
  ======================================================= */

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (closeDate < openDate) {
      setMessage("วันปิดรับสมัครต้องไม่อยู่ก่อนวันเปิดรับสมัคร");
      return;
    }

    if (!title.trim()) {
      setMessage("กรุณาระบุชื่อทุน");
      return;
    }

    if (Number(amount) <= 0) {
      setMessage("จำนวนเงินต้องมากกว่า 0");
      return;
    }

    if (Number(quota) <= 0) {
      setMessage("จำนวนทุนต้องมากกว่า 0");
      return;
    }

    /*
      =====================================================
      EDIT
      =====================================================
    */

    if (editingId) {
      setManagedScholarships((current) =>
        current.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title,
                type: scholarshipType,
                amount,
                quota,
                faculty,
                openDate,
                closeDate,
                description,
              }
            : item,
        ),
      );

      setSaved(true);

      setMessage(`แก้ไขข้อมูลทุน "${title}" เรียบร้อยแล้ว`);

      setEditingId(null);

      return;
    }

    /*
      =====================================================
      CREATE
      =====================================================
    */

    const newScholarship: ManagedScholarship = {
      id: `SCH-${Date.now()}`,
      title,
      type: scholarshipType,
      amount,
      quota,
      faculty,
      openDate,
      closeDate,
      description,
    };

    setManagedScholarships((current) => [
      newScholarship,
      ...current,
    ]);

    setSaved(true);

    setMessage(`สร้างทุน "${title}" เรียบร้อยแล้ว`);
  }

  /* =======================================================
     START EDITING
  ======================================================= */

  function startEdit(item: ManagedScholarship) {
    setEditingId(item.id);

    setTitle(item.title);

    setScholarshipType(item.type);

    setAmount(item.amount);

    setQuota(item.quota);

    setFaculty(item.faculty);

    setOpenDate(item.openDate);

    setCloseDate(item.closeDate);

    setDescription(item.description);

    setPreview(false);

    setMessage(`กำลังแก้ไขทุน "${item.title}"`);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =======================================================
     DELETE
  ======================================================= */

  function deleteScholarship(item: ManagedScholarship) {
    const ok = window.confirm(
      `ต้องการลบทุน "${item.title}" ใช่หรือไม่?`,
    );

    if (!ok) {
      return;
    }

    setManagedScholarships((current) =>
      current.filter((x) => x.id !== item.id),
    );

    /*
      ถ้ากำลังแก้ทุนตัวที่ถูกลบ
      ให้ล้างฟอร์มด้วย
    */

    if (editingId === item.id) {
      setEditingId(null);

      setTitle(DEFAULT_TITLE);

      setScholarshipType(scholarships[0]?.type ?? "");

      setAmount("10000");

      setQuota("20");

      setFaculty(DEFAULT_FACULTY);

      setOpenDate("2025-04-01");

      setCloseDate("2025-04-30");

      setDescription(DEFAULT_DESCRIPTION);
    }

    setMessage(`ลบทุน "${item.title}" แล้ว`);
  }

  /* =======================================================
     EXPORT CSV
  ======================================================= */

  function exportCsv() {
    const lines = [
      ["รหัสนักศึกษา", "ชื่อ–สกุล", "จำนวนเงิน", "สถานะ"],

      ...filtered.map((x) => [
        String(661234567 + x.i),
        x.name,
        amount,
        recipientStates[x.i],
      ]),
    ];

    const content =
      "\uFEFF" +
      lines
        .map((row) =>
          row
            .map(
              (x) =>
                '"' +
                String(x).replaceAll('"', '""') +
                '"',
            )
            .join(","),
        )
        .join("\r\n");

    const url = URL.createObjectURL(
      new Blob([content], {
        type: "text/csv;charset=utf-8;",
      }),
    );

    const a = document.createElement("a");

    a.href = url;

    a.download = "scholarship-recipients-demo.csv";

    a.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <>
      <Heading
        title="จัดการทุนและประกาศผล"
        description="สร้าง แก้ไข ลบ และประกาศผลทุนการศึกษาของมหาวิทยาลัย (ทุนภายในมหาวิทยาลัย)"
      />

      {message && <Notice>{message}</Notice>}

      {/* ===================================================
          FORM
      =================================================== */}

      <form onSubmit={submit}>
        <Panel
          title={
            editingId
              ? "แก้ไขข้อมูลทุนการศึกษา"
              : "ข้อมูลทุนการศึกษา"
          }
        >
          {editingId && (
            <Notice>
              กำลังแก้ไขทุนเดิม กรุณาแก้ข้อมูลแล้วกด
              “บันทึกการแก้ไข”
            </Notice>
          )}

          <div className="form-grid">
            {/* LEFT */}
            <div className="stack">
              <label>
                ชื่อทุน <b>*</b>

                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  required
                />
              </label>

              <label>
                ประเภททุน <b>*</b>

                <select
                  value={scholarshipType}
                  onChange={(e) =>
                    setScholarshipType(e.target.value)
                  }
                  required
                >
                  {scholarships.map((x) => (
                    <option key={x.id} value={x.type}>
                      {x.type}
                    </option>
                  ))}
                </select>
              </label>

              <div className="form-grid">
                <label>
                  จำนวนเงินต่อคน (บาท) <b>*</b>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value)
                    }
                    required
                  />
                </label>

                <label>
                  จำนวนทุน <b>*</b>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={quota}
                    onChange={(e) =>
                      setQuota(e.target.value)
                    }
                    required
                  />
                </label>
              </div>

              <label>
                คณะ / สาขาที่สมัครได้

                <select
                  value={faculty}
                  onChange={(e) =>
                    setFaculty(e.target.value)
                  }
                >
                  <option>
                    ทุกคณะ / ทุกสาขาวิชา
                  </option>

                  <option>
                    สำนักวิชาการจัดการ
                  </option>

                  <option>
                    สำนักวิชาเทคโนโลยีการเกษตรและอุตสาหกรรมอาหาร
                  </option>

                  <option>
                    สำนักวิชาพยาบาลศาสตร์
                  </option>

                  <option>
                    สำนักวิชาแพทยศาสตร์
                  </option>

                  <option>
                    สำนักวิชาเภสัชศาสตร์
                  </option>

                  <option>
                    สำนักวิชารัฐศาสตร์และนิติศาสตร์
                  </option>

                  <option>
                    สำนักวิชาวิทยาศาสตร์
                  </option>

                  <option>
                    สำนักวิชาวิศวกรรมศาสตร์และเทคโนโลยี
                  </option>

                  <option>
                    สำนักวิชาศิลปศาสตร์
                  </option>

                  <option>
                    สำนักวิชาสถาปัตยกรรมศาสตร์และการออกแบบ
                  </option>

                  <option>
                    สำนักวิชาสหเวชศาสตร์
                  </option>

                  <option>
                    สำนักวิชาสาธารณสุขศาสตร์
                  </option>

                  <option>
                    สำนักวิชาสารสนเทศศาสตร์
                  </option>

                  <option>
                    วิทยาลัยนานาชาติ
                  </option>

                  <option>
                    วิทยาลัยทันตแพทยศาสตร์นานาชาติ
                  </option>

                  <option>
                    วิทยาลัยสัตวแพทยศาสตร์อัครราชกุมารี
                  </option>
                </select>
              </label>
            </div>

            {/* RIGHT */}
            <div className="stack">
              <div className="form-grid">
                <label>
                  วันที่เปิดรับสมัคร <b>*</b>

                  <input
                    type="date"
                    value={openDate}
                    onChange={(e) =>
                      setOpenDate(e.target.value)
                    }
                    required
                  />
                </label>

                <label>
                  วันที่ปิดรับสมัคร <b>*</b>

                  <input
                    type="date"
                    value={closeDate}
                    onChange={(e) =>
                      setCloseDate(e.target.value)
                    }
                    required
                  />
                </label>
              </div>

              <label>
                รายละเอียดทุน <b>*</b>

                <textarea
                  required
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                />
              </label>

              <FilePicker />
            </div>
          </div>

          {/* =================================================
              FORM BUTTON
          ================================================= */}

          <div className="form-actions">
            <button
              className="btn secondary"
              type="button"
              onClick={() =>
                setPreview(!preview)
              }
            >
              ตัวอย่างประกาศผล
            </button>

            <button
              className="btn secondary"
              type="button"
              onClick={() =>
                setMessage(
                  "เก็บร่างไว้ในหน้านี้แล้ว ข้อมูลจะหายเมื่อรีเฟรช",
                )
              }
            >
              บันทึกร่าง
            </button>

            {editingId && (
              <button
                className="btn secondary"
                type="button"
                onClick={resetForm}
              >
                ยกเลิกการแก้ไข
              </button>
            )}

            <button className="btn" type="submit">
              {editingId
                ? "บันทึกการแก้ไข"
                : "บันทึก"}
            </button>
          </div>

          {/* =================================================
              PREVIEW
          ================================================= */}

          {preview && (
            <div className="announcement-preview">
              <h2>
                ประกาศผลการคัดเลือกทุนการศึกษา
              </h2>

              <h3>{title}</h3>

              <p>
                จำนวน {quota} ทุน ทุนละ{" "}
                {Number(amount).toLocaleString()} บาท
              </p>

              <p>
                รายชื่อผู้ได้รับทุนจะแสดงตามรายการที่ผ่านการอนุมัติด้านล่าง
              </p>

              <Badge>
                ตัวอย่างประกาศ · ยังไม่เผยแพร่
              </Badge>
            </div>
          )}
        </Panel>
      </form>

      {/* =====================================================
          SCHOLARSHIP LIST
      ===================================================== */}

      <Panel title="รายการทุนการศึกษา">
        <div className="section-title">
          <div>
            <h2>
              ทุนทั้งหมด ({managedScholarships.length})
            </h2>

            <p className="section-subtitle">
              สามารถแก้ไขหรือลบข้อมูลทุนได้จากรายการนี้
            </p>
          </div>

          
        </div>

        {managedScholarships.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ชื่อทุน</th>
                  <th>ประเภท</th>
                  <th>จำนวนเงิน</th>
                  <th>จำนวนทุน</th>
                  <th>เปิดรับสมัคร</th>
                  <th>ปิดรับสมัคร</th>
                  <th>จัดการ</th>
                </tr>
              </thead>

              <tbody>
                {managedScholarships.map(
                  (item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>
                          {item.title}
                        </strong>

                        <br />

                        <small>
                          {item.faculty}
                        </small>
                      </td>

                      <td>{item.type}</td>

                      <td>
                        {Number(
                          item.amount,
                        ).toLocaleString()}{" "}
                        บาท
                      </td>

                      <td>
                        {item.quota} ทุน
                      </td>

                      <td>
                        {item.openDate}
                      </td>

                      <td>
                        {item.closeDate}
                      </td>

                      <td>
                        <div className="button-row">
                          <button
                            type="button"
                            className="btn secondary"
                            onClick={() =>
                              startEdit(item)
                            }
                          >
                            แก้ไข
                          </button>

                          <button
                            type="button"
                            className="btn secondary"
                            onClick={() =>
                              deleteScholarship(
                                item,
                              )
                            }
                          >
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty">
            ยังไม่มีข้อมูลทุนการศึกษา
          </p>
        )}
      </Panel>

      {/* =====================================================
          RESULTS
      ===================================================== */}

      <Panel className="results-panel">
        <div className="tabs" id="results">
          {[
            "รายชื่อผู้ได้รับทุน",
            "การเบิกจ่ายทุน",
            "ประวัติการประกาศผล",
          ].map((t, i) => (
            <button
              key={t}
              className={
                tab === i ? "active" : ""
              }
              onClick={() => setTab(i)}
            >
              {t}
            </button>
          ))}
        </div>

        {tab < 2 ? (
          <>
            <div className="section-title">
              <h2>
                {tab === 0
                  ? "รายชื่อผู้ได้รับทุนการศึกษา"
                  : "การเบิกจ่ายทุน"}{" "}
                ({filtered.length} คน)
              </h2>

              <div className="button-row">
                <input
                  aria-label="ค้นหารายชื่อผู้ได้รับทุน"
                  placeholder="ค้นหาชื่อหรือรหัสนักศึกษา..."
                  value={query}
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                />

                <button
                  className="btn secondary"
                  onClick={exportCsv}
                  type="button"
                >
                  <Icon
                    name="upload"
                    size={18}
                  />

                  ส่งออกข้อมูล
                </button>
              </div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    {[
                      "ลำดับ",
                      "รหัสนักศึกษา",
                      "ชื่อ – สกุล",
                      "คณะ / สาขา",
                      "จำนวนเงิน (บาท)",
                      "สถานะการเบิกจ่าย",
                      "จัดการ",
                    ].map((x) => (
                      <th key={x}>
                        {x}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filtered.map(
                    ({ name, i }) => (
                      <tr key={name}>
                        <td>{i + 1}</td>

                        <td>
                          {661234567 + i}
                        </td>

                        <td>{name}</td>

                        <td>
                          คณะวิทยาศาสตร์
                          <br />
                          วิทยาการคอมพิวเตอร์
                        </td>

                        <td>
                          {Number(
                            amount,
                          ).toLocaleString()}
                        </td>

                        <td>
                          <Badge>
                            {
                              recipientStates[
                                i
                              ]
                            }
                          </Badge>
                        </td>

                        <td>
                          <select
                            aria-label={`สถานะการเบิกจ่ายของ ${name}`}
                            value={
                              recipientStates[
                                i
                              ]
                            }
                            onChange={(e) =>
                              setRecipientStates(
                                recipientStates.map(
                                  (s, j) =>
                                    j === i
                                      ? e
                                          .target
                                          .value
                                      : s,
                                ),
                              )
                            }
                          >
                            <option>
                              จ่ายแล้ว
                            </option>

                            <option>
                              รอเบิกจ่าย
                            </option>

                            <option>
                              รอดำเนินการ
                            </option>
                          </select>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>

              {!filtered.length && (
                <p className="empty">
                  ไม่พบรายชื่อที่ค้นหา
                </p>
              )}
            </div>

            <div className="form-actions">
              <span>
                แสดง {filtered.length} รายการ ·
                ข้อมูลตัวอย่าง
              </span>

              <button
                className="btn"
                type="button"
                onClick={() => {
                  if (!saved) {
                    setMessage(
                      "กรุณาบันทึกข้อมูลทุนก่อนทดลองประกาศผล",
                    );

                    return;
                  }

                  setPublished(true);

                  setMessage(
                    "เพิ่มประกาศตัวอย่างในประวัติแล้ว ยังไม่ได้เผยแพร่หรือแจ้งนักศึกษา",
                  );
                }}
              >
                ประกาศผลตัวอย่าง
              </button>
            </div>
          </>
        ) : (
          <div>
            {published ? (
              <Notice>
                ประกาศตัวอย่าง: {title} —
                สร้างในรอบการทดลองนี้
              </Notice>
            ) : (
              <p className="empty">
                ยังไม่มีประกาศในรอบการทดลองนี้
              </p>
            )}
          </div>
        )}
      </Panel>
    </>
  );
}

/* =========================================================
   APPLICANT
========================================================= */

function Applicant({
  name = "นายศุภกร แสงไทย",
  compact = false,
}: {
  name?: string;
  compact?: boolean;
}) {
  return (
    <Panel
      className={
        compact
          ? "compact-applicant"
          : ""
      }
      title="ข้อมูลผู้สมัคร"
    >
      <div className="applicant">
        <span className="applicant-initial">
          <Icon
            name="user"
            size={52}
          />
        </span>

        <div>
          <h3>{name}</h3>

          <p>
            รหัสนักศึกษา 671234568
          </p>

          <p>
            คณะวิทยาศาสตร์
            <br />
            สาขาวิทยาการคอมพิวเตอร์
            ชั้นปีที่ 2
          </p>

          <Badge>
            กำลังศึกษา
          </Badge>
        </div>
      </div>

      <p className="section-subtitle">
        ✉ student@example.com　☎
        082-345-6789
      </p>

      <div className="detail-metrics">
        <div>
          <span>
            เกรดเฉลี่ยสะสม (GPAX)

            <strong>3.68</strong>
          </span>
        </div>

        <div>
          <span>
            หน่วยกิตที่ลงทะเบียน

            <strong>
              32 หน่วยกิต
            </strong>
          </span>
        </div>
      </div>
    </Panel>
  );
}

/* =========================================================
   APPLICATION HEADER
========================================================= */

function ApplicationHeader({
  evaluation = false,
}: {
  evaluation?: boolean;
}) {
  return (
    <Panel className="application-header">
      <div>
        <Icon
          name="cap"
          size={42}
        />

        <span>
          <small>
            ทุนการศึกษา
          </small>

          <h2>
            ทุนเรียนดีเพื่ออนาคตยั่งยืน
          </h2>

          <p>
            ประจำปีการศึกษา 2568　|　
            เฉพาะนักศึกษาภายในมหาวิทยาลัย
          </p>
        </span>
      </div>

      <div>
        <Icon
          name="file"
          size={35}
        />

        <span>
          <small>
            รหัสใบสมัคร
          </small>

          <h2>
            SCH2568-000243
          </h2>

          <p>
            วันที่สมัคร 9 เม.ย. 2568　
            10:24 น.
          </p>
        </span>
      </div>

      <Badge>
        {evaluation
          ? "อยู่ระหว่างการประเมิน"
          : "อยู่ระหว่างตรวจสอบเอกสาร"}
      </Badge>
    </Panel>
  );
}

/* =========================================================
   REVIEW
========================================================= */

export function Review({
  applicant = 0,
}: {
  applicant?: number;
}) {
  const [tab, setTab] = useState(0);

  const [message, setMessage] =
    useState("");

  const [decision, setDecision] =
    useState("");

  const [doc, setDoc] =
    useState("");

  const [confirmed, setConfirmed] =
    useState(false);

  const [docStates, setDocStates] =
    useState<string[]>(
      documents.map((_, i) =>
        i === 3 || i === 6
          ? "ต้องตรวจสอบเพิ่มเติม"
          : i === 5
            ? "ไม่ระบุ"
            : "ถูกต้อง",
      ),
    );

  return (
    <>
      <Heading
        title="ตรวจสอบใบสมัคร"
        description="ตรวจสอบเอกสารและข้อมูลของผู้สมัครทุนการศึกษา"
      >
        <Action
          href="/staff"
          secondary
        >
          ← กลับไปหน้ารายการ
        </Action>
      </Heading>

      <ApplicationHeader />

      {message && (
        <Notice>{message}</Notice>
      )}

      <div className="columns">
        <div className="stack">
          <Panel>
            <div className="tabs">
              {[
                "เอกสารและข้อมูล",
                "ผลการประเมิน",
                "ประวัติการดำเนินการ",
              ].map((t, i) => (
                <button
                  key={t}
                  className={
                    tab === i
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setTab(i)
                  }
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === 0 ? (
              <>
                <h2>
                  เอกสารที่ผู้สมัครส่งมา
                </h2>

                <p className="section-subtitle">
                  ตรวจสอบความครบถ้วนและความถูกต้องของเอกสาร
                  (ทั้งหมด 8 รายการ)
                </p>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        {[
                          "ลำดับ",
                          "รายการเอกสาร",
                          "วันที่อัปโหลด",
                          "สถานะ",
                          "การดำเนินการ",
                        ].map((t) => (
                          <th key={t}>
                            {t}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {documents.map(
                        (d, i) => (
                          <tr key={d}>
                            <td>
                              {i + 1}
                            </td>

                            <td>{d}</td>

                            <td>
                              9 เม.ย.
                              2568
                            </td>

                            <td>
                              <select
                                aria-label={`สถานะ ${d}`}
                                value={
                                  docStates[
                                    i
                                  ]
                                }
                                onChange={(
                                  e,
                                ) =>
                                  setDocStates(
                                    docStates.map(
                                      (
                                        s,
                                        j,
                                      ) =>
                                        j ===
                                        i
                                          ? e
                                              .target
                                              .value
                                          : s,
                                    ),
                                  )
                                }
                              >
                                <option>
                                  ถูกต้อง
                                </option>

                                <option>
                                  ต้องตรวจสอบเพิ่มเติม
                                </option>

                                <option>
                                  ไม่ระบุ
                                </option>
                              </select>
                            </td>

                            <td>
                              <button
                                className="btn secondary"
                                onClick={() =>
                                  setDoc(
                                    d,
                                  )
                                }
                              >
                                ดูเอกสาร
                                ↗
                              </button>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>

                {doc && (
                  <Notice>
                    {doc}:
                    ภาพต้นแบบมีเฉพาะชื่อเอกสาร
                    ยังไม่มีไฟล์ต้นฉบับสำหรับเปิดดู{" "}

                    <button
                      className="text-button"
                      onClick={() =>
                        setDoc("")
                      }
                    >
                      ปิด
                    </button>
                  </Notice>
                )}
              </>
            ) : tab === 1 ? (
              <>
                <p>
                  ยังไม่มีผลประเมินที่ยืนยันในรอบการทดลองนี้
                </p>

                <Action href="/staff/evaluation">
                  เปิดแบบประเมิน
                </Action>
              </>
            ) : (
              <Timeline tracking />
            )}
          </Panel>

          <form
            onSubmit={(e) => {
              e.preventDefault();

              if (!decision) {
                setMessage(
                  "กรุณาเลือกผลการตรวจสอบเอกสาร",
                );

                return;
              }

              setConfirmed(true);

              setMessage(
                `บันทึกผลตัวอย่าง: ${decision} — ยังไม่ได้ส่งผลจริงหรือแจ้งผู้สมัคร`,
              );
            }}
          >
            <div className="form-grid">
              <Panel title="ความคิดเห็นของผู้ตรวจสอบ">
                <textarea
                  aria-label="ความคิดเห็นของผู้ตรวจสอบ"
                  maxLength={1000}
                  placeholder="ระบุความคิดเห็นเกี่ยวกับเอกสารและข้อมูลของผู้สมัคร..."
                />
              </Panel>

              <Panel title="บันทึกภายใน (สำหรับเจ้าหน้าที่)">
                <textarea
                  aria-label="บันทึกภายใน"
                  maxLength={1000}
                  placeholder="บันทึกข้อความภายในทีม หรือข้อมูลเพิ่มเติม..."
                />
              </Panel>
            </div>

            <Panel
              title="ผลการตรวจสอบเอกสาร"
              className="results-panel"
            >
              <div className="decisions">
                {[
                  "ส่งกลับแก้ไข",
                  "ผ่านการตรวจเอกสาร",
                  "อนุมัติเบื้องต้น",
                  "ไม่อนุมัติ",
                ].map((s) => (
                  <label key={s}>
                    <input
                      type="radio"
                      name="decision"
                      required
                      checked={
                        decision ===
                        s
                      }
                      onChange={() =>
                        setDecision(
                          s,
                        )
                      }
                    />

                    {s}
                  </label>
                ))}
              </div>

              <textarea
                aria-label="เหตุผลผลการตรวจสอบ"
                required={
                  decision ===
                    "ส่งกลับแก้ไข" ||
                  decision ===
                    "ไม่อนุมัติ"
                }
                placeholder="ระบุเหตุผลเพิ่มเติม (จำเป็นเมื่อส่งกลับแก้ไขหรือไม่อนุมัติ)"
              />

              <div className="form-actions">
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() =>
                    setMessage(
                      "เก็บร่างการตรวจสอบไว้ระหว่างการเปิดหน้านี้แล้ว",
                    )
                  }
                >
                  บันทึกชั่วคราว
                </button>

                <button className="btn">
                  ยืนยันผลการตรวจสอบ
                </button>
              </div>

              {confirmed && (
                <Badge>
                  บันทึกผลตัวอย่างแล้ว
                </Badge>
              )}
            </Panel>
          </form>
        </div>

        <aside className="stack">
          <Applicant
            name={
              people[
                applicant
              ] || people[0]
            }
          />

          <Panel title="ข้อมูลเพิ่มเติม">
            <h3>
              เหตุผลในการสมัครทุน
            </h3>

            <Quote />

            <h3 className="spaced">
              กิจกรรม / รางวัล
            </h3>

            <ul>
              <li>
                รองชนะเลิศแข่งขันโปรแกรมมิ่ง
                ระดับภาค
              </li>

              <li>
                กรรมการสโมสรนักศึกษา
                คณะวิทยาศาสตร์
              </li>

              <li>
                จิตอาสาพัฒนาชุมชน
                มากกว่า 50 ชั่วโมง
              </li>
            </ul>
          </Panel>
        </aside>
      </div>
    </>
  );
}

/* =========================================================
   EVALUATION
========================================================= */

export function Evaluation() {
  const [scores, setScores] =
    useState([
      "26",
      "18",
      "16",
      "17",
      "8",
    ]);

  const [decision, setDecision] =
    useState("เสนออนุมัติ");

  const [message, setMessage] =
    useState("");

  const [doc, setDoc] =
    useState("");

  const max = [
    30,
    20,
    20,
    20,
    10,
  ];

  const total = scores.reduce(
    (n, s) =>
      n + Number(s || 0),
    0,
  );

  function submit(
    e: FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    setMessage(
      `บันทึกผลประเมินตัวอย่าง ${total}/100 คะแนน · ${decision} — ยังไม่ได้ส่งผลเข้าระบบจริง`,
    );
  }

  return (
    <>
      <Heading
        title="ประเมินทุนการศึกษา"
        description="พิจารณาและให้คะแนนใบสมัครตามเกณฑ์ที่กำหนด"
      >
        <Action
          href="/committee"
          secondary
        >
          ← กลับไปหน้ารายการ
        </Action>
      </Heading>

      <ApplicationHeader evaluation />

      {message && (
        <Notice>{message}</Notice>
      )}

      <div className="columns">
        <div className="stack">
          <Applicant compact />

          <form onSubmit={submit}>
            <Panel title="แบบประเมิน (คะแนนเต็ม 100 คะแนน)">
              <div className="table-wrap">
                <table className="score-table">
                  <thead>
                    <tr>
                      <th>
                        เกณฑ์การพิจารณา
                      </th>

                      <th>
                        คะแนนเต็ม
                      </th>

                      <th>
                        คะแนนที่ให้
                      </th>

                      <th>
                        หมายเหตุ
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {[
                      "ผลการเรียน",
                      "ความประพฤติ",
                      "กิจกรรม / ผลงาน",
                      "ความจำเป็น / ความเหมาะสม",
                      "ภาพรวม",
                    ].map((s, i) => (
                      <tr key={s}>
                        <td>
                          <strong>
                            {s}
                          </strong>

                          <small>
                            {
                              [
                                "ผลการเรียนเฉลี่ยและพัฒนาการทางการศึกษา",
                                "ความประพฤติ วินัย และการปฏิบัติตามกฎระเบียบ",
                                "การเข้าร่วมกิจกรรม ผลงาน และความสามารถพิเศษ",
                                "ความจำเป็นทางการเงินและความเหมาะสมในการรับทุน",
                                "ศักยภาพ โอกาสในการพัฒนา และประโยชน์ต่อสังคม",
                              ][i]
                            }
                          </small>
                        </td>

                        <td>
                          {max[i]}
                        </td>

                        <td>
                          <input
                            aria-label={`คะแนน${s}`}
                            type="number"
                            min="0"
                            max={
                              max[i]
                            }
                            step="1"
                            required
                            value={
                              scores[
                                i
                              ]
                            }
                            onChange={(
                              e,
                            ) =>
                              setScores(
                                scores.map(
                                  (
                                    x,
                                    j,
                                  ) =>
                                    j ===
                                    i
                                      ? e
                                          .target
                                          .value
                                      : x,
                                ),
                              )
                            }
                          />
                        </td>

                        <td>
                          <input
                            aria-label={`หมายเหตุ${s}`}
                            placeholder="ระบุความคิดเห็น (ถ้ามี)..."
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr>
                      <th>
                        รวมคะแนน
                      </th>

                      <th>
                        100
                      </th>

                      <th>
                        <output aria-label="รวมคะแนน">
                          {total}
                        </output>
                      </th>

                      <th />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Panel>

            <Panel
              className="results-panel"
              title="ความคิดเห็นของกรรมการ"
            >
              <textarea
                aria-label="ความคิดเห็นของกรรมการ"
                maxLength={1000}
                placeholder="ระบุความคิดเห็นเพิ่มเติมเกี่ยวกับผู้สมัคร ความโดดเด่น จุดที่ควรพัฒนา หรือข้อเสนอแนะอื่น ๆ..."
              />

              <h3 className="spaced">
                ข้อเสนอแนะการพิจารณา
              </h3>

              <div className="decisions three">
                {[
                  "เสนออนุมัติ",
                  "เสนอสำรอง",
                  "ไม่เสนออนุมัติ",
                ].map((s) => (
                  <label key={s}>
                    <input
                      type="radio"
                      name="recommendation"
                      checked={
                        decision ===
                        s
                      }
                      onChange={() =>
                        setDecision(
                          s,
                        )
                      }
                    />

                    {s}
                  </label>
                ))}
              </div>

              <div className="button-row">
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() =>
                    setMessage(
                      `เก็บคะแนนร่าง ${total}/100 ไว้ในหน้านี้แล้ว ข้อมูลจะหายเมื่อรีเฟรช`,
                    )
                  }
                >
                  บันทึกร่าง
                </button>

                <button className="btn">
                  ส่งผลประเมินตัวอย่าง
                </button>
              </div>
            </Panel>
          </form>
        </div>

        <aside className="stack">
          <Panel title="เอกสารประกอบการสมัคร">
            <p>
              ทั้งหมด 8 รายการ
            </p>

            {documents.map(
              (s, i) => (
                <div
                  className="document-row"
                  key={s}
                >
                  <Icon
                    name="file"
                    size={19}
                  />

                  <span>
                    {i + 1}. {s}
                  </span>

                  <button
                    className="btn secondary"
                    onClick={() =>
                      setDoc(s)
                    }
                  >
                    ดูเอกสาร
                  </button>
                </div>
              ),
            )}

            {doc && (
              <Notice>
                {doc}:
                ไม่มีไฟล์ต้นฉบับในภาพตัวอย่าง{" "}

                <button
                  className="text-button"
                  onClick={() =>
                    setDoc("")
                  }
                >
                  ปิด
                </button>
              </Notice>
            )}
          </Panel>

          <Panel title="จุดเด่นของผู้สมัคร">
            <ul>
              <li>
                ผลการเรียนดี มี GPAX
                3.68
              </li>

              <li>
                เข้าร่วมกิจกรรมจิตอาสาและพัฒนาสังคมอย่างต่อเนื่อง
              </li>

              <li>
                มีผลงานด้านนวัตกรรมและได้รับรางวัลระดับคณะ
              </li>

              <li>
                มีความตั้งใจในการศึกษาต่อและนำความรู้ไปพัฒนาชุมชน
              </li>
            </ul>
          </Panel>

          <Panel title="ประวัติการพิจารณา">
            <Timeline tracking />
          </Panel>
        </aside>
      </div>
    </>
  );
}