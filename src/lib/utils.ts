import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format bytes into human-readable string (KB, MB, GB)
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  return `${val} ${sizes[i]}`;
}

/**
 * Calculate file name for compressed download
 */
export function getOutputFilename(
  originalName: string,
  targetMime: string,
  suffix = "_compressed"
): string {
  const lastDot = originalName.lastIndexOf(".");
  const base = lastDot !== -1 ? originalName.substring(0, lastDot) : originalName;

  let ext = "jpg";
  if (targetMime === "image/webp") ext = "webp";
  else if (targetMime === "image/png") ext = "png";
  else if (targetMime === "image/avif") ext = "avif";
  else if (targetMime === "image/jpeg" || targetMime === "image/jpg") ext = "jpg";
  else if (lastDot !== -1) ext = originalName.substring(lastDot + 1);

  return `${base}${suffix}.${ext}`;
}

/**
 * Download a blob cleanly with filename
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Returns physical print size at a given DPI in inches and cm
 */
export function getPrintDimensions(
  width: number,
  height: number,
  dpi: number = 300
): { inches: string; cm: string } {
  const widthInches = (width / dpi).toFixed(1);
  const heightInches = (height / dpi).toFixed(1);

  const widthCm = ((width / dpi) * 2.54).toFixed(1);
  const heightCm = ((height / dpi) * 2.54).toFixed(1);

  return {
    inches: `${widthInches}″ × ${heightInches}″`,
    cm: `${widthCm} × ${heightCm} cm`,
  };
}
