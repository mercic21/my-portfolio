"use client";

import { useState } from "react";
import type { ImageRef } from "@/lib/types";
import { inputClass } from "./fields";
import { UploadButton, uploadsEnabled } from "./upload-button";

type Row = ImageRef & { key: string };

/** Gallery images as `images.url` / `images.alt` rows, each with a thumbnail and optional upload. */
export function GalleryField({ label, name, initial, max = 20 }: { label: string; name: string; initial: ImageRef[]; max?: number }) {
  const [rows, setRows] = useState<Row[]>(() => initial.map((img) => ({ ...img, key: crypto.randomUUID() })));

  const update = (key: string, patch: Partial<ImageRef>) =>
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const add = (url = "") => setRows((prev) => [...prev, { url, alt: "", key: crypto.randomUUID() }]);

  return (
    <fieldset>
      <legend className="text-sm font-medium">{label}</legend>
      <div className="mt-1.5 space-y-3">
        {rows.map((r, i) => (
          <div key={r.key} className="flex gap-3">
            <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-bg-subtle">
              {r.url && (
                // eslint-disable-next-line @next/next/no-img-element -- admin preview of arbitrary URL
                <img src={r.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex gap-2">
                <input
                  name={`${name}.url`}
                  value={r.url}
                  onChange={(e) => update(r.key, { url: e.target.value })}
                  placeholder="https://…"
                  aria-label={`Image ${i + 1} URL`}
                  className={inputClass}
                />
                <UploadButton onUploaded={(url) => update(r.key, { url })} />
              </div>
              <input
                name={`${name}.alt`}
                value={r.alt}
                onChange={(e) => update(r.key, { alt: e.target.value })}
                placeholder="Caption / alt text"
                aria-label={`Image ${i + 1} caption`}
                className={inputClass}
              />
            </div>
            <button
              type="button"
              onClick={() => setRows((prev) => prev.filter((x) => x.key !== r.key))}
              aria-label={`Remove image ${i + 1}`}
              className="h-9 shrink-0 rounded-md px-2 text-fg-faint hover:bg-bg-subtle hover:text-danger"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      {rows.length < max && (
        <div className="mt-3 flex items-center gap-3 text-sm">
          {uploadsEnabled && <UploadButton onUploaded={(url) => add(url)} />}
          <button type="button" onClick={() => add()} className="text-fg-muted hover:text-fg">
            + Add image by URL
          </button>
        </div>
      )}
    </fieldset>
  );
}
