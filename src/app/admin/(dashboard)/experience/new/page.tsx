import { requireAdmin } from "@/lib/admin";
import { PageHeader } from "@/components/admin/page-header";
import { saveExperience } from "../../actions";
import { ExperienceForm } from "../experience-form";

// Session-gated: allowed to block on the server.
export const instant = false;

export default async function NewExperience() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Add entry" back={{ href: "/admin/experience", label: "Experience" }} />
      <ExperienceForm entry={null} action={saveExperience.bind(null, null)} />
    </>
  );
}
