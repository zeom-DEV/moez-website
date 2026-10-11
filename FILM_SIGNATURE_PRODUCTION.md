# MOEZ — FILM SIGNATURE / PRODUCTION

**État au 11 octobre 2026 :** teaser monté (12,5 s, 1280x720, H.264 + AAC), film de 24 secondes en cours de production.

## Ce qui est réellement prêt
- Un premier plan filmé par Google Flow (Moez répond au téléphone et se lève, 8 s brut, environ 5,5 s utiles après coupe).
- Un teaser publicitaire monté en noir et blanc avec transitions typographiques, sound design original et une voix française enregistrée authentiquement.
- Le parcours technique sur la branche `refonte-signature-preview-20261010` : intro inversée → film immersif → prise de rendez-vous Calendly / diagnostic.
- Possibilité de passer le film, l'écouter en activant le son, puis revoir depuis la page d'accueil.

## Action nécessaire pour voir le teaser sur GitHub
Le code est commité, **mais le fichier MP4 n'est pas encore présent dans le dépôt**.

Importer le fichier `moez-signature-teaser-12s.mp4` dans le dossier `assets/` sur cette branche uniquement.
Ne pas fusionner `main` avant validation des médias, des parcours et du mobile.
Sans ce fichier, le site doit revenir au diagnostic au lieu de bloquer les visiteurs.

## Plan 2 — Reprise en main (Google Flow, Veo 3.1 Fast, 8 s, 16:9)
**Image de début :** dernière image extraite du plan 1, Moez debout au téléphone dans le même bureau.

**Prompt (anglais pour les instructions de réalisation, aucune voix anglaise demandée) :**

Continue seamlessly from the provided live-action frame. Keep the exact same man Moez, his facial identity, black sweater, lighting, desk, landline telephone and office geography. In a single sophisticated tracking shot, Moez speaks to a customer with decisive conviction while walking a few steps alongside the desk. He gives one sharp, deliberate instruction to a colleague and points to a case being resolved. Two real team members respond with purposeful action. A professional handheld-to-dolly camera arcs from over-the-shoulder into an energetic lateral track, then settles on Moez. Intense but believable sales-floor leadership and physical acting, no movie character imitation. Premium black-and-white contrast, kinetic rhythm, subtle film grain, natural office sounds. No text, captions, logos, invented KPIs or impossible camera movement. No English speech.

## Plan 3 — Maîtrise (Google Flow, Veo 3.1 Fast, 8 s, 16:9)
**Image de début :** extraire le dernier photogramme du vrai plan 2, une fois généré.

**Prompt :**

Continue from the preceding shot without changing Moez's face, wardrobe or location. One continuous cinematic sequence: Moez finishes his call, sets the handset down naturally, gives a quiet reassuring nod to a colleague, and the once-busy office settles into calm coordinated work. The camera shifts from a dynamic medium tracking shot into a precise controlled 50mm close-up. Moez turns toward the lens with calm confidence and holds direct eye contact for 1.5 seconds. Original premium black-and-white commercial cinematography, realistic human movements, subtle breathing and eye expressions, elegant shadow detail and intentional silence at the end. No dialogue required; French voiceover is added in editing. No text, logos or fake statistics.

## Montage final envisagé
0–5,5 s : véritable plan 1 après suppression du portrait statique.
5,5–13,5 s : véritable plan 2 (à générer).
13,5–21,5 s : véritable plan 3 (à générer).
21,5–24 s : signature graphique "MOEZ" et CTA HTML réel "Réserver 30 minutes".

L'authenticité des personnages de bureau doit être présentée comme **mise en scène publicitaire avec IA**, et non comme preuve de résultats ou images de collaborateurs réels.

## Contrôles avant publication
- Vérifier continuité du visage, mains, téléphone et bureau sur les trois plans.
- Vérifier son et sous-titres français.
- Sur site: autoplay muet, activation du son, bouton Passer, `prefers-reduced-motion`, fin avec Calendly.
- Mesurer LCP/CLS et taux de clic Calendly sur l'URL de préproduction.
- Ne pas publier de faux résultats quantifiés ni de témoignages inventés.
