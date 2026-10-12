import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { HeroCarousel, type HeroCarouselItem } from "@/components/ui/hero-carousel"
import "./hero-carousel.css"

const ROOT = "https://moezthabet.com"
const CALENDLY = "https://calendly.com/moez-thabet-881988/30min"

// Licensed illustrative photographs. These do not imply past client projects.
const photographIds: Record<string, string> = {
  web: "photo-1778146476147-5f8d4bd03c79",
  sav: "photo-1712159018726-4564d92f3ec2",
  avis: "photo-1633613286991-611fe299c4be",
  prospects: "photo-1758876204242-787309002a8f",
  crm: "photo-1770681381576-f1fdceb2ea01",
  automation: "photo-1773966071293-bea3d7646fd1",
}
const photo = (id: string) =>
  "https://images.unsplash.com/" + photographIds[id] + "?auto=format&fit=crop&w=720&h=1000&q=76"

const services = [
  {
    id: "web",
    name: "Sites internet",
    title: "Votre activité.\nUne présence remarquable.",
    kicker: "CONCEPTION WEB — OFFRE PHARE",
    detail: "Je crée des sites qui expliquent votre activité, inspirent confiance et guident les visiteurs vers la prise de contact. Chaque page doit avoir un rôle clair.",
    deliverable: "Un site responsive publié, avec ses interactions et son parcours de contact vérifiés.",
    stages: ["Comprendre l'activité", "Créer l'expérience", "Tester et publier"],
    accent: "#e6b288",
    anchor: "solution-web",
  },
  {
    id: "sav",
    name: "Service client",
    title: "Une vraie réponse.\nÀ chaque demande.",
    kicker: "ASSISTANCE & RELATION CLIENT",
    detail: "Je prends en charge les messages et demandes clients selon vos procédures. Chaque échange est documenté et les situations complexes remontées au bon interlocuteur.",
    deliverable: "Des demandes traitées et un suivi clair des dossiers restant ouverts.",
    stages: ["Recevoir la demande", "Répondre et traiter", "Assurer le suivi"],
    accent: "#9bcbbb",
    anchor: "solution-sav",
  },
  {
    id: "avis",
    name: "Avis clients",
    title: "Les avis parlent.\nJe vous aide à écouter.",
    kicker: "E-RÉPUTATION & AMÉLIORATION",
    detail: "Je centralise vos avis, prépare des réponses adaptées et repère les difficultés récurrentes. Les retours deviennent des informations utiles pour vos décisions.",
    deliverable: "Des réponses préparées et une synthèse des sujets à améliorer.",
    stages: ["Recueillir les avis", "Préparer les réponses", "Identifier les tendances"],
    accent: "#ddbc8b",
    anchor: "solution-avis",
  },
  {
    id: "prospects",
    name: "Appels et relances",
    title: "Chaque contact.\nUne prochaine action.",
    kicker: "PROSPECTION & SUIVI",
    detail: "Je qualifie les besoins de vos contacts, prépare les relances et documente les échanges. Vous savez où en est chaque opportunité.",
    deliverable: "Des contacts suivis, avec leurs besoins et leurs prochaines étapes.",
    stages: ["Échanger et qualifier", "Documenter l'échange", "Organiser la relance"],
    accent: "#c3add6",
    anchor: "solution-prospects",
  },
  {
    id: "crm",
    name: "Dossiers clients",
    title: "Moins de désordre.\nPlus de maîtrise.",
    kicker: "CRM & ORGANISATION",
    detail: "Je complète les fiches clients, mets à jour les tâches et les échéances, et organise les informations pour que votre équipe retrouve rapidement le fil.",
    deliverable: "Des dossiers structurés et un tableau de suivi à jour.",
    stages: ["Vérifier les dossiers", "Structurer les données", "Mettre le suivi à jour"],
    accent: "#abc7de",
    anchor: "solution-crm",
  },
  {
    id: "automation",
    name: "Automatisation",
    title: "Vos outils connectés.\nVotre temps retrouvé.",
    kicker: "WORKFLOWS & PRODUCTIVITÉ",
    detail: "Je relie les outils que vous utilisez déjà et construis des scénarios fiables pour les tâches répétitives, avec tests et suivi des erreurs.",
    deliverable: "Un premier workflow testé, documenté et accompagné d'un suivi des erreurs.",
    stages: ["Identifier la routine", "Connecter vos outils", "Tester les automatisations"],
    accent: "#9cccca",
    anchor: "solution-automation",
  },
] as const

const items: HeroCarouselItem[] = services.map((service, i) => ({
  id: service.id,
  title: service.title,
  image: photo(service.id),
  credit: i === 0 ? "MOEZ THABET / CRÉATION WEB — OFFRE PHARE" : "MOEZ THABET / " + service.kicker,
  accent: service.accent,
  meta: [service.kicker],
}))

export function App() {
  const [selected, setSelected] = React.useState(0)
  const [autoplay, setAutoplay] = React.useState(true)
  const current = services[selected]
  const reduced = useReducedMotion()
  const prev = () => setSelected(i => (i + services.length - 1) % services.length)
  const next = () => setSelected(i => (i + 1) % services.length)
  return (
    <div className="signature-preview">
      <header className="signature-preview__header">
        <a href={ROOT} target="_blank" rel="noreferrer" className="signature-preview__logo">
          <span>M<span className="signature-preview__gold">.</span></span>
          <span>MOEZ THABET<small>DIGITAL SERVICES</small></span>
        </a>
        <div className="signature-preview__header-label">
          <i/> EXPÉRIENCE EN PRÉVISUALISATION
        </div>
        <span className="signature-preview__safe">SITE PUBLIC INCHANGÉ</span>
      </header>

      <main>
        <div className="signature-preview__stage" aria-label="Prévisualisation du nouveau carrousel des six services">
          <HeroCarousel
            items={items}
            index={selected}
            onIndexChange={setSelected}
            autoplay={autoplay}
            autoplayDelay={5700}
            brand="MOEZ THABET — SIGNATURE MOTION"
          />
        </div>

        <div className="signature-preview__controller">
          <div className="signature-preview__controller-name">
            <span className="signature-preview__controller-eye">MOUVEMENT PHYSIQUE / 6 CHAPITRES</span>
            <span className="signature-preview__controller-desc">Un service au centre, les autres en mouvement.</span>
          </div>
          <div className="signature-preview__controller-actions">
            <button type="button" onClick={prev} aria-label="Service précédent">←</button>
            <button type="button" onClick={() => setAutoplay(!autoplay)} aria-pressed={autoplay}
              className="signature-preview__pause">
              {autoplay && !reduced ? "Ⅱ  PAUSE" : "▷  LECTURE"}
            </button>
            <button type="button" onClick={next} aria-label="Service suivant">→</button>
          </div>
        </div>

        <section className="signature-preview__focus" aria-labelledby="service-heading">
          <div className="signature-preview__focus-top">
            <span>UNE EXPERTISE. UN RÉSULTAT COMPRÉHENSIBLE.</span>
            <span>{String(selected + 1).padStart(2, "0")} / 06</span>
          </div>
          <div className="signature-preview__focus-grid">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={current.id} className="signature-preview__focus-copy"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={reduced ? { duration: 0 } : { duration: .46, ease: [.22, .7, .22, 1] }}>
                <span className="signature-preview__kicker"><i/> {current.kicker}</span>
                <h1 id="service-heading">{current.name}<span>.</span></h1>
                <p>{current.detail}</p>
                <div className="signature-preview__result"><b>LE LIVRABLE</b><span>{current.deliverable}</span></div>
                <div className="signature-preview__cta-row">
                  <a className="signature-preview__primary" href={ROOT + "/#" + current.anchor} target="_blank" rel="noreferrer">
                    Découvrir cette solution <span>↗</span>
                  </a>
                  <a className="signature-preview__secondary" href={CALENDLY} target="_blank" rel="noreferrer">
                    Parler de mon projet <span>↗</span>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="signature-preview__journey">
              <span className="signature-preview__journey-eye">DE VOTRE BESOIN AU RÉSULTAT</span>
              <div className="signature-preview__journey-stages" key={current.id}>
                {current.stages.map((stage, i) => (
                  <motion.div key={stage} className="signature-preview__step"
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={reduced ? { duration: 0 } : { delay: .10 + i * .1, duration: .42 }}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <strong>{stage}</strong>
                    <span>↗</span>
                  </motion.div>
                ))}
              </div>
              <div className="signature-preview__journey-foot">CONCRET · DOCUMENTÉ · ADAPTÉ À VOTRE PROJET</div>
            </div>
          </div>
          <nav className="signature-preview__chapters" aria-label="Choisir une offre">
            {services.map((service, i) => (
              <button key={service.id} type="button" onClick={() => setSelected(i)}
                aria-pressed={selected === i} className={selected === i ? "active" : ""}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <strong>{service.name}</strong>
                <i>↗</i>
              </button>
            ))}
          </nav>
        </section>
      </main>

      <footer className="signature-preview__footer">
        <b>MOEZ THABET / SIGNATURE MOTION</b>
        <span>Prototype technique isolé · Photographies d'illustration, sans prétention de réalisations clients.</span>
        <span>2026 · PRÉVISUALISATION PRIVÉE</span>
      </footer>
    </div>
  )
}
