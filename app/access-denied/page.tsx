import Link from "next/link";
import { requireViewer } from "@/lib/auth/server";
import { homeForRole, roleLabels } from "@/lib/auth/types";

export const metadata = { title: "ไม่มีสิทธิ์เข้าถึง" };
export default async function AccessDeniedPage() {
  const viewer = await requireViewer();
  return (
    <section className="panel">
      <h1>ไม่มีสิทธิ์เข้าถึงหน้านี้</h1>
      <p>บัญชีของคุณอยู่ในบทบาท{roleLabels[viewer.role]} หากสิทธิ์ไม่ถูกต้อง กรุณาติดต่อผู้ดูแลระบบ</p>
      <Link className="btn" href={homeForRole(viewer.role)}>กลับหน้าของฉัน</Link>
    </section>
  );
}
