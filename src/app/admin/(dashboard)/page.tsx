import Link from "next/link";
import { adminCounts, adminMessages } from "@/lib/admin-data";
import { PageHeader } from "@/components/admin/page-header";
import { buttonStyles } from "@/components/ui";

// Session-gated: allowed to block on the server.
export const instant = false;

export default async function AdminHome() {
  const [counts, messages] = await Promise.all([adminCounts(), adminMessages()]);
  const recent = messages.slice(0, 5);

  const stats = [
    { label: "Projects", value: `${counts.published}/${counts.projects}`, hint: "published", href: "/admin/projects" },
    { label: "Experience", value: counts.experiences, hint: "entries", href: "/admin/experience" },
    { label: "Skill groups", value: counts.skills, hint: "groups", href: "/admin/skills" },
    { label: "Unread", value: counts.unread, hint: "messages", href: "/admin/messages" },
  ];

  return (
    <>
      <PageHeader
        title="Overview"
        actions={
          <>
            <a href="/api/admin/export" className={buttonStyles.secondary}>
              Export JSON
            </a>
            <Link href="/admin/projects/new" className={buttonStyles.primary}>
              New project
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-lg border border-border p-4 transition-colors hover:border-border-strong">
            <p className="text-sm text-fg-muted">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{s.value}</p>
            <p className="text-xs text-fg-faint">{s.hint}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold">Recent messages</h2>
          <Link href="/admin/messages" className="text-sm text-fg-muted hover:text-fg">
            View all →
          </Link>
        </div>
        {recent.length ? (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {recent.map((m) => (
              <li key={m.id} className="flex items-start gap-3 px-4 py-3">
                <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${m.read ? "bg-transparent" : "bg-accent"}`} aria-label={m.read ? undefined : "Unread"} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {m.name} <span className="font-normal text-fg-faint">· {m.email}</span>
                  </p>
                  <p className="truncate text-sm text-fg-muted">{m.body}</p>
                </div>
                <time className="shrink-0 font-mono text-xs text-fg-faint">{new Date(m.createdAt).toLocaleDateString("en-GB")}</time>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-fg-muted">No messages yet.</p>
        )}
      </section>
    </>
  );
}
