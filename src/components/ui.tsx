import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const buttonBase =
  "inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50";

export const buttonStyles = {
  primary: cn(buttonBase, "bg-fg text-bg hover:bg-fg/85"),
  secondary: cn(buttonBase, "border border-border-strong text-fg hover:bg-bg-subtle"),
  ghost: cn(buttonBase, "text-fg-muted hover:bg-bg-subtle hover:text-fg"),
  danger: cn(buttonBase, "border border-border-strong text-danger hover:bg-danger/10"),
};

type Variant = keyof typeof buttonStyles;

export function ButtonLink({
  variant = "primary",
  className,
  external,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; external?: boolean }) {
  const cls = cn(buttonStyles[variant], className);
  if (external) {
    const { href, ...rest } = props;
    return <a href={String(href)} target="_blank" rel="noopener noreferrer" className={cls} {...(rest as ComponentProps<"a">)} />;
  }
  return <Link className={cls} {...props} />;
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-fg-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-5xl px-5 sm:px-8", className)}>{children}</div>;
}

export function SectionHeading({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex items-baseline justify-between gap-4">
      <h2 className="text-sm font-medium text-fg-faint">{title}</h2>
      {action}
    </div>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden className={cn("size-3.5", className)}>
      <path d="M5 11 11 5M6 5h5v5" />
    </svg>
  );
}
