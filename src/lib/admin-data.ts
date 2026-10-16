import "server-only";
import { isValidObjectId } from "mongoose";
import { requireAdmin } from "@/lib/admin";
import { connectDB, toPlain } from "@/lib/db";
import type { Experience, Message, Project, Settings, SkillGroup } from "@/lib/types";
import { ExperienceModel, MessageModel, ProjectModel, SettingsModel, SkillGroupModel } from "@/models";

// Uncached reads for the admin. Each one checks the session itself.

async function ready() {
  await requireAdmin();
  await connectDB();
}

export async function adminSettings(): Promise<Settings | null> {
  await ready();
  const doc = await SettingsModel.findById("site").lean();
  return doc ? toPlain<Settings>(doc) : null;
}

export async function adminProjects(): Promise<Project[]> {
  await ready();
  return toPlain(await ProjectModel.find().sort({ order: 1, createdAt: -1 }).lean());
}

export async function adminProject(id: string): Promise<Project | null> {
  await ready();
  if (!isValidObjectId(id)) return null;
  const doc = await ProjectModel.findById(id).lean();
  return doc ? toPlain<Project>(doc) : null;
}

export async function adminExperiences(): Promise<Experience[]> {
  await ready();
  return toPlain(await ExperienceModel.find().sort({ order: 1, start: -1 }).lean());
}

export async function adminExperience(id: string): Promise<Experience | null> {
  await ready();
  if (!isValidObjectId(id)) return null;
  const doc = await ExperienceModel.findById(id).lean();
  return doc ? toPlain<Experience>(doc) : null;
}

export async function adminSkillGroups(): Promise<SkillGroup[]> {
  await ready();
  return toPlain(await SkillGroupModel.find().sort({ order: 1 }).lean());
}

export async function adminSkillGroup(id: string): Promise<SkillGroup | null> {
  await ready();
  if (!isValidObjectId(id)) return null;
  const doc = await SkillGroupModel.findById(id).lean();
  return doc ? toPlain<SkillGroup>(doc) : null;
}

export async function adminMessages(): Promise<Message[]> {
  await ready();
  return toPlain(await MessageModel.find().select("-ipHash").sort({ createdAt: -1 }).limit(200).lean());
}

export async function adminCounts() {
  await ready();
  const [projects, published, experiences, skills, unread] = await Promise.all([
    ProjectModel.countDocuments(),
    ProjectModel.countDocuments({ status: "published" }),
    ExperienceModel.countDocuments(),
    SkillGroupModel.countDocuments(),
    MessageModel.countDocuments({ read: false }),
  ]);
  return { projects, published, experiences, skills, unread };
}
