"use client";

import React from "react";
import { X, Printer, CheckCircle, Sparkles, Layers, Sliders, ArrowRight } from "lucide-react";

interface PrintGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPrintPreset: () => void;
}

export const PrintGuideModal: React.FC<PrintGuideModalProps> = ({
  isOpen,
  onClose,
  onApplyPrintPreset,
}) => {
  if (!isOpen) return null;

  const printSizes = [
    { name: "4 × 6 in (Standard Photo)", px: "1200 × 1800 px", use: "Postcards, family albums" },
    { name: "5 × 7 in (Desk Frame)", px: "1500 × 2100 px", use: "Framed portrait prints" },
    { name: "8 × 10 in (Art Print)", px: "2400 × 3000 px", use: "Gallery wall prints" },
    { name: "11 × 14 in (Exhibition)", px: "3300 × 4200 px", use: "Showcase photography" },
    { name: "A4 Document (8.3 × 11.7 in)", px: "2480 × 3508 px", use: "Flyers, portfolio sheets" },
    { name: "A3 Poster (11.7 × 16.5 in)", px: "3508 × 4960 px", use: "Posters & commercial signs" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-surface-card border border-surface-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface-base/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">HD Print & 300 DPI Mastery Guide</h3>
              <p className="text-xs text-slate-400">
                How to prepare razor-sharp images for professional photo printing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-subtle transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300">
          {/* Section 1 */}
          <div>
            <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                1
              </span>
              Why 300 DPI is the Print Standard
            </h4>
            <p className="text-slate-400 leading-relaxed text-xs">
              Computer screens and mobile displays generally render at 72 to 96 DPI (Dots Per Inch). If you send a standard web image to a photo lab or commercial printer, the printer stretches each pixel, causing soft, pixelated, or blurry prints. At <strong>300 DPI</strong>, the human eye cannot distinguish individual dots from a normal reading distance, creating photographic realism.
            </p>
          </div>

          {/* Section 2: Reference Table */}
          <div>
            <h4 className="font-bold text-white text-sm mb-2.5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center text-xs">
                2
              </span>
              Standard Print Dimensions at 300 DPI
            </h4>
            <div className="overflow-x-auto rounded-xl border border-surface-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-subtle text-slate-300 border-b border-surface-border">
                    <th className="py-2.5 px-3 font-semibold">Print Size</th>
                    <th className="py-2.5 px-3 font-semibold">Minimum Pixels (300 DPI)</th>
                    <th className="py-2.5 px-3 font-semibold hidden sm:table-cell">Best Used For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border font-mono text-[11px]">
                  {printSizes.map((item, idx) => (
                    <tr key={idx} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="py-2 px-3 text-white font-sans font-medium">{item.name}</td>
                      <td className="py-2 px-3 text-amber-400 font-bold">{item.px}</td>
                      <td className="py-2 px-3 text-slate-400 font-sans hidden sm:table-cell">
                        {item.use}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: How our tool helps */}
          <div>
            <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                3
              </span>
              How Compressor Pro Prepares Your Print
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>DPI Header Injection:</strong> Embeds JFIF APP0 (JPEG) or pHYs (PNG) markers so Photoshop, InDesign, and print drivers read exactly 300 DPI.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Unsharp Mask Clarification:</strong> Enhances high-frequency texture and edges to prevent ink-bleed softening during physical paper printing.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>High Bitrate Quantization:</strong> Maintains smooth gradients in skies, skin tones, and shadows without compression banding.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-surface-border bg-surface-base/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={() => {
              onApplyPrintPreset();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Activate HD Print Preset</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
