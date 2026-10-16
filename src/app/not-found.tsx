import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 py-24 sm:px-8">
      <p className="font-mono text-sm text-fg-faint">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 text-fg-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link href="/" className="mt-8 text-sm font-medium hover:underline">
        ← Back home
      </Link>
    </main>
  );
}
