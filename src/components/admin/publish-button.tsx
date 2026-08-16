"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { publishAllAction } from "@/app/admin/actions";

export function PublishButton({ disabled }: { disabled: boolean }) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handlePublish() {
    if (!confirm("เผยแพร่การเปลี่ยนแปลงทั้งหมดขึ้นเว็บจริงตอนนี้เลยหรือไม่?")) return;
    setPending(true);
    await publishAllAction();
    setPending(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handlePublish}
      disabled={disabled || pending}
      className="rounded-full bg-crimson px-6 py-2 text-sm font-semibold text-bone transition-colors hover:bg-crimson-dark disabled:opacity-40"
    >
      {pending ? "กำลังเผยแพร่..." : "เผยแพร่ขึ้นเว็บจริง"}
    </button>
  );
}
