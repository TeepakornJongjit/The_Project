import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import ScholarshipForm from "@/components/scholarships/ScholarshipForm";

export const metadata: Metadata = { title: "สร้างทุนการศึกษา" };

export default function NewScholarshipPage() {
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
