"use client";

import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdPlaceholderProps {
  /** 10-digit AdSense ad unit slot ID */
  slot?: string;
  /** Responsive ad format: auto, horizontal, rectangle */
  format?: "auto" | "horizontal" | "rectangle";
  className?: string;
  label?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  slot = "1000000001",
  format = "auto",
  className = "",
  label = "Advertisement",
}) => {
  const isPushedRef = useRef(false);

  useEffect(() => {
    if (isPushedRef.current) return;
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isPushedRef.current = true;
      }
    } catch {
      // Ignore adsbygoogle errors in development / before approval
    }
  }, []);

  return (
    <aside
      aria-label="Advertisement"
      className={`w-full overflow-hidden flex flex-col items-center justify-center my-8 ${className}`}
    >
      <div className="w-full max-w-5xl rounded-xl border border-dashed border-surface-border/60 bg-surface-card/30 p-2.5 sm:p-4 flex flex-col items-center justify-center min-h-[100px] text-center transition-colors hover:border-surface-border">
        {label && (
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-2 select-none">
            {label}
          </span>
        )}
        <div className="w-full flex justify-center overflow-hidden">
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%", minWidth: "250px" }}
            data-ad-client="ca-pub-3706001002085899"
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </aside>
  );
};
