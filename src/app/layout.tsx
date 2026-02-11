import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "@/lib/styled-components-registry";
import { getSiteUrl, getSiteUrlObject } from "@/utils/siteConfig";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Picture Drucker - Image Resizer for Instagram",
    template: "%s | Picture Drucker",
  },
  description:
    "Free online image resizer optimized for Instagram Feed and Stories. Resize images to 1:1, 4:5, and 9:16 aspect ratios. Apply polaroid frames, padding, glass blur, shadow effects, and customize background colors.",
  keywords: [
    "image resizer",
    "instagram resizer",
    "instagram feed",
    "instagram stories",
    "image editor",
    "instagram post",
    "aspect ratio",
    "polaroid frame",
    "image effects",
    "photo editor",
    "social media tools",
    "instagram optimized",
  ],
  authors: [{ name: "Picture Drucker" }],
  creator: "Picture Drucker",
  publisher: "Picture Drucker",
  metadataBase: getSiteUrlObject(),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/resizer_icon.png",
    apple: "/resizer_icon.png",
  },
  openGraph: {
    title: "Picture Drucker - Image Resizer for Instagram",
    description:
      "Free online image resizer optimized for Instagram Feed and Stories. Resize images to 1:1, 4:5, and 9:16 aspect ratios. Apply polaroid frames, padding, glass blur, shadow effects, and customize background colors.",
    url: `${getSiteUrl()}/`,
    siteName: "Picture Drucker",
    images: [
      {
        url: `${getSiteUrl()}/resizer_icon.png`,
        width: 600,
        height: 600,
        alt: "Picture Drucker - Image Resizer for Instagram",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Picture Drucker - Image Resizer for Instagram",
    description:
      "Free online image resizer optimized for Instagram Feed and Stories. Resize images to 1:1, 4:5, and 9:16 aspect ratios. Apply polaroid frames, padding, glass blur, shadow effects, and customize background colors.",
    images: [`${getSiteUrl()}/resizer_icon.png`],
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
      "Free online image resizer optimized for Instagram Feed and Stories. Resize images to 1:1, 4:5, and 9:16 aspect ratios. Apply polaroid frames, padding, glass blur, shadow effects, and customize background colors.",
    url: `${siteUrl}/`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Image resizing",
      "Aspect ratio adjustment (1:1, 4:5, 9:16)",
      "Polaroid frame",
      "Padding adjustment",
      "Glass blur effect",
      "Shadow effect",
      "Background color customization",
    ],
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
