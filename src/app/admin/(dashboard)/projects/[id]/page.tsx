import Link from "next/link";
import { notFound } from "next/navigation";
import { adminProject } from "@/lib/admin-data";
import { PageHeader } from "@/components/admin/page-header";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { buttonStyles } from "@/components/ui";
import { deleteProject, saveProject } from "../../actions";
import { ProjectForm } from "../project-form";

// Session-gated: allowed to block on the server.
export const instant = false;

export default async function EditProject({ params }: PageProps<"/admin/projects/[id]">) {
  const { id } = await params;
  const project = await adminProject(id);
  if (!project) notFound();

  return (
    <>
      <PageHeader
        title={project.title}
        back={{ href: "/admin/projects", label: "Projects" }}
        actions={
          <>
            {project.status === "published" && (
              <Link href={`/projects/${project.slug}`} target="_blank" className={buttonStyles.ghost}>
                View ↗
              </Link>
            )}
            <ConfirmButton action={deleteProject.bind(null, project.id)} confirmText={`Delete "${project.title}"? This can't be undone.`}>
              Delete
            </ConfirmButton>
          </>
        }
      />
      <ProjectForm project={project} action={saveProject.bind(null, project.id)} />
    </>
  );
}
