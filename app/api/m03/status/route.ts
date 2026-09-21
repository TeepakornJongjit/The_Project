import { NextRequest, NextResponse } from "next/server";
import {
  addStatus,
  getLatestStatus,
  getStatusHistory,
} from "@/features/M03-application/status.service";

export async function GET(request: NextRequest) {
  const applicationId =
    request.nextUrl.searchParams.get("application_id");

  if (!applicationId) {
    return NextResponse.json(
      {
        success: false,
        message: "application_id is required",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    application_id: applicationId,
    current_status: getLatestStatus(applicationId),
    history: getStatusHistory(applicationId),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.application_id || !body.status) {
      return NextResponse.json(
        {
          success: false,
          message: "application_id and status are required",
        },
        { status: 400 }
      );
    }

    const status = addStatus(
      body.application_id,
      body.status,
      body.changed_by ?? null,
      body.note ?? null
    );

    return NextResponse.json(
      {
        success: true,
        data: status,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to create status history",
      },
      { status: 500 }
    );
  }
}