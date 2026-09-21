import { NextResponse } from "next/server";
import { submitApplication } from "@/features/M03-application/application.service";

type RouteContext = {
  params: Promise<{
    applicationId: string;
  }>;
};

export async function POST(
  _request: Request,
  context: RouteContext
) {
  const { applicationId } = await context.params;

  try {
    const application = submitApplication(applicationId);

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
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to submit application",
      },
      { status: 400 }
    );
  }
}