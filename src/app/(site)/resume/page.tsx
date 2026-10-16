import type { Metadata } from "next";
import Link from "next/link";
import { getExperiences, getFeaturedProjects, getSettings, getSkillGroups } from "@/lib/data";
import type { Experience } from "@/lib/types";
import { formatRange, hostOf, siteUrl } from "@/lib/utils";
import { ButtonLink, Container } from "@/components/ui";
import { PrintButton } from "./print-button";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: "Résumé",
    description: `Résumé of ${s.name}${s.headline ? `, ${s.headline}` : ""}.`,
    alternates: { canonical: "/resume" },
  };
}

/** Web résumé generated from the same data as the rest of the site. Prints cleanly to A4. */
export default async function ResumePage() {
  const [s, experiences, skills, projects] = await Promise.all([
    getSettings(),
    getExperiences(),
    getSkillGroups(),
    getFeaturedProjects(3),
  ]);
  const work = experiences.filter((e) => e.type === "work");
  const education = experiences.filter((e) => e.type === "education");
  const site = siteUrl();

  const contact = [
    s.email && { label: s.email, href: `mailto:${s.email}` },
    { label: hostOf(site), href: site },
    ...s.socials.map((x) => ({ label: hostOf(x.url), href: x.url })),
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <Container className="py-12 sm:py-16 print:max-w-none print:p-0">
      <div className="mx-auto mb-10 flex max-w-3xl flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/about" className="text-sm text-fg-muted hover:text-fg">
          ← About
        </Link>
        <div className="flex gap-2">
          {s.resumeUrl && (
            <ButtonLink href={s.resumeUrl} variant="secondary" external data-umami-event="resume-pdf">
              Download PDF
            </ButtonLink>
          )}
          <PrintButton />
        </div>
      </div>

      <article className="mx-auto max-w-3xl text-[15px] leading-relaxed print:max-w-none print:text-[10.5pt]">
        <header className="border-b border-border pb-6">
          <h1 className="text-3xl font-semibold tracking-tight print:text-[22pt]">{s.name}</h1>
          {s.headline && <p className="mt-1 text-lg text-fg-muted print:text-[12pt]">{s.headline}</p>}
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-fg-muted print:text-[9.5pt]">
            {s.location && <li>{s.location}</li>}
            {contact.map((c) => (
              <li key={c.href}>
                <a href={c.href} className="hover:text-fg hover:underline">
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </header>

        {s.intro && (
          <Section title="Profile">
            <p className="text-fg-muted">{s.intro}</p>
          </Section>
        )}

        {work.length > 0 && (
          <Section title="Experience">
            <Entries items={work} />
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Selected projects">
            <ul className="space-y-3">
              {projects.map((p) => (
                <li key={p.id} className="break-inside-avoid">
                  <p className="font-medium">
                    <a href={`${site}/projects/${p.slug}`} className="hover:underline">
                      {p.title}
                    </a>
                    {p.techStack.length > 0 && (
                      <span className="font-normal text-fg-faint"> · {p.techStack.slice(0, 4).join(", ")}</span>
                    )}
                  </p>
                  <p className="text-fg-muted">{p.summary}</p>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Skills">
            <dl className="space-y-1">
              {skills.map((g) => (
                <div key={g.id} className="grid gap-x-4 sm:grid-cols-[140px_1fr] print:grid-cols-[110px_1fr]">
                  <dt className="font-medium">{g.category}</dt>
                  <dd className="text-fg-muted">{g.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education">
            <Entries items={education} />
          </Section>
        )}
      </article>
    </Container>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 print:mt-5">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-faint print:mb-2">{title}</h2>
      {children}
    </section>
  );
}

function Entries({ items }: { items: Experience[] }) {
  return (
    <ol className="space-y-5 print:space-y-3">
      {items.map((e) => (
        <li key={e.id} className="break-inside-avoid">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <p className="font-medium">
              {e.role} <span className="font-normal text-fg-muted">· {e.org}</span>
            </p>
            <p className="font-mono text-xs text-fg-faint print:text-[9pt]">
              {formatRange(e.start, e.end)}
              {e.location && ` · ${e.location}`}
            </p>
          </div>
          {e.summary && <p className="mt-1 text-fg-muted">{e.summary}</p>}
          {e.highlights.length > 0 && (
            <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-fg-muted marker:text-fg-faint">
              {e.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}
