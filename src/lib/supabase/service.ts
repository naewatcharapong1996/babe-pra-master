import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role client: bypasses RLS entirely. `page_sections` has no RLS
// policies at all (see supabase setup), so this is intentionally the *only*
// way anything reads or writes site content — never expose this key or this
// client to the browser.
export function createServiceClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
