import { requireAdmin } from "@/lib/admin";
import { PageHeader } from "@/components/admin/page-header";
import { saveProject } from "../../actions";
import { ProjectForm } from "../project-form";

// Session-gated: allowed to block on the server.
export const instant = false;

export default async function NewProject() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="New project" back={{ href: "/admin/projects", label: "Projects" }} />
      <ProjectForm project={null} action={saveProject.bind(null, null)} />
    </>
  );
}
