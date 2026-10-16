import { createHash } from "node:crypto";
import { auth } from "@/auth";

const FOLDER = "portfolio";
const ALLOWED = { image: "jpg,jpeg,png,webp,avif,gif", file: "pdf" } as const;

/**
 * Returns a short-lived signature for a direct browser -> Cloudinary upload.
 * The secret never leaves the server, and allowed formats are part of the signature.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return Response.json({ error: "Cloudinary is not configured" }, { status: 501 });
  }

  const { kind } = (await req.json().catch(() => ({}))) as { kind?: keyof typeof ALLOWED };
  const params: Record<string, string> = {
    allowed_formats: ALLOWED[kind === "file" ? "file" : "image"],
    folder: FOLDER,
    timestamp: String(Math.floor(Date.now() / 1000)),
  };
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  const signature = createHash("sha1").update(toSign + apiSecret).digest("hex");

  return Response.json({ cloudName, apiKey, signature, ...params });
}
