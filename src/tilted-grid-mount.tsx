import * as React from "react";
import { createRoot } from "react-dom/client";
import { TiltedGridHero, type TiltedGridImage } from "@/components/ui/tilted-grid-hero";
import "./styles.css";
import "./tilted-grid.css";

// Original project photographs: no unknown stock URLs, credits or external requests.
const images: TiltedGridImage[] = [
  { src: "/assets/orbit-photos/web-desktop.webp", alt: "Création de sites internet" },
  { src: "/assets/orbit-photos/sav-desktop.webp", alt: "Service client" },
  { src: "/assets/orbit-photos/prospects-desktop.webp", alt: "Échanges professionnels" },
  { src: "/assets/moez-portrait-900.webp", alt: "Présentation et collaboration" },
  { src: "/assets/orbit-photos/crm-desktop.webp", alt: "Dossiers clients" },
  { src: "/assets/orbit-photos/automation-desktop.webp", alt: "Automatisation" }
];

function MotionGallery() {
  React.useEffect(() => {
    const stage = document.getElementById("collection-stage");
    if (!stage) return;
    stage.classList.add("has-tilted-grid");
    document.getElementById("solutions")?.classList.add("is-tilted-ready");
    stage.dispatchEvent(new Event("mt:tilted-grid-ready", { bubbles: true }));
    return () => {
      stage.classList.remove("has-tilted-grid");
      document.getElementById("solutions")?.classList.remove("is-tilted-ready");
    };
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
      <span className="tgh-sculpture-caption" aria-hidden="true">DES IMAGES EN MOUVEMENT • SIX EXPERTISES</span>
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
