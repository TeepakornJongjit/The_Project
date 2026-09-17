import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCurrentSupabaseUser } from "@/lib/server/supabase-auth";

export async function GET() {
  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get(
      "m01_access_token"
    )?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
      },
      { status: 401 }
    );
  }

  const user =
    await getCurrentSupabaseUser(
      accessToken
    );

  if (!user) {
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,

    user: {
      id: user.id,
      email: user.email,

      fullName:
        user.user_metadata?.full_name ||
        "",

      studentId:
        user.user_metadata?.student_id ||
        "",

      role:
        user.user_metadata?.role ||
        "student",
    },
  });
}
