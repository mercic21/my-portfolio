/**
 * Populates an empty database with placeholder content you can then edit in /admin.
 *   npm run seed           only fills empty collections
 *   npm run seed -- --force  replaces settings, projects, experience and skills (messages are kept)
 */
import mongoose from "mongoose";
import { ExperienceModel, ProjectModel, SettingsModel, SkillGroupModel } from "../src/models";

const force = process.argv.includes("--force");

const settings = {
  _id: "site",
  name: "Your Name",
  headline: "Software Engineer",
  location: "Kigali, Rwanda",
  availability: "Open to new opportunities",
  intro: "I design and build reliable web platforms — from payment backends to the interfaces people use every day.",
  bio: "I'm a software engineer focused on backend systems and product engineering.\n\nReplace this text from **Admin → Settings**. Markdown is supported.",
  email: "you@example.com",
  avatar: null,
  resumeUrl: "",
  socials: [
    { label: "GitHub", url: "https://github.com/" },
    { label: "LinkedIn", url: "https://www.linkedin.com/" },
  ],
  seo: { title: "", description: "", ogImage: "" },
};

const caseStudy = (problem: string, approach: string, outcome: string) =>
  `## The problem\n\n${problem}\n\n## Approach\n\n${approach}\n\n## Outcome\n\n${outcome}\n`;

const projects = [
  {
    title: "Payments Platform",
    slug: "payments-platform",
    summary: "A microservices payment platform handling mobile-money and card transactions for merchants.",
    year: 2025,
    role: "Lead backend engineer",
    techStack: ["Go", "PostgreSQL", "Kafka", "Kubernetes"],
    content: caseStudy(
      "Merchants were reconciling payments by hand, and failed transactions were hard to trace across providers.",
      "Split the monolith into ledger, gateway and notification services connected by an event log. Every transaction gets an idempotency key and a double-entry ledger record.",
      "Reconciliation became automatic and failures can be traced end to end.",
    ),
    metrics: [
      { value: "99.95%", label: "uptime" },
      { value: "−60%", label: "reconciliation time" },
    ],
    links: { live: "", repo: "" },
    featured: true,
    status: "published",
    order: 0,
  },
  {
    title: "Portfolio CMS",
    slug: "portfolio-cms",
    summary: "This site: a database-driven portfolio with an admin dashboard and on-demand revalidation.",
    year: 2026,
    role: "Design & development",
    techStack: ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS"],
    content: caseStudy(
      "Updating a static portfolio meant editing code and redeploying for every change.",
      "All content lives in MongoDB and is edited from a protected dashboard. Pages are statically rendered and refreshed by cache tags when content changes.",
      "Content updates take seconds and need no deploy.",
    ),
    metrics: [],
    links: { live: "", repo: "" },
    featured: true,
    status: "published",
    order: 1,
  },
];

const experiences = [
  {
    type: "work",
    role: "Senior Software Engineer",
    org: "Company Name",
    location: "Remote",
    start: "2023-01",
    end: "",
    summary: "Backend and platform work on a fintech product.",
    highlights: ["Led the migration to an event-driven architecture.", "Mentored three engineers."],
    order: 0,
  },
  {
    type: "education",
    role: "BSc Computer Science",
    org: "University Name",
    start: "2016-09",
    end: "2020-06",
    highlights: [],
    order: 1,
  },
];

const skills = [
  { category: "Languages", items: ["TypeScript", "Go", "Python", "SQL"], order: 0 },
  { category: "Backend", items: ["Node.js", "PostgreSQL", "MongoDB", "Kafka", "Redis"], order: 1 },
  { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS"], order: 2 },
  { category: "Infrastructure", items: ["Docker", "Kubernetes", "AWS", "GitHub Actions"], order: 3 },
];

async function fill(model: typeof ProjectModel, docs: object[], label: string) {
  if (force) await model.deleteMany({});
  else if (await model.estimatedDocumentCount()) return console.log(`· ${label}: not empty, skipped`);
  await model.insertMany(docs);
  console.log(`✓ ${label}: ${docs.length} added`);
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set (expected in .env.local)");
  await mongoose.connect(uri);

  if (force || !(await SettingsModel.exists({ _id: "site" }))) {
    await SettingsModel.replaceOne({ _id: "site" }, settings, { upsert: true });
    console.log("✓ settings");
  } else console.log("· settings: exists, skipped");

  await fill(ProjectModel, projects, "projects");
  await fill(ExperienceModel, experiences, "experience");
  await fill(SkillGroupModel, skills, "skills");

  await Promise.all([ProjectModel, ExperienceModel, SkillGroupModel, SettingsModel].map((m) => m.syncIndexes()));
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
