import { ImageResponse } from "next/og";
import { getProjectBySlug, getPublishedProjects, getSettings } from "@/lib/data";
import { hostOf, siteUrl } from "@/lib/utils";

export const alt = "Project case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.length ? projects.map((p) => ({ slug: p.slug })) : [{ slug: "__placeholder__" }];
}

/** Share image for each case study: title, summary and stack on the site's dark palette. */
export default async function ProjectOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([getProjectBySlug(slug), getSettings()]);

  const title = project?.title ?? settings.name;
  const summary = project?.summary ?? settings.headline;
  const stack = project?.techStack.slice(0, 4) ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0c0c0e",
          color: "#ededf0",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#a0a0aa" }}>
          <span>{settings.name}</span>
          <span>Case study{project?.year ? ` · ${project.year}` : ""}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: title.length > 32 ? 64 : 80, fontWeight: 600, letterSpacing: -2, lineHeight: 1.05 }}>{title}</div>
          {summary && (
            <div style={{ marginTop: 24, fontSize: 30, lineHeight: 1.4, color: "#a0a0aa", maxWidth: 960 }}>
              {summary.length > 140 ? `${summary.slice(0, 137)}…` : summary}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12 }}>
            {stack.map((t) => (
              <span
                key={t}
                style={{ border: "1px solid #33333a", borderRadius: 999, padding: "6px 18px", fontSize: 22, color: "#a0a0aa" }}
              >
                {t}
              </span>
            ))}
          </div>
          <span style={{ fontSize: 24, color: "#6e6e78" }}>{hostOf(siteUrl())}</span>
        </div>
      </div>
    ),
    size,
  );
}
