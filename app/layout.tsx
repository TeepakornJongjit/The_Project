import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ระบบติดตามทุนการศึกษา",
  description: "Scholarship Tracking System",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
