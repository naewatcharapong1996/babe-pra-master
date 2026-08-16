import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบแอดมิน",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bone px-4">
      <h1 className="mb-8 font-display text-2xl font-bold text-onyx">เข้าสู่ระบบแอดมิน</h1>
      <LoginForm />
    </div>
  );
}
