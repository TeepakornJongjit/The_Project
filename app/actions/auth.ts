"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAuthConfigured } from "@/lib/supabase/config";
import { readViewer } from "@/lib/auth/server";
import { homeForRole } from "@/lib/auth/types";

export type AuthState = { error: string };

export async function login(_previous: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
      password.length < 8 || password.length > 128) {
    return { error: "กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน" };
  }
  if (!isAuthConfigured()) return { error: "ระบบเข้าสู่ระบบยังไม่พร้อมใช้งาน กรุณาติดต่อผู้ดูแล" };

  let destination: string;
  try {
    const client = await createClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      return { error: error?.status === 429
        ? "มีการเข้าสู่ระบบหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่"
        : "อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือบัญชียังไม่พร้อมใช้งาน" };
    }
    const viewer = await readViewer(client, data.user);
    if (!viewer) {
      await client.auth.signOut({ scope: "local" });
      return { error: "บัญชีนี้ยังไม่ได้รับสิทธิ์ใช้งาน กรุณาติดต่อผู้ดูแลระบบ" };
    }
    destination = homeForRole(viewer.role);
  } catch {
    return { error: "ไม่สามารถเชื่อมต่อระบบบัญชีได้ กรุณาลองใหม่อีกครั้ง" };
  }
  revalidatePath("/", "layout");
  redirect(destination);
}

export async function logout(): Promise<AuthState> {
  try {
    const client = await createClient();
    const { error } = await client.auth.signOut({ scope: "local" });
    if (error) return { error: "ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง" };
  } catch {
    return { error: "ออกจากระบบไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อแล้วลองอีกครั้ง" };
  }
  revalidatePath("/", "layout");
  redirect("/login");
}
