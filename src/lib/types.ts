// Plain (serialized) shapes returned by the data layer.

export type Status = "draft" | "published";
export type ImageRef = { url: string; alt: string };
export type LinkRef = { label: string; url: string };

export type Settings = {
  id: string;
  name: string;
  headline: string;
  location: string;
  availability: string;
  intro: string;
  bio: string;
  email: string;
  avatar: ImageRef | null;
  resumeUrl: string;
  socials: LinkRef[];
  seo: { title: string; description: string; ogImage: string };
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  year: number | null;
  role: string;
  content: string;
  techStack: string[];
  cover: ImageRef | null;
  images: ImageRef[];
  metrics: { label: string; value: string }[];
  links: { live: string; repo: string };
  featured: boolean;
  order: number;
  status: Status;
  createdAt: string;
  updatedAt: string;
};

export type Experience = {
  id: string;
  type: "work" | "education";
  role: string;
  org: string;
  orgUrl: string;
  location: string;
  start: string; // YYYY-MM
  end: string; // YYYY-MM or "" for present
  summary: string;
  highlights: string[];
  order: number;
};

export type SkillGroup = {
  id: string;
  category: string;
  items: string[];
  order: number;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  body: string;
  read: boolean;
  createdAt: string;
};
