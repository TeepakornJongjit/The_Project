"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { login } from "@/app/actions/auth";
import { Brand, Icon, Panel } from "@/components/portal/Shared";

export default function LoginPage({ register = false }: { register?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [help, setHelp] = useState(false);
  const [state, action, pending] = useActionState(login, { error: "" });
  return (
    <div className="auth-page">
      <aside className="auth-art">
        <Brand />
        <div className="auth-story">
          <h1>โอกาสที่ใช่<br />สร้างอนาคตที่ดีกว่าเสมอ</h1>
          <p>ระบบติดตามทุนการศึกษาภายในมหาวิทยาลัย<br />เข้าสู่ระบบเพื่อใช้พื้นที่ตามบทบาทของคุณ</p>
          <span className="short-line" />
          {[
            ["search", "นักศึกษา", "ค้นหาทุน จัดการโปรไฟล์ และติดตามใบสมัคร"],
            ["file", "เจ้าหน้าที่ทุน", "จัดการทุนการศึกษาและตรวจสอบเอกสาร"],
            ["people", "กรรมการ", "พิจารณาและประเมินใบสมัครทุนการศึกษา"],
          ].map(([icon, title, text]) => (
            <div className="auth-feature" key={title}>
              <span><Icon name={icon} size={36} /></span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </div>
          ))}
        </div>
        <blockquote>การศึกษา คือโอกาสในการเติบโต</blockquote>
      </aside>
      <div className="auth-right">
        <p className="auth-motto">เพื่อการเติบโตของทุกคน ในรั้วมหาวิทยาลัย <span>A Brighter Tomorrow Together</span></p>
        <Panel>
          <h1>{register ? "ขอเปิดบัญชีผู้ใช้" : "เข้าสู่ระบบ"}</h1>
          <h2>ระบบติดตามทุนการศึกษา</h2>
          {register ? (
            <>
              <p>ขณะนี้ผู้ดูแลระบบเป็นผู้เปิดบัญชีและกำหนดบทบาทให้ กรุณาติดต่อผู้ดูแลโครงการเพื่อขอบัญชีผู้ใช้</p>
              <Link className="btn" href="/login">มีบัญชีแล้ว เข้าสู่ระบบ</Link>
            </>
          ) : (
            <form action={action}>
              <label htmlFor="login-email">อีเมลมหาวิทยาลัย <b>*</b></label>
              <input id="login-email" name="email" type="email" required maxLength={254}
                placeholder="name@mail.wu.ac.th" autoComplete="username" />
              <label htmlFor="login-password">รหัสผ่าน <b>*</b></label>
              <span className="password-field">
                <input id="login-password" name="password" type={visible ? "text" : "password"}
                  required minLength={8} maxLength={128} placeholder="กรอกรหัสผ่าน"
                  autoComplete="current-password" />
                <button type="button" onClick={() => setVisible(!visible)}
                  aria-label={visible ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}>
                  {visible ? "ซ่อน" : "แสดง"}
                </button>
              </span>
              <button className="text-button forgot" type="button" onClick={() => setHelp(!help)}>ลืมรหัสผ่าน?</button>
              {help && <p role="status">กรุณาติดต่อผู้ดูแลโครงการเพื่อรีเซ็ตรหัสผ่าน ระบบยังไม่เปิดบริการรีเซ็ตด้วยอีเมล</p>}
              <button className="btn" type="submit" disabled={pending}>
                {pending ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}<Icon name="arrow" />
              </button>
              {state.error && <p className="soft-box" role="alert">{state.error}</p>}
              <p className="auth-switch">ยังไม่มีบัญชี? <Link href="/register">ขอเปิดบัญชีผู้ใช้</Link></p>
            </form>
          )}
        </Panel>
        <Link href="/">← กลับหน้าแรก</Link>
      </div>
    </div>
  );
}
