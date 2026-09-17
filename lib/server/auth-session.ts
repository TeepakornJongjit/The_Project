import "server-only";

import { cookies } from "next/headers";

import {
  getCurrentSupabaseUser,
  getStaffProfile,
  getStudentProfile,
  getUserRoles,
} from "./supabase-auth";

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  studentId: string;
  role: string;
};

type SupabaseAuthUser = {
  id: string;
  email?: string | null;

  user_metadata?: {
    full_name?: string | null;
    student_id?: string | null;
  } | null;
};

const ROLE_PRIORITY = [
  "admin",
  "scholarship_officer",
  "committee",
  "document_reviewer",
  "accounting_staff",
  "student",
] as const;

export function isStaffRole(
  role: string,
) {
  return [
    "admin",
    "scholarship_officer",
    "committee",
    "document_reviewer",
    "accounting_staff",
  ].includes(role);
}

function getPrimaryRole(
  roles: string[],
): string | null {
  for (const role of ROLE_PRIORITY) {
    if (roles.includes(role)) {
      return role;
    }
  }

  return null;
}

export async function resolveSessionUser(
  accessToken: string,
  authUser: SupabaseAuthUser,
): Promise<SessionUser | null> {
  const roles = await getUserRoles(
    accessToken,
    authUser.id,
  );

  const role = getPrimaryRole(roles);

  /*
   * ไม่มี Role จริงในฐานข้อมูล
   * ห้ามเดาว่าเป็น Student
   */
  if (!role) {
    return null;
  }

  const studentProfile =
    role === "student"
      ? await getStudentProfile(
          accessToken,
          authUser.id,
        )
      : null;

  const staffProfile =
    isStaffRole(role)
      ? await getStaffProfile(
          accessToken,
          authUser.id,
        )
      : null;

  return {
    id: authUser.id,

    email:
      authUser.email || "",

    fullName:
      studentProfile?.full_name ||
      staffProfile?.full_name ||
      authUser.user_metadata?.full_name ||
      authUser.email ||
      "",

    studentId:
      studentProfile?.student_code ||
      authUser.user_metadata?.student_id ||
      "",

    role,
  };
}

export async function getSessionUser(): Promise<
  SessionUser | null
> {
  const cookieStore =
    await cookies();

  const accessToken =
    cookieStore.get(
      "m01_access_token",
    )?.value;

  if (!accessToken) {
    return null;
  }

  const authUser =
    await getCurrentSupabaseUser(
      accessToken,
    );

  if (!authUser) {
    return null;
  }

  return resolveSessionUser(
    accessToken,
    authUser,
  );
}