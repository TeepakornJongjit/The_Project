export const documents = [
  { document_id: "doc-001", application_id: "app-001", document_type: "transcript", file_name: "transcript-student-001.pdf", verification_status: "pending" },
  { document_id: "doc-002", application_id: "app-001", document_type: "student_card", file_name: "student-card-student-001.pdf", verification_status: "verified" },
  { document_id: "doc-003", application_id: "app-002", document_type: "income_certificate", file_name: "income-student-002.pdf", verification_status: "revision_requested" },
] as const;
