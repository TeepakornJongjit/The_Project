export const reviewAssignments = [
  { review_assignment_id: "assign-001", application_id: "app-003", committee_member_id: "user-004", assigned_at: "2026-09-08" },
] as const;

export const evaluations = [
  { evaluation_id: "eval-001", review_assignment_id: "assign-001", score: 88, comment: "คุณสมบัติและเอกสารครบถ้วน", evaluated_at: "2026-09-09" },
] as const;
