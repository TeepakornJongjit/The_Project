import type { Metadata } from "next";
import type { ReactNode } from "react";
import AppLayout from "@/layouts/AppLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "แดชบอร์ด | Campus Scholarship Portal",
    template: "%s | Campus Scholarship Portal",
  },
  description: "ระบบจัดการและติดตามทุนการศึกษาภายในมหาวิทยาลัย",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
