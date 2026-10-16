import Link from "next/link";
import type { Project } from "@/lib/types";
import { Media } from "@/components/media";
import { Tag } from "@/components/ui";

export function ProjectCard({ project, priority }: { project: Project; priority?: boolean }) {
  return (
    <Link href={`/projects/${project.slug}`} prefetch={true} className="group block">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-bg-subtle">
        {project.cover ? (
          <Media
            src={project.cover.url}
            alt={project.cover.alt}
            sizes="(min-width: 768px) 480px, 100vw"
            priority={priority}
            className="transition-transform duration-500 ease-out group-hover:scale-[1.015]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center font-mono text-xs text-fg-faint">{project.title}</div>
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-medium tracking-tight group-hover:underline group-hover:decoration-border-strong group-hover:underline-offset-4">
          {project.title}
        </h3>
        {project.year && <span className="shrink-0 font-mono text-xs text-fg-faint">{project.year}</span>}
      </div>
      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-fg-muted">{project.summary}</p>
      {project.techStack.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      )}
    </Link>
  );
}
