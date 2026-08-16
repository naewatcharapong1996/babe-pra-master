"use client";

import { useState } from "react";
import { Button, Spinner, toast } from "@heroui/react";
import { CheckIcon, CloseIcon } from "@/components/icons";
import { deleteMediaAssetAction, renameMediaAssetAction } from "@/app/admin/actions";
import type { MediaAsset } from "@/lib/content/media-repository";

function formatSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

export function AssetCard({
  asset,
  mode,
  onSelect,
  onDeleted,
}: {
  asset: MediaAsset;
  mode: "library" | "picker";
  onSelect?: (asset: MediaAsset) => void;
  onDeleted?: (id: string) => void;
}) {
  const [name, setName] = useState(asset.name);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isVideo = asset.mime_type.startsWith("video/");

  async function handleRename() {
    const trimmed = name.trim();
    if (!trimmed || trimmed === asset.name) {
      setName(asset.name);
      setEditing(false);
      return;
    }
    setSaving(true);
    const result = await renameMediaAssetAction(asset.id, trimmed);
    setSaving(false);
    if (!result.ok) {
      toast.danger(result.error);
      setName(asset.name);
      return;
    }
    setEditing(false);
    toast.success("เปลี่ยนชื่อไฟล์แล้ว");
  }

  async function handleDelete() {
    if (!confirm(`ลบ "${asset.name}" ออกจากคลัง? การกระทำนี้ย้อนกลับไม่ได้ และเนื้อหาที่ใช้ไฟล์นี้อยู่จะแสดงผลผิดพลาด`)) return;
    setDeleting(true);
    const result = await deleteMediaAssetAction(asset.id);
    setDeleting(false);
    if (!result.ok) {
      toast.danger(result.error);
      return;
    }
    toast.success("ลบไฟล์แล้ว");
    onDeleted?.(asset.id);
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-taupe/30 bg-bone p-2">
      <button
        type="button"
        onClick={() => onSelect?.(asset)}
        disabled={mode !== "picker"}
        className="relative aspect-square w-full overflow-hidden rounded-lg bg-taupe/10 disabled:cursor-default"
      >
        {isVideo ? (
          <video src={asset.public_url} className="h-full w-full object-cover" muted playsInline preload="metadata" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- admin-only preview of a Supabase Storage URL
          <img src={asset.public_url} alt={asset.name} loading="lazy" className="h-full w-full object-cover" />
        )}
        {mode === "picker" && (
          <span className="absolute inset-0 flex items-center justify-center bg-onyx/0 text-transparent transition-colors hover:bg-onyx/40 hover:text-bone">
            เลือกไฟล์นี้
          </span>
        )}
      </button>

      {mode === "library" && editing ? (
        <div className="flex items-center gap-1">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            className="min-w-0 flex-1 rounded border border-taupe/40 bg-bone px-1.5 py-1 text-xs text-onyx outline-none focus:border-onyx"
          />
          <button type="button" onClick={handleRename} disabled={saving} className="p-1 text-onyx/60 hover:text-onyx">
            {saving ? <Spinner size="sm" /> : <CheckIcon className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setName(asset.name);
              setEditing(false);
            }}
            className="p-1 text-onyx/60 hover:text-onyx"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => (mode === "library" ? setEditing(true) : onSelect?.(asset))}
          className="truncate text-left text-xs font-medium text-onyx"
          title={mode === "library" ? "แก้ไขชื่อ" : "เลือกไฟล์นี้"}
        >
          {asset.name}
        </button>
      )}

      <p className="text-[11px] text-onyx/40">{formatSize(asset.size_bytes)}</p>

      {mode === "library" && (
        <Button variant="danger-soft" size="sm" isDisabled={deleting} onPress={handleDelete} className="gap-1.5">
          {deleting && <Spinner size="sm" color="current" />}
          {deleting ? "กำลังลบ..." : "ลบ"}
        </Button>
      )}
    </div>
  );
}
