import { getViewer } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const viewer = await getViewer();
  const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
  if (!viewer) return new Response(null, { status: 401, headers });
  const client = await createClient();
  const { data: profile, error } = await client.from("portal_profiles").select("avatar_path").eq("id", viewer.id).single();
  if (error || !profile?.avatar_path) return new Response(null, { status: 404, headers });
  const { data, error: downloadError } = await client.storage.from("portal-avatars").download(profile.avatar_path);
  if (downloadError || !data) return new Response(null, { status: 404, headers });
  return new Response(data, { headers: { ...headers, "Content-Type": "image/webp" } });
}
