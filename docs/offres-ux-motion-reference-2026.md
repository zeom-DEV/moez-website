# MOEZ — Référentiel A, B et C
11 octobre 2026 · Prévisualisation uniquement

## A. Textes commerciaux des cinq offres

### 01 / SAV e-commerce & service client
**Promesse :** Vos clients attendent une réponse. Je prends le relais.
**Le problème :** Messages sans réponse, réclamations qui s'accumulent, retours difficiles à suivre.
**Mon intervention :** Je réponds aux demandes dans vos outils autorisés, assure le suivi des commandes et réclamations selon vos procédures, organise la priorisation et documente les dossiers sensibles.
**Ce que vous obtenez :** Un suivi plus clair pour vos clients et votre équipe, avec les informations utiles au bon endroit. Aucun délai ni taux de satisfaction garanti avant cadrage.
**Formats :** Mission ponctuelle ou renfort régulier, sur devis.
**CTA final :** « Parlons de votre SAV »
**Introduction au CTA :** « En 30 minutes, décrivez-moi vos demandes, vos outils et votre volume d'activité. Nous définirons les étapes possibles. »
**Page :** sav-ecommerce.html

### 02 / Avis clients & e-réputation
**Promesse :** Votre réputation mérite une écoute organisée.
**Le problème :** Avis dispersés, retours sous-exploités et causes d'insatisfaction mal identifiées.
**Mon intervention :** Je suis les retours, organise les invitations neutres aux avis authentiques quand cela est autorisé, et remonte les problèmes récurrents aux équipes.
**Ce que vous obtenez :** Une meilleure visibilité sur les retours et une base concrète d'amélioration. Aucun avis acheté, aucune sélection des seuls clients satisfaits, aucune note promise.
**Formats :** Mission de cadrage ou suivi régulier, sur devis.
**CTA final :** « Améliorons le suivi de vos avis »
**Introduction au CTA :** « Identifions les plateformes, les retours prioritaires et votre méthode actuelle. »
**Page :** e-reputation.html

### 03 / Télévente, qualification & relances
**Promesse :** Une opportunité ne doit pas disparaître faute de suivi.
**Le problème :** Demandes non qualifiées, relances oubliées, manque de visibilité sur l'étape suivante.
**Mon intervention :** J'écoute, qualifie les besoins, réalise des relances dans le cadre autorisé et trace les échanges et les prochaines actions dans le CRM.
**Ce que vous obtenez :** Un meilleur suivi commercial et des informations exploitables pour décider. Aucune conversion ni vente garantie.
**Formats :** Campagne ponctuelle ou soutien récurrent, sur devis.
**CTA final :** « Parlons de vos prospects »
**Introduction au CTA :** « Faisons le point sur vos demandes entrantes, votre méthode de qualification et vos relances. »
**Page :** televente.html

### 04 / CRM, reporting & back-office
**Promesse :** Des données claires. Des actions qui ne se perdent plus.
**Le problème :** Informations dispersées, tâches difficiles à suivre, reporting peu lisible.
**Mon intervention :** Je structure et mets à jour les informations dans vos outils autorisés, documente les étapes de traitement et prépare un suivi adapté aux indicateurs définis ensemble.
**Ce que vous obtenez :** Des dossiers plus faciles à suivre et une meilleure visibilité opérationnelle. Les intégrations et automatisations sont définies au cas par cas.
**Formats :** Remise en ordre ponctuelle ou appui continu, sur devis.
**CTA final :** « Structurons votre suivi »
**Introduction au CTA :** « Montrez-moi votre organisation et ce qui est difficile à retrouver ou à mesurer. »
**Page :** crm-reporting.html

### 05 / Sites Signature & expérience web
**Promesse :** Un site qui présente clairement votre valeur et donne envie d'aller plus loin.
**Le problème :** Offre incomprise, design générique, navigation confuse, parcours de contact invisible.
**Mon intervention :** Je conçois un scénario et une identité visuelle cohérents, des pages lisibles sur mobile, des animations utiles et un parcours commercial relié à vos offres. SEO et mesure sont cadrés selon le projet.
**Ce que vous obtenez :** Une expérience web propre à votre activité, avec des offres claires et un chemin vers le contact. Aucun résultat commercial garanti sans mesure.
**Formats :** Projet sur mesure, sur devis.
**CTA final :** « Parlons de votre projet web »
**Introduction au CTA :** « Parlez-moi de votre public, de votre activité et de l'action attendue sur votre site. »
**Page :** site-signature.html

## B. Structure UX de la page d'accueil et des pages détaillées

1. Intro : site à l'envers et film d'ambiance silencieux si l'autoplay est possible ; notification après ~1,7 s ; un bouton « REMETTRE LE SITE À L'ENDROIT », puis film avec son déclenché par le clic.
2. Fin de film : titre « Voici les 5 façons dont je peux vous aider. », sous-texte court et UN SEUL CTA « DÉCOUVRIR MES SOLUTIONS » menant aux cinq offres. Aucune réservation ici.
3. Accueil : titre simple « Comment puis-je vous aider ? » puis cinq cartes immédiatement visibles. Chaque carte = nom compréhensible + problème en une phrase + action de Moez en une phrase. Carte entière cliquable ; aucun filtre ou diagnostic concurrent.
4. Page détaillée : « ← Retour aux 5 offres », promesse, pour qui, problème, tâches concrètes, résultat de suivi attendu (sans chiffres inventés), méthode en trois étapes, puis CTA spécifique à l'offre avec justification de l'échange de 30 minutes.
5. Bas des pages : lien de retour explicite et les quatre autres offres accessibles directement. Plus bas sur l'accueil : « Comment je travaille » puis contact général.
6. Mobile : cartes en une colonne, contenu immédiatement intelligible à 360 px, 390 px et 412 px ; aucune action ne nécessite le survol ; navigation arrière native fonctionnelle.
7. Identification publique : uniquement « Moez » dans l'interface et les textes publics. Les tarifs demeurent « sur devis » tant qu'ils ne sont pas approuvés.

## C. Cahier des charges de développement et motion design

### Direction visuelle
- Noir profond #111111, blanc doux #F7F7F6, bordeaux #9F2840 pour le signal d'ouverture et quelques états interactifs.
- Police sans-serif lisible ; aucun titre critique en script fin. Corps de texte mobile à 16 px minimum, interligne généreux.
- Contrastes conformes WCAG AA à tester ; cible tactile d'au moins 44 x 44 px ; focus clavier visible.

### Motion qui raconte les offres
- Intro : vraie vidéo en mouvement et site inversé, notification qui atterrit, halo bordeaux doux autour du CTA noir.
- SAV : tickets qui passent de « non traité » à « suivi en cours » à « dossier documenté » (illustration sans données réelles).
- E-réputation : retour client qui chemine de « reçu » à « analysé » à « action », sans fausse note ni étoiles trompeuses.
- Prospection : dossier de prospect « nouveau → qualifié → relance prévue », sans taux inventé.
- CRM : champs dispersés qui s'alignent en tableau de suivi clair, sans informations personnelles réelles.
- Web : structure confuse qui devient une page lisible avec un appel à l'action visible.
- Mouvement de 350 à 650 ms pour les transitions interactives ; entrées de section discrètes ; légère translation des flèches de 2 à 4 px. Chaque effet doit clarifier un processus, pas uniquement décorer.

### Comportements robustes
- Ne pas laisser deux vidéos lourdes décoder simultanément sur mobile. Vidéo d'intro muette optimisée et fallback poster si l'autoplay est interdit.
- Audio du film lancé au clic utilisateur seulement, bouton couper le son toujours accessible.
- Échec de vidéo : accès direct au bouton unique de découverte, pas d'écran bloqué.
- Accessibilité : contrôles au clavier, ARIA pour les scénarios, priorité au contenu, respect de prefers-reduced-motion.
- Préférer transform et opacity, limiter les filtres et les animations coûteuses ; garder un état statique lisible sans JavaScript.
- Objectifs techniques à mesurer, non résultats garantis : LCP inférieur à 2,5 s, CLS inférieur à 0,1, INP inférieur à 200 ms.

### Acceptation et mise en ligne
- Un seul CTA après le film : « Découvrir mes solutions ».
- Cinq offres visibles en haut de l'accueil après le film ; chacune cliquable et reliée à sa page.
- Chaque offre expliquée se conclut par un CTA dédié et compréhensible.
- Chaque page possède « Retour aux 5 offres » et quatre autres liens de service en bas.
- Motion narratif distinct pour chacun des cinq services, réduit si l'utilisateur désactive les animations.
- Vérifier les clics, le film, le son, les erreurs réseau, Calendly et la navigation privée sur Chrome/Brave Android et navigateur desktop.
- Aucun lien interne cassé, aucun chiffre commercial inventé, aucune donnée client confidentielle.
- Modifications uniquement sur refonte-signature-preview-20261010 ; aucun changement de main ni du site public sans accord.
