import { requireViewer } from "@/lib/auth/server";
import { roleLabels } from "@/lib/auth/types";
import LogoutButton from "@/components/auth/LogoutButton";

export const metadata = { title: "บัญชีของฉัน" };
export default async function AccountPage() {
  const viewer = await requireViewer();
  return (
    <section className="panel">
      <h1>บัญชีของฉัน</h1>
      <dl className="account-details">
        <dt>ชื่อ–นามสกุล</dt><dd>{viewer.fullName}</dd>
        <dt>รหัสนักศึกษา</dt><dd>{viewer.studentId}</dd>
        <dt>อีเมล</dt><dd>{viewer.email}</dd>
        <dt>บทบาท</dt><dd>{roleLabels[viewer.role]}</dd>
      </dl>
      <p>หากต้องการแก้ไขข้อมูลบัญชีหรือสิทธิ์ กรุณาติดต่อผู้ดูแลระบบ</p>
      <LogoutButton />
    </section>
  );
}
