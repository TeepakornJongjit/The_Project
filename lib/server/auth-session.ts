import "server-only";

import { cookies } from "next/headers";
import { getCurrentSupabaseUser } from "./supabase-auth";

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  studentId: string;
  role: string;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get("m01_access_token")?.value;

  if (!accessToken) {
    return null;
  }

  const user =
    await getCurrentSupabaseUser(accessToken);

  if (!user) {
    return null;
  }

  return {
    id: user.id,

    email:
      user.email || "",

    fullName:
      user.user_metadata?.full_name || "",

    studentId:
      user.user_metadata?.student_id || "",

    role:
      user.user_metadata?.role || "student",
  };
}

export function isStaffRole(role: string) {
  return [
    "scholarship_officer",
    "reviewer",
    "committee",
    "document_reviewer",
    "accounting_staff",
    "system_administrator",
  ].includes(role);
}