import React, { useState } from 'react';
import { supabase } from '../lib/supabase'; // ดึงตัวเชื่อมต่อฐานข้อมูลมาใช้งาน

export default function CreateScholarship() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '', 
    amount: '',
    quota: '',
    startDate: '',
    deadline: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // เปลี่ยนฟังก์ชันให้เป็น async เพื่อรอผลจากฐานข้อมูล
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ส่งข้อมูลไปบันทึกลงตาราง SCHOLARSHIP
    const { data, error } = await supabase
      .from('SCHOLARSHIP')
      .insert([
        {
          title: formData.title,
          category: formData.category,
          amount: parseFloat(formData.amount), // แปลงตัวหนังสือเป็นตัวเลข
          quota: parseInt(formData.quota),     // แปลงตัวหนังสือเป็นจำนวนเต็ม
          start_date: formData.startDate,
          deadline: formData.deadline,
          description: formData.description
        }
      ]);

    if (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      alert('บันทึกไม่สำเร็จ: ' + error.message);
    } else {
      alert('บันทึกข้อมูลทุนลงฐานข้อมูลสำเร็จ!');
      setIsModalOpen(false); // ปิด Popup
      
      // ล้างค่าในฟอร์มให้ว่างเปล่าเตรียมรับข้อมูลใหม่
      setFormData({
        title: '', category: '', amount: '', quota: '', startDate: '', deadline: '', description: ''
      });
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      
      <button
        onClick={() => setIsModalOpen(true)}
        style={{ background: '#16a34a', color: '#fff', padding: '12px 24px', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
      >
        + เพิ่มทุนการศึกษา
      </button>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          
          <div style={{ width: '100%', maxWidth: '600px', padding: '24px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', position: 'relative' }}>
            
            <button 
              onClick={() => setIsModalOpen(false)} 
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666' }}
            >
              ✕
            </button>

            <h2 style={{ marginBottom: '20px', color: '#333' }}>สร้างทุนการศึกษา</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>ชื่อทุนการศึกษา:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>ประเภททุน:</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}
                  required
                >
                  <option value="" disabled>-- กรุณาเลือกประเภททุน --</option>
                  <option value="ทุนเรียนดี">ทุนเรียนดี</option>
                  <option value="ทุนกิจกรรม">ทุนกิจกรรม</option>
                  <option value="ทุนขาดแคลนทุนทรัพย์">ทุนขาดแคลนทุนทรัพย์</option>
                  <option value="ทุนความสามารถพิเศษ">ทุนความสามารถพิเศษ</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>จำนวนเงิน (บาท):</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>จำนวนโควตา:</label>
                  <input
                    type="number"
                    name="quota"
                    value={formData.quota}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>วันที่เปิดรับสมัคร:</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>วันปิดรับสมัคร:</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>รายละเอียดเงื่อนไข:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: '#e5e7eb', color: '#374151', padding: '10px 20px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  style={{ background: '#2563eb', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  บันทึกทุนการศึกษา
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
