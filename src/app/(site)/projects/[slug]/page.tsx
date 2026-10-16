import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProjectBySlug, getPublishedProjects } from "@/lib/data";
import { ProjectArticle } from "@/components/site/project-article";
import { Container } from "@/components/ui";

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  // Cache Components needs at least one param; the placeholder resolves to notFound().
  return projects.length ? projects.map((p) => ({ slug: p.slug })) : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Not found" };
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: project.title, description: project.summary },
  };
}

export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<ProjectSkeleton />}>
      <ProjectDetail params={params} />
    </Suspense>
  );
}

async function ProjectDetail({ params }: Pick<PageProps<"/projects/[slug]">, "params">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const all = await getPublishedProjects();
  const index = all.findIndex((p) => p.id === project.id);
  const next = all.length > 1 ? all[(index + 1) % all.length] : null;

  return <ProjectArticle project={project} next={next} />;
}

function ProjectSkeleton() {
  return (
    <Container className="animate-pulse pt-12 sm:pt-16">
      <div className="h-4 w-20 rounded bg-bg-subtle" />
      <div className="mt-6 h-10 w-2/3 rounded bg-bg-subtle" />
      <div className="mt-4 h-5 w-1/2 rounded bg-bg-subtle" />
      <div className="mt-10 aspect-[16/9] rounded-lg bg-bg-subtle" />
    </Container>
  );
}
