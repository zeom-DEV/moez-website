"use client";

import { TiltedGridHero, type TiltedGridImage } from "@/components/ui/tilted-grid-hero";

// Unsplash image set for the standalone component demo.
// The integrated production-facing section uses the project's own photographs.
const images: TiltedGridImage[] = [
  { src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80", alt: "Workspace with computer" },
  { src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80", alt: "Creative team collaborating" },
  { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80", alt: "Business analytics" },
  { src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80", alt: "Professional interior" },
  { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80", alt: "Data analytics dashboard" },
  { src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80", alt: "Customer service environment" }
];

export default function TiltedGridHeroDemo() {
  return (
    <TiltedGridHero
      images={images}
      speed={4}
      className="h-[560px] w-full rounded-lg border border-border bg-background"
    >
      <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-between py-12 text-center">
        <h1 className="px-6 text-balance text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
          Every frame,
          <br /> brought into focus.
        </h1>
        <p className="max-w-md px-6 text-balance text-sm text-muted-foreground">
          Images curve in from one edge, flatten out at the centre, then fade around the other.
        </p>
      </div>
    </TiltedGridHero>
  );
}
