"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const NAV = [
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function NavLinks() {
  const pathname = usePathname();
  return <NavList isActive={(href) => pathname === href || pathname.startsWith(`${href}/`)} />;
}

export function NavList({ isActive = () => false }: { isActive?: (href: string) => boolean }) {
  return (
    <ul className="flex items-center gap-1 text-sm">
      {NAV.map((item) => {
        const active = isActive(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-md px-2.5 py-1.5 transition-colors",
                active ? "text-fg" : "text-fg-muted hover:text-fg",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
