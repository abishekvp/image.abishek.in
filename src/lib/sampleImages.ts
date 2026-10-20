export interface SampleImage {
  name: string;
  label: string;
  description: string;
  url: string;
  type: string;
}

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    name: "emerald-mountains-hd.jpg",
    label: "4K Mountain Landscape",
    description: "Vibrant colors & high dynamic range (Great for HD Print & Landscape test)",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=90",
    type: "image/jpeg",
  },
  {
    name: "architectural-minimalism.jpg",
    label: "Modern Architecture",
    description: "Sharp geometric lines & high contrast (Ideal for testing edge preservation)",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2400&q=90",
    type: "image/jpeg",
  },
  {
    name: "macro-neon-abstract.png",
    label: "Neon Art & Gradients",
    description: "Deep blacks, transparency and vivid gradients (Best for WebP / PNG)",
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=2000&q=90",
    type: "image/png",
  },
];
