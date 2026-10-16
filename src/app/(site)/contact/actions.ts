"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { notifyNewMessage } from "@/lib/mail";
import { ContactInput, firstIssue } from "@/lib/validators";
import { MessageModel } from "@/models";

type Values = { name: string; email: string; body: string };
export type ContactState = { status: "idle" | "error" | "sent"; message?: string; values?: Values };

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real users never see this field. Pretend success so bots don't retry.
  if (String(formData.get("company") ?? "")) return { status: "sent" };

  const values: Values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    body: String(formData.get("body") ?? ""),
  };
  const parsed = ContactInput.safeParse(values);
  if (!parsed.success) return { status: "error", message: firstIssue(parsed.error), values };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const ipHash = createHash("sha256")
    .update(`${ip}:${process.env.AUTH_SECRET ?? ""}`)
    .digest("hex");

  await connectDB();
  const recent = await MessageModel.countDocuments({
    ipHash,
    createdAt: { $gte: new Date(Date.now() - WINDOW_MS) },
  });
  if (recent >= MAX_PER_WINDOW) {
    return { status: "error", message: "Too many messages. Please try again in a few minutes.", values };
  }

  await MessageModel.create({ ...parsed.data, ipHash });
  await notifyNewMessage(parsed.data);
  return { status: "sent" };
}
