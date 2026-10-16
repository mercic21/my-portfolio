# Portfolio

A database-driven portfolio. All content (bio, projects, experience, skills, links, SEO) lives in MongoDB and is edited from `/admin`. Pages are statically rendered and refreshed by cache tags the moment you save, so updates need no code change or redeploy.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · MongoDB + Mongoose · Auth.js (GitHub) · Tailwind CSS v4 · Zod

## Setup

```bash
npm install
cp .env.example .env.local   # then fill it in
npm run seed                 # placeholder content for an empty database
npm run dev
```

Open http://localhost:3000 and http://localhost:3000/admin.

### Environment

| Variable | Required | Notes |
| --- | --- | --- |
| `MONGODB_URI` | yes | Atlas connection string. In Atlas, restrict network access and enable backups. |
| `AUTH_SECRET` | yes | `npx auth secret` |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | yes | GitHub OAuth app. Callback: `<site>/api/auth/callback/github` |
| `ADMIN_GITHUB_LOGIN` | yes | The only GitHub username allowed into `/admin`. Sign-in fails if unset. |
| `NEXT_PUBLIC_SITE_URL` | yes in prod | Used for sitemap, canonical URLs and Open Graph. |
| `AUTH_DEV_LOGIN` | no | `true` shows a one-click login on `/admin/login`, only under `next dev`. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | no | Enables upload buttons. Without them, paste image URLs. For résumé PDFs, enable *Allow delivery of PDF and ZIP files* in Cloudinary security settings. |
| `RESEND_API_KEY`, `CONTACT_NOTIFY_TO`, `CONTACT_NOTIFY_FROM` | no | Email notification for new contact messages. |

## How it fits together

```
src/
  app/
    (site)/           public pages: home, projects, projects/[slug], about, contact
    admin/login/      sign in
    admin/(dashboard)/ protected CRUD + server actions (actions.ts)
    api/              auth, signed uploads, JSON export
    sitemap.ts, robots.ts, opengraph-image.tsx
  lib/
    data.ts           cached public reads ('use cache' + cacheTag)
    admin-data.ts     uncached admin reads, each checks the session
    validators.ts     Zod schemas + FormData helpers
    db.ts, admin.ts, mail.ts, types.ts
  models/             Mongoose schemas
  components/         ui, site, admin
scripts/seed.ts
```

- **Freshness:** public reads are tagged (`settings`, `projects`, `experience`, `skills`). Every admin save calls `updateTag()`, so the next request renders fresh content.
- **Security:** every admin page, data read, server action and API route checks the session on the server. Input is validated with Zod; Markdown renders without raw HTML. The contact form has a honeypot and a per-IP rate limit (IPs are stored only as salted hashes).
- **Backups:** *Admin → Overview → Export JSON* downloads all content.

## Deploy (Vercel)

1. Push to GitHub and import the repo in Vercel.
2. Add the environment variables above (with `NEXT_PUBLIC_SITE_URL` set to your domain).
3. Create a second GitHub OAuth app for production with the production callback URL.
4. In Atlas, allow Vercel's egress (or `0.0.0.0/0` with a strong password) under Network Access.
