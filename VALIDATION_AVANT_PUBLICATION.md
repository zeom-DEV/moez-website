# Refonte Signature — Validation avant mise en ligne

Version de démonstration de `moezthabet.com` sur la branche `refonte-signature-preview-20261010`.

## Contrôles prioritaires
- Vérifier les références professionnelles et toutes les allégations du parcours.
- Compléter les mentions légales du statut indépendant, et vérifier les obligations applicables depuis la Tunisie.
- Tester la réservation Calendly sur iPhone, Android et ordinateur (iframe desktop, lien externe mobile).
- Vérifier le formulaire : génération du brief local puis ouverture de l'application e-mail. Aucun envoi serveur automatique.
- Auditer les contrastes, la navigation au clavier et les performances de l'URL de prévisualisation.
- Vérifier les données structurées, sitemap et indexation une fois le site publié.
- Installer un suivi respectueux de la vie privée avant toute mesure réelle des conversions.
- Ne pas présenter les objectifs QS, CSAT, avis clients, 40 dossiers ou 10% comme des réalisations prouvées sans validation.
- Vérifier que les invitations à déposer un avis respectent les règles de chaque plateforme.

## Déploiement
Ne pas fusionner sans validation explicite du propriétaire.
Le domaine personnalisé est dans `CNAME` existant, sur `main`.
Les fichiers statiques fonctionnent sur GitHub Pages sans build Node ni backend.
