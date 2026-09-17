import { NextResponse } from "next/server";
import { loginStudent } from "@/lib/server/supabase-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "กรุณากรอกอีเมลและรหัสผ่าน",
        },
        {
          status: 400,
        },
      );
    }

    const session = await loginStudent({
      email,
      password,
    });

    if (!session?.access_token || !session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "ไม่สามารถเข้าสู่ระบบได้",
        },
        {
          status: 401,
        },
      );
    }

    const user = {
      id: session.user.id,
      email: session.user.email || "",
      fullName:
        session.user.user_metadata?.full_name || "",
      studentId:
        session.user.user_metadata?.student_id || "",
      role:
        session.user.user_metadata?.role ||
        "student",
    };

    const response = NextResponse.json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      user,
    });

    response.cookies.set(
      "m01_access_token",
      session.access_token,
      {
        httpOnly: true,
        sameSite: "lax",
        secure:
          process.env.NODE_ENV === "production",
        path: "/",
        maxAge: session.expires_in || 3600,
      },
    );

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
          maxAge: 60 * 60 * 24 * 30,
        },
      );
    }

    return response;
  } catch (error) {
    console.error("LOGIN_ERROR:", error);

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