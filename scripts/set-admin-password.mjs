// Sets/overwrites the password for an existing admin account directly (no
// email sent) — for accounts stuck in a pending-invite state, or anyone who
// needs a password reset without going through the email flow.
// Usage: node scripts/set-admin-password.mjs <email> <password>
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] ??= match[2].trim();
}

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error("Usage: node scripts/set-admin-password.mjs <email> <password>");
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

const { data: list, error: listError } = await supabase.auth.admin.listUsers({ perPage: 200 });
if (listError) throw listError;

const existing = list.users.find((u) => u.email === email);
if (!existing) {
  console.error(`No existing user for ${email} — use create-admin.mjs instead.`);
  process.exit(1);
}

const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
  password,
  email_confirm: true,
});
if (error) throw error;
console.log(`Password set for ${data.user.email} — they can log in at /admin/login now.`);
