import type { Metadata } from "next";
import { SetPasswordForm } from "@/components/admin/set-password-form";

export const metadata: Metadata = { title: "ตั้งรหัสผ่าน" };

export default function SetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bone px-4">
      <h1 className="mb-2 font-display text-2xl font-bold text-onyx">ตั้งรหัสผ่านของคุณ</h1>
      <p className="mb-8 max-w-sm text-center text-sm text-onyx/60">
        ยืนยันอีเมลเรียบร้อยแล้ว ตั้งรหัสผ่านเพื่อเข้าใช้งานแอดมินในครั้งต่อไป
      </p>
      <SetPasswordForm />
    </div>
  );
}
