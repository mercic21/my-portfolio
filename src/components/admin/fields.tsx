import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "block w-full rounded-md border border-border-strong bg-bg px-3 py-2 text-sm placeholder:text-fg-faint focus:border-fg focus:outline-none disabled:opacity-60";

type FieldProps = { label: string; hint?: ReactNode; className?: string };

export function Field({ label, hint, className, children }: FieldProps & { children: ReactNode }) {
  return (
    <label className={cn("block", className)}>
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1.5 block text-xs text-fg-faint">{hint}</span>}
    </label>
  );
}

export function TextField({ label, hint, className, ...props }: FieldProps & ComponentProps<"input">) {
  return (
    <Field label={label} hint={hint} className={className}>
      <input className={inputClass} {...props} />
    </Field>
  );
}

export function TextArea({ label, hint, className, ...props }: FieldProps & ComponentProps<"textarea">) {
  return (
    <Field label={label} hint={hint} className={className}>
      <textarea className={cn(inputClass, "leading-relaxed")} {...props} />
    </Field>
  );
}

export function Select({
  label,
  hint,
  className,
  options,
  ...props
}: FieldProps & ComponentProps<"select"> & { options: { value: string; label: string }[] }) {
  return (
    <Field label={label} hint={hint} className={className}>
      <select className={inputClass} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Checkbox({ label, hint, ...props }: { label: string; hint?: string } & ComponentProps<"input">) {
  return (
    <label className="flex items-start gap-2.5">
      <input type="checkbox" className="mt-0.5 size-4 accent-[var(--fg)]" {...props} />
      <span>
        <span className="text-sm font-medium">{label}</span>
        {hint && <span className="block text-xs text-fg-faint">{hint}</span>}
      </span>
    </label>
  );
}

export function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-border py-8 first:border-t-0 first:pt-0 lg:grid-cols-[220px_1fr]">
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        {description && <p className="mt-1 text-sm text-fg-muted">{description}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}
