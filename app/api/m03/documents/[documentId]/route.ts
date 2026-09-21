import { NextRequest, NextResponse } from "next/server";
import {
  deleteDocument,
  getDocumentById,
  updateDocument,
} from "@/features/M03-application/document.service";

type RouteContext = {
  params: Promise<{
    documentId: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  const { documentId } = await context.params;

  const document = getDocumentById(documentId);

  if (!document) {
    return NextResponse.json(
      {
        success: false,
        message: "Document not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: document,
  });
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const { documentId } = await context.params;

  try {
    const body = await request.json();

    const document = updateDocument(documentId, {
      file_name: body.file_name,
      verification_status: body.verification_status,
    });

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          message: "Document not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: document,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to update document",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  const { documentId } = await context.params;

  const document = deleteDocument(documentId);

  if (!document) {
    return NextResponse.json(
      {
        success: false,
        message: "Document not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Document deleted successfully",
    data: document,
  });
}