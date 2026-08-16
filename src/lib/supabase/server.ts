import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Auth-only client (anon key, bound to the request's cookies). Used to know
// *who* is logged in for admin routes/actions — never to read or write
// page_sections, which has no anon/authenticated RLS policies and would
// simply return nothing.
export async function createAuthServerClient() {
  const cookieStore = await cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component render, where cookies() is
          // read-only. The middleware's session refresh (see
          // lib/supabase/middleware.ts) covers keeping the session alive.
        }
      },
    },
  });
}
