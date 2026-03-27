import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import StyledComponentsRegistry from "@/lib/styled-components-registry";
import { getSiteUrl, getSiteUrlObject } from "@/utils/siteConfig";

export const metadata: Metadata = {
  title: {
    default: "Picture Drucker - Add Background for Instagram Feed & Story",
    template: "%s | Picture Drucker",
  },
  description:
    "Free online tool to add backgrounds to Instagram photos and stories. Resize for Story (9:16) and Feed (1:1, 4:5) with blur, padding, frames.",
  keywords: [
    "instagram story background",
    "instagram story size",
    "instagram story resize",
    "resize for instagram story",
    "instagram story maker",
    "instagram story editor",
    "instagram story 9:16",
    "instagram image background",
    "instagram photo background",
    "add background to instagram",
    "instagram background maker",
    "white background instagram",
    "black background instagram",
    "instagram border",
    "instagram padding",
    "instagram feed size",
    "instagram feed 4:5",
    "photo background editor",
    "polaroid frame",
    "glass blur background",
  ],
  authors: [{ name: "Picture Drucker" }],
  creator: "Picture Drucker",
  publisher: "Picture Drucker",
  metadataBase: getSiteUrlObject(),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/picture_drucker_icon.png",
    apple: "/picture_drucker_icon.png",
  },
  openGraph: {
    title: "Picture Drucker - Add Background for Instagram Feed & Story",
    description:
      "Free online tool to add backgrounds to Instagram photos and stories. Resize for Story (9:16) and Feed (1:1, 4:5) with blur, padding, frames.",
    url: "/",
    siteName: "Picture Drucker",
    images: [
      {
        url: "/picture_drucker_icon.png",
        width: 1024,
        height: 1024,
        alt: "Picture Drucker - Add Background for Instagram Feed & Story",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Picture Drucker - Add Background for Instagram Feed & Story",
    description:
      "Free online tool to add backgrounds to Instagram photos and stories. Resize for Story (9:16) and Feed (1:1, 4:5) with blur, padding, frames.",
    images: ["/picture_drucker_icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Picture Drucker",
    description:
      "Free online tool to add background to Instagram photos and stories. Resize images for Instagram Story (9:16) and Feed (1:1, 4:5). Add white or black background, glass blur, padding, borders, and polaroid frames.",
    url: `${siteUrl}/`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Resize images for Instagram Story (9:16)",
      "Resize images for Instagram Feed (1:1, 4:5)",
      "Add background to Instagram photos",
      "White and black background options",
      "Glass blur background effect",
      "Add padding and borders",
      "Polaroid frame effect",
      "Shadow effect",
    ],
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
        <Analytics />
      </body>
    </html>
  );
}
