import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminProject } from "@/lib/admin-data";
import { ProjectArticle } from "@/components/site/project-article";

// Session-gated: allowed to block on the server.
export const instant = false;

export const metadata: Metadata = { title: "Preview", robots: { index: false, follow: false } };

/** Renders any project (drafts included) with the public case-study layout. */
export default async function ProjectPreview({ params }: PageProps<"/admin/preview/[id]">) {
  const { id } = await params;
  const project = await adminProject(id); // checks the session
  if (!project) notFound();

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-border bg-bg-subtle">
        <div className="mx-auto flex h-11 max-w-5xl items-center justify-between px-5 text-sm sm:px-8">
          <p>
            <span className="font-medium">Preview</span>
            <span className="text-fg-muted"> · {project.status === "draft" ? "Draft, not visible on the site" : "Published"}</span>
          </p>
          <Link href={`/admin/projects/${project.id}`} className="text-fg-muted hover:text-fg">
            Back to editor
          </Link>
        </div>
      </div>
      <main className="flex-1 pb-16">
        <ProjectArticle project={project} next={null} />
      </main>
    </>
  );
}
