const navigation = [
  { id: "dashboard", label: "แดชบอร์ด" },
  { id: "create-scholarship", label: "สร้างทุนการศึกษา" },
];

export default function AppLayout({
  activePage,
  onNavigate,
  children,
}) {
  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              ทุน
            </span>

            <div>
              <strong>Campus Scholarship Portal</strong>
              <small>ระบบทุนการศึกษาภายในมหาวิทยาลัย</small>
            </div>
          </div>

          <nav
            className="app-navigation"
            aria-label="เมนูหลัก"
          >
            {navigation.map((item) => (
              <button
                key={item.id}
                type="button"
                className={
                  activePage === item.id
                    ? "nav-button active"
                    : "nav-button"
                }
                aria-pressed={activePage === item.id}
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <span className="account-label">
            เจ้าหน้าที่ · หน้าตัวอย่าง
          </span>
        </div>
      </header>

      <main className="page-container">
        {children}
      </main>
    </>
  );
}