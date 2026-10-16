import Link from "next/link";
import { adminSkillGroups } from "@/lib/admin-data";
import { EmptyState, PageHeader } from "@/components/admin/page-header";
import { SortableList } from "@/components/admin/sortable-list";
import { buttonStyles } from "@/components/ui";

// Session-gated: allowed to block on the server.
export const instant = false;

export default async function AdminSkills() {
  const groups = await adminSkillGroups();

  return (
    <>
      <PageHeader
        title="Skills"
        description="Grouped lists, no ratings — let projects show your level."
        actions={
          <Link href="/admin/skills/new" className={buttonStyles.primary}>
            Add group
          </Link>
        }
      />
      {groups.length ? (
        <SortableList
          kind="skills"
          items={groups.map((g) => ({
            id: g.id,
            content: (
              <div className="min-w-0">
                <Link href={`/admin/skills/${g.id}`} className="font-medium hover:underline">
                  {g.category}
                </Link>
                <p className="truncate text-sm text-fg-muted">{g.items.join(", ")}</p>
              </div>
            ),
          }))}
        />
      ) : (
        <EmptyState>No skill groups yet.</EmptyState>
      )}
    </>
  );
}
