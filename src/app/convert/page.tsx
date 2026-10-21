import { Suspense } from "react";
import type { Metadata } from "next";
import { ConverterStudio } from "@/components/ConverterStudio";

export const metadata: Metadata = {
  title: "Image Converter — Convert JPG, PNG, WebP, AVIF, PDF, ICO Online",
  description:
    "Free, 100% private in-browser image converter. Convert photos & graphics between JPG, PNG, WebP, AVIF, PDF, ICO, and BMP with batch ZIP & multi-page PDF merge.",
  keywords: [
    "image converter",
    "convert jpg to png",
    "convert png to jpg",
    "convert webp to jpg",
    "convert image to pdf",
    "image to ico favicon",
    "batch image converter",
    "free online image converter",
  ],
  openGraph: {
    title: "Universal Image Converter — JPG, PNG, WebP, AVIF, PDF, ICO",
    description:
      "Convert unlimited images directly in your browser. Batch conversion, multi-page PDF generation, transparency preservation, and ZIP export.",
    url: "https://image.abishek.in/convert",
    siteName: "ImagePro Studio",
  },
};

export default function ConvertPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-base" />}>
      <ConverterStudio />
    </Suspense>
  );
}
