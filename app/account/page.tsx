import { requireViewer } from "@/lib/auth/server";
import ProfileOverview from "@/components/account/ProfileOverview";
import EmailChangeForm from "@/components/account/EmailChangeForm";
import { createClient } from "@/lib/supabase/server";
import type { PersonalProfile } from "@/lib/account/types";
import "./account.css";

export const metadata = { title: "บัญชีของฉัน" };
export default async function AccountPage() {
  const viewer = await requireViewer();
  const client = await createClient();
  const { data, error } = await client.from("portal_profiles").select("phone,department,position,expertise,avatar_path,version,profile_details").eq("id", viewer.id).single();
  if (error || !data) throw new Error("โหลดโปรไฟล์ไม่สำเร็จ");
  const { data: auth, error: authError } = await client.auth.getUser();
  if (authError) throw new Error("โหลดข้อมูลอีเมลไม่สำเร็จ");
  return (
    <div className="account-page">
      <header className="profile-heading"><div><span className="profile-eyebrow">MY PROFILE</span><h1>โปรไฟล์ของฉัน</h1><p>จัดการข้อมูลส่วนตัวและข้อมูลติดต่อของคุณ</p></div></header>
      <ProfileOverview key={viewer.id} viewer={viewer} profile={data as PersonalProfile} />
      <EmailChangeForm key={viewer.email} email={viewer.email} pendingEmail={auth.user?.new_email} />
    {viewer.role === "student" && <section id="documents" className="panel profile-security"><h2>เอกสารประกอบการสมัครทุน</h2><p>ระบบอัปโหลดและตรวจสอบเอกสารอยู่ระหว่างพัฒนา ข้อมูลโปรไฟล์ด้านบนสามารถบันทึกได้แล้ว</p></section>}
    </div>
  );
}
