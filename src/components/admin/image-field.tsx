"use client";

import { useState } from "react";
import type { ImageRef } from "@/lib/types";
import { inputClass } from "./fields";
import { UploadButton } from "./upload-button";

/** Image URL + alt text. Upload fills the URL when Cloudinary is configured. */
export function ImageField({ label, name, initial }: { label: string; name: string; initial: ImageRef | null }) {
  const [url, setUrl] = useState(initial?.url ?? "");

  return (
    <fieldset>
      <legend className="text-sm font-medium">{label}</legend>
      <div className="mt-1.5 flex gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-md border border-border bg-bg-subtle">
          {url && (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of arbitrary URL
            <img src={url} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <input
              name={`${name}.url`}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              aria-label={`${label} URL`}
              className={inputClass}
            />
            <UploadButton onUploaded={setUrl} />
          </div>
          <input
            name={`${name}.alt`}
            defaultValue={initial?.alt ?? ""}
            placeholder="Alt text — describe the image"
            aria-label={`${label} alt text`}
            className={inputClass}
          />
        </div>
      </div>
    </fieldset>
  );
}

/** Plain URL input with an optional upload (used for the résumé PDF). */
export function FileUrlField({ label, name, initial, hint }: { label: string; name: string; initial: string; hint?: string }) {
  const [url, setUrl] = useState(initial);
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-1.5 flex gap-2">
        <input name={name} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className={inputClass} />
        <UploadButton kind="file" onUploaded={setUrl} />
      </div>
      {hint && <span className="mt-1.5 block text-xs text-fg-faint">{hint}</span>}
    </label>
  );
}
