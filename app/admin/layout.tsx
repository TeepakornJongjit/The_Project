import { requireRole } from "@/lib/auth/server";
import "./admin.css";
export default async function AdminLayout({children}:{children:React.ReactNode}) {
  await requireRole(["admin"]);
  return <div className="admin-area">{children}</div>;
}
