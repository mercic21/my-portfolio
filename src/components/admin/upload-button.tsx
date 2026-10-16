"use client";

import { useRef, useState } from "react";

const MAX_BYTES = 10 * 1024 * 1024;
export const uploadsEnabled = Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

/** Uploads straight to Cloudinary with a server-issued signature and returns the secure URL. */
export function UploadButton({ kind = "image", onUploaded }: { kind?: "image" | "file"; onUploaded: (url: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!uploadsEnabled) return null;

  async function upload(file: File) {
    setError("");
    if (file.size > MAX_BYTES) return setError("Max 10 MB");
    setBusy(true);
    try {
      const signRes = await fetch("/api/upload/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind }),
      });
      if (!signRes.ok) throw new Error((await signRes.json()).error ?? "Could not sign upload");
      const { cloudName, apiKey, signature, ...params } = await signRes.json();

      const body = new FormData();
      body.append("file", file);
      body.append("api_key", apiKey);
      body.append("signature", signature);
      for (const [k, v] of Object.entries(params)) body.append(k, String(v));

      const resourceType = kind === "file" ? "raw" : "image";
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message ?? "Upload failed");
      onUploaded(json.secure_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <input
        ref={input}
        type="file"
        hidden
        accept={kind === "file" ? "application/pdf" : "image/*"}
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => input.current?.click()}
        className="h-9 shrink-0 rounded-md border border-border-strong px-3 text-sm hover:bg-bg-subtle disabled:opacity-50"
      >
        {busy ? "Uploading…" : "Upload"}
      </button>
      {error && <span className="text-xs text-danger">{error}</span>}
    </span>
  );
}
