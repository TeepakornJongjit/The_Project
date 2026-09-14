export const applicationResults = [
  { application_result_id: "result-001", application_id: "app-003", result: "approved", announced_at: "2026-09-10", remark: "ผ่านการพิจารณา" },
] as const;

export const disbursements = [
  { disbursement_id: "pay-001", application_id: "app-003", amount: 10000, status: "paid", transfer_date: "2026-09-12", transfer_reference: "MOCK-TRANSFER-001" },
] as const;

export const followUps = [
  { follow_up_id: "follow-001", application_id: "app-003", follow_up_type: "รายงานผลการศึกษา", title: "ติดตามผลหลังได้รับทุน", status: "pending", due_date: "2026-12-31" },
] as const;
