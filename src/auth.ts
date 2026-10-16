import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

export const devLoginEnabled =
  process.env.NODE_ENV === "development" && process.env.AUTH_DEV_LOGIN === "true";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub, // reads AUTH_GITHUB_ID / AUTH_GITHUB_SECRET
    ...(devLoginEnabled
      ? [
          Credentials({
            id: "dev",
            name: "Dev login",
            credentials: {},
            authorize: async () => ({ id: "dev", name: "Dev admin", email: "dev@localhost" }),
          }),
        ]
      : []),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login", error: "/admin/login" },
  callbacks: {
    // Single-admin site: only the configured GitHub account may sign in. Fails closed if unset.
    signIn({ account, profile }) {
      if (account?.provider === "dev") return devLoginEnabled;
      if (account?.provider === "github") {
        const allowed = process.env.ADMIN_GITHUB_LOGIN?.trim().toLowerCase();
        const login = typeof profile?.login === "string" ? profile.login.toLowerCase() : "";
        return Boolean(allowed) && login === allowed;
      }
      return false;
    },
  },
});
