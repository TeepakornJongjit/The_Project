export type PortalRole = "student" | "staff" | "committee";

export type Viewer = {
  id: string;
  email: string;
  fullName: string;
  studentId: string;
  role: PortalRole;
};

export const roleLabels: Record<PortalRole, string> = {
  student: "นักศึกษา",
  staff: "เจ้าหน้าที่ทุน",
  committee: "กรรมการ",
};

export function isPortalRole(value: unknown): value is PortalRole {
  return value === "student" || value === "staff" || value === "committee";
}

export function homeForRole(role: PortalRole): string {
  if (role === "staff") return "/staff";
  if (role === "committee") return "/committee";
  return "/dashboard";
}
