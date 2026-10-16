"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav({ unread }: { unread: number }) {
  const pathname = usePathname();
  return (
    <ul className="flex gap-1 overflow-x-auto text-sm md:flex-col">
      {LINKS.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center justify-between gap-3 whitespace-nowrap rounded-md px-3 py-1.5 transition-colors",
                active ? "bg-bg-subtle font-medium text-fg" : "text-fg-muted hover:text-fg",
              )}
            >
              {l.label}
              {l.href === "/admin/messages" && unread > 0 && (
                <span className="rounded-full bg-accent px-1.5 text-[11px] font-medium text-accent-fg">{unread}</span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
