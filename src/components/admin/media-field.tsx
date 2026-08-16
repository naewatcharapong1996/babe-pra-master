"use client";

import { useRef, useState } from "react";
import { Button, ProgressBar, toast } from "@heroui/react";
import { UploadIcon } from "@/components/icons";
import { createUploadUrlAction, registerMediaAssetAction } from "@/app/admin/actions";
import { uploadFileWithProgress } from "@/lib/supabase/upload-with-progress";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from "@/lib/admin/constants";
import type { MediaAsset } from "@/lib/content/media-repository";
import { MediaPickerModal } from "./media-picker-modal";

type UploadProgress = { loaded: number; total: number };

export function MediaField({
  label,
  value,
  onChange,
  optional,
}: {
  label: string;
  value: string | null | undefined;
  onChange: (url: string) => void;
  optional?: boolean;
}) {
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isVideo = /\.(webm|mp4|mov)$/i.test(value ?? "");

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

      await registerMediaAssetAction({
        storagePath: created.path,
        publicUrl: created.publicUrl,
        name: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      });

      onChange(created.publicUrl);
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
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-onyx">
        {label}
        {optional && <span className="ml-1 text-xs font-normal text-onyx/50">(ไม่บังคับ)</span>}
      </span>

      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative h-24 w-24 flex-none overflow-hidden rounded-lg border border-taupe/40 bg-taupe/10">
            {isVideo ? (
              <video src={value} className="h-full w-full object-cover" muted playsInline preload="metadata" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- admin-only preview of an arbitrary uploaded URL
              <img src={value} alt="" loading="lazy" className="h-full w-full object-cover" />
            )}
          </div>
        ) : (
          <div className="flex h-24 w-24 flex-none items-center justify-center rounded-lg border border-dashed border-taupe/40 text-xs text-onyx/40">
            ยังไม่มีไฟล์
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              isDisabled={uploading}
              onPress={() => inputRef.current?.click()}
              className="gap-2"
            >
              <UploadIcon className="h-4 w-4" />
              {value ? "อัปโหลดใหม่" : "อัปโหลดไฟล์"}
            </Button>
            <Button variant="ghost" size="sm" isDisabled={uploading} onPress={() => setPickerOpen(true)}>
              เลือกจากคลัง
            </Button>
          </div>

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

      <MediaPickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(asset: MediaAsset) => onChange(asset.public_url)}
      />
    </div>
  );
}
