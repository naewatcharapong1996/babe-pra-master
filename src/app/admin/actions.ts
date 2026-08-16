"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { sectionSchemas, type SectionKey } from "@/lib/content/schema";
import { publishAllPending, saveSectionDraft } from "@/lib/content/repository";

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

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

export async function uploadMediaAction(formData: FormData): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  await requireAdminUser();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "ไม่พบไฟล์" };
  }
  if (!/^image\/|^video\//.test(file.type)) {
    return { ok: false, error: "รองรับเฉพาะไฟล์รูปภาพหรือวิดีโอ" };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "ไฟล์ใหญ่เกินไป (สูงสุด 25MB)" };
  }

  const supabase = createServiceClient();
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
  });
  if (error) {
    return { ok: false, error: error.message };
  }

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
