import { adminSettings } from "@/lib/admin-data";
import { PageHeader } from "@/components/admin/page-header";
import { saveSettings } from "../actions";
import { SettingsForm } from "./settings-form";

// Session-gated: allowed to block on the server.
export const instant = false;

export default async function AdminSettings() {
  const settings = await adminSettings();
  return (
    <>
      <PageHeader title="Settings" description="Site-wide content: who you are, links and SEO." />
      <SettingsForm settings={settings} action={saveSettings} />
    </>
  );
}
