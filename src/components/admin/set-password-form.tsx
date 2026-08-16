"use client";

import { useActionState } from "react";
import { setPasswordAction } from "@/app/admin/actions";

export function SetPasswordForm() {
  const [state, formAction, pending] = useActionState<{ error: string | null }, FormData>(setPasswordAction, {
    error: null,
  });

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-onyx">
          รหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="rounded-lg border border-taupe/40 bg-bone px-3 py-2 text-sm text-onyx outline-none focus:border-onyx"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-onyx">
          ยืนยันรหัสผ่าน
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="rounded-lg border border-taupe/40 bg-bone px-3 py-2 text-sm text-onyx outline-none focus:border-onyx"
        />
      </div>

      {state.error && <p className="text-sm text-crimson">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-onyx px-6 py-2.5 text-sm font-semibold text-bone transition-colors hover:bg-onyx/90 disabled:opacity-60"
      >
        {pending ? "กำลังบันทึก..." : "ตั้งรหัสผ่านและเข้าสู่ระบบ"}
      </button>
    </form>
  );
}
