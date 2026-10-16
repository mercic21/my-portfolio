import { ImageResponse } from "next/og";
import { getSettings } from "@/lib/data";

export const alt = "Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default share image, used when settings.seo.ogImage and project covers aren't set.
export default async function OpengraphImage() {
  const s = await getSettings();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 80,
          background: "#0c0c0e",
          color: "#ededf0",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: -2 }}>{s.name}</div>
        {s.headline && <div style={{ fontSize: 36, color: "#a0a0aa", marginTop: 12 }}>{s.headline}</div>}
      </div>
    ),
    size,
  );
}
