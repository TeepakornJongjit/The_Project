import { NextRequest, NextResponse } from "next/server";
import {
  getApplicationById,
  updateApplication,
} from "@/features/M03-application/application.service";

type RouteContext = {
  params: Promise<{
    applicationId: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  const { applicationId } = await context.params;

  const application = getApplicationById(applicationId);

  if (!application) {
    return NextResponse.json(
      {
        success: false,
        message: "Application not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: application,
  });
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const { applicationId } = await context.params;

  try {
    const body = await request.json();

    const application = updateApplication(applicationId, {
      scholarship_id: body.scholarship_id,
      application_date: body.application_date,
    });

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          message: "Application not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: application,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to update application",
      },
      { status: 400 }
    );
  }
}