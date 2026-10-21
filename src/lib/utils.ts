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

/**
 * Map MIME type to a short human-readable uppercase format label
 */
export function getFormatLabel(mime: string): string {
  switch (mime) {
    case "image/jpeg":
    case "image/jpg":
      return "JPG";
    case "image/png":
      return "PNG";
    case "image/webp":
      return "WEBP";
    case "image/avif":
      return "AVIF";
    case "image/bmp":
      return "BMP";
    case "image/x-icon":
    case "image/vnd.microsoft.icon":
    case "image/ico":
      return "ICO";
    case "application/pdf":
      return "PDF";
    case "image/gif":
      return "GIF";
    case "image/svg+xml":
      return "SVG";
    default:
      if (mime.startsWith("image/")) {
        return mime.replace("image/", "").toUpperCase();
      }
      return mime.toUpperCase();
  }
}

/**
 * Get extension string for a target MIME type
 */
export function getExtensionForMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
    case "image/jpg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/avif":
      return "avif";
    case "image/bmp":
      return "bmp";
    case "image/x-icon":
    case "image/vnd.microsoft.icon":
    case "image/ico":
      return "ico";
    case "application/pdf":
      return "pdf";
    case "image/gif":
      return "gif";
    case "image/svg+xml":
      return "svg";
    default:
      return "jpg";
  }
}

/**
 * Get converted output filename with the new extension
 */
export function getConvertedFilename(originalName: string, targetMime: string): string {
  const lastDot = originalName.lastIndexOf(".");
  const base = lastDot !== -1 ? originalName.substring(0, lastDot) : originalName;
  const ext = getExtensionForMime(targetMime);
  return `${base}.${ext}`;
}

/**
 * Copy image blob to clipboard (when supported)
 */
export async function copyBlobToClipboard(blob: Blob): Promise<boolean> {
  try {
    if (!navigator.clipboard || !window.ClipboardItem) return false;
    // Standard clipboard items usually require image/png
    let pngBlob = blob;
    if (blob.type !== "image/png") {
      // Convert to PNG for clipboard compatibility
      const img = new Image();
      const url = URL.createObjectURL(blob);
      img.src = url;
      await new Promise((res, rej) => {
        img.onload = () => res(true);
        img.onerror = rej;
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return false;
      ctx.drawImage(img, 0, 0);
      pngBlob = await new Promise<Blob>((res, rej) =>
        canvas.toBlob((b) => (b ? res(b) : rej()), "image/png")
      );
      URL.revokeObjectURL(url);
    }
    await navigator.clipboard.write([
      new window.ClipboardItem({
        [pngBlob.type]: pngBlob,
      }),
    ]);
    return true;
  } catch (err) {
    console.error("Clipboard copy failed:", err);
    return false;
  }
}

