"use client";

import { useActionState } from "react";
import { signInAction } from "@/app/admin/actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<{ error: string | null }, FormData>(signInAction, {
    error: null,
  });

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-onyx">
          อีเมล
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="rounded-lg border border-taupe/40 bg-bone px-3 py-2 text-sm text-onyx outline-none focus:border-onyx"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-onyx">
          รหัสผ่าน
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="rounded-lg border border-taupe/40 bg-bone px-3 py-2 text-sm text-onyx outline-none focus:border-onyx"
        />
      </div>

      {state.error && <p className="text-sm text-crimson">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-onyx px-6 py-2.5 text-sm font-semibold text-bone transition-colors hover:bg-onyx/90 disabled:opacity-60"
      >
        {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
}
