"use client";

import { useTransition, type ReactNode } from "react";
import { buttonStyles } from "@/components/ui";

/** Runs a server action after a confirm() prompt. */
export function ConfirmButton({
  action,
  confirmText = "Are you sure? This can't be undone.",
  children,
  className = buttonStyles.danger,
}: {
  action: () => Promise<void>;
  confirmText?: string;
  children: ReactNode;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className={className}
      onClick={() => {
        if (confirm(confirmText)) startTransition(() => action());
      }}
    >
      {pending ? "Working…" : children}
    </button>
  );
}

/** Runs a server action without confirmation (toggles etc.). */
export function ActionButton({ action, children, className }: { action: () => Promise<void>; children: ReactNode; className?: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button type="button" disabled={pending} className={className} onClick={() => startTransition(() => action())}>
      {children}
    </button>
  );
}
