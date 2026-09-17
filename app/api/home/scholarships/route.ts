import { NextResponse } from "next/server";

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL;

const SUPABASE_KEY =
  process.env.VITE_SUPABASE_ANON_KEY;

export async function GET() {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json(
        {
          success: false,
          scholarships: [],
          message:
            "Supabase environment variables are missing",
        },
        { status: 500 },
      );
    }

    const query =
      "select=scholarship_id,title,description,provider_name,amount,open_date,deadline,quota,status,category" +
      "&status=eq.open" +
      "&order=deadline.asc" +
      "&limit=3";

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/scholarships?${query}`,
      {
        method: "GET",

        headers: {
          apikey: SUPABASE_KEY,
        },

        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "HOME_SCHOLARSHIPS_ERROR:",
        data,
      );

      return NextResponse.json(
        {
          success: false,
          scholarships: [],
          message:
            data?.message ||
            "ไม่สามารถโหลดข้อมูลทุนได้",
        },
        {
          status: response.status,
        },
      );
    }

    const scholarships = data.map(
      (item: {
        scholarship_id: string;
        title: string;
        description: string | null;
        provider_name: string | null;
        amount: number | null;
        open_date: string | null;
        deadline: string | null;
        quota: number | null;
        status: string;
        category: string | null;
      }) => ({
        id: item.scholarship_id,

        title: item.title,

        description:
          item.description || "",

        providerName:
          item.provider_name || "",

        amount:
          Number(item.amount || 0),

        quota:
          Number(item.quota || 0),

        openDate:
          item.open_date,

        deadline:
          item.deadline,

        status:
          item.status,

        category:
          item.category || "",
      }),
    );

    return NextResponse.json({
      success: true,
      scholarships,
    });
  } catch (error) {
    console.error(
      "HOME_SCHOLARSHIPS_ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        scholarships: [],
        message:
          "เกิดข้อผิดพลาดในการโหลดข้อมูลทุน",
      },
      {
        status: 500,
      },
    );
  }
}