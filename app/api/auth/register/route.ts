import { NextResponse } from "next/server";

import {
  signUpStudent,
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

    const fullName = String(
      body.fullName || "",
    ).trim();

    const studentId = String(
      body.studentId || "",
    ).trim();

    const email =
      normalizeWuEmail(body.email);

    const password = String(
      body.password || "",
    );

    const confirmPassword = String(
      body.confirmPassword || "",
    );

    /*
     * ชื่อ - นามสกุล
     */
    if (!fullName) {
      return NextResponse.json(
        {
          success: false,
          message:
            "กรุณากรอกชื่อ–นามสกุล",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * รหัสนักศึกษา
     */
    if (!/^\d{8,12}$/.test(studentId)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "รหัสนักศึกษาต้องเป็นตัวเลข 8–12 หลัก",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Email
     */
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

    /*
     * อนุญาตเฉพาะ @mail.wu.ac.th
     */
    if (!isWuEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "สมัครสมาชิกได้เฉพาะอีเมลมหาวิทยาลัย @mail.wu.ac.th เท่านั้น",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Password
     */
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Confirm Password
     */
    if (
      confirmPassword &&
      password !== confirmPassword
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "รหัสผ่านทั้งสองช่องไม่ตรงกัน",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * สมัครผ่าน Supabase Auth
     *
     * Trigger ในฐานข้อมูลจะทำ:
     * auth.users
     *      ↓
     * profiles
     *      ↓
     * user_roles = student
     *
     * และถ้ามีข้อมูลครบ:
     * student_profiles
     */
    const result =
      await signUpStudent({
        fullName,
        studentId,
        email,
        password,
      });

    return NextResponse.json({
      success: true,
      message:
        "สมัครสมาชิกสำเร็จ",

      requiresEmailConfirmation:
        !result.access_token,

      user: result.user
        ? {
            id: result.user.id,
            email:
              result.user.email,
          }
        : null,
    });
  } catch (error) {
    console.error(
      "REGISTER_ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "สมัครสมาชิกไม่สำเร็จ",
      },
      {
        status: 500,
      },
    );
  }
}