import Link from "next/link";
import type { Project } from "@/lib/types";
import { hostOf } from "@/lib/utils";
import { Markdown } from "@/components/markdown";
import { Media } from "@/components/media";
import { ArrowIcon, Container, Tag } from "@/components/ui";

/** Case-study layout, shared by the public page and the admin draft preview. */
export function ProjectArticle({ project, next }: { project: Project; next: Project | null }) {
  const meta = [
    project.role && { label: "Role", value: project.role },
    project.year && { label: "Year", value: String(project.year) },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article>
      <Container className="pt-12 sm:pt-16">
        <Link href="/projects" className="text-sm text-fg-muted hover:text-fg">
          ← All work
        </Link>
        <h1 className="mt-6 max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl sm:leading-[1.08]">
          {project.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-muted text-pretty">{project.summary}</p>

        <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-border py-6 text-sm sm:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label}>
              <dt className="text-fg-faint">{m.label}</dt>
              <dd className="mt-1">{m.value}</dd>
            </div>
          ))}
          {project.techStack.length > 0 && (
            <div className="col-span-2">
              <dt className="text-fg-faint">Stack</dt>
              <dd className="mt-1.5 flex flex-wrap gap-1.5">
                {project.techStack.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </dd>
            </div>
          )}
          {(project.links.live || project.links.repo) && (
            <div className="col-span-2 sm:col-span-4 flex flex-wrap gap-x-6 gap-y-2">
              {project.links.live && (
                <a href={project.links.live} data-umami-event="project-live" data-umami-event-project={project.slug} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium hover:underline">
                  {hostOf(project.links.live)} <ArrowIcon />
                </a>
              )}
              {project.links.repo && (
                <a href={project.links.repo} data-umami-event="project-repo" data-umami-event-project={project.slug} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium hover:underline">
                  Source code <ArrowIcon />
                </a>
              )}
            </div>
          )}
        </dl>

        {project.metrics.length > 0 && (
          <ul className="grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
            {project.metrics.map((m) => (
              <li key={m.label}>
                <p className="text-2xl font-semibold tracking-tight">{m.value}</p>
                <p className="mt-1 text-sm text-fg-muted">{m.label}</p>
              </li>
            ))}
          </ul>
        )}
      </Container>

      {project.cover && (
        <Container className="mt-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border bg-bg-subtle">
            <Media src={project.cover.url} alt={project.cover.alt} sizes="(min-width: 1024px) 960px, 100vw" priority />
          </div>
        </Container>
      )}

      {project.content && (
        <Container className="py-14">
          <Markdown className="max-w-2xl">{project.content}</Markdown>
        </Container>
      )}

      {project.images.length > 0 && (
        <Container className="pb-14">
          <div className="grid gap-6 md:grid-cols-2">
            {project.images.map((img) => (
              <figure key={img.url}>
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-bg-subtle">
                  <Media src={img.url} alt={img.alt} sizes="(min-width: 768px) 480px, 100vw" />
                </div>
                {img.alt && <figcaption className="mt-2 text-sm text-fg-faint">{img.alt}</figcaption>}
              </figure>
            ))}
          </div>
        </Container>
      )}

      {next && next.id !== project.id && (
        <Container className="border-t border-border py-12">
          <Link href={`/projects/${next.slug}`} prefetch={true} className="group block">
            <p className="text-sm text-fg-faint">Next project</p>
            <p className="mt-1 text-xl font-semibold tracking-tight group-hover:underline group-hover:underline-offset-4">
              {next.title} →
            </p>
          </Link>
        </Container>
      )}
    </article>
  );
}
