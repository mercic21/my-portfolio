import { Schema, model, models, type Model } from "mongoose";

const imageSchema = new Schema({ url: String, alt: { type: String, default: "" } }, { _id: false });
const linkSchema = new Schema({ label: String, url: String }, { _id: false });

// settings — a single document with _id "site"
const SettingsSchema = new Schema({
  _id: { type: String, default: "site" },
  name: { type: String, default: "" },
  headline: { type: String, default: "" },
  location: { type: String, default: "" },
  availability: { type: String, default: "" },
  intro: { type: String, default: "" },
  bio: { type: String, default: "" },
  email: { type: String, default: "" },
  avatar: { type: imageSchema, default: null },
  resumeUrl: { type: String, default: "" },
  socials: { type: [linkSchema], default: [] },
  seo: {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    ogImage: { type: String, default: "" },
  },
});

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    summary: { type: String, required: true, maxlength: 280 },
    year: { type: Number, default: null },
    role: { type: String, default: "" },
    content: { type: String, default: "" },
    techStack: { type: [String], index: true, default: [] },
    cover: { type: imageSchema, default: null },
    images: { type: [imageSchema], default: [] },
    metrics: { type: [new Schema({ label: String, value: String }, { _id: false })], default: [] },
    links: { live: { type: String, default: "" }, repo: { type: String, default: "" } },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
  },
  { timestamps: true },
);
ProjectSchema.index({ status: 1, featured: -1, order: 1 });

const ExperienceSchema = new Schema(
  {
    type: { type: String, enum: ["work", "education"], default: "work" },
    role: { type: String, required: true },
    org: { type: String, required: true },
    orgUrl: { type: String, default: "" },
    location: { type: String, default: "" },
    start: { type: String, required: true },
    end: { type: String, default: "" },
    summary: { type: String, default: "" },
    highlights: { type: [String], default: [] },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

const SkillGroupSchema = new Schema(
  {
    category: { type: String, required: true },
    items: { type: [String], default: [] },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

const MessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    body: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
    // Salted hash of the sender IP, used only for rate limiting.
    ipHash: { type: String, index: true },
  },
  { timestamps: true },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- documents are converted with toPlain()
function getModel(name: string, schema: Schema): Model<any> {
  return models[name] || model(name, schema);
}

export const SettingsModel = getModel("Settings", SettingsSchema);
export const ProjectModel = getModel("Project", ProjectSchema);
export const ExperienceModel = getModel("Experience", ExperienceSchema);
export const SkillGroupModel = getModel("SkillGroup", SkillGroupSchema);
export const MessageModel = getModel("Message", MessageSchema);
