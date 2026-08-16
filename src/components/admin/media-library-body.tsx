"use client";

import { useRef, useState } from "react";
import { Button, ProgressBar, toast } from "@heroui/react";
import { UploadIcon } from "@/components/icons";
import { createUploadUrlAction, registerMediaAssetAction } from "@/app/admin/actions";
import { uploadFileWithProgress } from "@/lib/supabase/upload-with-progress";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from "@/lib/admin/constants";
import type { MediaAsset } from "@/lib/content/media-repository";
import { AssetCard } from "./asset-card";

type UploadProgress = { loaded: number; total: number };

export function MediaLibraryBody({ initialAssets }: { initialAssets: MediaAsset[] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!/^image\/|^video\//.test(file.type)) {
      toast.danger("รองรับเฉพาะไฟล์รูปภาพหรือวิดีโอ");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.danger(`ไฟล์ใหญ่เกินไป (${(file.size / 1024 / 1024).toFixed(1)}MB) — สูงสุด ${MAX_UPLOAD_MB}MB`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setProgress({ loaded: 0, total: file.size });
    try {
      const created = await createUploadUrlAction(file.name, file.type, file.size);
      if (!created.ok) {
        toast.danger(created.error);
        return;
      }

      await uploadFileWithProgress({
        path: created.path,
        token: created.token,
        file,
        onProgress: (loaded, total) => setProgress({ loaded, total }),
      });

      const asset = await registerMediaAssetAction({
        storagePath: created.path,
        publicUrl: created.publicUrl,
        name: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      });

      setAssets((prev) => [asset, ...prev]);
      toast.success("อัปโหลดไฟล์แล้ว");
    } catch {
      toast.danger("อัปโหลดไม่สำเร็จ ลองใหม่อีกครั้ง");
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const uploading = progress !== null;
  const percent = uploading ? Math.round((progress.loaded / progress.total) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-taupe/30 bg-taupe/5 p-4">
        <div>
          <p className="text-sm font-medium text-onyx">ไฟล์ทั้งหมด {assets.length} รายการ</p>
          <p className="mt-0.5 text-xs text-onyx/50">อัปโหลดที่นี่แล้วนำไปใช้ซ้ำได้ทุกส่วนของเว็บ ผ่านปุ่ม "เลือกจากคลัง"</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Button variant="primary" size="md" isDisabled={uploading} onPress={() => inputRef.current?.click()} className="gap-2">
            <UploadIcon className="h-4 w-4" />
            อัปโหลดไฟล์ใหม่
          </Button>
          {uploading && (
            <div className="flex w-48 flex-col gap-1">
              <ProgressBar value={percent} minValue={0} maxValue={100} aria-label="ความคืบหน้าการอัปโหลด">
                <ProgressBar.Track className="h-1.5">
                  <ProgressBar.Fill />
                </ProgressBar.Track>
              </ProgressBar>
              <span className="text-[11px] text-onyx/50">
                {(progress.loaded / 1024 / 1024).toFixed(1)} / {(progress.total / 1024 / 1024).toFixed(1)}MB ({percent}%)
              </span>
            </div>
          )}
        </div>
      </div>

      <input ref={inputRef} type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />

      {assets.length === 0 ? (
        <p className="py-16 text-center text-sm text-onyx/50">ยังไม่มีไฟล์ในคลัง</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {assets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              mode="library"
              onDeleted={(id) => setAssets((prev) => prev.filter((a) => a.id !== id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
