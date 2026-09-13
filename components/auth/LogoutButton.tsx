"use client";
import { useActionState } from "react";
import { logout } from "@/app/actions/auth";

export default function LogoutButton() {
  const [state, action, pending] = useActionState(logout, { error: "" });
  return (
    <form action={action}>
      <button className="text-button" type="submit" disabled={pending}>
        {pending ? "กำลังออกจากระบบ…" : "ออกจากระบบ"}
      </button>
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}
