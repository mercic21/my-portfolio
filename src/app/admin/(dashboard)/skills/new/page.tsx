import { requireAdmin } from "@/lib/admin";
import { PageHeader } from "@/components/admin/page-header";
import { saveSkillGroup } from "../../actions";
import { SkillForm } from "../skill-form";

// Session-gated: allowed to block on the server.
export const instant = false;

export default async function NewSkillGroup() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Add skill group" back={{ href: "/admin/skills", label: "Skills" }} />
      <SkillForm group={null} action={saveSkillGroup.bind(null, null)} />
    </>
  );
}
