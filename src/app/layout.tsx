import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getSettings } from "@/lib/data";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const title = s.seo.title || `${s.name}${s.headline ? ` — ${s.headline}` : ""}`;
  const description = s.seo.description || s.intro;
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s — ${s.name}` },
    description,
    openGraph: {
      type: "website",
      siteName: s.name,
      title,
      description,
      ...(s.seo.ogImage ? { images: [s.seo.ogImage] } : {}),
    },
    twitter: { card: "summary_large_image" },
  };
}

// Applies the saved theme before paint to avoid a flash.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
