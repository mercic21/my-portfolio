import type { Metadata } from "next";
import { Suspense } from "react";
import { devLoginEnabled, signIn } from "@/auth";
import { buttonStyles } from "@/components/ui";
import { LoginError } from "./login-error";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default function LoginPage() {
  async function github() {
    "use server";
    await signIn("github", { redirectTo: "/admin" });
  }
  async function dev() {
    "use server";
    await signIn("dev", { redirectTo: "/admin" });
  }

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-24">
      <div className="w-full max-w-xs">
        <h1 className="text-xl font-semibold tracking-tight">Admin</h1>
        <p className="mt-1 text-sm text-fg-muted">Sign in to manage your portfolio.</p>
        <Suspense>
          <LoginError />
        </Suspense>
        <form action={github} className="mt-8">
          <button className={`${buttonStyles.primary} w-full`}>
            <svg viewBox="0 0 16 16" fill="currentColor" className="size-4" aria-hidden>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            Continue with GitHub
          </button>
        </form>
        {devLoginEnabled && (
          <form action={dev} className="mt-3">
            <button className={`${buttonStyles.secondary} w-full`}>Dev login (local only)</button>
          </form>
        )}
      </div>
    </main>
  );
}
