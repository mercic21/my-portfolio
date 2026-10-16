"use client";

import { useActionState } from "react";
import { buttonStyles } from "@/components/ui";
import { sendMessage, type ContactState } from "./actions";

const field =
  "mt-1.5 block w-full rounded-md border border-border-strong bg-bg px-3 py-2 text-sm placeholder:text-fg-faint focus:border-fg focus:outline-none";

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, { status: "idle" });

  if (state.status === "sent") {
    return (
      <div role="status" className="rounded-lg border border-border bg-bg-subtle p-6">
        <p className="font-medium">Thanks — your message is on its way.</p>
        <p className="mt-1 text-sm text-fg-muted">I&apos;ll get back to you by email.</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Name
          <input name="name" defaultValue={state.values?.name} required maxLength={100} autoComplete="name" className={field} />
        </label>
        <label className="block text-sm font-medium">
          Email
          <input name="email" type="email" defaultValue={state.values?.email} required autoComplete="email" className={field} />
        </label>
      </div>
      <label className="block text-sm font-medium">
        Message
        <textarea name="body" defaultValue={state.values?.body} required minLength={10} maxLength={5000} rows={6} className={field} />
      </label>

      {/* Honeypot, hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className={buttonStyles.primary}>
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
