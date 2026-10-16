import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connectDB, toPlain } from "@/lib/db";
import { ExperienceModel, ProjectModel, SettingsModel, SkillGroupModel } from "@/models";
import type { Experience, Project, Settings, SkillGroup } from "@/lib/types";

// Public, cached reads. Admin saves call updateTag() with these tags.
export const TAGS = {
  settings: "settings",
  projects: "projects",
  experience: "experience",
  skills: "skills",
} as const;

const EMPTY_SETTINGS: Settings = {
  id: "site",
  name: "Your Name",
  headline: "",
  location: "",
  availability: "",
  intro: "",
  bio: "",
  email: "",
  avatar: null,
  resumeUrl: "",
  socials: [],
  seo: { title: "", description: "", ogImage: "" },
};

export async function getSettings(): Promise<Settings> {
  "use cache";
  cacheTag(TAGS.settings);
  cacheLife("max");
  await connectDB();
  const doc = await SettingsModel.findById("site").lean();
  return doc ? { ...EMPTY_SETTINGS, ...toPlain<Settings>(doc) } : EMPTY_SETTINGS;
}

export async function getPublishedProjects(): Promise<Project[]> {
  "use cache";
  cacheTag(TAGS.projects);
  cacheLife("max");
  await connectDB();
  const docs = await ProjectModel.find({ status: "published" }).sort({ order: 1, createdAt: -1 }).lean();
  return toPlain<Project[]>(docs);
}

export async function getFeaturedProjects(limit = 4): Promise<Project[]> {
  const all = await getPublishedProjects();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const all = await getPublishedProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getExperiences(): Promise<Experience[]> {
  "use cache";
  cacheTag(TAGS.experience);
  cacheLife("max");
  await connectDB();
  const docs = await ExperienceModel.find().sort({ order: 1, start: -1 }).lean();
  return toPlain<Experience[]>(docs);
}

export async function getSkillGroups(): Promise<SkillGroup[]> {
  "use cache";
  cacheTag(TAGS.skills);
  cacheLife("max");
  await connectDB();
  const docs = await SkillGroupModel.find().sort({ order: 1 }).lean();
  return toPlain<SkillGroup[]>(docs);
}
