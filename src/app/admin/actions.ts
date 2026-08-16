"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { sectionSchemas, type SectionKey } from "@/lib/content/schema";
import { publishAllPending, saveSectionDraft } from "@/lib/content/repository";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from "@/lib/admin/constants";
import {
  deleteMediaAsset,
  listMediaAssets,
  registerMediaAsset,
  renameMediaAsset,
  type MediaAsset,
} from "@/lib/content/media-repository";

export async function signInAction(
  _prevState: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createAuthServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
  }

  redirect("/admin");
}

export async function signOutAction() {
  const supabase = await createAuthServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function setPasswordAction(
  _prevState: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    return { error: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" };
  }
  if (password !== confirmPassword) {
    return { error: "รหัสผ่านไม่ตรงกัน" };
  }

  // Reaching this action at all requires the session cookie set by
  // /auth/confirm's verifyOtp() — i.e. a valid, single-use invite/recovery
  // link was just clicked. No separate admin check needed.
  const supabase = await createAuthServerClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: error.message };
  }

  redirect("/admin");
}

export async function saveDraftAction(key: SectionKey, content: unknown) {
  const user = await requireAdminUser();
  const schema = sectionSchemas[key];
  const parsed = schema.safeParse(content);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" };
  }
  await saveSectionDraft(key, parsed.data as never, user.id);
  revalidatePath(`/admin/${key}`);
  revalidatePath("/admin");
  revalidatePath("/admin/preview");
  return { ok: true as const };
}

export async function publishAllAction() {
  await requireAdminUser();
  const count = await publishAllPending();
  revalidatePath("/admin");
  revalidatePath("/");
  return { published: count };
}

// Step 1 of the upload: validate + get a signed URL the browser can PUT the
// file to directly (so upload progress can be tracked client-side — a
// Server Action can't report progress on its own request body).
export async function createUploadUrlAction(
  fileName: string,
  fileType: string,
  fileSize: number,
): Promise<
  | { ok: true; signedUrl: string; token: string; path: string; publicUrl: string }
  | { ok: false; error: string }
> {
  await requireAdminUser();

  if (!/^image\/|^video\//.test(fileType)) {
    return { ok: false, error: "รองรับเฉพาะไฟล์รูปภาพหรือวิดีโอ" };
  }
  if (fileSize > MAX_UPLOAD_BYTES) {
    return { ok: false, error: `ไฟล์ใหญ่เกินไป (สูงสุด ${MAX_UPLOAD_MB}MB)` };
  }

  const supabase = createServiceClient();
  const ext = fileName.split(".").pop() ?? "bin";
  const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { data, error } = await supabase.storage.from("media").createSignedUploadUrl(path);
  if (error) {
    return { ok: false, error: error.message };
  }

  const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(path);
  return { ok: true, signedUrl: data.signedUrl, token: data.token, path: data.path, publicUrl: publicUrlData.publicUrl };
}

// Step 2: called once the browser's direct PUT to the signed URL succeeds,
// so the asset shows up in the reusable media library.
export async function registerMediaAssetAction(input: {
  storagePath: string;
  publicUrl: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
}): Promise<MediaAsset> {
  await requireAdminUser();
  const asset = await registerMediaAsset(input);
  revalidatePath("/admin/media");
  return asset;
}

export async function listMediaAssetsAction(): Promise<MediaAsset[]> {
  await requireAdminUser();
  return listMediaAssets();
}

export async function renameMediaAssetAction(id: string, name: string): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdminUser();
  const trimmed = name.trim();
  if (!trimmed) {
    return { ok: false, error: "ชื่อไฟล์ห้ามว่าง" };
  }
  await renameMediaAsset(id, trimmed);
  revalidatePath("/admin/media");
  return { ok: true };
}

export async function deleteMediaAssetAction(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdminUser();
  try {
    await deleteMediaAsset(id);
    revalidatePath("/admin/media");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "ลบไม่สำเร็จ" };
  }
}
