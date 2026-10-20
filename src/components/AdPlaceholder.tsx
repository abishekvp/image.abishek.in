import React from "react";

interface AdPlaceholderProps {
  slot?: string;
  format?: "horizontal" | "rectangle";
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  format = "horizontal",
  className = "",
}) => {
  return (
    <div
      className={`w-full overflow-hidden flex flex-col items-center justify-center my-6 ${className}`}
    >
      <div className="w-full max-w-4xl p-2.5 rounded-xl border border-dashed border-surface-border/60 bg-surface-card/30 flex flex-col items-center justify-center min-h-[90px] text-center">
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium mb-1">
          Advertisement
        </span>
        <div className="text-xs text-slate-500">
          Google AdSense Unit (Publisher ID: pub-3706001002085899)
        </div>
      </div>
    </div>
  );
};
