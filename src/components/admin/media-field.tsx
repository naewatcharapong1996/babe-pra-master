"use client";

import { useRef, useState } from "react";
import { uploadMediaAction } from "@/app/admin/actions";

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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isVideo = /\.(webm|mp4|mov)$/i.test(value ?? "");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadMediaAction(formData);

    setUploading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onChange(result.url);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-onyx">
        {label}
        {optional && <span className="ml-1 text-xs font-normal text-onyx/50">(ไม่บังคับ)</span>}
      </span>

      {value ? (
        <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-taupe/40 bg-taupe/10">
          {isVideo ? (
            <video src={value} className="h-full w-full object-cover" muted playsInline />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- admin-only preview of an arbitrary uploaded URL
            <img src={value} alt="" className="h-full w-full object-cover" />
          )}
        </div>
      ) : (
        <div className="flex h-32 w-32 items-center justify-center rounded-lg border border-dashed border-taupe/40 text-xs text-onyx/40">
          ยังไม่มีไฟล์
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="text-sm text-onyx/70"
      />
      {uploading && <p className="text-xs text-onyx/50">กำลังอัปโหลด...</p>}
      {error && <p className="text-xs text-crimson">{error}</p>}
    </div>
  );
}
