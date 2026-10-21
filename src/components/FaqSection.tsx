"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "How does in-browser image compression and conversion work?",
    a: "Unlike traditional online tools that upload your private photos to remote servers, ImagePro uses client-side HTML5 Canvas, WebCodecs, and browser binary encoders. Every byte of compression and conversion runs locally inside your browser on your CPU/GPU. Your photos never leave your device, ensuring 100% privacy, zero data leaks, and lightning-fast speeds.",
  },
  {
    q: "Which image formats can I convert between?",
    a: "You can convert between JPG, PNG, WebP, AVIF, PDF, ICO, and BMP formats. You can also drag and drop SVG, GIF, and other browser-supported image formats to convert them into crisp modern web formats or documents.",
  },
  {
    q: "What happens to transparent backgrounds when converting PNG/WebP to JPG?",
    a: "JPG does not support alpha channel transparency. When converting a transparent image (like a PNG logo) into JPG or BMP, our converter fills the transparent areas with your chosen background color (default is pure white, with options for black, custom colors, or light gray) so your graphics look natural without black pixel artifacts.",
  },
  {
    q: "Can I convert multiple images into a single PDF document?",
    a: "Yes! When in Converter mode, you can upload multiple photos, receipts, or document scans, convert them to PDF, and click 'Merge into 1 PDF' to instantly generate and download a single multi-page PDF document.",
  },
  {
    q: "How does HD Print Mode (300 DPI) work for photo printing?",
    a: "Most web tools strip metadata and output images at 72 DPI, causing photo print machines and desktop printer drivers to produce pixelated prints. Our HD Print preset retains high resolution, injects true 300 DPI metadata tags (JFIF for JPEG, pHYs for PNG), and applies an unsharp mask filter to counteract ink bleed on photo paper.",
  },
  {
    q: "Is there any limit on file sizes or how many images I can convert/compress?",
    a: "No artificial limits! Because processing runs entirely on your device hardware, there are no subscription paywalls, hourly quotas, or file count caps. You can convert or compress batches of dozens of photos simultaneously and download them in a single organized ZIP file.",
  },
];

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="mt-16 pt-12 border-t border-surface-border/60">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Clear answers on image compression, format conversion, print fidelity, and privacy.
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-xl border border-surface-border bg-surface-card overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-surface-subtle/40 transition-colors"
              >
                <span className="font-semibold text-xs sm:text-sm text-white">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? "rotate-180 text-brand-400" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-4 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-surface-border/40 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
