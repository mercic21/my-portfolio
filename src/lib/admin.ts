import "server-only";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

/**
 * Server-side session check. Call at the top of every admin page, data read and server action.
 * Never rely on the UI hiding things.
 */
export async function requireAdmin() {
  // Session checks are always request-time; mark it before Auth.js touches crypto.
  await connection();
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return session.user;
}
