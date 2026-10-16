"use client";

import { useState } from "react";
import { Markdown } from "@/components/markdown";
import { cn } from "@/lib/utils";
import { inputClass } from "./fields";

/** Markdown textarea with a Write / Preview toggle. Preview uses the same renderer as the site. */
export function MarkdownEditor({
  label,
  name,
  initial,
  rows = 16,
  hint,
}: {
  label: string;
  name: string;
  initial: string;
  rows?: number;
  hint?: string;
}) {
  const [value, setValue] = useState(initial);
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <div>
      <div className="flex items-end justify-between">
        <span className="text-sm font-medium">{label}</span>
        <div role="tablist" aria-label={`${label} mode`} className="flex rounded-md border border-border p-0.5 text-xs">
          {(["write", "preview"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn("rounded px-2.5 py-1 capitalize", tab === t ? "bg-bg-subtle font-medium text-fg" : "text-fg-muted hover:text-fg")}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-1.5">
        {/* The textarea stays mounted while previewing so its value is still submitted. */}
        <textarea
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={rows}
          aria-label={label}
          className={cn(inputClass, "font-mono leading-relaxed", tab === "preview" && "hidden")}
        />
        {tab === "preview" && (
          <div className="overflow-auto rounded-md border border-border px-5 py-4" style={{ minHeight: `${rows * 1.6}rem` }}>
            {value.trim() ? <Markdown>{value}</Markdown> : <p className="text-sm text-fg-faint">Nothing to preview.</p>}
          </div>
        )}
      </div>
      {hint && <span className="mt-1.5 block text-xs text-fg-faint">{hint}</span>}
    </div>
  );
}
