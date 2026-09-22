"use client";
import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { scholarships, money } from "@/lib/ui-data";
import {
  Action,
  Badge,
  Heading,
  Icon,
  Notice,
  Panel,
  Photo,
  Quote,
} from "./Shared";

export function FilePicker({
  onCount,
  selectedFiles,
  onFilesChange,
}: {
  onCount?: (n: number) => void;
  selectedFiles?: File[];
  onFilesChange?: (files: File[]) => void;
}) {
  const [localFiles, setLocalFiles] = useState<File[]>([]),
    [error, setError] = useState("");
  const files = selectedFiles ?? localFiles;
  function setFiles(next: File[]) {
    setLocalFiles(next);
    onFilesChange?.(next);
  }
  function change(e: ChangeEvent<HTMLInputElement>) {
    const chosen = Array.from(e.target.files || []);
    const invalid = chosen.find(
      (f) =>
        f.size > 10 * 1024 * 1024 || !/\.(pdf|png|jpe?g|docx?)$/i.test(f.name),
    );
    if (invalid) {
      setError(
        `ไฟล์ ${invalid.name} ไม่รองรับ กรุณาเลือก PDF, JPG, PNG, DOC หรือ DOCX ขนาดไม่เกิน 10 MB`,
      );
      e.target.value = "";
      return;
    }
    const next = [...files, ...chosen];
    setFiles(next);
    onCount?.(next.length);
    setError("");
    e.target.value = "";
  }
  return (
    <div>
      <label className="upload-box">
        <Icon name="upload" size={28} />
        <strong>คลิกเพื่อเลือกเอกสาร</strong>
        <small>PDF, DOC, DOCX, JPG, PNG · ขนาดไม่เกิน 10 MB ต่อไฟล์</small>
        <input
          aria-label="เลือกเอกสาร"
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          multiple
          onChange={change}
        />
      </label>
      <small>
        ไฟล์ที่เลือกอยู่ในหน้านี้เท่านั้น ยังไม่ได้ส่งไปยังมหาวิทยาลัย
      </small>
      {error && <Notice>{error}</Notice>}
      {files.map((f, i) => (
        <div className="selected-file" key={`${f.name}-${i}`}>
          <Icon name="file" />
          <span>
            {f.name}
            <small>{(f.size / 1024).toFixed(1)} KB</small>
          </span>
          <button
            type="button"
            className="text-button"
            onClick={() => {
              const url = URL.createObjectURL(f);
              const a = document.createElement("a");
              a.href = url;
              a.download = f.name;
              a.click();
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            }}
          >
            ดาวน์โหลด
          </button>
          <button
            type="button"
            className="text-button"
            aria-label={`นำ ${f.name} ออกจากรายการ`}
            onClick={() => {
              const next = files.filter((_, j) => j !== i);
              setFiles(next);
              onCount?.(next.length);
            }}
          >
            นำออก
          </button>
        </div>
      ))}
    </div>
  );
}

type StudentProfile = {
  id: string;
  email: string;
  fullName: string;
  studentId: string;
  phoneNumber: string;
  faculty: string;
  major: string;
  educationLevel: string;
  yearLevel: number | null;
  gpa: number | null;
  address: string;
  familyIncome: number | null;
  parentStatus: string;
  familyMembers: number | null;
  parentOccupation: string;
  siblings: number | null;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  emergencyContactEmail: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  bankAccountType: string;
};

const emptyValue = "-";

const profileInitial:
  Record<string, string> = {
    "ชื่อ–นามสกุล":
      emptyValue,
    อีเมล:
      emptyValue,
    เบอร์โทรศัพท์:
      emptyValue,
    ที่อยู่:
      emptyValue,
    คณะ:
      emptyValue,
    สาขาวิชา:
      emptyValue,
    ระดับการศึกษา:
      emptyValue,
    ชั้นปี:
      emptyValue,
    เกรดเฉลี่ย:
      emptyValue,
    สถานภาพบิดามารดา:
      emptyValue,
    จำนวนสมาชิกในครอบครัว:
      emptyValue,
    รายได้ครอบครัวต่อปี:
      emptyValue,
    อาชีพผู้ปกครอง:
      emptyValue,
    จำนวนพี่น้อง:
      emptyValue,
    ชื่อผู้ติดต่อ:
      emptyValue,
    ความสัมพันธ์:
      emptyValue,
    โทรศัพท์ฉุกเฉิน:
      emptyValue,
    อีเมลผู้ติดต่อ:
      emptyValue,
    ธนาคาร:
      emptyValue,
    เลขที่บัญชี:
      emptyValue,
    ชื่อบัญชี:
      emptyValue,
    ประเภทบัญชี:
      emptyValue,
  };

function displayValue(
  value:
    | string
    | number
    | null
    | undefined,
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return emptyValue;
  }

  return String(value);
}

function profileToDisplay(
  profile: StudentProfile,
): Record<string, string> {
  return {
    "ชื่อ–นามสกุล":
      displayValue(
        profile.fullName,
      ),

    อีเมล:
      displayValue(
        profile.email,
      ),

    เบอร์โทรศัพท์:
      displayValue(
        profile.phoneNumber,
      ),

    ที่อยู่:
      displayValue(
        profile.address,
      ),

    คณะ:
      displayValue(
        profile.faculty,
      ),

    สาขาวิชา:
      displayValue(
        profile.major,
      ),

    ระดับการศึกษา:
      displayValue(
        profile.educationLevel,
      ),

    ชั้นปี:
      profile.yearLevel !== null
        ? `ปีที่ ${profile.yearLevel}`
        : emptyValue,

    เกรดเฉลี่ย:
      displayValue(
        profile.gpa,
      ),

    สถานภาพบิดามารดา:
      displayValue(
        profile.parentStatus,
      ),

    จำนวนสมาชิกในครอบครัว:
      profile.familyMembers !==
      null
        ? `${profile.familyMembers} คน`
        : emptyValue,

    รายได้ครอบครัวต่อปี:
      profile.familyIncome !== null
        ? `${profile.familyIncome.toLocaleString(
            "th-TH",
          )} บาท`
        : emptyValue,

    อาชีพผู้ปกครอง:
      displayValue(
        profile.parentOccupation,
      ),

    จำนวนพี่น้อง:
      profile.siblings !== null
        ? `${profile.siblings} คน`
        : emptyValue,

    ชื่อผู้ติดต่อ:
      displayValue(
        profile.emergencyContactName,
      ),

    ความสัมพันธ์:
      displayValue(
        profile.emergencyContactRelation,
      ),

    โทรศัพท์ฉุกเฉิน:
      displayValue(
        profile.emergencyContactPhone,
      ),

    อีเมลผู้ติดต่อ:
      displayValue(
        profile.emergencyContactEmail,
      ),

    ธนาคาร:
      displayValue(
        profile.bankName,
      ),

    เลขที่บัญชี:
      displayValue(
        profile.bankAccountNumber,
      ),

    ชื่อบัญชี:
      displayValue(
        profile.bankAccountName,
      ),

    ประเภทบัญชี:
      displayValue(
        profile.bankAccountType,
      ),
  };
}

export function Profile() {
  const [data, setData] =
    useState<
      Record<string, string>
    >(profileInitial);

  const [
    profile,
    setProfile,
  ] =
    useState<StudentProfile | null>(
      null,
    );

  const [edit, setEdit] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [upload, setUpload] =
    useState(false);

  const [preview, setPreview] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const response =
          await fetch(
            "/api/profile",
            {
              cache:
                "no-store",
            },
          );

        const result =
          await response.json();

        if (
          cancelled ||
          !response.ok ||
          !result.success ||
          !result.profile
        ) {
          return;
        }

        const loadedProfile =
          result.profile as StudentProfile;

        setProfile(
          loadedProfile,
        );

        setData(
          profileToDisplay(
            loadedProfile,
          ),
        );
      } catch (error) {
        console.error(
          "PROFILE_LOAD_ERROR:",
          error,
        );
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  async function saveProfile(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    const formData =
      new FormData(
        event.currentTarget,
      );

    const payload = {
      fullName:
        formData.get(
          "fullName",
        ),

      studentId:
        formData.get(
          "studentId",
        ),

      phoneNumber:
        formData.get(
          "phoneNumber",
        ),

      faculty:
        formData.get(
          "faculty",
        ),

      major:
        formData.get(
          "major",
        ),

      educationLevel:
        formData.get(
          "educationLevel",
        ),

      yearLevel:
        formData.get(
          "yearLevel",
        ),

      gpa:
        formData.get("gpa"),

      address:
        formData.get(
          "address",
        ),

      familyIncome:
        formData.get(
          "familyIncome",
        ),

      parentStatus:
        formData.get(
          "parentStatus",
        ),

      familyMembers:
        formData.get(
          "familyMembers",
        ),

      parentOccupation:
        formData.get(
          "parentOccupation",
        ),

      siblings:
        formData.get(
          "siblings",
        ),

      emergencyContactName:
        formData.get(
          "emergencyContactName",
        ),

      emergencyContactRelation:
        formData.get(
          "emergencyContactRelation",
        ),

      emergencyContactPhone:
        formData.get(
          "emergencyContactPhone",
        ),

      emergencyContactEmail:
        formData.get(
          "emergencyContactEmail",
        ),

      bankName:
        formData.get(
          "bankName",
        ),

      bankAccountNumber:
        formData.get(
          "bankAccountNumber",
        ),

      bankAccountName:
        formData.get(
          "bankAccountName",
        ),

      bankAccountType:
        formData.get(
          "bankAccountType",
        ),
    };

    try {
      const response =
        await fetch(
          "/api/profile",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                payload,
              ),
          },
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        setMessage(
          result.message ||
            "ไม่สามารถบันทึกข้อมูลได้",
        );

        return;
      }

      const updatedProfile =
        result.profile as StudentProfile;

      setProfile(
        updatedProfile,
      );

      setData(
        profileToDisplay(
          updatedProfile,
        ),
      );

      setEdit(false);

      setMessage(
        "บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว",
      );
    } catch (error) {
      console.error(
        "PROFILE_SAVE_ERROR:",
        error,
      );

      setMessage(
        "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
      );
    } finally {
      setSaving(false);
    }
  }

  const sections = [
    [
      "ข้อมูลการศึกษา",
      "คณะ",
      "สาขาวิชา",
      "ระดับการศึกษา",
      "ชั้นปี",
      "เกรดเฉลี่ย",
    ],

    [
      "ข้อมูลฐานะทางครอบครัว",
      "สถานภาพบิดามารดา",
      "จำนวนสมาชิกในครอบครัว",
      "รายได้ครอบครัวต่อปี",
      "อาชีพผู้ปกครอง",
      "จำนวนพี่น้อง",
    ],

    [
      "ข้อมูลติดต่อฉุกเฉิน",
      "ชื่อผู้ติดต่อ",
      "ความสัมพันธ์",
      "โทรศัพท์ฉุกเฉิน",
      "อีเมลผู้ติดต่อ",
    ],

    [
      "ข้อมูลบัญชีธนาคาร",
      "ธนาคาร",
      "เลขที่บัญชี",
      "ชื่อบัญชี",
      "ประเภทบัญชี",
    ],
  ];

  return (
    <>
      <Heading
        title="โปรไฟล์และเอกสาร"
        description="จัดการข้อมูลส่วนตัว ข้อมูลประกอบการสมัครทุน และเอกสารสำคัญของคุณ"
      />

      {message && (
        <Notice>
          {message}
        </Notice>
      )}

      <div className="columns">
        <Panel>
          <div className="profile-summary">
            <span className="avatar large" />

            <div>
              <h1>
                {
                  data[
                    "ชื่อ–นามสกุล"
                  ]
                }
              </h1>

              <p>
                รหัสนักศึกษา{" "}
                {profile?.studentId ||
                  emptyValue}
              </p>

              <Badge>
                นักศึกษาปัจจุบัน
              </Badge>

              <p>
                {data["คณะ"]}　
                {data["สาขาวิชา"]}　
                {data["ชั้นปี"]}
              </p>

              <p>
                ✉ {data["อีเมล"]}　
                ☎{" "}
                {
                  data[
                    "เบอร์โทรศัพท์"
                  ]
                }
              </p>

              <p>
                {data["ที่อยู่"]}
              </p>
            </div>

            <button
              className="btn secondary"
              onClick={() =>
                setEdit(!edit)
              }
            >
              <Icon
                name="edit"
                size={17}
              />
              แก้ไขข้อมูล
            </button>
          </div>
        </Panel>

        <Panel title="ความพร้อมในการสมัครทุน">
          <div className="chart-wrap">
            <div className="donut readiness">
              <div>
                <strong>
                  80%
                </strong>
                สมบูรณ์
              </div>
            </div>

            <div>
              <p>
                คุณกรอกข้อมูลครบแล้ว 4
                จาก 5 ส่วน
                และอัปโหลดเอกสาร 4
                จาก 5 รายการ
              </p>

              <div className="soft-box">
                ✓ ใกล้เสร็จแล้ว!
                <small>
                  {" "}
                  ตรวจสอบเอกสารที่ยังไม่ผ่านการตรวจสอบ
                </small>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {edit && (
        <Panel
          title="แก้ไขข้อมูลโปรไฟล์"
          className="edit-profile"
        >
          <form
            onSubmit={
              saveProfile
            }
          >
            <div className="form-grid">
              <label>
                ชื่อ–นามสกุล
                <input
                  name="fullName"
                  defaultValue={
                    profile?.fullName ||
                    ""
                  }
                  required
                />
              </label>

              <label>
  รหัสนักศึกษา
  <input
    name="studentId"
    defaultValue={
      profile?.studentId || ""
    }
    required
    type="text"
    inputMode="numeric"
    pattern="[0-9]{8,12}"
    maxLength={12}
    onInput={(e) => {
      e.currentTarget.value =
        e.currentTarget.value.replace(
          /\D/g,
          "",
        );
    }}
  />
</label>

              <label>
                อีเมล
                <input
                  value={
                    profile?.email ||
                    ""
                  }
                  readOnly
                  type="email"
                />
              </label>

              <label>
  เบอร์โทรศัพท์
  <input
    name="phoneNumber"
    defaultValue={
      profile?.phoneNumber || ""
    }
    type="text"
    inputMode="numeric"
    pattern="[0-9]{9,10}"
    maxLength={10}
    onInput={(e) => {
      e.currentTarget.value =
        e.currentTarget.value.replace(
          /\D/g,
          "",
        );
    }}
  />
</label>

              <label>
                คณะ
                <input
                  name="faculty"
                  defaultValue={
                    profile?.faculty ||
                    ""
                  }
                />
              </label>

              <label>
                สาขาวิชา
                <input
                  name="major"
                  defaultValue={
                    profile?.major ||
                    ""
                  }
                />
              </label>

              <label>
                ระดับการศึกษา
                <input
                  name="educationLevel"
                  defaultValue={
                    profile?.educationLevel ||
                    ""
                  }
                />
              </label>

              <label>
                ชั้นปี
                <input
                  name="yearLevel"
                  type="number"
                  min="1"
                  max="8"
                  step="1"
                  defaultValue={
                    profile?.yearLevel ??
                    ""
                  }
                />
              </label>

              <label>
                เกรดเฉลี่ย
                <input
                  name="gpa"
                  type="number"
                  min="0"
                  max="4"
                  step="0.01"
                  defaultValue={
                    profile?.gpa ??
                    ""
                  }
                />
              </label>

              <label>
                ที่อยู่
                <input
                  name="address"
                  defaultValue={
                    profile?.address ||
                    ""
                  }
                />
              </label>

              <label>
                สถานภาพบิดามารดา
                <input
                  name="parentStatus"
                  defaultValue={
                    profile?.parentStatus ||
                    ""
                  }
                />
              </label>

              <label>
                จำนวนสมาชิกในครอบครัว
                <input
                  name="familyMembers"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={
                    profile?.familyMembers ??
                    ""
                  }
                />
              </label>

              <label>
                รายได้ครอบครัวต่อปี
                <input
                  name="familyIncome"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={
                    profile?.familyIncome ??
                    ""
                  }
                />
              </label>

              <label>
                อาชีพผู้ปกครอง
                <input
                  name="parentOccupation"
                  defaultValue={
                    profile?.parentOccupation ||
                    ""
                  }
                />
              </label>

              <label>
                จำนวนพี่น้อง
                <input
                  name="siblings"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={
                    profile?.siblings ??
                    ""
                  }
                />
              </label>

              <label>
                ชื่อผู้ติดต่อฉุกเฉิน
                <input
                  name="emergencyContactName"
                  defaultValue={
                    profile?.emergencyContactName ||
                    ""
                  }
                />
              </label>

              <label>
                ความสัมพันธ์
                <input
                  name="emergencyContactRelation"
                  defaultValue={
                    profile?.emergencyContactRelation ||
                    ""
                  }
                />
              </label>

              <label>
  โทรศัพท์ฉุกเฉิน
  <input
    name="emergencyContactPhone"
    defaultValue={
      profile?.emergencyContactPhone ||
      ""
    }
    type="text"
    inputMode="numeric"
    pattern="[0-9]{9,10}"
    maxLength={10}
    onInput={(e) => {
      e.currentTarget.value =
        e.currentTarget.value.replace(
          /\D/g,
          "",
        );
    }}
  />
</label>

              <label>
                อีเมลผู้ติดต่อ
                <input
                  name="emergencyContactEmail"
                  type="email"
                  defaultValue={
                    profile?.emergencyContactEmail ||
                    ""
                  }
                />
              </label>

              <label>
                ธนาคาร
                <input
                  name="bankName"
                  defaultValue={
                    profile?.bankName ||
                    ""
                  }
                />
              </label>

              <label>
  เลขที่บัญชี
  <input
    name="bankAccountNumber"
    defaultValue={
      profile?.bankAccountNumber ||
      ""
    }
    type="text"
    inputMode="numeric"
    onInput={(e) => {
      e.currentTarget.value =
        e.currentTarget.value.replace(
          /\D/g,
          "",
        );
    }}
  />
</label>

              <label>
                ชื่อบัญชี
                <input
                  name="bankAccountName"
                  defaultValue={
                    profile?.bankAccountName ||
                    ""
                  }
                />
              </label>

              <label>
                ประเภทบัญชี
                <input
                  name="bankAccountType"
                  defaultValue={
                    profile?.bankAccountType ||
                    ""
                  }
                />
              </label>
            </div>

            <div className="form-actions">
              <button
                className="btn secondary"
                type="button"
                onClick={() =>
                  setEdit(false)
                }
                disabled={
                  saving
                }
              >
                ยกเลิก
              </button>

              <button
                className="btn"
                type="submit"
                disabled={
                  saving
                }
              >
                {saving
                  ? "กำลังบันทึก..."
                  : "บันทึกข้อมูล"}
              </button>
            </div>
          </form>
        </Panel>
      )}

      <div className="profile-grid">
        {sections.map(
          (
            [
              title,
              ...keys
            ],
            i,
          ) => (
            <Panel
              key={title}
              title={title}
              action={
                <button
                  className="text-button"
                  onClick={() =>
                    setEdit(true)
                  }
                >
                  แก้ไข ›
                </button>
              }
            >
              <Icon
                name={
                  [
                    "cap",
                    "people",
                    "user",
                    "money",
                  ][i]
                }
                size={30}
              />

              <dl>
                {keys.map(
                  (key) => (
                    <div
                      key={
                        key
                      }
                    >
                      <dt>
                        {key}
                      </dt>

                      <dd>
                        {
                          data[
                            key
                          ]
                        }
                      </dd>
                    </div>
                  ),
                )}
              </dl>
            </Panel>
          ),
        )}
      </div>

      <Panel
        title="เอกสารประกอบการสมัครทุน"
        action={
          <button
            className="btn"
            onClick={() =>
              setUpload(
                !upload,
              )
            }
          >
            <Icon name="upload" />
            อัปโหลดเอกสารใหม่
          </button>
        }
      >
        <div id="documents">
          {upload && (
            <FilePicker />
          )}

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>
                    ชื่อเอกสาร
                  </th>
                  <th>
                    ประเภทเอกสาร
                  </th>
                  <th>
                    วันที่อัปโหลด
                  </th>
                  <th>
                    สถานะการตรวจสอบ
                  </th>
                  <th>
                    จัดการ
                  </th>
                </tr>
              </thead>

              <tbody>
                {[
                  "Transcript.pdf",
                  "บัตรนักศึกษา.jpg",
                  "หนังสือรับรองรายได้.pdf",
                  "Portfolio.pdf",
                  "เกียรติบัตร.jpg",
                ].map(
                  (file, i) => (
                    <tr
                      key={
                        file
                      }
                    >
                      <td>
                        {i +
                          1}
                      </td>

                      <td>
                        ▤{" "}
                        {file}
                      </td>

                      <td>
                        {
                          [
                            "ใบแสดงผลการศึกษา",
                            "เอกสารยืนยันตัวตน",
                            "เอกสารรับรองรายได้",
                            "แฟ้มสะสมผลงาน",
                            "เอกสารประกอบอื่น ๆ",
                          ][i]
                        }
                      </td>

                      <td>
                        {12 -
                          i *
                            2}{" "}
                        ม.ค.
                        2568
                      </td>

                      <td>
                        <Badge>
                          {i ===
                          4
                            ? "ไม่ผ่านการตรวจสอบ"
                            : i ===
                                2
                              ? "อยู่ระหว่างพิจารณา"
                              : "ผ่านการตรวจสอบ"}
                        </Badge>
                      </td>

                      <td>
                        <button
                          className="btn secondary"
                          onClick={() =>
                            setPreview(
                              file,
                            )
                          }
                        >
                          ดูเอกสาร
                        </button>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          {preview && (
            <Notice>
              {preview}{" "}
              เป็นชื่อเอกสารในภาพตัวอย่าง
              ยังไม่มีไฟล์ต้นฉบับแนบมา{" "}
              <button
                className="text-button"
                onClick={() =>
                  setPreview(
                    "",
                  )
                }
              >
                ปิด
              </button>
            </Notice>
          )}

          <div className="error-note">
            กรุณาแก้ไขเอกสารที่ยังไม่ผ่านการตรวจสอบ
            โดยอัปโหลดเอกสารอีกครั้ง
          </div>
        </div>
      </Panel>
    </>
  );
}

const stepLabels = [
  "ข้อมูลส่วนตัว",
  "ข้อมูลการศึกษา",
  "ฐานะการเงิน / ครอบครัว",
  "เหตุผลในการสมัคร",
  "บัญชีธนาคาร",
  "อัปโหลดเอกสาร",
];
const formSteps = [
  [
    ["ชื่อ–นามสกุล", "name", "น.ส.ณัฐธิดา ใจดี"],
    ["รหัสนักศึกษา", "studentId", "661234567"],
    ["คณะ", "faculty", "คณะวิทยาศาสตร์"],
    ["สาขาวิชา", "major", "วิทยาการคอมพิวเตอร์"],
    ["ชั้นปี", "year", "3"],
    ["เกรดเฉลี่ยสะสม (GPAX)", "gpa", "3.72"],
    ["วันเกิด", "birth", "2003-08-15"],
    ["สัญชาติ", "nationality", "ไทย"],
    ["เบอร์โทรศัพท์มือถือ", "phone", "0812345678"],
    ["อีเมล", "email", "nattida@example.com"],
    ["ที่อยู่ปัจจุบัน", "address", "123 หมู่ 4 อำเภอเมือง จังหวัดขอนแก่น"],
    ["รหัสไปรษณีย์", "postcode", "40000"],
    ["ชื่อผู้ติดต่อฉุกเฉิน", "contact", "นางสมใจ ใจดี"],
    ["ความสัมพันธ์", "relation", "มารดา"],
    ["โทรศัพท์ฉุกเฉิน", "emergencyPhone", "0819876543"],
  ],
  [
    ["ระดับการศึกษา", "level", "ปริญญาตรี"],
    ["จำนวนหน่วยกิตที่ลงทะเบียน", "credits", "32"],
    ["อาจารย์ที่ปรึกษา", "advisor", "อาจารย์สมศรี ใจดี"],
    ["ปีการศึกษา", "academicYear", "2568"],
  ],
  [
    ["สถานภาพบิดามารดา", "familyStatus", "อยู่ด้วยกัน"],
    ["จำนวนสมาชิกในครอบครัว", "members", "4"],
    ["รายได้ครอบครัวต่อปี (บาท)", "income", "180000"],
    ["อาชีพผู้ปกครอง", "occupation", "เกษตรกร"],
    ["จำนวนพี่น้องที่กำลังศึกษา", "siblings", "2"],
  ],
  [
    ["เหตุผลและความจำเป็นในการสมัครทุน", "reason", ""],
    ["กิจกรรมและผลงานที่ผ่านมา", "activities", ""],
  ],
  [
    ["ธนาคาร", "bank", "ธนาคารกสิกรไทย"],
    ["ชื่อบัญชี", "accountName", "น.ส.ณัฐธิดา ใจดี"],
    ["เลขที่บัญชี", "accountNumber", ""],
  ],
];
export function ApplyForm({
  scholarshipId = "academic",
}: {
  scholarshipId?: string;
}) {
  const item =
    scholarships.find((s) => s.id === scholarshipId) || scholarships[0];
  const [step, setStep] = useState(0),
    [values, setValues] = useState<Record<string, string>>(() =>
      Object.fromEntries(formSteps.flat().map(([, k, v]) => [k, v])),
    ),
    [message, setMessage] = useState(""),
    [count, setCount] = useState(0),
    [submitted, setSubmitted] = useState(false),
    [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  function next(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    if (step === 0 && Number(values.gpa) < item.gpa) {
      setMessage(
        `ทุนนี้กำหนด GPAX ขั้นต่ำ ${item.gpa.toFixed(2)} โปรดตรวจสอบข้อมูลหรือเลือกทุนอื่น`,
      );
      return;
    }
    if (step < 5) {
      setStep(step + 1);
      return;
    }
    if (count === 0) {
      setMessage("กรุณาเลือกเอกสารประกอบอย่างน้อย 1 ไฟล์");
      return;
    }
    setSubmitted(true);
  }
  return (
    <>
      <Heading
        title="สมัครทุน"
        description="กรอกข้อมูลเพื่อยืนยันการสมัครทุนการศึกษาภายในมหาวิทยาลัย"
      >
        <Badge>เฉพาะทุนภายในมหาวิทยาลัยเท่านั้น</Badge>
      </Heading>
      <ol className="form-steps">
        {stepLabels.map((s, i) => (
          <li
            key={s}
            className={i === step ? "active" : i < step ? "done" : ""}
          >
            <span>{i < step ? "✓" : i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
      {submitted ? (
        <Panel title="ตรวจสอบใบสมัครตัวอย่างเรียบร้อยแล้ว">
          <Notice>
            นี่เป็นการทดลองกรอกแบบฟอร์ม
            ยังไม่ได้ส่งใบสมัครหรือเอกสารไปยังมหาวิทยาลัย
          </Notice>
          <p>ชื่อผู้สมัคร: {values.name}</p>
          <p>ทุนที่สมัคร: {item.title}</p>
          <p>เอกสารที่เลือก: {count} ไฟล์</p>
          <div className="button-row">
            <Action href="/applications">ดูหน้าติดตามสถานะตัวอย่าง</Action>
            <button
              className="btn secondary"
              onClick={() => {
                setSubmitted(false);
                setStep(0);
              }}
            >
              กลับไปแก้ไข
            </button>
          </div>
        </Panel>
      ) : (
        <div className="columns">
          <div>
            <form onSubmit={next}>
              <Panel title={stepLabels[step]}>
                <p className="section-subtitle">
                  กรอกข้อมูลของคุณให้ถูกต้องและครบถ้วน
                </p>
                {step < 5 ? (
                  <div className="form-grid" key={step}>
                    {formSteps[step].map(([label, key]) => (
                      <label className={step === 3 ? "wide" : ""} key={key}>
                        {label} <b>*</b>
                        {step === 3 ? (
                          <textarea
                            name={key}
                            value={values[key]}
                            onChange={(e) =>
                              setValues({ ...values, [key]: e.target.value })
                            }
                            required
                            minLength={20}
                            maxLength={2000}
                            placeholder="อย่างน้อย 20 ตัวอักษร"
                          />
                        ) : (
                          <input
                            name={key}
                            value={values[key]}
                            onChange={(e) =>
                              setValues({ ...values, [key]: e.target.value })
                            }
                            type={
                              key === "birth"
                                ? "date"
                                : key === "email"
                                  ? "email"
                                  : [
                                        "gpa",
                                        "year",
                                        "credits",
                                        "members",
                                        "income",
                                        "siblings",
                                        "academicYear",
                                      ].includes(key)
                                    ? "number"
                                    : "text"
                            }
                            min={key === "gpa" ? 0 : 0}
                            max={
                              key === "gpa" ? 4 : key === "year" ? 8 : undefined
                            }
                            step={key === "gpa" ? "0.01" : "1"}
                            pattern={
                              key === "studentId"
                                ? "[0-9]{8,12}"
                                : key === "postcode"
                                  ? "[0-9]{5}"
                                  : key.toLowerCase().includes("phone")
                                    ? "[0-9]{9,10}"
                                    : undefined
                            }
                            required
                          />
                        )}
                      </label>
                    ))}
                  </div>
                ) : (
                  <>
                    <FilePicker
                      onCount={setCount}
                      selectedFiles={selectedFiles}
                      onFilesChange={setSelectedFiles}
                    />
                    <label className="checkbox consent">
                      <input type="checkbox" required />
                      ฉันตรวจสอบข้อมูลในแบบฟอร์มตัวอย่างแล้ว
                    </label>
                  </>
                )}
                {message && <Notice>{message}</Notice>}
                <div className="form-actions">
                  <button
                    className="btn secondary"
                    type="button"
                    disabled={step === 0}
                    onClick={() => {
                      setStep(step - 1);
                      setMessage("");
                    }}
                  >
                    ← ย้อนกลับ
                  </button>
                  <button
                    className="btn secondary"
                    type="button"
                    onClick={() =>
                      setMessage(
                        "เก็บข้อมูลร่างไว้ระหว่างการกรอกในหน้านี้แล้ว ข้อมูลจะหายเมื่อรีเฟรชหรือออกจากหน้า",
                      )
                    }
                  >
                    บันทึกร่าง
                  </button>
                  <button className="btn" type="submit">
                    {step === 5 ? "ตรวจสอบใบสมัคร" : "ถัดไป"}
                    <Icon name="arrow" />
                  </button>
                </div>
              </Panel>
            </form>
          </div>
          <aside className="stack">
            <Panel
              title="สรุปทุนที่สมัคร"
              action={
                <Action secondary href="/scholarships">
                  เปลี่ยนทุน ›
                </Action>
              }
            >
              <Photo index={item.image} />
              <h2 className="spaced">{item.title}</h2>
              <Badge>{item.type}</Badge>
              <p>{item.description}</p>
              <dl className="summary-data">
                <div>
                  <dt>จำนวนทุน</dt>
                  <dd>{item.quota} ทุน</dd>
                </div>
                <div>
                  <dt>มูลค่าทุน</dt>
                  <dd>{money(item.amount)} บาท</dd>
                </div>
                <div>
                  <dt>เปิดรับสมัคร</dt>
                  <dd>1 – 30 เม.ย. 2568</dd>
                </div>
                <div>
                  <dt>คุณสมบัติหลัก</dt>
                  <dd>GPAX ≥ {item.gpa.toFixed(2)}</dd>
                </div>
              </dl>
            </Panel>
            <Panel title="คำแนะนำในการสมัคร">
              <ul className="check-list">
                {[
                  "กรอกข้อมูลให้ครบถ้วนและเป็นความจริง",
                  "เตรียมเอกสารให้พร้อม",
                  "ตรวจสอบความถูกต้องก่อนส่ง",
                  "ติดตามสถานะที่เมนู ใบสมัครของฉัน",
                ].map((x) => (
                  <li key={x}>
                    <Icon name="check" />
                    {x}
                  </li>
                ))}
              </ul>
              <Quote />
            </Panel>
          </aside>
        </div>
      )}
    </>
  );
}
