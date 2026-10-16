import type { Metadata } from "next";
import { getExperiences, getSettings, getSkillGroups } from "@/lib/data";
import type { Experience } from "@/lib/types";
import { formatRange } from "@/lib/utils";
import { Markdown } from "@/components/markdown";
import { Media } from "@/components/media";
import { ArrowIcon, ButtonLink, Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const [settings, experiences, skills] = await Promise.all([getSettings(), getExperiences(), getSkillGroups()]);
  const work = experiences.filter((e) => e.type === "work");
  const education = experiences.filter((e) => e.type === "education");

  return (
    <Container className="py-16 sm:py-20">
      <div className="grid gap-12 md:grid-cols-[1fr_220px]">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">About</h1>
          {settings.bio ? (
            <Markdown className="mt-8 max-w-2xl prose-p:leading-relaxed">{settings.bio}</Markdown>
          ) : (
            settings.intro && <p className="mt-8 max-w-2xl text-fg-muted">{settings.intro}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/resume" data-umami-event="resume-open">
              Résumé
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Contact
            </ButtonLink>
          </div>
        </div>
        {settings.avatar && (
          <div className="relative order-first aspect-square w-40 overflow-hidden rounded-lg border border-border bg-bg-subtle md:order-none md:w-full">
            <Media src={settings.avatar.url} alt={settings.avatar.alt || settings.name} sizes="220px" priority />
          </div>
        )}
      </div>

      {work.length > 0 && <Timeline title="Experience" items={work} />}

      {skills.length > 0 && (
        <section className="mt-20 border-t border-border pt-10">
          <h2 className="text-sm font-medium text-fg-faint">Skills</h2>
          <dl className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {skills.map((g) => (
              <div key={g.id}>
                <dt className="font-medium">{g.category}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-fg-muted">{g.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {education.length > 0 && <Timeline title="Education" items={education} />}
    </Container>
  );
}

function Timeline({ title, items }: { title: string; items: Experience[] }) {
  return (
    <section className="mt-20 border-t border-border pt-10">
      <h2 className="text-sm font-medium text-fg-faint">{title}</h2>
      <ol className="mt-6 space-y-10">
        {items.map((e) => (
          <li key={e.id} className="grid gap-2 sm:grid-cols-[180px_1fr] sm:gap-8">
            <p className="font-mono text-xs text-fg-faint sm:pt-1">{formatRange(e.start, e.end)}</p>
            <div>
              <h3 className="font-medium">
                {e.role}
                <span className="text-fg-muted">
                  {" · "}
                  {e.orgUrl ? (
                    <a href={e.orgUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-fg">
                      {e.org}
                      <ArrowIcon />
                    </a>
                  ) : (
                    e.org
                  )}
                </span>
              </h3>
              {e.location && <p className="text-sm text-fg-faint">{e.location}</p>}
              {e.summary && <p className="mt-2 text-sm leading-relaxed text-fg-muted">{e.summary}</p>}
              {e.highlights.length > 0 && (
                <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-fg-muted marker:text-fg-faint">
                  {e.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
