import { NextRequest, NextResponse } from "next/server";
import {
  createDocument,
  getDocuments,
} from "@/features/M03-application/document.service";

export async function GET(request: NextRequest) {
  const applicationId =
    request.nextUrl.searchParams.get("application_id") ??
    undefined;

  return NextResponse.json({
    success: true,
    data: getDocuments(applicationId),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (
      !body.application_id ||
      !body.document_type ||
      !body.file_name
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "application_id, document_type and file_name are required",
        },
        { status: 400 }
      );
    }

    const document = createDocument({
      application_id: body.application_id,
      document_type: body.document_type,
      file_name: body.file_name,
    });

    return NextResponse.json(
      {
        success: true,
        data: document,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to create document",
      },
      { status: 500 }
    );
  }
}