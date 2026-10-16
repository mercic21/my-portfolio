"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { ActionForm, SubmitButton } from "@/components/admin/action-form";
import { Checkbox, FormSection, Select, TextArea, TextField } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/image-field";
import { RowsField } from "@/components/admin/rows-field";
import type { ActionResult } from "../actions";

const CASE_STUDY_TEMPLATE = `## The problem

What was broken, slow or missing? Who was affected?

## Approach

Key decisions, architecture and trade-offs.

## Outcome

What changed, ideally with numbers.
`;

export function ProjectForm({
  project,
  action,
}: {
  project: Project | null;
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
}) {
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(project));

  return (
    <ActionForm action={action}>
      <FormSection title="Basics" description="Shown on project cards and at the top of the case study.">
        <TextField
          label="Title"
          name="title"
          required
          defaultValue={project?.title}
          onChange={(e) => !slugTouched && setSlug(slugify(e.target.value))}
        />
        <TextField
          label="Slug"
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          hint={`URL: /projects/${slug || "…"}`}
        />
        <TextArea label="Summary" name="summary" required maxLength={280} rows={2} defaultValue={project?.summary} hint="One or two sentences, max 280 characters." />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Your role" name="role" defaultValue={project?.role} placeholder="Lead engineer" />
          <TextField label="Year" name="year" type="number" min={1990} max={2100} defaultValue={project?.year ?? ""} />
        </div>
        <TextField
          label="Tech stack"
          name="techStack"
          defaultValue={project?.techStack.join(", ")}
          placeholder="Next.js, Go, PostgreSQL"
          hint="Comma separated. Used for filtering."
        />
      </FormSection>

      <FormSection title="Links">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Live URL" name="links.live" type="url" defaultValue={project?.links.live} placeholder="https://…" />
          <TextField label="Repository" name="links.repo" type="url" defaultValue={project?.links.repo} placeholder="https://github.com/…" />
        </div>
      </FormSection>

      <FormSection title="Case study" description="Markdown. Structure it as problem → approach → outcome.">
        <TextArea
          label="Content"
          name="content"
          rows={18}
          className="font-mono"
          defaultValue={project ? project.content : CASE_STUDY_TEMPLATE}
        />
        <RowsField
          label="Key results"
          name="metrics"
          columns={[
            { name: "value", placeholder: "Value, e.g. 40%", width: "9rem" },
            { name: "label", placeholder: "Label, e.g. faster checkout" },
          ]}
          initial={project?.metrics ?? []}
          addLabel="Add result"
          max={6}
        />
      </FormSection>

      <FormSection title="Images">
        <ImageField label="Cover" name="cover" initial={project?.cover ?? null} />
        <RowsField
          label="Gallery"
          name="images"
          columns={[
            { name: "url", placeholder: "Image URL" },
            { name: "alt", placeholder: "Caption / alt text" },
          ]}
          initial={project?.images ?? []}
          addLabel="Add image"
          max={20}
        />
      </FormSection>

      <FormSection title="Publishing">
        <Select
          label="Status"
          name="status"
          defaultValue={project?.status ?? "draft"}
          options={[
            { value: "draft", label: "Draft — hidden from the site" },
            { value: "published", label: "Published" },
          ]}
        />
        <Checkbox label="Featured" name="featured" defaultChecked={project?.featured} hint="Show on the home page." />
      </FormSection>

      <div className="border-t border-border pt-6">
        <SubmitButton>{project ? "Save changes" : "Create project"}</SubmitButton>
      </div>
    </ActionForm>
  );
}
