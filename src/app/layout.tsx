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
    default: "Image Resizer for Instagram - 인스타그램 이미지 리사이저",
    template: "%s | Image Resizer",
  },
  description:
    "인스타그램용 이미지 리사이저. 1:1, 4:5, 9:16 비율로 이미지를 리사이즈하고, 폴라로이드 프레임, 패딩, 글래스 블러, 그림자 효과를 적용하세요.",
  keywords: [
    "이미지 리사이저",
    "인스타그램 리사이저",
    "이미지 편집",
    "인스타그램 포스팅",
    "이미지 비율 조정",
    "폴라로이드 프레임",
    "이미지 효과",
  ],
  authors: [{ name: "Resizer" }],
  creator: "Resizer",
  publisher: "Resizer",
  metadataBase: getSiteUrlObject(),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/resizer_icon.png",
    apple: "/resizer_icon.png",
  },
  openGraph: {
    title: "Image Resizer for Instagram - 인스타그램 이미지 리사이저",
    description:
      "인스타그램용 이미지 리사이저. 1:1, 4:5, 9:16 비율로 이미지를 리사이즈하고, 폴라로이드 프레임, 패딩, 글래스 블러, 그림자 효과를 적용하세요.",
    url: `${getSiteUrl()}/`,
    siteName: "Image Resizer for Instagram",
    images: [
      {
        url: `${getSiteUrl()}/resizer_icon.png`,
        width: 600,
        height: 600,
        alt: "Image Resizer for Instagram",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Image Resizer for Instagram - 인스타그램 이미지 리사이저",
    description:
      "인스타그램용 이미지 리사이저. 1:1, 4:5, 9:16 비율로 이미지를 리사이즈하고, 폴라로이드 프레임, 패딩, 글래스 블러, 그림자 효과를 적용하세요.",
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
    name: "Image Resizer for Instagram",
    description:
      "인스타그램용 이미지 리사이저. 1:1, 4:5, 9:16 비율로 이미지를 리사이즈하고, 폴라로이드 프레임, 패딩, 글래스 블러, 그림자 효과를 적용하세요.",
    url: `${siteUrl}/`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    featureList: [
      "이미지 리사이즈",
      "비율 조정 (1:1, 4:5, 9:16)",
      "폴라로이드 프레임",
      "패딩 조정",
      "글래스 블러 효과",
      "그림자 효과",
      "배경색 변경",
    ],
  };

  return (
    <html lang="ko">
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
