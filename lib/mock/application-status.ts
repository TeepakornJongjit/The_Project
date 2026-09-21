export type MockApplicationStatus = {
  status_id: string;
  application_id: string;
  status: string;
  changed_at: string;
  changed_by: string | null;
  note: string | null;
};

export const applicationStatuses: MockApplicationStatus[] = [
  {
    status_id: "status-001",
    application_id: "app-001",
    status: "draft",
    changed_at: "2026-09-04T09:00:00Z",
    changed_by: "student-001",
    note: "Application created",
  },
  {
    status_id: "status-002",
    application_id: "app-001",
    status: "pending",
    changed_at: "2026-09-05T10:00:00Z",
    changed_by: "student-001",
    note: "Application submitted",
  },
  {
    status_id: "status-003",
    application_id: "app-002",
    status: "document_review",
    changed_at: "2026-09-06T13:00:00Z",
    changed_by: "staff-001",
    note: "Documents are being reviewed",
  },
  {
    status_id: "status-004",
    application_id: "app-003",
    status: "approved",
    changed_at: "2026-09-07T15:00:00Z",
    changed_by: "staff-001",
    note: "Application approved",
  },
];