import {
  documents,
  type MockDocument,
} from "@/lib/mock/documents";

type CreateDocumentInput = {
  application_id: string;
  document_type: string;
  file_name: string;
};

type UpdateDocumentInput = {
  verification_status?: MockDocument["verification_status"];
  file_name?: string;
};

const REQUIRED_DOCUMENT_TYPES = [
  "application_form",
  "national_id",
  "house_registration",
  "transcript",
  "student_status_certificate",
  "income_certificate",
] as const;

export function getDocuments(applicationId?: string) {
  if (!applicationId) {
    return documents;
  }

  return documents.filter(
    (document) => document.application_id === applicationId
  );
}

export function getMissingRequiredDocuments(
  applicationId: string
) {
  const applicationDocuments = getDocuments(applicationId);

  return REQUIRED_DOCUMENT_TYPES.filter(
    (requiredType) =>
      !applicationDocuments.some(
        (document) =>
          document.document_type === requiredType &&
          document.verification_status === "verified"
      )
  );
}

export function getDocumentById(documentId: string) {
  return documents.find(
    (document) => document.document_id === documentId
  );
}

export function createDocument(
  input: CreateDocumentInput
): MockDocument {
  const newDocument: MockDocument = {
    document_id: `doc-${String(documents.length + 1).padStart(3, "0")}`,
    application_id: input.application_id,
    document_type: input.document_type,
    file_name: input.file_name,
    verification_status: "pending",
  };

  documents.push(newDocument);

  return newDocument;
}

export function updateDocument(
  documentId: string,
  input: UpdateDocumentInput
) {
  const document = getDocumentById(documentId);

  if (!document) {
    return null;
  }

  if (input.file_name !== undefined) {
    document.file_name = input.file_name;
  }

  if (input.verification_status !== undefined) {
    document.verification_status = input.verification_status;
  }

  return document;
}

export function deleteDocument(documentId: string) {
  const index = documents.findIndex(
    (document) => document.document_id === documentId
  );

  if (index === -1) {
    return null;
  }

  const deletedDocument = documents[index];

  documents.splice(index, 1);

  return deletedDocument;
}