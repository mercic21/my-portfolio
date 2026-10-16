import { notFound } from "next/navigation";
import { adminSkillGroup } from "@/lib/admin-data";
import { PageHeader } from "@/components/admin/page-header";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { deleteSkillGroup, saveSkillGroup } from "../../actions";
import { SkillForm } from "../skill-form";

// Session-gated: allowed to block on the server.
export const instant = false;

export default async function EditSkillGroup({ params }: PageProps<"/admin/skills/[id]">) {
  const { id } = await params;
  const group = await adminSkillGroup(id);
  if (!group) notFound();

  return (
    <>
      <PageHeader
        title={group.category}
        back={{ href: "/admin/skills", label: "Skills" }}
        actions={<ConfirmButton action={deleteSkillGroup.bind(null, group.id)}>Delete</ConfirmButton>}
      />
      <SkillForm group={group} action={saveSkillGroup.bind(null, group.id)} />
    </>
  );
}
