"use client";

import { createContext, startTransition, useActionState, useContext, type ReactNode } from "react";
import { buttonStyles } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { ActionResult } from "@/app/admin/(dashboard)/actions";

const PendingContext = createContext(false);

/**
 * Submits through useActionState without React's automatic form reset,
 * so a validation error never wipes what was typed.
 */
export function ActionForm({
  action,
  children,
  className,
}: {
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
  children: ReactNode;
  className?: string;
}) {
  const [state, dispatch, pending] = useActionState(action, null);

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => dispatch(fd));
      }}
    >
      <PendingContext value={pending}>{children}</PendingContext>
      <div aria-live="polite" className="mt-4 min-h-5 text-sm">
        {state && !pending && (
          <p className={state.ok ? "text-ok" : "text-danger"}>{state.message}</p>
        )}
      </div>
    </form>
  );
}

export function SubmitButton({ children = "Save", className }: { children?: ReactNode; className?: string }) {
  const pending = useContext(PendingContext);
  return (
    <button type="submit" disabled={pending} className={cn(buttonStyles.primary, className)}>
      {pending ? "Saving…" : children}
    </button>
  );
}
