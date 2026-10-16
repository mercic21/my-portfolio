import Link from "next/link";
import { getExperiences, getFeaturedProjects, getSettings } from "@/lib/data";
import { formatRange, siteUrl } from "@/lib/utils";
import { ProjectCard } from "@/components/site/project-card";
import { ArrowIcon, ButtonLink, Container, SectionHeading } from "@/components/ui";

export default async function HomePage() {
  const [settings, projects, experiences] = await Promise.all([
    getSettings(),
    getFeaturedProjects(4),
    getExperiences(),
  ]);
  const work = experiences.filter((e) => e.type === "work").slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.name,
    jobTitle: settings.headline || undefined,
    url: siteUrl(),
    image: settings.avatar?.url,
    sameAs: settings.socials.map((s) => s.url),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <Container className="pb-16 pt-16 sm:pb-24 sm:pt-24">
        {settings.availability && (
          <p className="mb-6 inline-flex items-center gap-2 text-sm text-fg-muted">
            <span className="size-1.5 rounded-full bg-ok" aria-hidden />
            {settings.availability}
          </p>
        )}
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl sm:leading-[1.08]">
          {settings.name}
          {settings.headline && <span className="block text-fg-faint">{settings.headline}</span>}
        </h1>
        {settings.intro && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted text-pretty">{settings.intro}</p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/projects">View work</ButtonLink>
          <ButtonLink href="/resume" variant="secondary" data-umami-event="resume-open">
            Résumé
          </ButtonLink>
        </div>
      </Container>

      {projects.length > 0 && (
        <Container className="border-t border-border py-16">
          <SectionHeading
            title="Selected work"
            action={
              <Link href="/projects" className="text-sm text-fg-muted hover:text-fg">
                All projects →
              </Link>
            }
          />
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} priority={i < 2} />
            ))}
          </div>
        </Container>
      )}

      {work.length > 0 && (
        <Container className="border-t border-border py-16">
          <SectionHeading
            title="Experience"
            action={
              <Link href="/about" className="text-sm text-fg-muted hover:text-fg">
                More about me →
              </Link>
            }
          />
          <ul className="divide-y divide-border">
            {work.map((e) => (
              <li key={e.id} className="grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:gap-6">
                <div>
                  <p className="font-medium">{e.role}</p>
                  <p className="text-sm text-fg-muted">
                    {e.orgUrl ? (
                      <a href={e.orgUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-fg">
                        {e.org}
                        <ArrowIcon />
                      </a>
                    ) : (
                      e.org
                    )}
                  </p>
                </div>
                <p className="font-mono text-xs text-fg-faint sm:pt-1">{formatRange(e.start, e.end)}</p>
              </li>
            ))}
          </ul>
        </Container>
      )}

      <Container className="border-t border-border py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Have a project or role in mind?</h2>
          </div>
          <ButtonLink href="/contact">Contact me</ButtonLink>
        </div>
      </Container>
    </>
  );
}
