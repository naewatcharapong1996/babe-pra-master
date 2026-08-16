"use client";

import { createClient } from "@supabase/supabase-js";

// fetch() has no cross-browser-reliable upload progress event, so this
// swaps in an XHR-backed fetch just for this one client instance — the
// Supabase SDK still builds the exact request (headers, FormData wrapping),
// we just intercept it to report byte progress.
function fetchWithProgress(onProgress: (loaded: number, total: number) => void): typeof fetch {
  return (input, init) =>
    new Promise<Response>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open((init?.method as string) ?? "GET", input.toString(), true);
      new Headers(init?.headers).forEach((value, key) => xhr.setRequestHeader(key, value));
      xhr.responseType = "text";
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(e.loaded, e.total);
      };
      xhr.onload = () => resolve(new Response(xhr.response, { status: xhr.status, statusText: xhr.statusText }));
      xhr.onerror = () => reject(new Error("อัปโหลดล้มเหลว (เครือข่ายมีปัญหา)"));
      xhr.send((init?.body as XMLHttpRequestBodyInit | null | undefined) ?? null);
    });
}

export async function uploadFileWithProgress({
  path,
  token,
  file,
  onProgress,
}: {
  path: string;
  token: string;
  file: File;
  onProgress: (loaded: number, total: number) => void;
}) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { fetch: fetchWithProgress(onProgress) },
  });

  const { error } = await supabase.storage.from("media").uploadToSignedUrl(path, token, file, {
    contentType: file.type,
  });
  if (error) throw error;
}
