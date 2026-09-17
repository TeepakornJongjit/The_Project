import { NextResponse } from "next/server";

import {
  resolveSessionUser,
} from "@/lib/server/auth-session";

import {
  loginStudent,
} from "@/lib/server/supabase-auth";

import {
  isWuEmail,
  normalizeWuEmail,
} from "@/lib/auth/email-policy";

export async function POST(
  request: Request,
) {
  try {
    const body =
      await request.json();

    const email =
      normalizeWuEmail(body.email);

    const password = String(
      body.password || "",
    );

    /*
     * ต้องกรอก Email + Password
     */
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "กรุณากรอกอีเมลและรหัสผ่าน",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * M01:
     * อนุญาตเฉพาะอีเมลมหาวิทยาลัย
     * @mail.wu.ac.th
     */
    if (!isWuEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "กรุณาใช้อีเมลมหาวิทยาลัย @mail.wu.ac.th เท่านั้น",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * ตรวจสอบ Email / Password
     * กับ Supabase Auth
     */
    const session =
      await loginStudent({
        email,
        password,
      });

    if (
      !session?.access_token ||
      !session?.user
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "ไม่สามารถเข้าสู่ระบบได้",
        },
        {
          status: 401,
        },
      );
    }

    /*
     * อ่าน Role จริงจาก
     * user_roles -> roles
     */
    const user =
      await resolveSessionUser(
        session.access_token,
        session.user,
      );

    /*
     * มี Auth User
     * แต่ไม่มี Role จริงในระบบ
     */
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "บัญชีนี้ยังไม่ได้กำหนดสิทธิ์ในระบบ",
        },
        {
          status: 403,
        },
      );
    }

    /*
     * Login สำเร็จ
     */
    const response =
      NextResponse.json({
        success: true,
        message:
          "เข้าสู่ระบบสำเร็จ",
        user,
      });

    /*
     * เก็บ Access Token
     */
    response.cookies.set(
      "m01_access_token",
      session.access_token,
      {
        httpOnly: true,
        sameSite: "lax",
        secure:
          process.env.NODE_ENV ===
          "production",
        path: "/",
        maxAge:
          session.expires_in ||
          3600,
      },
    );

    /*
     * เก็บ Refresh Token
     */
    if (session.refresh_token) {
      response.cookies.set(
        "m01_refresh_token",
        session.refresh_token,
        {
          httpOnly: true,
          sameSite: "lax",
          secure:
            process.env.NODE_ENV ===
            "production",
          path: "/",
          maxAge:
            60 * 60 * 24 * 30,
        },
      );
    }

    return response;
  } catch (error) {
    console.error(
      "LOGIN_ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      },
      {
        status: 401,
      },
    );
  }
}