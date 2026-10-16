import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  back,
  actions,
}: {
  title: string;
  description?: string;
  back?: { href: string; label: string };
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8">
      {back && (
        <Link href={back.href} className="text-sm text-fg-muted hover:text-fg">
          ← {back.label}
        </Link>
      )}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-sm text-fg-muted">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-lg border border-dashed border-border-strong p-8 text-center text-sm text-fg-muted">{children}</p>;
}
