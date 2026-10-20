import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#090d16",
};

export const metadata: Metadata = {
  title: "Compressor Pro — Best Image Compressor & 300 DPI HD Print Studio",
  description:
    "Compress images online with lossless & lossy algorithms, WebP, AVIF, JPEG, and PNG. Download HD 300 DPI print-ready photos. 100% private in-browser processing.",
  keywords: [
    "image compressor",
    "HD print 300 DPI",
    "photo compressor",
    "WebP converter",
    "AVIF compressor",
    "batch image compressor",
    "reduce image file size",
    "compress image without losing quality",
  ],
  authors: [{ name: "abishek.in" }],
  openGraph: {
    title: "Compressor Pro — Professional Image Compressor & 300 DPI HD Print",
    description:
      "Ultra-fast, 100% private client-side image compression with interactive before/after split slider, batch ZIP export, and 300 DPI print options.",
    url: "https://image.abishek.in",
    siteName: "Compressor Pro",
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
      <body className="bg-surface-base text-slate-100 min-h-screen antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
