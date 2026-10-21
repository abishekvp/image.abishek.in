import React from "react";
import {
  ShieldCheck,
  Printer,
  Zap,
  FolderArchive,
  RefreshCw,
  FileText,
} from "lucide-react";

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: "100% In-Browser Privacy",
      description:
        "Your photos are processed entirely on your device using HTML5 Canvas & WebCodecs. Zero bytes are uploaded to any external server.",
    },
    {
      icon: RefreshCw,
      title: "Universal Format Converter",
      description:
        "Seamlessly convert between JPG, PNG, WebP, AVIF, PDF, ICO, and BMP with intelligent transparency background replacement and custom quality.",
    },
    {
      icon: Printer,
      title: "HD Print Ready (300 DPI)",
      description:
        "Injects physical 300 DPI JFIF and PNG metadata with subtle unsharp masking for razor-sharp photo paper and canvas printing.",
    },
    {
      icon: FileText,
      title: "Image to PDF & Multi-Merge",
      description:
        "Convert single images or combine multiple photos into a neatly formatted, printable multi-page PDF document in seconds.",
    },
    {
      icon: Zap,
      title: "Favicon & Windows ICO Creator",
      description:
        "Turn any square graphic or logo into a valid multi-size Windows icon (.ico) or website favicon with resolutions from 16px to 256px.",
    },
    {
      icon: FolderArchive,
      title: "Parallel Batch Processing & ZIP",
      description:
        "Drop multiple photos at once. Compress or convert in parallel threads and download the entire collection in a neatly packed ZIP file.",
    },
  ];

  return (
    <section className="mt-16 pt-12 border-t border-surface-border">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Engineered for Professionals & Creators
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Everything you need for web optimization, photo archiving, format conversion, and print reproduction.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-xl bg-surface-card border border-surface-border hover:border-slate-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl border border-surface-border bg-surface-subtle flex items-center justify-center mb-3.5 text-blue-400">
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
