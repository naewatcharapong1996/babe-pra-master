// Fallback for when the invite-email flow (scripts/invite-admin.mjs) is
// blocked, e.g. by Supabase's free-tier email rate limit — creates the
// account directly with a password, no email sent at all.
// Usage: node scripts/create-admin.mjs <email> <password>
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] ??= match[2].trim();
}

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error("Usage: node scripts/create-admin.mjs <email> <password>");
  process.exit(1);
}
if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});
if (error) throw error;
console.log(`Created admin ${data.user.email} (id: ${data.user.id}) — they can log in at /admin/login now.`);
