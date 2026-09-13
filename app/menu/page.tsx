import { redirect } from "next/navigation";
import { requireViewer } from "@/lib/auth/server";
import { homeForRole } from "@/lib/auth/types";
export default async function Page() {
  const viewer = await requireViewer();
  redirect(homeForRole(viewer.role));
}
