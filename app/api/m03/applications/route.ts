import { NextRequest, NextResponse } from "next/server";
import { createApplication } from "@/features/M03-application/application.service";
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

    if (!body.scholarship_id || !body.student_id) {
      return NextResponse.json(
        {
          success: false,
          message: "scholarship_id and student_id are required",
        },
        { status: 400 }
      );
    }

    const application = createApplication({
      scholarship_id: body.scholarship_id,
      student_id: body.student_id,
    });

    return NextResponse.json(
      {
        success: true,
        data: application,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to create application",
      },
      { status: 400 }
    );
  }
}