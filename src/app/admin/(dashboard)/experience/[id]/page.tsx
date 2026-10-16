import { notFound } from "next/navigation";
import { adminExperience } from "@/lib/admin-data";
import { PageHeader } from "@/components/admin/page-header";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { deleteExperience, saveExperience } from "../../actions";
import { ExperienceForm } from "../experience-form";

// Session-gated: allowed to block on the server.
export const instant = false;

export default async function EditExperience({ params }: PageProps<"/admin/experience/[id]">) {
  const { id } = await params;
  const entry = await adminExperience(id);
  if (!entry) notFound();

  return (
    <>
      <PageHeader
        title={`${entry.role} · ${entry.org}`}
        back={{ href: "/admin/experience", label: "Experience" }}
        actions={
          <ConfirmButton action={deleteExperience.bind(null, entry.id)}>Delete</ConfirmButton>
        }
      />
      <ExperienceForm entry={entry} action={saveExperience.bind(null, entry.id)} />
    </>
  );
}
