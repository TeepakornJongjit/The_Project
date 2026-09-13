"use client";
import {useActionState} from "react";
import {saveReference} from "@/app/actions/admin";
import {referenceLabels,type ReferenceItem} from "@/lib/admin/types";
export default function ReferenceForm({item}:{item?:ReferenceItem}){
 const [state,action,pending]=useActionState(saveReference,{error:"",success:""});
 return <form action={action} className="admin-edit-form">
   <input type="hidden" name="id" value={item?.id??""}/><input type="hidden" name="version" value={item?.version??""}/>
   {item?<input type="hidden" name="kind" value={item.kind}/>:<label>หมวดข้อมูล<select name="kind">{Object.entries(referenceLabels).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>}
   <label>ชื่อข้อมูล<input name="name" defaultValue={item?.name??""} required maxLength={150}/></label>
   <label>สถานะ<select name="active" defaultValue={String(item?.active??true)}><option value="true">เปิดใช้งาน</option><option value="false">ปิดใช้งาน</option></select></label>
   <label>เหตุผล<textarea name="reason" required minLength={3} maxLength={500}/></label>
   <button className="btn" disabled={pending}>{pending?"กำลังบันทึก…":item?"บันทึกการแก้ไข":"เพิ่มข้อมูล"}</button>
   {state.error&&<p role="alert" className="admin-error">{state.error}</p>}{state.success&&<p role="status" className="admin-success">{state.success}</p>}
 </form>;
}
