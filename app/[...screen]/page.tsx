import { notFound } from "next/navigation";
import { AuthPage } from "@/components/portal/PublicPages";
import {
  Applications,
  Dashboard,
  DetailPage,
  SearchPage,
} from "@/components/portal/StudentPages";
import { ApplyForm, Profile } from "@/components/portal/Forms";
import {
  Evaluation,
  ManageScholarships,
  Review,
  StaffDashboard,
} from "@/components/portal/StaffPages";
import { scholarships, screens } from "@/lib/ui-data";
type Props = {
  params: Promise<{ screen: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export async function generateMetadata({ params }: Props) {
  const route = "/" + (await params).screen.join("/");
  return {
    title: screens.find(([url]) => url === route)?.[1] || "ทุนการศึกษา",
  };
}
export default async function Page({ params, searchParams }: Props) {
  const path = (await params).screen.join("/");
  if (path === "register") return <AuthPage register />;
  if (path === "login") return <AuthPage />;
  if (path === "dashboard") return <Dashboard />;
  if (path === "profile") return <Profile />;
  if (path === "scholarships") return <SearchPage />;
  if (path === "applications") return <Applications />;
  if (path === "staff") return <StaffDashboard />;
  if (path === "staff/scholarships") return <ManageScholarships />;
  if (path === "staff/evaluation") return <Evaluation />;
  if (path === "staff/review") {
    const query = await searchParams;
    const n = Number(query.applicant || 0);
    return (
      <Review applicant={Number.isInteger(n) && n >= 0 && n < 6 ? n : 0} />
    );
  }
  if (path === "apply") {
    const query = await searchParams;
    return (
      <ApplyForm
        scholarshipId={
          typeof query.scholarship === "string" ? query.scholarship : "academic"
        }
      />
    );
  }
  if (path.startsWith("scholarships/")) {
    const s = scholarships.find((s) => path === `scholarships/${s.id}`);
    if (s) return <DetailPage item={s} />;
  }
  notFound();
}
