// Pass [{email,password,role}] for all four roles through stdin; no credentials are logged.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
let input=''; for await(const part of process.stdin) input+=part;
const accounts=JSON.parse(input); input='';
const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const base=process.env.AUTH_TEST_BASE_URL??'http://localhost:3000';
const anon=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
const avatar=await sharp({create:{width:4,height:4,channels:3,background:'#2563eb'}}).webp().toBuffer();
for(const account of accounts){
 const jar=new Map();
 const client=createServerClient(url,key,{cookies:{getAll:()=>[...jar].map(([name,value])=>({name,value})),setAll:items=>items.forEach(item=>jar.set(item.name,item.value))}});
 let path;
 try{
  const {data,error}=await client.auth.signInWithPassword({email:account.email,password:account.password}); account.password='';
  assert.equal(error,null,'login '+account.role);
  const cookie=[...jar].map(([name,value])=>`${name}=${value}`).join('; ');
  const response=await fetch(base+'/profile',{headers:{cookie}});
  assert.equal(response.status,200);
  const html=await response.text();
  assert(html.includes('ข้อมูลส่วนตัวและการติดต่อ')&&html.includes('แก้ไขข้อมูล / รูปโปรไฟล์'));
  assert(html.includes(account.role==='student'?'ข้อมูลการศึกษา':'ข้อมูลการทำงาน'));
  assert(html.includes('name="new_email"')&&html.includes('name="current_password"'),'own email-change form');
  assert(!html.includes('name="phone"'),'profile editor is closed initially');
  assert(!html.includes('name="role"')&&!html.includes('name="full_name"'),'identity fields must be read-only');
  path=`${data.user.id}/${randomUUID()}.webp`;
  assert.equal((await client.storage.from('portal-avatars').upload(path,avatar,{contentType:'image/webp'})).error,null,'own upload');
  assert.equal((await client.storage.from('portal-avatars').download(path)).error,null,'own private download');
  assert((await anon.storage.from('portal-avatars').download(path)).error,'anonymous private download denied');
  const publicURL=client.storage.from('portal-avatars').getPublicUrl(path).data.publicUrl;
  const publicResponse=await fetch(publicURL); assert(!publicResponse.ok,'public URL denied'); await publicResponse.body?.cancel();
  const foreign=`${randomUUID()}/${randomUUID()}.webp`;
  assert((await client.storage.from('portal-avatars').upload(foreign,avatar,{contentType:'image/webp'})).error,'foreign upload denied');
  assert((await client.storage.from('portal-avatars').upload(`${data.user.id}/${randomUUID()}.svg`,Buffer.from('<svg/>'),{contentType:'image/svg+xml'})).error,'SVG denied');
  const removed=await client.storage.from('portal-avatars').remove([path]);
  assert.equal(removed.error,null,'unused upload cleanup');
  const listed=await client.storage.from('portal-avatars').list(data.user.id,{search:path.split('/')[1]});
  assert.equal(listed.error,null); assert.equal(listed.data.length,0,'file actually removed'); path=null;
  console.log('PASS: '+account.role+' form fields, private upload/read, anonymous/foreign/SVG denial and cleanup');
 }finally{
  if(path)await client.storage.from('portal-avatars').remove([path]);
  await client.auth.signOut({scope:'local'});
 }
}
const response=await fetch(base+'/account/avatar'); assert.equal(response.status,401); await response.body?.cancel();
console.log('PASS: anonymous avatar route denied');
