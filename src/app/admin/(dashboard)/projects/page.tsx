import Link from "next/link";
import { adminProjects } from "@/lib/admin-data";
import { EmptyState, PageHeader } from "@/components/admin/page-header";
import { SortableList } from "@/components/admin/sortable-list";
import { ActionButton } from "@/components/admin/confirm-button";
import { buttonStyles } from "@/components/ui";
import { cn } from "@/lib/utils";
import { setProjectStatus } from "../actions";

// Session-gated: allowed to block on the server.
export const instant = false;

export default async function AdminProjects() {
  const projects = await adminProjects();

  return (
    <>
      <PageHeader
        title="Projects"
        description="Drag to set the order shown on the site. Featured projects appear on the home page."
        actions={
          <Link href="/admin/projects/new" className={buttonStyles.primary}>
            New project
          </Link>
        }
      />
      {projects.length ? (
        <SortableList
          kind="projects"
          items={projects.map((p) => ({
            id: p.id,
            content: (
              <div className="flex items-center gap-4">
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/projects/${p.id}`} className="font-medium hover:underline">
                    {p.title}
                  </Link>
                  <p className="truncate text-sm text-fg-muted">{p.summary}</p>
                </div>
                {p.featured && <span className="hidden text-xs text-fg-faint sm:inline">Featured</span>}
                <ActionButton
                  action={setProjectStatus.bind(null, p.id, p.status === "published" ? "draft" : "published")}
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-0.5 text-xs",
                    p.status === "published" ? "border-ok/40 text-ok" : "border-border-strong text-fg-faint",
                  )}
                >
                  {p.status === "published" ? "Published" : "Draft"}
                </ActionButton>
              </div>
            ),
          }))}
        />
      ) : (
        <EmptyState>No projects yet. Create your first one.</EmptyState>
      )}
    </>
  );
}
