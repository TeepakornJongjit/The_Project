import { supabase } from './lib/supabase.js'

document.querySelector('#root').innerHTML = `
  <main>
    <h1>ระบบติดตามทุนการศึกษา</h1>
    <p>Project foundation พร้อมเชื่อมต่อ Supabase</p>
  </main>
`

window.supabase = supabase
