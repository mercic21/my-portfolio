"use server";

import { isValidObjectId } from "mongoose";
import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { TAGS } from "@/lib/data";
import { connectDB } from "@/lib/db";
import {
  ExperienceInput,
  ProjectInput,
  SettingsInput,
  SkillGroupInput,
  csv,
  firstIssue,
  imageFrom,
  lines,
  rows,
  str,
} from "@/lib/validators";
import { ExperienceModel, MessageModel, ProjectModel, SettingsModel, SkillGroupModel } from "@/models";

export type ActionResult = { ok: boolean; message?: string } | null;

async function guard() {
  await requireAdmin();
  await connectDB();
}

function assertId(id: string) {
  if (!isValidObjectId(id)) throw new Error("Invalid id");
}

function isDuplicateKey(err: unknown) {
  return typeof err === "object" && err !== null && "code" in err && (err as { code: number }).code === 11000;
}

async function nextOrder(model: typeof ProjectModel) {
  const last = await model.findOne().sort({ order: -1 }).select("order").lean<{ order?: number }>();
  return (last?.order ?? -1) + 1;
}

// ---------- Settings ----------

export async function saveSettings(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  await guard();
  const parsed = SettingsInput.safeParse({
    name: str(fd, "name"),
    headline: str(fd, "headline"),
    location: str(fd, "location"),
    availability: str(fd, "availability"),
    intro: str(fd, "intro"),
    bio: str(fd, "bio"),
    email: str(fd, "email"),
    avatar: imageFrom(fd, "avatar"),
    resumeUrl: str(fd, "resumeUrl"),
    socials: rows(fd, "socials", ["label", "url"] as const),
    seo: { title: str(fd, "seo.title"), description: str(fd, "seo.description"), ogImage: str(fd, "seo.ogImage") },
  });
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) };

  await SettingsModel.findByIdAndUpdate("site", parsed.data, { upsert: true, setDefaultsOnInsert: true });
  updateTag(TAGS.settings);
  return { ok: true, message: "Settings saved" };
}

// ---------- Projects ----------

export async function saveProject(id: string | null, _prev: ActionResult, fd: FormData): Promise<ActionResult> {
  await guard();
  const year = str(fd, "year");
  const parsed = ProjectInput.safeParse({
    title: str(fd, "title"),
    slug: str(fd, "slug"),
    summary: str(fd, "summary"),
    year: year ? Number(year) : null,
    role: str(fd, "role"),
    content: String(fd.get("content") ?? ""),
    techStack: csv(fd, "techStack"),
    cover: imageFrom(fd, "cover"),
    images: rows(fd, "images", ["url", "alt"] as const),
    metrics: rows(fd, "metrics", ["value", "label"] as const),
    links: { live: str(fd, "links.live"), repo: str(fd, "links.repo") },
    featured: fd.get("featured") === "on",
    status: fd.get("status") === "published" ? "published" : "draft",
  });
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) };

  try {
    if (id) {
      assertId(id);
      await ProjectModel.findByIdAndUpdate(id, parsed.data, { runValidators: true });
    } else {
      await ProjectModel.create({ ...parsed.data, order: await nextOrder(ProjectModel) });
    }
  } catch (err) {
    if (isDuplicateKey(err)) return { ok: false, message: "Another project already uses this slug" };
    throw err;
  }
  updateTag(TAGS.projects);
  if (!id) redirect("/admin/projects");
  return { ok: true, message: "Project saved" };
}

export async function setProjectStatus(id: string, status: "draft" | "published") {
  await guard();
  assertId(id);
  await ProjectModel.findByIdAndUpdate(id, { status });
  updateTag(TAGS.projects);
  refresh();
}

export async function deleteProject(id: string) {
  await guard();
  assertId(id);
  await ProjectModel.findByIdAndDelete(id);
  updateTag(TAGS.projects);
  redirect("/admin/projects");
}

// ---------- Experience ----------

export async function saveExperience(id: string | null, _prev: ActionResult, fd: FormData): Promise<ActionResult> {
  await guard();
  const parsed = ExperienceInput.safeParse({
    type: fd.get("type") === "education" ? "education" : "work",
    role: str(fd, "role"),
    org: str(fd, "org"),
    orgUrl: str(fd, "orgUrl"),
    location: str(fd, "location"),
    start: str(fd, "start"),
    end: fd.get("current") === "on" ? "" : str(fd, "end"),
    summary: str(fd, "summary"),
    highlights: lines(fd, "highlights"),
  });
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) };

  if (id) {
    assertId(id);
    await ExperienceModel.findByIdAndUpdate(id, parsed.data, { runValidators: true });
  } else {
    await ExperienceModel.create({ ...parsed.data, order: await nextOrder(ExperienceModel) });
  }
  updateTag(TAGS.experience);
  if (!id) redirect("/admin/experience");
  return { ok: true, message: "Entry saved" };
}

export async function deleteExperience(id: string) {
  await guard();
  assertId(id);
  await ExperienceModel.findByIdAndDelete(id);
  updateTag(TAGS.experience);
  redirect("/admin/experience");
}

// ---------- Skills ----------

export async function saveSkillGroup(id: string | null, _prev: ActionResult, fd: FormData): Promise<ActionResult> {
  await guard();
  const parsed = SkillGroupInput.safeParse({ category: str(fd, "category"), items: csv(fd, "items") });
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) };

  if (id) {
    assertId(id);
    await SkillGroupModel.findByIdAndUpdate(id, parsed.data, { runValidators: true });
  } else {
    await SkillGroupModel.create({ ...parsed.data, order: await nextOrder(SkillGroupModel) });
  }
  updateTag(TAGS.skills);
  if (!id) redirect("/admin/skills");
  return { ok: true, message: "Group saved" };
}

export async function deleteSkillGroup(id: string) {
  await guard();
  assertId(id);
  await SkillGroupModel.findByIdAndDelete(id);
  updateTag(TAGS.skills);
  redirect("/admin/skills");
}

// ---------- Ordering ----------

const ORDERABLE = {
  projects: { model: ProjectModel, tag: TAGS.projects },
  experience: { model: ExperienceModel, tag: TAGS.experience },
  skills: { model: SkillGroupModel, tag: TAGS.skills },
} as const;

export type OrderableKind = keyof typeof ORDERABLE;

export async function reorder(kind: OrderableKind, ids: string[]) {
  await guard();
  const target = ORDERABLE[kind];
  if (!target) throw new Error("Unknown kind");
  ids.forEach(assertId);
  await target.model.bulkWrite(
    ids.map((id, order) => ({ updateOne: { filter: { _id: id }, update: { $set: { order } } } })),
  );
  updateTag(target.tag);
  refresh();
}

// ---------- Messages ----------

export async function setMessageRead(id: string, read: boolean) {
  await guard();
  assertId(id);
  await MessageModel.findByIdAndUpdate(id, { read });
  refresh();
}

export async function deleteMessage(id: string) {
  await guard();
  assertId(id);
  await MessageModel.findByIdAndDelete(id);
  refresh();
}
