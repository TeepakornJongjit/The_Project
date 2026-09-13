import type { Metadata } from "next";
import type { ReactNode } from "react";
import AppLayout from "@/components/portal/Shell";
import "./globals.css";
import "./ui-v1.css";

export const metadata: Metadata = {
  title: {
    default: "ระบบติดตามทุนการศึกษา",
    template: "%s | ระบบติดตามทุนการศึกษา",
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
