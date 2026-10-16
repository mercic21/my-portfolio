"use client";

import { useSearchParams } from "next/navigation";

export function LoginError() {
  const error = useSearchParams().get("error");
  if (!error) return null;
  return (
    <p role="alert" className="mt-4 rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
      {error === "AccessDenied" ? "This account isn't allowed to sign in." : "Sign-in failed. Please try again."}
    </p>
  );
}
