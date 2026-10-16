"use client";

import { useState } from "react";
import { inputClass } from "./fields";

type Column = { name: string; placeholder: string; width?: string };

/** Repeating rows of inputs, submitted as `${name}.${column}` (read with `rows()` on the server). */
export function RowsField({
  label,
  name,
  columns,
  initial,
  addLabel = "Add row",
  max = 12,
}: {
  label: string;
  name: string;
  columns: Column[];
  initial: Record<string, string>[];
  addLabel?: string;
  max?: number;
}) {
  const [items, setItems] = useState(() => initial.map((row) => ({ key: crypto.randomUUID(), row })));

  return (
    <fieldset>
      <legend className="text-sm font-medium">{label}</legend>
      <div className="mt-1.5 space-y-2">
        {items.map((item, i) => (
          <div key={item.key} className="flex gap-2">
            {columns.map((c) => (
              <input
                key={c.name}
                name={`${name}.${c.name}`}
                defaultValue={item.row[c.name] ?? ""}
                placeholder={c.placeholder}
                aria-label={`${c.placeholder} ${i + 1}`}
                className={inputClass}
                style={c.width ? { width: c.width, flex: "none" } : undefined}
              />
            ))}
            <button
              type="button"
              onClick={() => setItems((prev) => prev.filter((x) => x.key !== item.key))}
              aria-label="Remove row"
              className="shrink-0 rounded-md px-2 text-fg-faint hover:bg-bg-subtle hover:text-danger"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      {items.length < max && (
        <button
          type="button"
          onClick={() => setItems((prev) => [...prev, { key: crypto.randomUUID(), row: {} }])}
          className="mt-2 text-sm text-fg-muted hover:text-fg"
        >
          + {addLabel}
        </button>
      )}
    </fieldset>
  );
}
