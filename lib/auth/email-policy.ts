export const WU_EMAIL_DOMAIN =
  "@mail.wu.ac.th";

export function normalizeWuEmail(
  value: unknown,
) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export function isWuEmail(
  email: string,
) {
  return /^[a-z0-9._%+-]+@mail\.wu\.ac\.th$/i.test(
    email,
  );
}