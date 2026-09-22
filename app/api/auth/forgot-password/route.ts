import { NextResponse } from "next/server";

import {
  isWuEmail,
  normalizeWuEmail,
} from "@/lib/auth/email-policy";

import {
  requestPasswordReset,
} from "@/lib/server/supabase-auth";

export async function POST(
  request: Request,
) {
  try {
    const body =
      await request.json();

    const email =
      normalizeWuEmail(body.email);

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message:
            "กรุณากรอกอีเมลมหาวิทยาลัย",
        },
        {
          status: 400,
        },
      );
    }

    if (!isWuEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "กรุณาใช้อีเมล @mail.wu.ac.th เท่านั้น",
        },
        {
          status: 400,
        },
      );
    }

    const origin =
      new URL(request.url).origin;

    const redirectTo =
      `${origin}/reset-password`;

    await requestPasswordReset(
      email,
      redirectTo,
    );

    /*
     * ไม่บอกว่ามีบัญชีนี้หรือไม่
     * ป้องกันการค้นหารายชื่อผู้ใช้
     */
    return NextResponse.json({
      success: true,
      message:
        "หากอีเมลนี้มีบัญชีในระบบ ระบบได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่แล้ว",
    });
  } catch (error) {
    console.error(
      "FORGOT_PASSWORD_ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "ไม่สามารถส่งอีเมลได้",
      },
      {
        status: 400,
      },
    );
  }
}