import Link from "next/link";
import { adminExperiences } from "@/lib/admin-data";
import { formatRange } from "@/lib/utils";
import { EmptyState, PageHeader } from "@/components/admin/page-header";
import { SortableList } from "@/components/admin/sortable-list";
import { buttonStyles } from "@/components/ui";

// Session-gated: allowed to block on the server.
export const instant = false;

export default async function AdminExperience() {
  const entries = await adminExperiences();

  return (
    <>
      <PageHeader
        title="Experience"
        description="Work and education timeline. Drag to reorder."
        actions={
          <Link href="/admin/experience/new" className={buttonStyles.primary}>
            Add entry
          </Link>
        }
      />
      {entries.length ? (
        <SortableList
          kind="experience"
          items={entries.map((e) => ({
            id: e.id,
            content: (
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <div className="min-w-0">
                  <Link href={`/admin/experience/${e.id}`} className="font-medium hover:underline">
                    {e.role}
                  </Link>
                  <span className="text-sm text-fg-muted"> · {e.org}</span>
                  {e.type === "education" && <span className="ml-2 text-xs text-fg-faint">Education</span>}
                </div>
                <span className="font-mono text-xs text-fg-faint">{formatRange(e.start, e.end)}</span>
              </div>
            ),
          }))}
        />
      ) : (
        <EmptyState>No entries yet.</EmptyState>
      )}
    </>
  );
}
