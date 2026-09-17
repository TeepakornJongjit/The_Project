import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { logoutSupabaseUser } from "@/lib/server/supabase-auth";

export async function POST() {
  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get(
      "m01_access_token"
    )?.value;

  if (accessToken) {
    try {
      await logoutSupabaseUser(
        accessToken
      );
    } catch (error) {
      console.error(
        "LOGOUT_ERROR:",
        error
      );
    }
  }

  const response =
    NextResponse.json({
      success: true,
    });

  response.cookies.set(
    "m01_access_token",
    "",
    {
      path: "/",
      maxAge: 0,
    }
  );

  response.cookies.set(
    "m01_refresh_token",
    "",
    {
      path: "/",
      maxAge: 0,
    }
  );

  return response;
}
