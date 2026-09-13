"use client";
export default function AdminError({reset}:{reset:()=>void}){return <section className="admin-card"><h1>โหลดข้อมูลไม่สำเร็จ</h1><p>กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่</p><button className="btn" onClick={reset}>ลองอีกครั้ง</button></section>;}
