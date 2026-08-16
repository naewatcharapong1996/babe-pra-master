import "server-only";
import { createServiceClient } from "@/lib/supabase/service";

export type MediaAsset = {
  id: string;
  storage_path: string;
  public_url: string;
  name: string;
  mime_type: string;
  size_bytes: number;
  is_default: boolean;
  created_at: string;
};

export async function listMediaAssets(): Promise<MediaAsset[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from("media_assets").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function registerMediaAsset(input: {
  storagePath: string;
  publicUrl: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  isDefault?: boolean;
}): Promise<MediaAsset> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      storage_path: input.storagePath,
      public_url: input.publicUrl,
      name: input.name,
      mime_type: input.mimeType,
      size_bytes: input.sizeBytes,
      is_default: input.isDefault ?? false,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function renameMediaAsset(id: string, name: string): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.from("media_assets").update({ name }).eq("id", id);
  if (error) throw error;
}

export async function deleteMediaAsset(id: string): Promise<void> {
  const supabase = createServiceClient();
  const { data: asset, error: fetchError } = await supabase
    .from("media_assets")
    .select("storage_path, is_default")
    .eq("id", id)
    .single();
  if (fetchError) throw fetchError;

  // Defense in depth — the UI already hides/disables delete for these.
  // Default assets are bundled files under /public, not real Storage
  // objects, so there's nothing in Storage to remove even if this weren't
  // blocked.
  if (asset.is_default) {
    throw new Error("ไฟล์นี้เป็นค่าเริ่มต้นของระบบ ลบไม่ได้ (เปลี่ยนชื่อได้)");
  }

  const { error: removeError } = await supabase.storage.from("media").remove([asset.storage_path]);
  if (removeError) throw removeError;

  const { error: deleteError } = await supabase.from("media_assets").delete().eq("id", id);
  if (deleteError) throw deleteError;
}
