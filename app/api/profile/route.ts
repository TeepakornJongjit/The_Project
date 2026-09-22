import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  getSessionUser,
} from "@/lib/server/auth-session";

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

function userHeaders(
  accessToken: string,
) {
  return {
    apikey: SUPABASE_KEY!,
    Authorization:
      `Bearer ${accessToken}`,
    "Content-Type":
      "application/json",
  };
}

function textOrNull(
  value: unknown,
) {
  const text =
    String(value ?? "").trim();

  return text || null;
}

function numberOrNull(
  value: unknown,
) {
  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

async function getAccessToken() {
  const cookieStore =
    await cookies();

  return (
    cookieStore.get(
      "m01_access_token",
    )?.value || null
  );
}

async function fetchProfileData(
  accessToken: string,
  userId: string,
  email: string,
) {
  const [
    profileResponse,
    studentResponse,
  ] = await Promise.all([
    fetch(
      `${SUPABASE_URL}/rest/v1/profiles?select=phone_number&id=eq.${encodeURIComponent(
        userId,
      )}&limit=1`,
      {
        headers:
          userHeaders(
            accessToken,
          ),
        cache: "no-store",
      },
    ),

    fetch(
      `${SUPABASE_URL}/rest/v1/student_profiles?select=student_code,full_name,faculty,gpa,family_income,major,education_level,year_level,address,parent_status,family_members,parent_occupation,siblings,emergency_contact_name,emergency_contact_relation,emergency_contact_phone,emergency_contact_email,bank_name,bank_account_number,bank_account_name,bank_account_type&student_id=eq.${encodeURIComponent(
        userId,
      )}&limit=1`,
      {
        headers:
          userHeaders(
            accessToken,
          ),
        cache: "no-store",
      },
    ),
  ]);

  if (
    !profileResponse.ok ||
    !studentResponse.ok
  ) {
    throw new Error(
      "ไม่สามารถอ่านข้อมูลโปรไฟล์ได้",
    );
  }

  const profiles =
    await profileResponse.json();

  const students =
    await studentResponse.json();

  const baseProfile =
    profiles[0] ?? {};

  const student =
    students[0] ?? {};

  return {
    id: userId,

    email,

    fullName:
      student.full_name ?? "",

    studentId:
      student.student_code ??
      "",

    phoneNumber:
      baseProfile.phone_number ??
      "",

    faculty:
      student.faculty ?? "",

    major:
      student.major ?? "",

    educationLevel:
      student.education_level ??
      "",

    yearLevel:
      student.year_level ??
      null,

    gpa:
      student.gpa ?? null,

    address:
      student.address ?? "",

    familyIncome:
      student.family_income ??
      null,

    parentStatus:
      student.parent_status ??
      "",

    familyMembers:
      student.family_members ??
      null,

    parentOccupation:
      student.parent_occupation ??
      "",

    siblings:
      student.siblings ?? null,

    emergencyContactName:
      student.emergency_contact_name ??
      "",

    emergencyContactRelation:
      student.emergency_contact_relation ??
      "",

    emergencyContactPhone:
      student.emergency_contact_phone ??
      "",

    emergencyContactEmail:
      student.emergency_contact_email ??
      "",

    bankName:
      student.bank_name ?? "",

    bankAccountNumber:
      student.bank_account_number ??
      "",

    bankAccountName:
      student.bank_account_name ??
      "",

    bankAccountType:
      student.bank_account_type ??
      "",
  };
}

export async function GET() {
  try {
    checkEnvironment();

    const sessionUser =
      await getSessionUser();

    if (!sessionUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "กรุณาเข้าสู่ระบบ",
        },
        {
          status: 401,
        },
      );
    }

    if (
      sessionUser.role !==
      "student"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "บัญชีนี้ไม่ใช่บัญชีนักศึกษา",
        },
        {
          status: 403,
        },
      );
    }

    const accessToken =
      await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          message:
            "ไม่พบ Session",
        },
        {
          status: 401,
        },
      );
    }

    const profile =
      await fetchProfileData(
        accessToken,
        sessionUser.id,
        sessionUser.email,
      );

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error(
      "PROFILE_GET_ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "ไม่สามารถโหลดข้อมูลโปรไฟล์ได้",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(
  request: Request,
) {
  try {
    checkEnvironment();

    const sessionUser =
      await getSessionUser();

    if (!sessionUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "กรุณาเข้าสู่ระบบใหม่อีกครั้ง",
        },
        {
          status: 401,
        },
      );
    }

    if (
      sessionUser.role !==
      "student"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "บัญชีนี้ไม่ใช่บัญชีนักศึกษา",
        },
        {
          status: 403,
        },
      );
    }

    const accessToken =
      await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          message:
            "ไม่พบ Session",
        },
        {
          status: 401,
        },
      );
    }

    const body =
      await request.json();

    const fullName =
      String(
        body.fullName || "",
      ).trim();

    const studentId =
      String(
        body.studentId || "",
      ).trim();

    const phoneNumber =
      String(
        body.phoneNumber || "",
      ).trim();

    const emergencyPhone =
      String(
        body.emergencyContactPhone ||
          "",
      ).trim();

    const emergencyEmail =
      String(
        body.emergencyContactEmail ||
          "",
      ).trim();

    const bankAccountNumber =
  String(
    body.bankAccountNumber ||
      "",
  ).trim();

    const gpa =
      numberOrNull(body.gpa);

    const familyIncome =
      numberOrNull(
        body.familyIncome,
      );

    const yearLevel =
      numberOrNull(
        body.yearLevel,
      );

    const familyMembers =
      numberOrNull(
        body.familyMembers,
      );

    const siblings =
      numberOrNull(
        body.siblings,
      );

    if (!fullName) {
      return NextResponse.json(
        {
          success: false,
          message:
            "กรุณากรอกชื่อ–นามสกุล",
        },
        { status: 400 },
      );
    }

    if (
      !/^[0-9]{8,12}$/.test(
        studentId,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "รหัสนักศึกษาต้องเป็นตัวเลข 8–12 หลัก",
        },
        { status: 400 },
      );
    }

    if (
      phoneNumber &&
      !/^[0-9]{9,10}$/.test(
        phoneNumber,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "เบอร์โทรศัพท์ไม่ถูกต้อง",
        },
        { status: 400 },
      );
    }

    if (
      emergencyPhone &&
      !/^[0-9]{9,10}$/.test(
        emergencyPhone,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "เบอร์โทรศัพท์ฉุกเฉินไม่ถูกต้อง",
        },
        { status: 400 },
      );
    }

    if (
  bankAccountNumber &&
  !/^[0-9]+$/.test(
    bankAccountNumber,
  )
) {
  return NextResponse.json(
    {
      success: false,
      message:
        "เลขที่บัญชีต้องเป็นตัวเลขเท่านั้น",
    },
    {
      status: 400,
    },
  );
}

    if (
      emergencyEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        emergencyEmail,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "อีเมลผู้ติดต่อฉุกเฉินไม่ถูกต้อง",
        },
        { status: 400 },
      );
    }

    if (
      gpa !== null &&
      (gpa < 0 || gpa > 4)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "GPA ต้องอยู่ระหว่าง 0.00 ถึง 4.00",
        },
        { status: 400 },
      );
    }

    if (
      yearLevel !== null &&
      (
        !Number.isInteger(
          yearLevel,
        ) ||
        yearLevel < 1 ||
        yearLevel > 8
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "ชั้นปีต้องอยู่ระหว่าง 1 ถึง 8",
        },
        { status: 400 },
      );
    }

    if (
      familyIncome !== null &&
      familyIncome < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "รายได้ครอบครัวต้องไม่ติดลบ",
        },
        { status: 400 },
      );
    }

    if (
      familyMembers !== null &&
      (
        !Number.isInteger(
          familyMembers,
        ) ||
        familyMembers < 0
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "จำนวนสมาชิกในครอบครัวไม่ถูกต้อง",
        },
        { status: 400 },
      );
    }

    if (
      siblings !== null &&
      (
        !Number.isInteger(
          siblings,
        ) ||
        siblings < 0
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "จำนวนพี่น้องไม่ถูกต้อง",
        },
        { status: 400 },
      );
    }

    const studentResponse =
      await fetch(
        `${SUPABASE_URL}/rest/v1/student_profiles?on_conflict=student_id`,
        {
          method: "POST",

          headers: {
            ...userHeaders(
              accessToken,
            ),
            Prefer:
              "resolution=merge-duplicates,return=representation",
          },

          body: JSON.stringify({
            student_id:
              sessionUser.id,

            student_code:
              studentId,

            full_name:
              fullName,

            faculty:
              textOrNull(
                body.faculty,
              ),

            major:
              textOrNull(
                body.major,
              ),

            education_level:
              textOrNull(
                body.educationLevel,
              ),

            year_level:
              yearLevel,

            gpa,

            address:
              textOrNull(
                body.address,
              ),

            family_income:
              familyIncome,

            parent_status:
              textOrNull(
                body.parentStatus,
              ),

            family_members:
              familyMembers,

            parent_occupation:
              textOrNull(
                body.parentOccupation,
              ),

            siblings,

            emergency_contact_name:
              textOrNull(
                body.emergencyContactName,
              ),

            emergency_contact_relation:
              textOrNull(
                body.emergencyContactRelation,
              ),

            emergency_contact_phone:
              emergencyPhone ||
              null,

            emergency_contact_email:
              emergencyEmail ||
              null,

            bank_name:
              textOrNull(
                body.bankName,
              ),

            bank_account_number:
  bankAccountNumber ||
  null,

            bank_account_name:
              textOrNull(
                body.bankAccountName,
              ),

            bank_account_type:
              textOrNull(
                body.bankAccountType,
              ),
          }),

          cache: "no-store",
        },
      );

    const studentResult =
      await studentResponse
        .json()
        .catch(() => ({}));

    if (!studentResponse.ok) {
      console.error(
        "STUDENT_PROFILE_SAVE_ERROR:",
        studentResult,
      );

      if (
        studentResult?.code ===
        "23505"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "รหัสนักศึกษานี้ถูกใช้งานแล้ว",
          },
          { status: 409 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          message:
            studentResult?.message ||
            "ไม่สามารถบันทึกข้อมูลนักศึกษาได้",
        },
        { status: 400 },
      );
    }

    const profileResponse =
      await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(
          sessionUser.id,
        )}`,
        {
          method: "PATCH",

          headers: {
            ...userHeaders(
              accessToken,
            ),
            Prefer:
              "return=representation",
          },

          body: JSON.stringify({
            phone_number:
              phoneNumber ||
              null,
          }),

          cache: "no-store",
        },
      );

    if (!profileResponse.ok) {
      const profileError =
        await profileResponse
          .json()
          .catch(() => ({}));

      console.error(
        "BASE_PROFILE_SAVE_ERROR:",
        profileError,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            profileError?.message ||
            "ไม่สามารถบันทึกเบอร์โทรศัพท์ได้",
        },
        { status: 400 },
      );
    }

    const profile =
      await fetchProfileData(
        accessToken,
        sessionUser.id,
        sessionUser.email,
      );

    return NextResponse.json({
      success: true,

      message:
        "บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว",

      profile,
    });
  } catch (error) {
    console.error(
      "PROFILE_UPDATE_ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
      },
      {
        status: 500,
      },
    );
  }
}