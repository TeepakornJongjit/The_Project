import Link from "next/link";
import { requireRole } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import MemberManager from "@/components/admin/MemberManager";
import type { Member } from "@/lib/admin/types";

export default async function AdminPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  const viewer=await requireRole(["admin"]);
  const params=await searchParams;
  const q=typeof params.q==="string"?params.q.trim().slice(0,100):"";
  const role=typeof params.role==="string"?params.role:"";
  const status=typeof params.status==="string"?params.status:"";
  const page=Math.max(1,Math.min(10000,Math.floor(Number(params.page))||1));
  const client=await createClient();
  let query=client.from("portal_profiles").select("id,full_name,student_id,email,role,active,pending_role,version,created_at",{count:"exact"});
  // Filter syntax is constructed only from a restricted alphabet, not raw query input.
  const safe=q.replace(/[^\p{L}\p{N}@. _-]/gu,"");
  if(safe) query=query.or(`full_name.ilike.%${safe}%,student_id.ilike.%${safe}%,email.ilike.%${safe}%`);
  if(["student","staff","committee","admin"].includes(role)) query=query.eq("role",role);
  if(status==="pending") query=query.not("pending_role","is",null);
  if(status==="active"||status==="suspended") query=query.eq("active",status==="active");
  const {data,error,count}=await query.order("created_at",{ascending:false}).order("id").range((page-1)*20,page*20-1);
  if(error) throw new Error("โหลดบัญชีสมาชิกไม่สำเร็จ");
  const url=(p:number)=>"/admin?"+new URLSearchParams({q,role,status,page:String(p)});
  return <>
    <div className="admin-heading"><div><span className="admin-eyebrow">ADMINISTRATION</span><h1>จัดการบัญชีสมาชิก</h1><p>สวัสดี {viewer.fullName} · ดูแลบัญชีและสิทธิ์การใช้งานจากพื้นที่เดียว</p></div><Link className="btn secondary" href="/admin/audit">ประวัติการแก้ไข</Link></div>
    <p className="admin-note">ผู้สมัครใหม่เป็น Student เสมอ · Admin เลือกบทบาทแล้วกด “บันทึกและอนุมัติ” ครั้งเดียวเพื่อเปลี่ยนสิทธิ์ได้ทันที</p>
    <form className="admin-filters" method="get">
      <label>ค้นหาสมาชิก<input name="q" defaultValue={q} placeholder="ชื่อ รหัสนักศึกษา หรืออีเมล" maxLength={100}/></label>
      <label>บทบาท<select name="role" defaultValue={role}><option value="">ทุกบทบาท</option><option value="student">Student</option><option value="staff">Officer</option><option value="committee">Committee</option><option value="admin">Admin</option></select></label>
      <label>สถานะ<select name="status" defaultValue={status}><option value="">ทุกสถานะ</option><option value="pending">คำขอบทบาทเดิมที่ค้างอยู่</option><option value="active">เปิดใช้งาน</option><option value="suspended">ระงับบัญชี</option></select></label>
      <button className="btn">ค้นหา</button>
    </form>
    <p>พบ {count??0} บัญชี · หน้า {page}</p>
    <MemberManager members={(data??[]) as Member[]}/>
    <nav className="admin-pagination" aria-label="หน้ารายชื่อ">{page>1&&<Link href={url(page-1)}>← ก่อนหน้า</Link>}{page*20<(count??0)&&<Link href={url(page+1)}>ถัดไป →</Link>}</nav>
  </>;
}
