// Invites a new admin login for /admin. Public sign-up is disabled, so this
// is the only way to add an account — Supabase emails the recipient a link
// to set their own password, we never handle or relay one.
// Usage: node scripts/invite-admin.mjs someone@example.com
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] ??= match[2].trim();
}

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/invite-admin.mjs <email>");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const { data, error } = await supabase.auth.admin.inviteUserByEmail(email);
if (error) throw error;
console.log(`Invited ${data.user.email} (id: ${data.user.id}) — check their inbox for the setup link.`);
