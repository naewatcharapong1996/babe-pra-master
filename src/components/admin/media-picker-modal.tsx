"use client";

import { useEffect, useState } from "react";
import { Modal, Spinner } from "@heroui/react";
import { listMediaAssetsAction } from "@/app/admin/actions";
import type { MediaAsset } from "@/lib/content/media-repository";
import { AssetCard } from "./asset-card";

export function MediaPickerModal({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (asset: MediaAsset) => void;
}) {
  const [assets, setAssets] = useState<MediaAsset[] | null>(null);

  useEffect(() => {
    if (!open) return;
    setAssets(null);
    listMediaAssetsAction().then(setAssets);
  }, [open]);

  return (
    <Modal isOpen={open} onOpenChange={onOpenChange}>
      <Modal.Backdrop>
        <Modal.Container size="lg" scroll="inside">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>เลือกจากคลังสื่อ</Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>
            <Modal.Body>
              {assets === null ? (
                <div className="flex justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : assets.length === 0 ? (
                <p className="py-12 text-center text-sm text-onyx/50">ยังไม่มีไฟล์ในคลัง — อัปโหลดไฟล์ก่อนเพื่อนำมาใช้ซ้ำได้</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {assets.map((asset) => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      mode="picker"
                      onSelect={(selected) => {
                        onSelect(selected);
                        onOpenChange(false);
                      }}
                    />
                  ))}
                </div>
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
