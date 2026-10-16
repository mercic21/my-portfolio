import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/data";
import { Container } from "@/components/ui";
import { ProjectGrid } from "@/components/site/project-grid";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects and case studies.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <Container className="py-16 sm:py-20">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Work</h1>
      <p className="mt-3 max-w-xl text-fg-muted">
        Selected projects and case studies: the problem, the approach and the outcome.
      </p>
      <div className="mt-12">
        {projects.length ? (
          <ProjectGrid projects={projects} />
        ) : (
          <p className="text-fg-muted">Projects are on their way.</p>
        )}
      </div>
    </Container>
  );
}
