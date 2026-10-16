import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "@/auth";
import { requireAdmin } from "@/lib/admin";
import { adminCounts } from "@/lib/admin-data";
import { AdminNav } from "@/components/admin/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

// The admin reads the session on every request, so it's allowed to block.
export const instant = false;

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireAdmin();
  const counts = await adminCounts();

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-6 md:flex-row md:gap-10 md:py-10">
      <aside className="md:w-48 md:shrink-0">
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <Link href="/" className="text-sm font-semibold" target="_blank">
            View site ↗
          </Link>
          <ThemeToggle />
        </div>
        <AdminNav unread={counts.unread} />
        <form action={logout} className="mt-4 border-t border-border pt-4 md:mt-6">
          <p className="truncate text-xs text-fg-faint">{user.name ?? user.email}</p>
          <button className="mt-1 text-sm text-fg-muted hover:text-fg">Sign out</button>
        </form>
      </aside>
      <main className="min-w-0 flex-1">
        <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
      </main>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden>
      <div className="h-6 w-40 rounded bg-bg-subtle" />
      <div className="mt-8 h-40 rounded-lg bg-bg-subtle" />
    </div>
  );
}
