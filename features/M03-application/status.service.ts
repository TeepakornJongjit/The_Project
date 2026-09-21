import {
  applicationStatuses,
  type MockApplicationStatus,
} from "@/lib/mock/application-status";

export function getStatusHistory(applicationId: string) {
  return applicationStatuses.filter(
    (status) => status.application_id === applicationId
  );
}

export function getLatestStatus(applicationId: string) {
  const history = getStatusHistory(applicationId);

  return history.length > 0
    ? history[history.length - 1]
    : null;
}

export function addStatus(
  applicationId: string,
  status: string,
  changedBy: string | null,
  note: string | null
): MockApplicationStatus {
  const newStatus: MockApplicationStatus = {
    status_id: `status-${String(
      applicationStatuses.length + 1
    ).padStart(3, "0")}`,
    application_id: applicationId,
    status,
    changed_at: new Date().toISOString(),
    changed_by: changedBy,
    note,
  };

  applicationStatuses.push(newStatus);

  return newStatus;
}