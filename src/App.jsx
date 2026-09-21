import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

// พจนานุกรมสำหรับรองรับ 2 ภาษา (ไทย / อังกฤษ)
const translations = {
  th: {
    portalTitle: "Campus Scholarship Portal",
    portalSubtitle: "ระบบทุนการศึกษาภายในมหาวิทยาลัย",
    dashboard: "แดชบอร์ด",
    scholarships: "ทุนการศึกษา",
    apply: "สมัครทุน",
    myApplications: "ใบสมัครของฉัน",
    documents: "เอกสาร",
    user: "ผู้ใช้งานระบบ",
    welcome: "ยินดีต้อนรับกลับมา",
    systemTitle: "ระบบจัดการทุนการศึกษา",
    systemDesc: "มาร่วมค้นหาโอกาสดีๆ เพื่อพัฒนาตนเอง เพิ่มศักยภาพ และสร้างอนาคตที่ดีไปด้วยกัน",
    allScholarships: "🌟 รายชื่อทุนการศึกษาทั้งหมดในระบบ",
    addScholarshipBtn: "+ เพิ่มทุนการศึกษาใหม่",
    loading: "กำลังโหลดข้อมูลทุน...",
    noData: "ยังไม่มีข้อมูลทุนการศึกษาในระบบ กดปุ่ม \"+ เพิ่มทุนการศึกษาใหม่\" ด้านบนเพื่อเพิ่มข้อมูลได้เลย",
    quota: "โควตา",
    amount: "มูลค่าทุน",
    deadline: "ปิดรับสมัคร",
    detailsBtn: "ดูรายละเอียด",
    applyBtn: "สมัครทุน",
    baht: "บาท",
    // Modal เพิ่มทุน
    addModalTitle: "📝 เพิ่มทุนการศึกษาใหม่",
    titleLabel: "ชื่อทุนการศึกษา:",
    categoryLabel: "ประเภททุน:",
    selectCategory: "-- เลือกประเภท --",
    cat1: "ทุนเรียนดี",
    cat2: "ทุนพัฒนาทักษะ",
    cat3: "ทุนกิจกรรม",
    cat4: "ทุนขาดแคลนทุนทรัพย์",
    amountLabel: "จำนวนเงิน (บาท):",
    quotaLabel: "จำนวนโควตา:",
    startDateLabel: "วันที่เปิด:",
    deadlineLabel: "วันปิดรับ:",
    descLabel: "รายละเอียด:",
    cancelBtn: "ยกเลิก",
    saveBtn: "บันทึก",
    // Modal สมัครทุน
    applyModalTitle: "สมัครทุน",
    applyModalSubtitle: "กรอกข้อมูลเพื่อยืนยันการสมัครทุนการศึกษาภายในมหาวิทยาลัย",
    steps: ['ข้อมูลส่วนตัว', 'ข้อมูลการศึกษา', 'ฐานะการเงิน', 'เหตุผล', 'บัญชีธนาคาร', 'อัปโหลดเอกสาร'],
    nameLabel: "ชื่อ - นามสกุล (ตัวอักขระ) *",
    studentIdLabel: "รหัสนักศึกษา (ตัวเลขเท่านั้น) *",
    facultyLabel: "คณะ (ตัวอักขระ) *",
    majorLabel: "สาขาวิชา (ตัวอักขระ) *",
    yearLabel: "ชั้นปี *",
    gpaLabel: "เกรดเฉลี่ยสะสม GPAX (ตัวเลข 0.00 - 4.00) *",
    phoneLabel: "เบอร์โทรศัพท์มือถือ (ตัวเลข 10 หลัก) *",
    emailLabel: "อีเมล *",
    addressLabel: "ที่อยู่ปัจจุบัน:",
    incomeLabel: "รายได้ครอบครัวรวมต่อปี (ตัวเลขเท่านั้น):",
    familyStatusLabel: "สถานะทางครอบครัว:",
    reasonLabel: "เหตุผลและความจำเป็นในการขอรับทุนการศึกษา:",
    bankLabel: "ธนาคาร:",
    bankAccLabel: "เลขที่บัญชี (ตัวเลขเท่านั้น):",
    uploadLabel: "อัปโหลดเอกสารใบแสดงผลการเรียน (Transcript) / บัตรนักศึกษา:",
    backBtn: "ย้อนกลับ",
    nextBtn: "ถัดไป ➔",
    confirmApplyBtn: "ยืนยันการส่งใบสมัคร",
    summaryTitle: "🔹 สรุปทุนที่สมัคร",
    advice: "คำแนะนำ: กรอกข้อมูลตัวเลขและตัวอักษรให้ถูกต้องครบถ้วนก่อนกดยืนยันการส่งใบสมัคร"
  },
  en: {
    portalTitle: "Campus Scholarship Portal",
    portalSubtitle: "University Scholarship Management System",
    dashboard: "Dashboard",
    scholarships: "Scholarships",
    apply: "Apply",
    myApplications: "My Applications",
    documents: "Documents",
    user: "System User",
    welcome: "Welcome Back",
    systemTitle: "Scholarship Management System",
    systemDesc: "Explore great opportunities to develop yourself, enhance potential, and build a better future together.",
    allScholarships: "🌟 All Scholarships in the System",
    addScholarshipBtn: "+ Add New Scholarship",
    loading: "Loading scholarship data...",
    noData: "No scholarship data available. Click \"+ Add New Scholarship\" above to add data.",
    quota: "Quota",
    amount: "Amount",
    deadline: "Deadline",
    detailsBtn: "View Details",
    applyBtn: "Apply Now",
    baht: "THB",
    // Modal เพิ่มทุน
    addModalTitle: "📝 Add New Scholarship",
    titleLabel: "Scholarship Name:",
    categoryLabel: "Category:",
    selectCategory: "-- Select Category --",
    cat1: "Academic Excellence",
    cat2: "Skill Development",
    cat3: "Activity Scholarship",
    cat4: "Need-based Scholarship",
    amountLabel: "Amount (THB):",
    quotaLabel: "Quota Slots:",
    startDateLabel: "Start Date:",
    deadlineLabel: "Deadline:",
    descLabel: "Description:",
    cancelBtn: "Cancel",
    saveBtn: "Save",
    // Modal สมัครทุน
    applyModalTitle: "Apply for Scholarship",
    applyModalSubtitle: "Fill in the information to confirm your scholarship application.",
    steps: ['Personal Info', 'Education', 'Financial Status', 'Reason', 'Bank Account', 'Upload Docs'],
    nameLabel: "Full Name (Text only) *",
    studentIdLabel: "Student ID (Numbers only) *",
    facultyLabel: "Faculty (Text only) *",
    majorLabel: "Major (Text only) *",
    yearLabel: "Year *",
    gpaLabel: "GPAX (Number 0.00 - 4.00) *",
    phoneLabel: "Mobile Phone (10 digits) *",
    emailLabel: "Email *",
    addressLabel: "Current Address:",
    incomeLabel: "Annual Family Income (Numbers only):",
    familyStatusLabel: "Family Status:",
    reasonLabel: "Reason and Necessity for Scholarship:",
    bankLabel: "Bank:",
    bankAccLabel: "Account Number (Numbers only):",
    uploadLabel: "Upload Transcript / Student ID Card:",
    backBtn: "Back",
    nextBtn: "Next ➔",
    confirmApplyBtn: "Confirm Application",
    summaryTitle: "🔹 Application Summary",
    advice: "Tip: Please fill in all required numbers and text accurately before confirming your application."
  }
};

export default function ScholarshipDashboard() {
  const [lang, setLang] = useState('th'); // ค่าเริ่มต้นภาษาไทย ('th' หรือ 'en')
  const t = translations[lang];

  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State สำหรับเพิ่มทุน
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', category: '', amount: '', quota: '', startDate: '', deadline: '', description: '',
  });

  // Modal State สำหรับสมัครทุน
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [step, setStep] = useState(1); 
  
  const [applyData, setApplyData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    faculty: '',
    major: '',
    year: '',
    gpa: '',
    phone: '',
    email: '',
    address: '',
    familyIncome: '',
    bankAccount: '',
    reason: ''
  });

  // ดึงข้อมูลทุนจาก Supabase
  const fetchScholarships = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('scholarship')
      .select('*');

    if (error) {
      console.error('Error fetching scholarships:', error);
    } else {
      setScholarships(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  const handleAddChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('scholarship').insert([
      {
        title: formData.title,
        category: formData.category,
        amount: parseFloat(formData.amount),
        quota: parseInt(formData.quota),
        start_date: formData.startDate,
        deadline: formData.deadline,
        description: formData.description
      }
    ]);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert(lang === 'th' ? 'เพิ่มทุนการศึกษาสำเร็จ!' : 'Scholarship added successfully!');
      setIsAddModalOpen(false);
      setFormData({ title: '', category: '', amount: '', quota: '', startDate: '', deadline: '', description: '' });
      fetchScholarships();
    }
  };

  const handleOpenApply = (scholarship) => {
    setSelectedScholarship(scholarship);
    setStep(1);
    setIsApplyModalOpen(true);
  };

  const handleNumericChange = (e, maxLength) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, '');
    if (maxLength && numericValue.length > maxLength) return;
    setApplyData({ ...applyData, [name]: numericValue });
  };

  const handleGpaChange = (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) <= 4.00)) {
      setApplyData({ ...applyData, gpa: value });
    }
  };

  const handleTextChange = (e) => {
    setApplyData({ ...applyData, [e.target.name]: e.target.value });
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    alert(lang === 'th' ? `ส่งใบสมัครทุน "${selectedScholarship.title}" สำเร็จเรียบร้อยแล้ว!` : `Successfully applied for "${selectedScholarship.title}"!`);
    setIsApplyModalOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#DAFAFA', fontFamily: 'sans-serif', margin: 0, paddingBottom: '40px' }}>
      
      {/* 1. Navbar + ปุ่มสลับภาษา */}
      <header style={{ backgroundColor: '#9DCAEB', color: '#1e3a5f', padding: '14px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#AFD5F0', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '18px' }}>🎓</div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e3a5f' }}>{t.portalTitle}</div>
            <div style={{ fontSize: '11px', color: '#334155' }}>{t.portalSubtitle}</div>
          </div>
        </div>
        
        <nav style={{ display: 'flex', gap: '20px', fontSize: '14px', alignItems: 'center' }}>
          <span style={{ cursor: 'pointer', color: '#1e3a5f', fontWeight: 'bold' }}>{t.dashboard}</span>
          <span style={{ cursor: 'pointer', color: '#334155' }}>{t.scholarships}</span>
          <span style={{ cursor: 'pointer', color: '#334155' }}>{t.apply}</span>
          <span style={{ cursor: 'pointer', color: '#334155' }}>{t.myApplications}</span>
          <span style={{ cursor: 'pointer', color: '#334155' }}>{t.documents}</span>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* ปุ่มสลับภาษา TH / EN */}
          <div style={{ display: 'flex', backgroundColor: '#AFD5F0', borderRadius: '20px', padding: '3px' }}>
            <button 
              onClick={() => setLang('th')} 
              style={{ backgroundColor: lang === 'th' ? '#9DCAEB' : 'transparent', border: 'none', padding: '4px 10px', borderRadius: '15px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', color: '#1e3a5f' }}
            >
              TH
            </button>
            <button 
              onClick={() => setLang('en')} 
              style={{ backgroundColor: lang === 'en' ? '#9DCAEB' : 'transparent', border: 'none', padding: '4px 10px', borderRadius: '15px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', color: '#1e3a5f' }}
            >
              EN
            </button>
          </div>

          <div style={{ background: '#AFD5F0', padding: '6px 14px', borderRadius: '20px' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1e3a5f' }}>{t.user}</span>
          </div>
        </div>
      </header>

      {/* 2. Main Content */}
      <div style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 20px' }}>
        
        {/* Banner */}
        <div style={{ background: 'linear-gradient(135deg, #9DCAEB 0%, #AFD5F0 100%)', borderRadius: '12px', padding: '30px 40px', color: '#1e3a5f', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(157, 202, 235, 0.3)' }}>
          <div>
            <p style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#334155' }}>{t.welcome}</p>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '26px', color: '#1e3a5f' }}>{t.systemTitle}</h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#334155' }}>{t.systemDesc}</p>
          </div>
        </div>

        {/* Header Title & Add Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '35px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', color: '#1e3a5f', margin: 0 }}>{t.allScholarships}</h2>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{ backgroundColor: '#9DCAEB', color: '#1e3a5f', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
          >
            {t.addScholarshipBtn}
          </button>
        </div>

        {/* 3. Scholarships Card Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>{t.loading}</div>
        ) : scholarships.length === 0 ? (
          <div style={{ background: '#fff', padding: '40px', borderRadius: '8px', textAlign: 'center', color: '#6b7280', border: '1px solid #C3EEFA' }}>
            {t.noData}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
            {scholarships.map((item) => (
              <div key={item.id} style={{ background: '#fff', borderRadius: '10px', padding: '20px', border: '1px solid #C3EEFA', boxShadow: '0 2px 6px rgba(195, 238, 250, 0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span style={{ backgroundColor: '#C3EEFA', color: '#1e3a5f', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                      {item.category || 'General'}
                    </span>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{t.quota}: {item.quota}</span>
                  </div>
                  
                  <h3 style={{ fontSize: '16px', color: '#1e3a5f', margin: '0 0 10px 0' }}>{item.title}</h3>
                  <p style={{ fontSize: '13px', color: '#4b5563', margin: '0 0 16px 0', lineHeight: '1.4' }}>{item.description || '-'}</p>

                  <div style={{ borderTop: '1px solid #DAFAFA', paddingTop: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                      <span style={{ color: '#6b7280' }}>{t.amount}:</span>
                      <strong style={{ color: '#0369a1' }}>{Number(item.amount).toLocaleString()} {t.baht}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }}>
                      <span>{t.deadline}:</span>
                      <span style={{ color: '#dc2626', fontWeight: '500' }}>{item.deadline}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ flex: 1, backgroundColor: '#DAFAFA', color: '#1e3a5f', border: '1px solid #C3EEFA', padding: '8px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {t.detailsBtn}
                  </button>
                  <button 
                    onClick={() => handleOpenApply(item)}
                    style={{ flex: 1, backgroundColor: '#9DCAEB', color: '#1e3a5f', border: 'none', padding: '8px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    {t.applyBtn}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal 1: เพิ่มทุน */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '550px', background: '#fff', borderRadius: '12px', padding: '24px', maxHeight: '90vh', overflowY: 'auto', border: '2px solid #9DCAEB' }}>
            <h2 style={{ marginBottom: '20px', color: '#1e3a5f', fontSize: '20px' }}>{t.addModalTitle}</h2>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px' }}>{t.titleLabel}</label>
                <input type="text" name="title" value={formData.title} onChange={handleAddChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #9DCAEB', boxSizing: 'border-box' }} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px' }}>{t.categoryLabel}</label>
                <select name="category" value={formData.category} onChange={handleAddChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #9DCAEB', backgroundColor: '#fff', boxSizing: 'border-box' }} required>
                  <option value="" disabled>{t.selectCategory}</option>
                  <option value={t.cat1}>{t.cat1}</option>
                  <option value={t.cat2}>{t.cat2}</option>
                  <option value={t.cat3}>{t.cat3}</option>
                  <option value={t.cat4}>{t.cat4}</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px' }}>{t.amountLabel}</label>
                  <input type="number" name="amount" value={formData.amount} onChange={handleAddChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #9DCAEB', boxSizing: 'border-box' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px' }}>{t.quotaLabel}</label>
                  <input type="number" name="quota" value={formData.quota} onChange={handleAddChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #9DCAEB', boxSizing: 'border-box' }} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px' }}>{t.startDateLabel}</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleAddChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #9DCAEB', boxSizing: 'border-box' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px' }}>{t.deadlineLabel}</label>
                  <input type="date" name="deadline" value={formData.deadline} onChange={handleAddChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #9DCAEB', boxSizing: 'border-box' }} required />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px' }}>{t.descLabel}</label>
                <textarea name="description" value={formData.description} onChange={handleAddChange} rows="3" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #9DCAEB', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ backgroundColor: '#DAFAFA', color: '#1e3a5f', padding: '10px 18px', border: '1px solid #C3EEFA', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>{t.cancelBtn}</button>
                <button type="submit" style={{ backgroundColor: '#9DCAEB', color: '#1e3a5f', padding: '10px 20px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>{t.saveBtn}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: สมัครทุน */}
      {isApplyModalOpen && selectedScholarship && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '1000px', background: '#DAFAFA', borderRadius: '12px', padding: '30px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
            
            <button onClick={() => setIsApplyModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#666' }}>✕</button>

            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', color: '#1e3a5f', margin: '0 0 5px 0' }}>{t.applyModalTitle}</h2>
              <p style={{ fontSize: '13px', color: '#334155', margin: 0 }}>{t.applyModalSubtitle}</p>
            </div>

            {/* Stepper Indicator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#fff', padding: '15px 20px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #C3EEFA', textAlign: 'center' }}>
              {t.steps.map((lbl, idx) => (
                <div key={idx} style={{ opacity: step === idx + 1 ? 1 : 0.5, fontWeight: step === idx + 1 ? 'bold' : 'normal', color: step === idx + 1 ? '#1e3a5f' : '#4b5563', fontSize: '13px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: step === idx + 1 ? '#9DCAEB' : '#C3EEFA', color: step === idx + 1 ? '#1e3a5f' : '#666', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 4px', fontSize: '12px' }}>{idx + 1}</div>
                  {lbl}
                </div>
              ))}
            </div>

            {/* Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
              
              <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #C3EEFA' }}>
                <h3 style={{ fontSize: '16px', color: '#1e3a5f', borderBottom: '1px solid #C3EEFA', paddingBottom: '10px', marginBottom: '20px' }}>
                  🔹 {t.steps[step - 1]}
                </h3>

                {step === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>{t.nameLabel}</label>
                        <input type="text" name="firstName" value={applyData.firstName} onChange={handleTextChange} style={{ width: '100%', padding: '8px', border: '1px solid #9DCAEB', borderRadius: '4px', boxSizing: 'border-box' }} required />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>{t.studentIdLabel}</label>
                        <input type="text" name="studentId" value={applyData.studentId} onChange={(e) => handleNumericChange(e, 10)} style={{ width: '100%', padding: '8px', border: '1px solid #9DCAEB', borderRadius: '4px', boxSizing: 'border-box' }} required />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>{t.facultyLabel}</label>
                        <input type="text" name="faculty" value={applyData.faculty} onChange={handleTextChange} style={{ width: '100%', padding: '8px', border: '1px solid #9DCAEB', borderRadius: '4px', boxSizing: 'border-box' }} required />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>{t.majorLabel}</label>
                        <input type="text" name="major" value={applyData.major} onChange={handleTextChange} style={{ width: '100%', padding: '8px', border: '1px solid #9DCAEB', borderRadius: '4px', boxSizing: 'border-box' }} required />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>{t.yearLabel}</label>
                        <input type="text" name="year" value={applyData.year} onChange={handleTextChange} style={{ width: '100%', padding: '8px', border: '1px solid #9DCAEB', borderRadius: '4px', boxSizing: 'border-box' }} required />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>{t.gpaLabel}</label>
                        <input type="text" name="gpa" value={applyData.gpa} onChange={handleGpaChange} style={{ width: '100%', padding: '8px', border: '1px solid #9DCAEB', borderRadius: '4px', boxSizing: 'border-box' }} required />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>{t.phoneLabel}</label>
                      <input type="text" name="phone" value={applyData.phone} onChange={(e) => handleNumericChange(e, 10)} style={{ width: '100%', padding: '8px', border: '1px solid #9DCAEB', borderRadius: '4px', boxSizing: 'border-box' }} required />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>{t.emailLabel}</label>
                      <input type="email" name="email" value={applyData.email} onChange={handleTextChange} style={{ width: '100%', padding: '8px', border: '1px solid #9DCAEB', borderRadius: '4px', boxSizing: 'border-box' }} required />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>{t.addressLabel}</label>
                    <textarea rows="3" name="address" value={applyData.address} onChange={handleTextChange} style={{ width: '100%', padding: '8px', border: '1px solid #9DCAEB', borderRadius: '4px', boxSizing: 'border-box' }} />
                  </div>
                )}

                {step === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>{t.incomeLabel}</label>
                    <input type="text" name="familyIncome" value={applyData.familyIncome} onChange={(e) => handleNumericChange(e)} style={{ width: '100%', padding: '8px', border: '1px solid #9DCAEB', borderRadius: '4px', boxSizing: 'border-box' }} />
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>{t.familyStatusLabel}</label>
                    <select style={{ width: '100%', padding: '8px', border: '1px solid #9DCAEB', borderRadius: '4px', background: '#fff' }}>
                      <option>Parents together</option>
                      <option>Parents separated</option>
                      <option>Under guardianship</option>
                    </select>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '6px' }}>{t.reasonLabel}</label>
                    <textarea rows="5" name="reason" value={applyData.reason} onChange={handleTextChange} style={{ width: '100%', padding: '10px', border: '1px solid #9DCAEB', borderRadius: '4px', boxSizing: 'border-box' }} required></textarea>
                  </div>
                )}

                {step === 5 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>{t.bankLabel}</label>
                    <select style={{ width: '100%', padding: '8px', border: '1px solid #9DCAEB', borderRadius: '4px', background: '#fff' }}>
                      <option>SCB</option>
                      <option>KBANK</option>
                      <option>KTB</option>
                    </select>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>{t.bankAccLabel}</label>
                    <input type="text" name="bankAccount" value={applyData.bankAccount} onChange={(e) => handleNumericChange(e, 15)} style={{ width: '100%', padding: '8px', border: '1px solid #9DCAEB', borderRadius: '4px', boxSizing: 'border-box' }} />
                  </div>
                )}

                {step === 6 && (
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '6px' }}>{t.uploadLabel}</label>
                    <input type="file" style={{ width: '100%', padding: '10px', border: '1px dashed #9DCAEB', borderRadius: '4px', backgroundColor: '#fafafa' }} />
                  </div>
                )}

                {/* ปุ่มควบคุมย้อนกลับ / ถัดไป */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px', borderTop: '1px solid #C3EEFA', paddingTop: '15px' }}>
                  {step > 1 ? (
                    <button type="button" onClick={() => setStep(step - 1)} style={{ backgroundColor: '#C3EEFA', color: '#1e3a5f', padding: '8px 16px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>{t.backBtn}</button>
                  ) : <div />}

                  {step < 6 ? (
                    <button type="button" onClick={() => setStep(step + 1)} style={{ backgroundColor: '#9DCAEB', color: '#1e3a5f', padding: '8px 20px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>{t.nextBtn}</button>
                  ) : (
                    <button type="button" onClick={handleApplySubmit} style={{ backgroundColor: '#AFD5F0', color: '#1e3a5f', padding: '8px 24px', border: '1px solid #9DCAEB', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>{t.confirmApplyBtn}</button>
                  )}
                </div>

              </div>

              {/* ฝั่งขวา: สรุปทุนที่สมัคร */}
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #C3EEFA', height: 'fit-content' }}>
                <h4 style={{ fontSize: '14px', color: '#1e3a5f', borderBottom: '1px solid #C3EEFA', paddingBottom: '8px', marginTop: 0 }}>{t.summaryTitle}</h4>
                <h5 style={{ fontSize: '15px', color: '#1f2937', margin: '10px 0 6px 0' }}>{selectedScholarship.title}</h5>
                <span style={{ backgroundColor: '#C3EEFA', color: '#1e3a5f', padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' }}>{selectedScholarship.category}</span>
                
                <div style={{ marginTop: '14px', fontSize: '13px', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>💰 {t.amount}: <strong style={{ color: '#0369a1' }}>{Number(selectedScholarship.amount).toLocaleString()} {t.baht}</strong></div>
                  <div>👥 {t.quota}: <strong>{selectedScholarship.quota}</strong></div>
                  <div>⏳ {t.deadline}: <strong style={{ color: '#dc2626' }}>{selectedScholarship.deadline}</strong></div>
                </div>

                <div style={{ marginTop: '20px', backgroundColor: '#DAFAFA', padding: '12px', borderRadius: '6px', border: '1px solid #C3EEFA', fontSize: '12px', color: '#1e3a5f' }}>
                  💡 <strong>{t.advice}</strong>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
