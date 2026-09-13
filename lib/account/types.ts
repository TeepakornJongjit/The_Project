export type PersonalProfile = {
  phone: string | null;
  department: string | null;
  position: string | null;
  expertise: string | null;
  avatar_path: string | null;
  version: number;
  profile_details: Record<string, string>;
};
export type ProfileState = { error: string; success: string; version?: number };
