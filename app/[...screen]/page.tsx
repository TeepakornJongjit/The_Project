import { notFound, redirect } from "next/navigation";

import { AuthPage } from "@/components/portal/PublicPages";

import {
  Applications,
  Dashboard,
  DetailPage,
  SearchPage,
} from "@/components/portal/StudentPages";

import {
  ApplyForm,
  Profile,
} from "@/components/portal/Forms";

import {
  Evaluation,
  ManageScholarships,
  Review,
  StaffDashboard,
} from "@/components/portal/StaffPages";

import {
  scholarships,
  screens,
} from "@/lib/ui-data";

import {
  getSessionUser,
  isStaffRole,
} from "@/lib/server/auth-session";

type Props = {
  params: Promise<{
    screen: string[];
  }>;

  searchParams: Promise<
    Record<
      string,
      string | string[] | undefined
    >
  >;
};

export async function generateMetadata({
  params,
}: Props) {
  const route =
    "/" +
    (await params).screen.join("/");

  return {
    title:
      screens.find(
        ([url]) => url === route,
      )?.[1] || "ทุนการศึกษา",
  };
}

export default async function Page({
  params,
  searchParams,
}: Props) {
  const path =
    (await params).screen.join("/");

  /*
   * ==========================
   * PUBLIC
   * ==========================
   */

  if (path === "register") {
    return <AuthPage register />;
  }

  if (path === "login") {
    const user =
      await getSessionUser();

    // Login อยู่แล้ว ไม่ต้องกลับมาหน้า Login
    if (user) {
      if (isStaffRole(user.role)) {
        redirect("/staff");
      }

      redirect("/dashboard");
    }

    return <AuthPage />;
  }

  /*
   * นักศึกษาที่ยังไม่ Login
   * สามารถดูรายการทุนได้
   */
  if (path === "scholarships") {
    return <SearchPage />;
  }

  /*
   * รายละเอียดทุนเดิม
   * ตอนนี้ยังคง UI เดิมไว้
   */
  if (
    path.startsWith(
      "scholarships/",
    )
  ) {
    const scholarship =
      scholarships.find(
        (item) =>
          path ===
          `scholarships/${item.id}`,
      );

    if (scholarship) {
      return (
        <DetailPage
          item={scholarship}
        />
      );
    }

    notFound();
  }

  /*
   * ==========================
   * ต้อง Login ตั้งแต่ตรงนี้
   * ==========================
   */

  const user =
    await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  /*
   * ==========================
   * STAFF
   * ==========================
   */

  if (path.startsWith("staff")) {
    if (!isStaffRole(user.role)) {
      redirect("/dashboard");
    }

    if (path === "staff") {
      return <StaffDashboard />;
    }

    if (
      path ===
      "staff/scholarships"
    ) {
      return (
        <ManageScholarships />
      );
    }

    if (
      path ===
      "staff/evaluation"
    ) {
      return <Evaluation />;
    }

    if (
      path ===
      "staff/review"
    ) {
      const query =
        await searchParams;

      const n =
        Number(
          query.applicant || 0,
        );

      return (
        <Review
          applicant={
            Number.isInteger(n) &&
            n >= 0 &&
            n < 6
              ? n
              : 0
          }
        />
      );
    }

    notFound();
  }

  /*
   * ==========================
   * STUDENT
   * ==========================
   */

  // Staff ไม่ควรใช้หน้าของ Student
  if (isStaffRole(user.role)) {
    redirect("/staff");
  }

  if (path === "dashboard") {
    return <Dashboard />;
  }

  if (path === "profile") {
    return <Profile />;
  }

  if (
    path === "applications"
  ) {
    return <Applications />;
  }

  if (path === "apply") {
    const query =
      await searchParams;

    return (
      <ApplyForm
        scholarshipId={
          typeof query.scholarship ===
          "string"
            ? query.scholarship
            : "academic"
        }
      />
    );
  }

  notFound();
}