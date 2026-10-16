"use client";

import type { Settings } from "@/lib/types";
import { ActionForm, SubmitButton } from "@/components/admin/action-form";
import { FormSection, TextArea, TextField } from "@/components/admin/fields";
import { FileUrlField, ImageField } from "@/components/admin/image-field";
import { RowsField } from "@/components/admin/rows-field";
import type { ActionResult } from "../actions";

export function SettingsForm({
  settings: s,
  action,
}: {
  settings: Settings | null;
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
}) {
  return (
    <ActionForm action={action}>
      <FormSection title="Identity" description="Your name and headline appear in the header, hero and share images.">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Name" name="name" required defaultValue={s?.name} />
          <TextField label="Headline" name="headline" defaultValue={s?.headline} placeholder="Full-stack software engineer" />
          <TextField label="Location" name="location" defaultValue={s?.location} />
          <TextField label="Email" name="email" type="email" defaultValue={s?.email} hint="Shown on the contact page." />
        </div>
        <TextField
          label="Availability"
          name="availability"
          defaultValue={s?.availability}
          placeholder="Open to senior backend roles"
          hint="Short status shown above your name. Leave empty to hide."
        />
        <ImageField label="Photo" name="avatar" initial={s?.avatar ?? null} />
      </FormSection>

      <FormSection title="About">
        <TextArea label="Intro" name="intro" rows={3} maxLength={400} defaultValue={s?.intro} hint="One or two sentences for the home page." />
        <TextArea label="Bio" name="bio" rows={10} className="font-mono" defaultValue={s?.bio} hint="Markdown, shown on the About page." />
        <FileUrlField label="Résumé" name="resumeUrl" initial={s?.resumeUrl ?? ""} hint="PDF link. Leave empty to hide résumé buttons." />
      </FormSection>

      <FormSection title="Links">
        <RowsField
          label="Social profiles"
          name="socials"
          columns={[
            { name: "label", placeholder: "Label", width: "9rem" },
            { name: "url", placeholder: "https://…" },
          ]}
          initial={s?.socials ?? []}
          addLabel="Add link"
        />
      </FormSection>

      <FormSection title="SEO" description="Defaults for search engines and link previews.">
        <TextField label="Site title" name="seo.title" defaultValue={s?.seo.title} hint="Defaults to “Name — Headline”." />
        <TextArea label="Description" name="seo.description" rows={2} maxLength={200} defaultValue={s?.seo.description} hint="Defaults to the intro." />
        <TextField label="Share image URL" name="seo.ogImage" type="url" defaultValue={s?.seo.ogImage} hint="1200×630. Leave empty for a generated image." />
      </FormSection>

      <div className="border-t border-border pt-6">
        <SubmitButton>Save settings</SubmitButton>
      </div>
    </ActionForm>
  );
}
