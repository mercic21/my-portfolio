import { z } from "zod";

const url = z.union([z.literal(""), z.url({ protocol: /^https?$/ })]);
const text = (max: number) => z.string().trim().max(max);
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use YYYY-MM");

const image = z.object({ url: z.url({ protocol: /^https?$/ }), alt: text(200) });

export const SettingsInput = z.object({
  name: text(80).min(1, "Name is required"),
  headline: text(120),
  location: text(80),
  availability: text(80),
  intro: text(400),
  bio: text(5000),
  email: z.union([z.literal(""), z.email()]),
  avatar: image.nullable(),
  resumeUrl: url,
  socials: z.array(z.object({ label: text(40).min(1), url: z.url() })).max(12),
  seo: z.object({ title: text(80), description: text(200), ogImage: url }),
});

export const ProjectInput = z.object({
  title: text(120).min(1, "Title is required"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: lowercase letters, numbers and dashes"),
  summary: text(280).min(1, "Summary is required"),
  year: z.number().int().min(1990).max(2100).nullable(),
  role: text(120),
  content: text(50000),
  techStack: z.array(text(40).min(1)).max(30),
  cover: image.nullable(),
  images: z.array(image).max(20),
  metrics: z.array(z.object({ label: text(60).min(1), value: text(30).min(1) })).max(6),
  links: z.object({ live: url, repo: url }),
  featured: z.boolean(),
  status: z.enum(["draft", "published"]),
});

export const ExperienceInput = z
  .object({
    type: z.enum(["work", "education"]),
    role: text(120).min(1, "Role is required"),
    org: text(120).min(1, "Organization is required"),
    orgUrl: url,
    location: text(80),
    start: month,
    end: z.union([z.literal(""), month]),
    summary: text(600),
    highlights: z.array(text(300).min(1)).max(10),
  })
  .refine((v) => !v.end || v.end >= v.start, { message: "End must be after start", path: ["end"] });

export const SkillGroupInput = z.object({
  category: text(60).min(1, "Category is required"),
  items: z.array(text(40).min(1)).min(1, "Add at least one skill").max(40),
});

export const ContactInput = z.object({
  name: text(100).min(1, "Please enter your name"),
  email: z.email("Please enter a valid email"),
  body: text(5000).min(10, "Message is a bit short"),
});

/** First validation message, for showing a single error under a form. */
export function firstIssue(error: z.ZodError) {
  const issue = error.issues[0];
  return issue ? issue.message : "Invalid input";
}

// ---- FormData helpers ----

export const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

export const lines = (fd: FormData, key: string) =>
  str(fd, key)
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

export const csv = (fd: FormData, key: string) =>
  str(fd, key)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

/** Reads repeated row inputs named `${prefix}.${field}` into objects, dropping empty rows. */
export function rows<K extends string>(fd: FormData, prefix: string, fields: readonly K[]) {
  const cols = fields.map((f) => fd.getAll(`${prefix}.${f}`).map((v) => String(v).trim()));
  const count = Math.max(0, ...cols.map((c) => c.length));
  const out: Record<K, string>[] = [];
  for (let i = 0; i < count; i++) {
    const row = Object.fromEntries(fields.map((f, j) => [f, cols[j][i] ?? ""])) as Record<K, string>;
    if (Object.values(row).some(Boolean)) out.push(row);
  }
  return out;
}

export function imageFrom(fd: FormData, key: string) {
  const u = str(fd, `${key}.url`);
  return u ? { url: u, alt: str(fd, `${key}.alt`) } : null;
}
