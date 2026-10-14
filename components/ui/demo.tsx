"use client";

import { TiltedGridHero, type TiltedGridImage } from "@/components/ui/tilted-grid-hero";

// Reference demonstration: existing project imagery, not third-party branded assets.
const IMAGES: TiltedGridImage[] = [
  { src: "/assets/orbit-photos/web-desktop.webp", alt: "Création de sites internet" },
  { src: "/assets/orbit-photos/sav-desktop.webp", alt: "Service client" },
  { src: "/assets/orbit-photos/avis-desktop.webp", alt: "Avis clients" },
  { src: "/assets/orbit-photos/prospects-desktop.webp", alt: "Appels et relances" },
  { src: "/assets/orbit-photos/crm-desktop.webp", alt: "Gestion des dossiers clients" },
  { src: "/assets/orbit-photos/automation-desktop.webp", alt: "Automatisation" },
];

export default function TiltedGridHeroDemo() {
  return (
    <TiltedGridHero
      images={IMAGES}
      className="h-[560px] w-full rounded-lg border border-border bg-background"
    >
      <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-between py-12 text-center">
        <div className="px-6">
          <h1 className="text-balance text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            Chaque mouvement,
            <br />une autre perspective.
          </h1>
        </div>
        <p className="max-w-md text-balance px-6 text-sm text-muted-foreground">
          Une galerie cylindrique fluide qui donne vie aux six expertises.
        </p>
      </div>
    </TiltedGridHero>
  );
}
