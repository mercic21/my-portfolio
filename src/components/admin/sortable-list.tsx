"use client";

import { useState, useTransition, type ReactNode } from "react";
import { reorder, type OrderableKind } from "@/app/admin/(dashboard)/actions";
import { cn } from "@/lib/utils";

type Item = { id: string; content: ReactNode };

/** Drag rows (or use the arrow buttons) to reorder. Saves the new order immediately. */
export function SortableList({ kind, items: initial }: { kind: OrderableKind; items: Item[] }) {
  const [items, setItems] = useState(initial);
  const [dragId, setDragId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [prevInitial, setPrevInitial] = useState(initial);

  // Server data changed (e.g. after a refresh) — reset local order.
  if (initial !== prevInitial) {
    setPrevInitial(initial);
    setItems(initial);
  }

  function commit(next: Item[]) {
    setItems(next);
    startTransition(() => reorder(kind, next.map((i) => i.id)));
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    commit(next);
  }

  return (
    <ul className={cn("divide-y divide-border rounded-lg border border-border", pending && "opacity-70")}>
      {items.map((item, index) => (
        <li
          key={item.id}
          draggable
          onDragStart={(e) => {
            setDragId(item.id);
            e.dataTransfer.effectAllowed = "move";
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const from = items.findIndex((i) => i.id === dragId);
            if (from !== -1) move(from, index);
            setDragId(null);
          }}
          onDragEnd={() => setDragId(null)}
          className={cn("flex items-center gap-3 bg-bg px-3 py-3 first:rounded-t-lg last:rounded-b-lg", dragId === item.id && "opacity-40")}
        >
          <span className="cursor-grab select-none text-fg-faint" aria-hidden title="Drag to reorder">
            ⋮⋮
          </span>
          <div className="min-w-0 flex-1">{item.content}</div>
          <div className="flex shrink-0 flex-col">
            <button type="button" onClick={() => move(index, index - 1)} disabled={index === 0} aria-label="Move up" className="px-1 text-xs leading-none text-fg-faint hover:text-fg disabled:opacity-30">
              ▲
            </button>
            <button type="button" onClick={() => move(index, index + 1)} disabled={index === items.length - 1} aria-label="Move down" className="px-1 text-xs leading-none text-fg-faint hover:text-fg disabled:opacity-30">
              ▼
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
