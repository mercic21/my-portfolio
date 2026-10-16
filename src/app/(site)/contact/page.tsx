import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import { Container } from "@/components/ui";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <Container className="py-16 sm:py-20">
      <div className="grid gap-12 md:grid-cols-[1fr_1.4fr]">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Contact</h1>
          <p className="mt-3 max-w-sm text-fg-muted">
            Questions, opportunities or just a hello. Send a message and I&apos;ll reply by email.
          </p>
          <dl className="mt-10 space-y-5 text-sm">
            {settings.email && (
              <div>
                <dt className="text-fg-faint">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${settings.email}`} className="hover:underline">
                    {settings.email}
                  </a>
                </dd>
              </div>
            )}
            {settings.location && (
              <div>
                <dt className="text-fg-faint">Based in</dt>
                <dd className="mt-1">{settings.location}</dd>
              </div>
            )}
            {settings.socials.length > 0 && (
              <div>
                <dt className="text-fg-faint">Elsewhere</dt>
                <dd className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  {settings.socials.map((s) => (
                    <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {s.label}
                    </a>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
        <ContactForm />
      </div>
    </Container>
  );
}
