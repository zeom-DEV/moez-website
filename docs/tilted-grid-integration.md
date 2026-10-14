# Tilted Grid Hero — intégration React

Le site reste utilisable comme vitrine HTML/CSS/JavaScript. Seule la galerie animée est montée avec React. Si le module ne charge pas, l'ancien carrousel demeure comme solution de repli.

## Structure

- `/components/ui/tilted-grid-hero.tsx` : composant React original adapté de Ruixen UI (16 facettes, flux cylindrique, ResizeObserver, animation CSS).
- `/components/ui/demo.tsx` : démonstration autonome avec photographies Unsplash.
- `/src/tilted-grid-mount.tsx` : intégration des six services, avec les photographies du projet.
- `/src/styles.css` : classes utilitaires Tailwind.
- `/src/tilted-grid.css` : style de composition noir et blanc et bascule progressive depuis l'ancien carrousel.
- `/lib/utils.ts` : fonction `cn` (clsx + tailwind-merge).
- `/components.json` : configuration shadcn, alias `@/components/ui`.
- `/scripts/copy-static.mjs` : conserve les photos, les pages statiques et le film MP4 dans `dist`.

## Installation

```bash
npm install
npm run typecheck
npm run dev
npm run build
```

Le code utilise React 18, TypeScript 5, Tailwind CSS 3 et Vite 6. Les composants shadcn doivent être placés dans **`/components/ui`** pour respecter le chemin des imports `@/components/ui/...`; ce chemin est déclaré dans `tsconfig.json` et `components.json`.

Le projet a déjà les fichiers nécessaires à shadcn. Si vous démarrez un **nouveau** dépôt à partir de zéro, exécutez `npx shadcn@latest init`, choisissez Tailwind et TypeScript et conservez l'alias `@/components/ui`. N'exécutez pas `init` sur cette branche sans revoir les fichiers existants.

## Contrôles avant publication

1. Tester l'introduction inversée, le redressement et la lecture du film.
2. Confirmer le défilement automatique continu du Tilted Grid, sans ancien carrousel visible par-dessus.
3. Vérifier que les six catégories restent accessibles au clavier et au toucher.
4. Vérifier 320, 375, 768, 1280 et 1920 px, y compris le mode paysage.
5. Vérifier `prefers-reduced-motion` et l'absence de débordement horizontal.

Le composant est décoratif (`aria-hidden`). Les catégories et les descriptions des services conservent leur propre navigation accessible.
