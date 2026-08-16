import Link from "next/link";
import { signOutAction } from "@/app/admin/actions";

export function AdminTopbar({ title, backHref }: { title: string; backHref?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-taupe/30 bg-bone px-4 py-3 sm:px-8">
      <div className="flex items-center gap-3">
        {backHref && (
          <Link href={backHref} className="text-sm text-onyx/60 hover:text-onyx">
            ←
          </Link>
        )}
        <h1 className="font-display text-lg font-bold text-onyx">{title}</h1>
      </div>
      <form action={signOutAction}>
        <button type="submit" className="text-sm text-onyx/60 hover:text-onyx">
          ออกจากระบบ
        </button>
      </form>
    </div>
  );
}
