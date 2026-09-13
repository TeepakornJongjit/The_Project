import sharp from "sharp";

export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

// Decode and re-encode uploaded bytes; do not trust the extension or MIME header.
export async function prepareAvatar(bytes) {
  if (!bytes.length || bytes.length > MAX_AVATAR_BYTES) throw new Error("AVATAR_SIZE");
  const input = sharp(bytes, { limitInputPixels: 20_000_000, failOn: "warning" });
  const metadata = await input.metadata();
  if (!["jpeg", "png", "webp"].includes(metadata.format) || (metadata.pages ?? 1) > 1) {
    throw new Error("AVATAR_FORMAT");
  }
  // Default output strips EXIF, including GPS metadata.
  return input.rotate().resize(512, 512, { fit: "cover" }).webp({ quality: 82 }).toBuffer();
}
