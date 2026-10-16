import Link from "next/link";
import { Suspense } from "react";
import { cacheLife } from "next/cache";
import { getSettings } from "@/lib/data";
import { Analytics } from "@/components/site/analytics";
import { NavLinks, NavList } from "@/components/site/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();

  return (
    <>
      <a
        href="#main"
        className="sr-only print:hidden focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-bg focus:px-3 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>
      <header className="sticky top-0 print:hidden z-40 border-b border-border/70 bg-bg/85 backdrop-blur supports-[backdrop-filter]:bg-bg/70">
        <nav aria-label="Main" className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            {settings.name}
          </Link>
          <div className="flex items-center gap-1">
            <Suspense fallback={<NavList />}>
              <NavLinks />
            </Suspense>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border print:hidden">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-8 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © <CurrentYear /> {settings.name}
          </p>
          {settings.socials.length > 0 && (
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {settings.socials.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-fg" data-umami-event="social" data-umami-event-label={s.label}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </footer>
      <Analytics />
    </>
  );
}

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
