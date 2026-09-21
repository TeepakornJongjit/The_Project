export type MockDocument = {
  document_id: string;
  application_id: string;
  document_type: string;
  file_name: string;
  verification_status:
    | "pending"
    | "verified"
    | "revision_requested";
};

export const documents: MockDocument[] = [
  {
    document_id: "doc-001",
    application_id: "app-001",
    document_type: "application_form",
    file_name: "application-form-student-001.pdf",
    verification_status: "verified",
  },
  {
    document_id: "doc-002",
    application_id: "app-001",
    document_type: "national_id",
    file_name: "national-id-student-001.pdf",
    verification_status: "verified",
  },
  {
    document_id: "doc-003",
    application_id: "app-001",
    document_type: "house_registration",
    file_name: "house-registration-student-001.pdf",
    verification_status: "verified",
  },
  {
    document_id: "doc-004",
    application_id: "app-001",
    document_type: "transcript",
    file_name: "transcript-student-001.pdf",
    verification_status: "verified",
  },
  {
    document_id: "doc-005",
    application_id: "app-001",
    document_type: "student_status_certificate",
    file_name: "student-status-student-001.pdf",
    verification_status: "verified",
  },
  {
    document_id: "doc-006",
    application_id: "app-001",
    document_type: "income_certificate",
    file_name: "income-student-001.pdf",
    verification_status: "verified",
  },
  {
    document_id: "doc-007",
    application_id: "app-002",
    document_type: "transcript",
    file_name: "transcript-student-002.pdf",
    verification_status: "pending",
  },
  {
    document_id: "doc-008",
    application_id: "app-002",
    document_type: "income_certificate",
    file_name: "income-student-002.pdf",
    verification_status: "revision_requested",
  },
];