import * as React from "react"
import { HeroCarousel, type HeroCarouselItem } from "@/components/ui/hero-carousel"

const ROOT = "https://moezthabet.com"
const art = (id: string) => ROOT + "/assets/service-wheel/" + id + ".svg"
const services = [
  {
    id: "web",
    name: "Sites internet",
    title: "Votre activité.\nUn site qui l'explique.",
    kicker: "CRÉATION DE SITES INTERNET — OFFRE PHARE",
    detail: "Un site qui présente clairement votre activité, fonctionne sur mobile et oriente vos visiteurs vers la prise de contact.",
    deliverable: "Un site mis en ligne, avec ses animations et son parcours de contact testés.",
    accent: "#ae3955",
    anchor: "solution-web",
  },
  {
    id: "sav",
    name: "Service client",
    title: "Chaque demande.\nUne réponse suivie.",
    kicker: "RELATION CLIENT",
    detail: "Répondre aux e-mails et aux demandes, suivre les dossiers et transmettre les situations qui nécessitent une décision.",
    deliverable: "Des demandes traitées et un récapitulatif des dossiers à suivre.",
    accent: "#16888e",
    anchor: "solution-sav",
  },
  {
    id: "avis",
    name: "Avis clients",
    title: "Vos avis.\nDes enseignements utiles.",
    kicker: "E-RÉPUTATION",
    detail: "Classer les avis, préparer des réponses adaptées et comprendre les problèmes signalés par vos clients.",
    deliverable: "Des réponses préparées et une synthèse des points à améliorer.",
    accent: "#b27832",
    anchor: "solution-avis",
  },
  {
    id: "prospects",
    name: "Appels et relances",
    title: "Chaque contact.\nUne prochaine étape.",
    kicker: "PROSPECTION ET SUIVI COMMERCIAL",
    detail: "Qualifier les prospects, documenter les échanges et organiser les relances dans un cadre convenu.",
    deliverable: "Une liste de contacts suivis, avec leurs besoins et les actions prévues.",
    accent: "#7052bc",
    anchor: "solution-prospects",
  },
  {
    id: "crm",
    name: "Dossiers clients",
    title: "Vos dossiers.\nUn suivi sans friction.",
    kicker: "CRM ET ORGANISATION",
    detail: "Mettre à jour les fiches clients, les tâches, les responsables et les échéances pour retrouver rapidement la prochaine action.",
    deliverable: "Des dossiers structurés et un tableau de suivi lisible.",
    accent: "#3463bb",
    anchor: "solution-crm",
  },
  {
    id: "automation",
    name: "Automatisation",
    title: "Moins de répétition.\nPlus de temps utile.",
    kicker: "AUTOMATISATION DES WORKFLOWS",
    detail: "Relier formulaires, messagerie et CRM, puis tester chaque scénario et prévoir des alertes en cas d'erreur.",
    deliverable: "Un scénario automatisé testé et documenté.",
    accent: "#527961",
    anchor: "solution-automation",
  },
] as const

const items: HeroCarouselItem[] = services.map((s, i) => ({
  id: s.id,
  title: s.title,
  image: art(s.id),
  credit: "MOEZ THABET · SERVICE " + String(i + 1).padStart(2, "0"),
  meta: i === 0 ? ["OFFRE PHARE"] : undefined,
  accent: s.accent,
}))

export function App() {
  const [index, setIndex] = React.useState(0)
  const [autoplay, setAutoplay] = React.useState(false)
  const current = services[index]
  const prev = () => setIndex((value) => Math.max(0, value - 1))
  const next = () => setIndex((value) => Math.min(services.length - 1, value + 1))
  return (
    <div>
      <header className="preview-header">
        <div className="flex items-center gap-3">
          <strong className="text-3xl tracking-[-.13em]">M<span className="text-rose-600">.</span></strong>
          <div><b className="block text-xs tracking-[.16em]">MOEZ THABET</b>
            <span className="block text-[9px] font-semibold tracking-[.2em] text-neutral-500">EXPLORATION DES SIX OFFRES</span></div>
        </div>
        <span className="rounded-full border border-stone-300 px-3 py-2 text-[10px] font-semibold tracking-[.12em] text-stone-600">PROTOTYPE PRIVÉ · NON PUBLIÉ</span>
      </header>
      <section aria-label="Nouvelle présentation interactive des six offres">
        <div className="h-[68svh] min-h-[460px] w-full md:h-[76svh] md:min-h-[570px]">
          <HeroCarousel
            items={items} index={index} onIndexChange={setIndex}
            autoplay={autoplay} autoplayDelay={4500}
            brand="MOEZ · SIX SOLUTIONS"
          />
        </div>
      </section>
      <section className="preview-section" aria-label="Détails de l'offre sélectionnée">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-300 pb-5">
          <span className="text-[11px] font-extrabold tracking-[.18em] text-rose-700">UNE OFFRE AU CENTRE · SIX POSSIBILITÉS</span>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <button type="button" onClick={prev} disabled={index === 0} className="rounded-full border border-stone-400 px-4 py-2 disabled:opacity-40" aria-label="Service précédent">←</button>
            <button type="button" onClick={next} disabled={index === services.length - 1} className="rounded-full border border-stone-400 px-4 py-2 disabled:opacity-40" aria-label="Service suivant">→</button>
            <button type="button" onClick={() => setAutoplay(!autoplay)} className="rounded-full border border-stone-400 px-4 py-2 text-xs font-bold" aria-pressed={autoplay}>{autoplay ? "Ⅱ Pause auto" : "▶ Défilement auto"}</button>
          </div>
        </div>
        <div className="preview-service mt-8">
          <div key={index} className="animate-[fadeIn_.4s_ease-out]">
            <span className="text-xs font-extrabold uppercase tracking-[.16em] text-rose-700">{String(index + 1).padStart(2, "0")} / 06 — {current.kicker}</span>
            <h1 className="my-4 text-4xl font-extrabold tracking-[-.06em] md:text-6xl">{current.name}</h1>
            <p className="max-w-2xl text-base leading-7 text-neutral-700 md:text-lg">{current.detail}</p>
            <p className="mt-4 max-w-2xl border-l-[3px] border-rose-600 pl-4 text-sm font-semibold leading-6">{current.deliverable}</p>
          </div>
          <a href={ROOT + "/#" + current.anchor}
            className="inline-flex min-h-14 items-center justify-between gap-7 rounded-full bg-neutral-950 px-6 py-4 text-sm font-bold text-white transition hover:bg-rose-800"
            target="_blank" rel="noopener noreferrer">
            Découvrir cette offre <span aria-hidden={true}>↗</span>
          </a>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-2 border-t border-stone-300 pt-5 sm:grid-cols-3 lg:grid-cols-6" aria-label="Choisir une offre directement">
          {services.map((s, i) => (
            <button type="button" key={s.id} aria-pressed={i === index}
              onClick={() => setIndex(i)}
              className={"rounded-md border px-3 py-4 text-left text-xs font-bold transition " +
                (i === index ? "border-rose-800 bg-rose-100 text-rose-900" : "border-stone-300 bg-white hover:border-neutral-700")}>
              <span className="mb-2 block text-[10px] opacity-60">{String(i + 1).padStart(2, "0")}</span>{s.name}
            </button>
          ))}
        </div>
        <p className="mt-8 text-xs leading-6 text-stone-600">Cet aperçu teste le composant HeroCarousel fourni avec les six offres réelles de moezthabet.com. Il est indépendant du site public. Utilisez les flèches du clavier, glissez la bande d'images ou cliquez sur une carte.</p>
      </section>
      <footer className="border-t border-stone-300 px-5 py-5 text-center text-[10px] font-bold tracking-[.14em] text-stone-600">PROTOTYPE TECHNIQUE · MAIN ET MOEZTHABET.COM INCHANGÉS</footer>
    </div>
  )
}
