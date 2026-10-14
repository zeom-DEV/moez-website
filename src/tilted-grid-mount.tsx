import * as React from "react";
import { createRoot } from "react-dom/client";
import { TiltedGridHero, type TiltedGridImage } from "@/components/ui/tilted-grid-hero";
import "./styles.css";
import "./tilted-grid.css";

// Original project photographs: no unknown stock URLs, credits or external requests.
const images: TiltedGridImage[] = [
  { src: "/assets/orbit-photos/web-desktop.webp", alt: "Création de sites internet" },
  { src: "/assets/orbit-photos/sav-desktop.webp", alt: "Service client" },
  { src: "/assets/orbit-photos/avis-desktop.webp", alt: "Avis clients" },
  { src: "/assets/orbit-photos/prospects-desktop.webp", alt: "Appels et relances" },
  { src: "/assets/orbit-photos/crm-desktop.webp", alt: "Dossiers clients" },
  { src: "/assets/orbit-photos/automation-desktop.webp", alt: "Automatisation" }
];

function MotionGallery() {
  React.useEffect(() => {
    const stage = document.getElementById("collection-stage");
    if (!stage) return;
    stage.classList.add("has-tilted-grid");
    stage.dispatchEvent(new Event("mt:tilted-grid-ready", { bubbles: true }));
    return () => stage.classList.remove("has-tilted-grid");
  }, []);

  return (
    <TiltedGridHero
      images={images}
      speed={2.8}
      tileHeight={62}
      aspectRatio={1.38}
      gap={10}
      axis={51}
      curve={48}
      fade={7}
      className="tgh-live relative h-full w-full overflow-hidden"
    >
      <div className="tgh-editorial-overlay" aria-hidden="true">
        <span className="tgh-editorial-index">ÉDITION 2026 / SIX EXPERTISES</span>
        <span className="tgh-editorial-line" />
        <span className="tgh-editorial-instruction">
          Un mouvement continu. Des solutions concrètes.
        </span>
      </div>
    </TiltedGridHero>
  );
}

const mount = document.getElementById("tilted-grid-root");
if (mount) {
  const root = createRoot(mount);
  root.render(
    <React.StrictMode>
      <MotionGallery />
    </React.StrictMode>
  );
}
