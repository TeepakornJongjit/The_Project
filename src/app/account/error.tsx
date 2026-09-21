"use client";
export default function AccountError({ reset }: { reset: () => void }) {
  return <section className="panel"><h1>โหลดโปรไฟล์ไม่สำเร็จ</h1><p>กรุณาลองใหม่อีกครั้ง</p><button onClick={reset}>ลองใหม่</button></section>;
}
