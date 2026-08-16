import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createAuthServerClient } from "@/lib/supabase/server";

// Where invite/recovery email links land. Verifies the token server-side
// (establishing the session cookie), then sends the user on to set a
// password — this is what was missing: the invite email had nowhere to go.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (token_hash && type) {
    const supabase = await createAuthServerClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      const next = type === "invite" || type === "recovery" ? "/admin/set-password" : "/admin";
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  return NextResponse.redirect(new URL("/admin/login", origin));
}
