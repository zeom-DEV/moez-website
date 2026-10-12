# Moez — Hero Carousel React Preview

This is an **isolated Vite/React/TypeScript/Tailwind/shadcn-compatible project**. The existing static HTML/CSS/JS website at the repository root is unaffected.

## Run locally

```bash
cd experiments/hero-carousel
npm install
npm run dev
npm run build
```

## shadcn setup / usage

The existing repository is **not** a shadcn project. This isolated app already provides a conventional shadcn project structure, aliases, Tailwind CSS, TSX and `components.json`. If starting from a blank folder instead:

```bash
npx shadcn@latest init
npm install framer-motion
```

Keep reusable components under **`components/ui/`**, the standard shadcn location. The aliases in `components.json` and `tsconfig.json` make `@/components/ui/hero-carousel` and `@/lib/utils` resolve correctly. Keeping them there also allows future shadcn CLI commands to add components without misplaced imports.

For a manual setup, install React + TypeScript, Tailwind 3, PostCSS and autoprefixer, then follow `tailwind.config.ts`, `src/index.css`, and `vite.config.ts` here.

## Integration status

- Source: `components/ui/hero-carousel.tsx` (supplied component, malformed newline literals repaired).
- Demo: `src/App.tsx` (the **six real Moez services**, not fictional event cards).
- Background artwork references the current published service illustrations at `https://moezthabet.com/assets/service-wheel/`.
- This preview is not mounted in the public `index.html`. Only after explicit approval should its production bundle be connected to the existing site's offer navigator.
- The original component has no offer CTA, so the demo places one below the carousel.
- Respect motion reduction, keyboard, touch, hover, and drag.
- Verify at mobile and desktop sizes before merge. No changes to `main` or the public domain.
