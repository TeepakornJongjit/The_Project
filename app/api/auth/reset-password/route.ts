import { NextResponse } from "next/server";

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL;

const SUPABASE_KEY =
  process.env.VITE_SUPABASE_ANON_KEY;

function checkEnvironment() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error(
      "Supabase environment variables are missing",
    );
  }
}

export async function POST(
  request: Request,
) {
  try {
    checkEnvironment();

    const body =
      await request.json();

    const accessToken = String(
      body.accessToken || "",
    );

    const password = String(
      body.password || "",
    );

    const confirmPassword = String(
      body.confirmPassword || "",
    );

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          message:
            "ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุ",
        },
        {
          status: 401,
        },
      );
    }

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

    if (
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

    const response = await fetch(
      `${SUPABASE_URL}/auth/v1/user`,
      {
        method: "PUT",

        headers: {
          apikey: SUPABASE_KEY!,
          Authorization:
            `Bearer ${accessToken}`,
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          password,
        }),

        cache: "no-store",
      },
    );

    const data = await response
      .json()
      .catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            data?.msg ||
            data?.message ||
            data?.error_description ||
            "ไม่สามารถเปลี่ยนรหัสผ่านได้",
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "ตั้งรหัสผ่านใหม่สำเร็จ",
    });
  } catch (error) {
    console.error(
      "RESET_PASSWORD_ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      },
      {
        status: 500,
      },
    );
  }
}