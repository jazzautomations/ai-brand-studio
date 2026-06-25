import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { StoreHydrator } from "@/components/store-hydrator";
import "./globals.css";
import { STUDIO_NAME, STUDIO_TAGLINE } from "@/lib/studio";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: `${STUDIO_NAME} — Autonomous AI Brand Studio`,
    template: `%s · ${STUDIO_NAME}`,
  },
  description: STUDIO_TAGLINE,
  openGraph: {
    title: `${STUDIO_NAME} — Autonomous AI Brand Studio`,
    description: STUDIO_TAGLINE,
    type: "website",
    siteName: STUDIO_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${STUDIO_NAME} — Autonomous AI Brand Studio`,
    description: STUDIO_TAGLINE,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning>
      <body className="bg-background text-foreground font-sans antialiased min-h-screen">
        <StoreHydrator />
        {children}
      </body>
    </html>
  );
}
