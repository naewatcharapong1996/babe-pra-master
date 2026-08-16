// Registers the project's bundled /public/media content files (hero +
// product photos — not logo.svg/line-qr.png, those are UI chrome, not
// swappable content) into media_assets as is_default:true, so they show up
// in the media library and are reusable via "เลือกจากคลัง", but are
// delete-protected (see deleteMediaAsset). Safe to re-run: existing rows
// (matched by storage_path) are left alone, so renames aren't clobbered.
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] ??= match[2].trim();
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const MIME_TYPES = {
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webm": "video/webm",
};

const dirs = ["public/media/hero", "public/media/products"];

const rows = dirs.flatMap((dir) =>
  readdirSync(dir).map((fileName) => {
    const ext = path.extname(fileName).toLowerCase();
    const fullPath = path.join(dir, fileName);
    const publicPath = `/${path.relative("public", fullPath).split(path.sep).join("/")}`;
    return {
      storage_path: publicPath,
      public_url: publicPath,
      name: fileName,
      mime_type: MIME_TYPES[ext] ?? "application/octet-stream",
      size_bytes: statSync(fullPath).size,
      is_default: true,
    };
  }),
);

const { data, error } = await supabase
  .from("media_assets")
  .upsert(rows, { onConflict: "storage_path", ignoreDuplicates: true })
  .select();
if (error) throw error;
console.log(`Registered ${data.length} of ${rows.length} default assets (existing ones were left untouched).`);
