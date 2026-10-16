"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./project-card";

/** Client-side tech filter so the page itself stays fully static. */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [tech, setTech] = useState<string | null>(null);

  const techs = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects) for (const t of p.techStack) counts.set(t, (counts.get(t) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t);
  }, [projects]);

  const visible = tech ? projects.filter((p) => p.techStack.includes(tech)) : projects;

  return (
    <>
      {techs.length > 1 && (
        <div role="group" aria-label="Filter by technology" className="mb-10 flex flex-wrap gap-2">
          <Chip active={tech === null} onClick={() => setTech(null)}>
            All
          </Chip>
          {techs.slice(0, 14).map((t) => (
            <Chip key={t} active={tech === t} onClick={() => setTech(tech === t ? null : t)}>
              {t}
            </Chip>
          ))}
        </div>
      )}
      <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
        {visible.map((p, i) => (
          <ProjectCard key={p.id} project={p} priority={i < 2} />
        ))}
      </div>
    </>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "h-7 rounded-full border px-3 text-xs transition-colors",
        active ? "border-fg bg-fg text-bg" : "border-border text-fg-muted hover:border-border-strong hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
