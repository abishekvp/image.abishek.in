# Compressor Pro — image.abishek.in

> The Next-Generation In-Browser Image Compressor & 300 DPI HD Print Studio.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and modern **HTML5 Canvas / Web APIs**. Engineered for speed, 100% client-side privacy, and zero server upload limits.

Hosted at: [image.abishek.in](https://image.abishek.in) (Ready for Vercel deployment)

---

## 🌟 Key Features

### 1. 🌟 HD Print Ready (300 DPI)
- **True 300 DPI Metadata Injection**: Automatically injects JFIF APP0 (for JPEG) and `pHYs` chunks (for PNG) so desktop photo viewers, Adobe Photoshop, InDesign, and commercial photo labs recognize the exact 300 DPI physical print density.
- **Unsharp Mask Clarity Filter**: Fine-tuned 3×3 convolution filter preserves high-frequency edge sharpness, preventing ink-bleed softening during physical paper printing.
- **Physical Print Size Calculator**: Live calculation of print dimensions in inches and centimeters (e.g. `13.4″ × 10.1″ at 300 DPI`).

### 2. ⚡ Multi-Format Modern Encoders
- **WebP & AVIF**: Next-generation web compression saving up to 85% compared to standard JPEGs.
- **JPEG**: Universal compatibility with selectable quality quantization.
- **PNG**: Lossless compression retaining alpha transparency and graphic crispness.

### 3. 🎯 Target File Size Solver (Binary Search)
- Need an image under 200 KB, 500 KB, or 1 MB for government portals, visa applications, or upload caps?
- The automated binary search solver iteratively optimizes quality and dimensions to guarantee output stays under your exact KB ceiling.

### 4. 🔍 Interactive Split-Screen & Side-by-Side Inspector
- Drag the split divider to visually compare the uncompressed original vs compressed output in real-time.
- Multi-level zoom (100% pixel-to-pixel, 200%, 300%) to inspect pixel grain, chromatic clarity, and edge retention.

### 5. 🗜️ Batch Processing & ZIP Export
- Drag and drop dozens of images or paste directly from your clipboard (`Ctrl+V`).
- Parallel multi-threaded canvas processing.
- One-click **"Download All as ZIP"** powered by JSZip.

### 6. 🔒 100% Client-Side Privacy
- Your photos **never leave your device**. All processing runs directly in your browser.
- No upload bandwidth lag, no server storage, and no artificial file size caps.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (tested on Node 24)
- pnpm (or npm / yarn)

### Installation
```bash
# Clone the repository
git clone https://github.com/abishekvp/image.abishek.in.git
cd image.abishek.in

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build
```bash
pnpm build
pnpm start
```

---

## ☁️ Deploy to Vercel

This project is tailored specifically for zero-configuration deployment on **Vercel**:
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Framework Preset: **Next.js**
3. Root Directory: `./`
4. Click **Deploy**.
5. Assign your custom domain `image.abishek.in` in the Vercel project settings.

`public/ads.txt` is pre-configured and served automatically at `/ads.txt` for Google AdSense monetization.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, React 19)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Compression**: HTML5 Canvas, OffscreenCanvas, WebCodecs, Native Encoders
- **Batch ZIP**: JSZip
- **DPI Metadata**: Custom JFIF APP0 & PNG `pHYs` binary chunk injectors

---

## 📄 License

MIT License. Designed and maintained for `abishek.in`.
