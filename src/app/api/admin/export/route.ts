import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { ExperienceModel, ProjectModel, SettingsModel, SkillGroupModel } from "@/models";

/** Downloads all content as JSON — a simple backup. Messages are excluded. */
export async function GET() {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const [settings, projects, experiences, skills] = await Promise.all([
    SettingsModel.findById("site").lean(),
    ProjectModel.find().sort({ order: 1 }).lean(),
    ExperienceModel.find().sort({ order: 1 }).lean(),
    SkillGroupModel.find().sort({ order: 1 }).lean(),
  ]);

  const date = new Date().toISOString().slice(0, 10);
  return new Response(JSON.stringify({ exportedAt: new Date().toISOString(), settings, projects, experiences, skills }, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="portfolio-${date}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
