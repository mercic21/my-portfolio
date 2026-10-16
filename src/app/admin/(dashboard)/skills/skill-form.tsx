"use client";

import type { SkillGroup } from "@/lib/types";
import { ActionForm, SubmitButton } from "@/components/admin/action-form";
import { TextArea, TextField } from "@/components/admin/fields";
import type { ActionResult } from "../actions";

export function SkillForm({
  group,
  action,
}: {
  group: SkillGroup | null;
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
}) {
  return (
    <ActionForm action={action} className="max-w-xl space-y-5">
      <TextField label="Category" name="category" required defaultValue={group?.category} placeholder="Backend" />
      <TextArea
        label="Skills"
        name="items"
        rows={3}
        required
        defaultValue={group?.items.join(", ")}
        placeholder="Go, Node.js, PostgreSQL, Kafka"
        hint="Comma separated, most relevant first."
      />
      <SubmitButton>{group ? "Save changes" : "Add group"}</SubmitButton>
    </ActionForm>
  );
}
