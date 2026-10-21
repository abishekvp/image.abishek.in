import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#090d16",
};

export const metadata: Metadata = {
  title: "ImagePro — Professional Image Compressor & Universal Format Converter",
  description:
    "Compress and convert images online with 100% in-browser privacy. WebP, AVIF, JPEG, PNG, PDF, ICO & BMP. 300 DPI HD Print studio and batch ZIP downloads.",
  keywords: [
    "image compressor",
    "image converter",
    "HD print 300 DPI",
    "convert jpg to png",
    "convert png to jpg",
    "convert image to pdf",
    "image to ico favicon",
    "WebP converter",
    "AVIF compressor",
    "batch image compressor",
    "reduce image file size",
    "client-side image converter",
  ],
  authors: [{ name: "abishek.in" }],
  openGraph: {
    title: "ImagePro — Professional Image Compressor & Universal Format Converter",
    description:
      "Ultra-fast, 100% private client-side image compression and format conversion with before/after split slider, batch ZIP export, 300 DPI print options, and PDF merge.",
    url: "https://image.abishek.in",
    siteName: "ImagePro",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3706001002085899"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-surface-base text-slate-100 min-h-screen antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
