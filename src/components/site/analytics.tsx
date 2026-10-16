import Script from "next/script";
import { siteUrl } from "@/lib/utils";

/**
 * Umami (cookie-free, no consent banner needed). Loaded only on the public site, only in
 * production builds, and only counted on the real domain so previews and localhost stay out.
 * Clicks on elements with `data-umami-event="name"` are tracked as events.
 */
export function Analytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!websiteId || process.env.NODE_ENV !== "production") return null;

  const src = process.env.NEXT_PUBLIC_UMAMI_SRC || "https://cloud.umami.is/script.js";
  return <Script src={src} data-website-id={websiteId} data-domains={new URL(siteUrl()).hostname} strategy="afterInteractive" />;
}
