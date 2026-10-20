import React from "react";
import {
  ShieldCheck,
  Printer,
  Zap,
  Maximize2,
  FolderArchive,
  SlidersHorizontal,
  Cpu,
  Layers,
} from "lucide-react";

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      title: "100% In-Browser Privacy",
      description:
        "Your photos are processed entirely on your device using HTML5 Canvas & WebCodecs. Zero bytes are uploaded to any external server.",
    },
    {
      icon: Printer,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      title: "HD Print Ready (300 DPI)",
      description:
        "Injects physical 300 DPI JFIF and PNG metadata with subtle unsharp masking for razor-sharp photo paper and canvas printing.",
    },
    {
      icon: Zap,
      color: "text-brand-400 bg-brand-500/10 border-brand-500/20",
      title: "Next-Gen WebP & AVIF",
      description:
        "Convert bulky JPEGs and PNGs into modern WebP and AVIF formats, slashing file size by up to 85% while preserving visual clarity.",
    },
    {
      icon: Maximize2,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      title: "Target Size Solver",
      description:
        "Need an image under 500 KB for a portal or visa application? Our binary search algorithm automatically dials in the exact quality.",
    },
    {
      icon: FolderArchive,
      color: "text-violet-400 bg-violet-500/10 border-violet-500/20",
      title: "Batch ZIP Download",
      description:
        "Drop 50+ photos at once. Compress them in parallel threads and download the entire collection in a neatly packed ZIP file.",
    },
    {
      icon: SlidersHorizontal,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      title: "Live Split Inspector",
      description:
        "Compare original and compressed images side-by-side with zoom up to 300% to inspect pixel sharpness, grain, and color fidelity.",
    },
  ];

  return (
    <section className="mt-16 pt-12 border-t border-surface-border/60">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Engineered for Professionals & Creators
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Everything you need for web optimization, photo archiving, and print reproduction.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-surface-card border border-surface-border hover:border-surface-hover hover:bg-surface-card/90 transition-all flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3.5 ${feat.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
