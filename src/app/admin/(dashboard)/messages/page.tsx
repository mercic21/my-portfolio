import { adminMessages } from "@/lib/admin-data";
import { EmptyState, PageHeader } from "@/components/admin/page-header";
import { ActionButton, ConfirmButton } from "@/components/admin/confirm-button";
import { cn } from "@/lib/utils";
import { deleteMessage, setMessageRead } from "../actions";

const linkBtn = "text-sm text-fg-muted hover:text-fg";

// Session-gated: allowed to block on the server.
export const instant = false;

export default async function AdminMessages() {
  const messages = await adminMessages();

  return (
    <>
      <PageHeader title="Messages" description="Submissions from the contact form." />
      {messages.length ? (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m.id} className={cn("rounded-lg border p-4", m.read ? "border-border" : "border-border-strong bg-bg-subtle")}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="text-sm font-medium">
                  {!m.read && <span className="mr-2 inline-block size-1.5 rounded-full bg-accent align-middle" aria-label="Unread" />}
                  {m.name}{" "}
                  <a href={`mailto:${m.email}`} className="font-normal text-fg-muted hover:underline">
                    {m.email}
                  </a>
                </p>
                <time className="font-mono text-xs text-fg-faint" dateTime={m.createdAt}>
                  {new Date(m.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                </time>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-fg-muted">{m.body}</p>
              <div className="mt-4 flex gap-4">
                <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`} className={linkBtn}>
                  Reply
                </a>
                <ActionButton action={setMessageRead.bind(null, m.id, !m.read)} className={linkBtn}>
                  Mark as {m.read ? "unread" : "read"}
                </ActionButton>
                <ConfirmButton action={deleteMessage.bind(null, m.id)} confirmText="Delete this message?" className="text-sm text-fg-muted hover:text-danger">
                  Delete
                </ConfirmButton>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState>No messages yet.</EmptyState>
      )}
    </>
  );
}
