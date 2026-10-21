import { Suspense } from "react";
import type { Metadata } from "next";
import { CompressorStudio } from "@/components/CompressorStudio";

export const metadata: Metadata = {
  title: "Image Compressor — 300 DPI Print & Web Optimizer | ImagePro",
  description:
    "Compress images online with 100% in-browser privacy. WebP, AVIF, JPEG, PNG. 300 DPI HD Print studio, lossless/lossy compression, and batch ZIP export.",
  keywords: [
    "image compressor",
    "compress images online",
    "300 dpi print",
    "hd print image optimizer",
    "reduce image size",
    "batch image compressor",
    "webp compressor",
    "avif compressor",
    "png compression",
    "free online photo compressor",
  ],
  openGraph: {
    title: "Image Compressor — 300 DPI Print & Web Optimizer",
    description:
      "Compress unlimited images directly in your browser. 300 DPI print-ready export, split-screen comparison, batch ZIP download, and zero server uploads.",
    url: "https://image.abishek.in",
    siteName: "ImagePro Studio",
  },
};

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-base" />}>
      <CompressorStudio />
    </Suspense>
  );
}
