import { NextResponse } from "next/server";

import {
  getSessionUser,
} from "@/lib/server/auth-session";

export async function GET() {
  try {
    const user =
      await getSessionUser();

    if (!user) {
      return NextResponse.json(
        {
          authenticated: false,
          user: null,
        },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error(
      "AUTH_ME_ERROR:",
      error,
    );

    return NextResponse.json(
      {
        authenticated: false,
        user: null,
      },
      {
        status: 401,
      },
    );
  }
}