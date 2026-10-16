"use client";

import { useState } from "react";
import type { Experience } from "@/lib/types";
import { ActionForm, SubmitButton } from "@/components/admin/action-form";
import { Checkbox, FormSection, Select, TextArea, TextField } from "@/components/admin/fields";
import type { ActionResult } from "../actions";

export function ExperienceForm({
  entry,
  action,
}: {
  entry: Experience | null;
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
}) {
  const [current, setCurrent] = useState(entry ? !entry.end : false);

  return (
    <ActionForm action={action}>
      <FormSection title="Position">
        <Select
          label="Type"
          name="type"
          defaultValue={entry?.type ?? "work"}
          options={[
            { value: "work", label: "Work" },
            { value: "education", label: "Education" },
          ]}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Role / degree" name="role" required defaultValue={entry?.role} />
          <TextField label="Company / school" name="org" required defaultValue={entry?.org} />
          <TextField label="Website" name="orgUrl" type="url" defaultValue={entry?.orgUrl} placeholder="https://…" />
          <TextField label="Location" name="location" defaultValue={entry?.location} placeholder="Kigali · Remote" />
        </div>
      </FormSection>

      <FormSection title="Dates">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Start" name="start" type="month" required defaultValue={entry?.start} />
          <TextField label="End" name="end" type="month" disabled={current} defaultValue={entry?.end} />
        </div>
        <Checkbox label="I currently work / study here" name="current" checked={current} onChange={(e) => setCurrent(e.target.checked)} />
      </FormSection>

      <FormSection title="Details">
        <TextArea label="Summary" name="summary" rows={3} maxLength={600} defaultValue={entry?.summary} />
        <TextArea
          label="Highlights"
          name="highlights"
          rows={5}
          defaultValue={entry?.highlights.join("\n")}
          hint="One per line. Lead with impact: “Cut payment failures by 30% by …”"
        />
      </FormSection>

      <div className="border-t border-border pt-6">
        <SubmitButton>{entry ? "Save changes" : "Add entry"}</SubmitButton>
      </div>
    </ActionForm>
  );
}
