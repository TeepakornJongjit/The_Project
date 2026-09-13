import type { ComponentPropsWithoutRef } from "react";

export default function Card({ className = "", ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={["portal-card", className].filter(Boolean).join(" ")} {...props} />;
}
