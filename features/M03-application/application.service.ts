import { addStatus } from "@/features/M03-application/status.service";
import { getMissingRequiredDocuments } from "@/features/M03-application/document.service";
import {
  applications,
  type MockApplication,
} from "@/lib/mock/applications";

type CreateApplicationInput = {
  scholarship_id: string;
  student_id: string;
};

type UpdateApplicationInput = {
  scholarship_id?: string;
  application_date?: string;
};

function hasDuplicateApplication(
  scholarshipId: string,
  studentId: string
) {
  return applications.some(
    (application) =>
      application.scholarship_id === scholarshipId &&
      application.student_id === studentId
  );
}

export function getApplications() {
  return applications;
}

export function getApplicationById(applicationId: string) {
  return applications.find(
    (application) => application.application_id === applicationId
  );
}

export function createApplication(
  input: CreateApplicationInput
): MockApplication {
    if (
    hasDuplicateApplication(
      input.scholarship_id,
      input.student_id
    )
  ) {
    throw new Error(
      "Student has already applied for this scholarship."
    );
  }
  
  const newApplication: MockApplication = {
    application_id: `app-${String(applications.length + 1).padStart(3, "0")}`,
    scholarship_id: input.scholarship_id,
    student_id: input.student_id,
    application_date: new Date().toISOString().slice(0, 10),
    current_status: "draft",
  };

  applications.push(newApplication);

  addStatus(
  newApplication.application_id,
  "draft",
  newApplication.student_id,
  "Application created"
);

  return newApplication;
}

export function updateApplication(
  applicationId: string,
  input: UpdateApplicationInput
) {
  const application = getApplicationById(applicationId);

  if (!application) {
    return null;
  }

  if (application.current_status !== "draft") {
    throw new Error("Only draft applications can be updated.");
  }

  if (input.scholarship_id !== undefined) {
    application.scholarship_id = input.scholarship_id;
  }

  if (input.application_date !== undefined) {
    application.application_date = input.application_date;
  }

  return application;
}

export function submitApplication(applicationId: string) {
  const application = getApplicationById(applicationId);

  if (!application) {
    return null;
  }

  if (application.current_status !== "draft") {
    throw new Error("Only draft applications can be submitted.");
  }

  const missingDocuments = getMissingRequiredDocuments(
  application.application_id
);

if (missingDocuments.length > 0) {
  throw new Error(
    "Required documents are missing or not verified."
  );
}

  application.current_status = "pending";

  addStatus(
    application.application_id,
    "pending",
    application.student_id,
    "Application submitted"
  );

  return application;
}