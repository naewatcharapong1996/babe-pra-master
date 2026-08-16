import "server-only";
import { redirect } from "next/navigation";
import { createAuthServerClient } from "./server";

// Defense-in-depth: middleware already redirects unauthenticated /admin
// requests, but every Server Action re-checks independently since actions
// can be invoked directly and shouldn't trust the caller came through a
// gated page.
export async function requireAdminUser() {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return user;
}
