export type PortalRole = "student" | "staff" | "committee" | "admin";

export type Viewer = {
  id: string;
  email: string;
  fullName: string;
  studentId: string;
  role: PortalRole;
};

export const roleLabels: Record<PortalRole, string> = {
  admin: "ผู้ดูแลระบบ",
  student: "นักศึกษา",
  staff: "เจ้าหน้าที่ทุน",
  committee: "กรรมการ",
};

export function isPortalRole(value: unknown): value is PortalRole {
  return value === "admin" || value === "student" || value === "staff" || value === "committee";
}

export function homeForRole(role: PortalRole): string {
  if (role === "admin") return "/admin";
  if (role === "staff") return "/staff";
  if (role === "committee") return "/committee";
  return "/dashboard";
}
