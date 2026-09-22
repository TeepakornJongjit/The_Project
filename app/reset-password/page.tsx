"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useState,
  type FormEvent,
} from "react";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function submit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const hash =
      window.location.hash.replace(
        /^#/,
        "",
      );

    const params =
      new URLSearchParams(hash);

    const accessToken =
      params.get("access_token") || "";

    const type =
      params.get("type");

    if (
      !accessToken ||
      type !== "recovery"
    ) {
      setMessage(
        "ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุ",
      );
      return;
    }

    const formData =
      new FormData(
        event.currentTarget,
      );

    const password = String(
      formData.get("password") || "",
    );

    const confirmPassword = String(
      formData.get("confirmPassword") || "",
    );

    if (password.length < 8) {
      setMessage(
        "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
      );
      return;
    }

    if (
      password !== confirmPassword
    ) {
      setMessage(
        "รหัสผ่านทั้งสองช่องไม่ตรงกัน",
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            accessToken,
            password,
            confirmPassword,
          }),
        },
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        setMessage(
          result.message ||
            "ไม่สามารถเปลี่ยนรหัสผ่านได้",
        );
        return;
      }

      window.history.replaceState(
        {},
        "",
        "/reset-password",
      );

      setMessage(
        "ตั้งรหัสผ่านใหม่สำเร็จ กำลังกลับหน้าเข้าสู่ระบบ...",
      );

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (error) {
      console.error(
        "RESET_PASSWORD_PAGE_ERROR:",
        error,
      );

      setMessage(
        "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "#f5faf8",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#ffffff",
          border:
            "1px solid #dfe9e5",
          borderRadius: "18px",
          padding: "36px",
        }}
      >
        <h1>
          ตั้งรหัสผ่านใหม่
        </h1>

        <p>
          ระบบติดตามทุนการศึกษา
        </p>

        <form onSubmit={submit}>
          <label>
            รหัสผ่านใหม่

            <input
              name="password"
              type="password"
              minLength={8}
              required
              autoComplete="new-password"
              placeholder="อย่างน้อย 8 ตัวอักษร"
            />
          </label>

          <label>
            ยืนยันรหัสผ่านใหม่

            <input
              name="confirmPassword"
              type="password"
              minLength={8}
              required
              autoComplete="new-password"
              placeholder="กรอกรหัสผ่านอีกครั้ง"
            />
          </label>

          <button
            className="btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "กำลังบันทึก..."
              : "ตั้งรหัสผ่านใหม่"}
          </button>
        </form>

        {message && (
          <p className="soft-box">
            {message}
          </p>
        )}

        <p>
          <Link href="/login">
            ← กลับหน้าเข้าสู่ระบบ
          </Link>
        </p>
      </section>
    </main>
  );
}