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

function userHeaders(
  accessToken: string,
) {
  checkEnvironment();

  return {
    apikey: SUPABASE_KEY!,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
}

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
          role: "student",
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