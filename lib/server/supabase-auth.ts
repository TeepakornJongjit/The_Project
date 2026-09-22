const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL;

const SUPABASE_KEY =
  process.env.VITE_SUPABASE_ANON_KEY;

function checkEnvironment() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error(
      "Supabase environment variables are missing",
    );
  }
}

function publicHeaders() {
  checkEnvironment();

  return {
    apikey: SUPABASE_KEY!,
    "Content-Type": "application/json",
  };
}

function userHeaders(accessToken: string) {
  checkEnvironment();

  return {
    apikey: SUPABASE_KEY!,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
}

/* =========================
   LOGIN
========================= */

export async function loginStudent(input: {
  email: string;
  password: string;
}) {
  checkEnvironment();

  const response = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: publicHeaders(),
      body: JSON.stringify({
        email: input.email,
        password: input.password,
      }),
      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.msg ||
        data?.message ||
        data?.error_description ||
        "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    );
  }

  return data;
}

/* =========================
   CURRENT AUTH USER
========================= */

export async function getCurrentSupabaseUser(
  accessToken: string,
) {
  checkEnvironment();

  const response = await fetch(
    `${SUPABASE_URL}/auth/v1/user`,
    {
      method: "GET",
      headers: userHeaders(accessToken),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

/* =========================
   ROLE จากฐานข้อมูลจริง
   user_roles -> roles
========================= */

export async function getUserRoles(
  accessToken: string,
  userId: string,
): Promise<string[]> {
  checkEnvironment();

  const userRolesResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/user_roles?select=role_id&user_id=eq.${encodeURIComponent(
      userId,
    )}`,
    {
      method: "GET",
      headers: userHeaders(accessToken),
      cache: "no-store",
    },
  );

  if (!userRolesResponse.ok) {
    throw new Error(
      "ไม่สามารถตรวจสอบสิทธิ์ผู้ใช้ได้",
    );
  }

  const userRoles: Array<{
    role_id: string;
  }> = await userRolesResponse.json();

  if (userRoles.length === 0) {
    return [];
  }

  const roleNames = await Promise.all(
    userRoles.map(async ({ role_id }) => {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/roles?select=role_name&role_id=eq.${encodeURIComponent(
          role_id,
        )}&limit=1`,
        {
          method: "GET",
          headers: userHeaders(accessToken),
          cache: "no-store",
        },
      );

      if (!response.ok) {
        return null;
      }

      const rows: Array<{
        role_name: string;
      }> = await response.json();

      return rows[0]?.role_name ?? null;
    }),
  );

  return roleNames.filter(
    (role): role is string =>
      typeof role === "string",
  );
}

/* =========================
   STUDENT PROFILE
========================= */

export async function getStudentProfile(
  accessToken: string,
  userId: string,
) {
  checkEnvironment();

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/student_profiles?select=student_code,full_name,faculty,gpa,family_income&student_id=eq.${encodeURIComponent(
      userId,
    )}&limit=1`,
    {
      method: "GET",
      headers: userHeaders(accessToken),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  const rows = await response.json();

  return rows[0] ?? null;
}

/* =========================
   STAFF PROFILE
========================= */

export async function getStaffProfile(
  accessToken: string,
  userId: string,
) {
  checkEnvironment();

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/staff_profiles?select=full_name&staff_id=eq.${encodeURIComponent(
      userId,
    )}&limit=1`,
    {
      method: "GET",
      headers: userHeaders(accessToken),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  const rows = await response.json();

  return rows[0] ?? null;
}

/* =========================
   LOGOUT
========================= */

export async function logoutSupabaseUser(
  accessToken: string,
) {
  checkEnvironment();

  await fetch(
    `${SUPABASE_URL}/auth/v1/logout`,
    {
      method: "POST",
      headers: userHeaders(accessToken),
      cache: "no-store",
    },
  );
}

/* =========================
   REGISTER STUDENT
========================= */

export async function signUpStudent(input: {
  fullName: string;
  studentId: string;
  email: string;
  password: string;
}) {
  checkEnvironment();

  const response = await fetch(
    `${SUPABASE_URL}/auth/v1/signup`,
    {
      method: "POST",
      headers: publicHeaders(),

      body: JSON.stringify({
        email: input.email,
        password: input.password,

        data: {
          full_name: input.fullName,
          student_id: input.studentId,
        },
      }),

      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.msg ||
        data?.message ||
        data?.error_description ||
        "สมัครสมาชิกไม่สำเร็จ",
    );
  }

  return data;
}

/* =========================
   FORGOT PASSWORD
========================= */

export async function requestPasswordReset(
  email: string,
  redirectTo: string,
) {
  checkEnvironment();

  const response = await fetch(
    `${SUPABASE_URL}/auth/v1/recover?redirect_to=${encodeURIComponent(
      redirectTo,
    )}`,
    {
      method: "POST",
      headers: publicHeaders(),
      body: JSON.stringify({
        email,
      }),
      cache: "no-store",
    },
  );

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.msg ||
        data?.message ||
        data?.error_description ||
        "ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้",
    );
  }

  return data;
}