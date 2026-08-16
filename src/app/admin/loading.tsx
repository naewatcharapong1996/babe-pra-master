import { Spinner } from "@heroui/react";

// Next.js wraps every /admin/** page in a Suspense boundary around this file
// automatically. Without it, navigation blocks silently while server data
// loads (feels frozen); with it, this shows immediately on click.
export default function AdminLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bone">
      <Spinner size="lg" />
      <p className="text-sm text-onyx/50">กำลังโหลด...</p>
    </div>
  );
}
