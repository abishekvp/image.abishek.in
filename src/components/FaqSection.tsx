"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "How does in-browser compression work and is my data private?",
    a: "Unlike traditional online compressors that send your photos to remote servers, Compressor Pro uses client-side HTML5 Canvas and native browser encoders. Every byte of compression runs directly inside your computer or smartphone's browser. Your photos never leave your device, ensuring 100% privacy and zero upload waiting time.",
  },
  {
    q: "What makes HD Print Mode (300 DPI) suitable for photo printing?",
    a: "Most web compressors strip image headers and save images at 72 DPI, causing photo print machines and desktop drivers to produce pixelated or blurry prints. Our HD Print preset retains high resolution, injects true 300 DPI metadata tags (JFIF for JPEG, pHYs for PNG), and applies an unsharp mask filter to counteract printer ink bleeding.",
  },
  {
    q: "Which format should I choose: WebP, AVIF, JPEG, or PNG?",
    a: "For modern websites, WebP and AVIF offer 30-50% smaller sizes than JPEG with identical visual quality. For transparent graphics, logos, and screenshots, PNG or WebP is best. For universal compatibility, photo printing, and backwards compatibility with older operating systems, choose JPEG.",
  },
  {
    q: "How does the 'Target File Size' mode work?",
    a: "Many government portals, visa forms, and job application sites require images strictly under a specific limit (e.g., 200 KB or 500 KB). Our target size solver runs an intelligent binary search over the quality parameter, adjusting quantization and dimensions until the output meets your exact size threshold with the highest possible visual clarity.",
  },
  {
    q: "Is there any limit on how many images I can compress?",
    a: "No! Because processing is performed locally on your device rather than on our servers, there are no artificial quotas, subscription walls, or file-count caps. You can compress batches of dozens of photos simultaneously and download them in a single ZIP file.",
  },
];

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="mt-16 pt-12 border-t border-surface-border/60">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Clear answers on image compression, print fidelity, and privacy.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
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
