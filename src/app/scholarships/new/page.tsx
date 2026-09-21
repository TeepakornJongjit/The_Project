import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import ScholarshipForm from "@/components/scholarships/ScholarshipForm";
import { requireRole } from "@/lib/auth/server";

export const metadata: Metadata = { title: "สร้างทุนการศึกษา" };

export default async function NewScholarshipPage() {
  await requireRole(["staff"]);
  return (
    <div className="portal-page-stack">
      <PageHeader
        eyebrow="ประกาศทุน"
        title="สร้างทุนการศึกษา"
        description="เตรียมรายละเอียดทุนและตรวจสอบตัวอย่างก่อนนำไปประกาศ"
      />
      <ScholarshipForm />
    </div>
  );
}
