"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface HeroCarouselItem {
  id?: string | number
  title: string
  image: string
  credit?: string
  meta?: string[]
  accent?: string
}

export interface HeroCarouselProps {
  items: HeroCarouselItem[]
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  brand?: React.ReactNode
  onBack?: () => void
  onMenu?: () => void
  /** A continuously moving, seamless filmstrip; enabled by the demo. */
  autoplay?: boolean
  /** Used as a speed multiplier: nominal duration of one card in milliseconds. */
  autoplayDelay?: number
  className?: string
}

const mod = (n: number, size: number) => ((n % size) + size) % size
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))
const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.3'/%3E%3C/svg%3E\")"

function ServiceArtwork({ item, ordinal }: { item: HeroCarouselItem; ordinal: number }) {
  const kind = String(item.id ?? ordinal)
  return (
    <div className={"hc-art hc-art--" + kind} style={{ "--poster-accent": item.accent ?? "#ad7c96" } as React.CSSProperties}>
      <img className="hc-art__image" src={item.image} alt="" loading="lazy" draggable={false} />
      <div className="hc-art__light" aria-hidden="true" />
      {kind === "web" && <div className="hc-ui hc-ui--web">
        <div className="hc-ui__top"><i/><i/><i/><span>atelier / studio</span></div>
        <div className="hc-web-visual"><span className="hc-web-orb"/><small>LA VITRINE QUI CONVAINC</small><strong>Votre idée.<br/>Notre prochain clic.</strong><b>EXPLORER ↗</b></div>
      </div>}
      {kind === "sav" && <div className="hc-ui hc-ui--chat">
        <div className="hc-chat"><span>01 · MESSAGE REÇU</span><strong>Bonjour, j'ai une question.</strong><i>09:41</i></div>
        <div className="hc-chat hc-chat--reply"><span>02 · RÉPONSE</span><strong>Je m'en occupe.</strong><i>✓ SUIVI EN COURS</i></div>
      </div>}
      {kind === "avis" && <div className="hc-ui hc-ui--review">
        <span className="hc-review-star">✳</span><div className="hc-review-card"><small>AVIS CLIENTS</small><strong>★★★★★</strong><b>Écouter.<br/>Répondre.<br/>Progresser.</b><i>✓ RÉPONSE PRÉPARÉE</i></div>
      </div>}
      {kind === "prospects" && <div className="hc-ui hc-ui--phone">
        <div className="hc-phone-ring"/><div className="hc-phone"><small>ÉCHANGE EN COURS</small><strong>↗</strong><span>PROCHAINE ÉTAPE</span></div><div className="hc-soundwave">{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ "--wave": (i % 5) } as React.CSSProperties}/>)}</div>
      </div>}
      {kind === "crm" && <div className="hc-ui hc-ui--crm"><div className="hc-crm-top"><b>CRM / STUDIO</b><span>✓ EN SUIVI</span></div>
        <div className="hc-crm-title">Tableau de suivi</div>
        <div className="hc-crm-columns"><div><b>À FAIRE</b><span>Client 01</span><span>Client 04</span></div><div><b>EN COURS</b><span>Client 02</span><span>Client 05</span></div><div><b>TERMINÉ</b><span>Client 03</span></div></div>
      </div>}
      {kind === "automation" && <div className="hc-ui hc-ui--flow"><svg viewBox="0 0 340 250" aria-hidden="true"><path d="M65 126 C125 126 99 62 175 62 S235 125 281 125" /><path d="M65 126 C125 126 99 190 175 190 S235 125 281 125" /></svg><div className="hc-node hc-node--a">FORMULAIRE</div><div className="hc-node hc-node--b">CRM</div><div className="hc-node hc-node--c">EMAIL</div><div className="hc-node hc-node--d">✓ ACTION</div></div>}
      <div className="hc-art__bottom"><span>{String(ordinal + 1).padStart(2, "0")} / 06</span><b>{["CRÉATION WEB","RELATION CLIENT","E-RÉPUTATION","PROSPECTION","ORGANISATION","WORKFLOWS"][ordinal] ?? "SOLUTION"}</b></div>
    </div>
  )
}

export function HeroCarousel({
  items, index: controlled, defaultIndex = 0, onIndexChange, brand, onBack, onMenu,
  autoplay = false, autoplayDelay = 4400, className,
}: HeroCarouselProps) {
  const reduced = useReducedMotion()
  const stageRef = React.useRef<HTMLDivElement>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const [box, setBox] = React.useState({ w: 0, h: 0 })
  const [local, setLocal] = React.useState(defaultIndex)
  const [visualFocus, setVisualFocus] = React.useState(defaultIndex)
  const [interacting, setInteracting] = React.useState(false)
  const position = React.useRef(0)
  const target = React.useRef<number | null>(null)
  const velocity = React.useRef(0)
  const drag = React.useRef<{ x: number; pos: number; time: number; lastX: number; moved: boolean } | null>(null)
  const suppressClick = React.useRef(false)
  const focusRef = React.useRef(defaultIndex)
  const hovered = React.useRef(false)
  const focused = React.useRef(false)
  const visible = React.useRef(true)
  const pauseUntil = React.useRef(0)
  const motionPaused = React.useRef(false)
  const activeCallback = React.useRef(onIndexChange)
  const count = items.length
  const focus = clamp(controlled ?? local, 0, Math.max(0, count - 1))
  const step = clamp(box.h * 0.475, 200, 455) * 0.72 + Math.max(9, box.w * 0.012)
  const cardH = clamp(box.h * 0.475, 200, 455)
  const cardW = cardH * 0.72
  const gap = step - cardW
  const cycle = step * count
  const stageCenter = box.w / 2
  const focusItem = items[focus] ?? items[0]
  const slides = React.useMemo(() => [...items, ...items, ...items], [items])

  React.useEffect(() => { activeCallback.current = onIndexChange }, [onIndexChange])

  React.useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const read = () => setBox({ w: stage.clientWidth, h: stage.clientHeight })
    read()
    const observer = new ResizeObserver(read)
    observer.observe(stage)
    const watch = new IntersectionObserver(entries => {
      visible.current = entries[0]?.isIntersecting ?? true
    }, { threshold: .05 })
    watch.observe(stage)
    return () => { observer.disconnect(); watch.disconnect() }
  }, [])

  const geometry = React.useRef({ step, cycle, cardW, stageCenter })
  React.useEffect(() => { geometry.current = { step, cycle, cardW, stageCenter } }, [step, cycle, cardW, stageCenter])
  React.useEffect(() => {
    if (!step || !cycle) return
    const newPos = clamp(focusRef.current, 0, count - 1) * step
    if (position.current === 0 && focusRef.current !== 0) position.current = newPos
  }, [step, cycle, count])

  // The entire track translates at a constant velocity, without card-by-card stops.
  // Three copies make modulo wrapping visually identical on both sides of a seam.
  React.useEffect(() => {
    if (count < 1) return
    let raf = 0
    let last = 0
    const tick = (time: number) => {
      const dt = clamp(time - (last || time), 0, 40)
      last = time
      const { step: s, cycle: c, cardW: w, stageCenter: center } = geometry.current
      if (!s || !c) { raf = requestAnimationFrame(tick); return }
      const pointer = drag.current
      const frozen = hovered.current || focused.current || !visible.current || document.hidden
      if (reduced) {
        position.current = focusRef.current * s
        target.current = null
      } else if (!pointer) {
        if (target.current !== null) {
          position.current += (target.current - position.current) * (1 - Math.exp(-dt / 225))
          if (Math.abs(target.current - position.current) < .35) {
            position.current = target.current
            target.current = null
          }
        } else if (Math.abs(velocity.current) > .5) {
          position.current += velocity.current * (dt / 1000)
          velocity.current *= Math.exp(-dt / 330)
        } else if (autoplay && !frozen && time > pauseUntil.current && !motionPaused.current) {
          // Speed is proportional to card size, not viewport pixels.
          position.current += (s * dt) / Math.max(2200, autoplayDelay)
        }
      }
      const normalized = mod(position.current, c)
      const translateX = center - w / 2 - (count * s + normalized)
      if (trackRef.current) trackRef.current.style.transform = "translate3d(" + translateX.toFixed(2) + "px,0,0)"
      // Subtle per-card optical bend, updated without React rendering.
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const distance = (i - count) - normalized / s
        const abs = Math.abs(distance)
        if (abs > 4.3) {
          card.style.visibility = "hidden"
          return
        }
        card.style.visibility = "visible"
        const bend = clamp(distance * -9, -22, 22)
        card.style.transform = "translate3d(0," + (Math.min(abs * abs * 8, 42)).toFixed(1) + "px,0) rotateY(" + bend.toFixed(1) + "deg)"
        card.style.opacity = String(clamp(1 - Math.max(0, abs - 2) * .29, .09, 1))
      })
      const next = mod(Math.round(normalized / s), count)
      if (next !== focusRef.current && target.current === null && !pointer) {
        focusRef.current = next
        setVisualFocus(next)
        if (controlled === undefined) setLocal(next)
        activeCallback.current?.(next)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [count, autoplay, autoplayDelay, reduced, controlled])

  const navigate = React.useCallback((next: number) => {
    if (count < 1) return
    const i = mod(next, count)
    const { step: s, cycle: c } = geometry.current
    if (!s || !c) return
    const current = position.current
    const nearest = i * s + Math.round((current - i * s) / c) * c
    target.current = nearest
    velocity.current = 0
    pauseUntil.current = performance.now() + 2900
    focusRef.current = i
    setVisualFocus(i)
    if (controlled === undefined) setLocal(i)
    activeCallback.current?.(i)
  }, [count, controlled])

  React.useEffect(() => {
    if (controlled === undefined || !count || !geometry.current.step) return
    if (controlled !== focusRef.current) navigate(controlled)
  }, [controlled, count, navigate, step])

  React.useEffect(() => {
    if (!stageRef.current) return
    const stage = stageRef.current
    // Only horizontal gestures control the ribbon; vertical scroll remains the page's.
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) * 1.3) return
      e.preventDefault()
      target.current = null
      velocity.current = 0
      position.current += e.deltaX * .8
      pauseUntil.current = performance.now() + 1400
    }
    stage.addEventListener("wheel", onWheel, { passive: false })
    return () => stage.removeEventListener("wheel", onWheel)
  }, [])

  if (!focusItem || !count) return null
  const activeAccent = focusItem.accent ?? "#855d78"

  return (
    <section
      className={cn("hc-stage relative isolate h-full w-full min-h-[24rem] overflow-hidden text-white", className)}
      ref={stageRef} role="region" tabIndex={0} aria-roledescription="carrousel"
      aria-label="Exploration automatique des six offres"
      onPointerEnter={() => { hovered.current = true }}
      onPointerLeave={() => { hovered.current = false }}
      onFocusCapture={() => { focused.current = true }}
      onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) focused.current = false }}
      onKeyDown={e => {
        if (e.key === "ArrowRight") { e.preventDefault(); navigate(focusRef.current + 1) }
        if (e.key === "ArrowLeft") { e.preventDefault(); navigate(focusRef.current - 1) }
        if (e.key === "Home") { e.preventDefault(); navigate(0) }
        if (e.key === "End") { e.preventDefault(); navigate(count - 1) }
      }}
      onPointerDown={e => {
        if (e.pointerType === "mouse" && e.button !== 0) return
        drag.current = { x: e.clientX, lastX: e.clientX, pos: position.current, time: performance.now(), moved: false }
        target.current = null
        velocity.current = 0
        setInteracting(true)
        e.currentTarget.setPointerCapture(e.pointerId)
      }}
      onPointerMove={e => {
        if (!drag.current) return
        const dx = e.clientX - drag.current.x
        drag.current.moved ||= Math.abs(dx) > 7
        const now = performance.now()
        const dt = Math.max(12, now - drag.current.time)
        velocity.current = clamp(-(e.clientX - drag.current.lastX) / dt * 1000, -850, 850)
        drag.current.lastX = e.clientX
        drag.current.time = now
        position.current = drag.current.pos - dx
      }}
      onPointerUp={e => {
        const currentDrag = drag.current
        if (!currentDrag) return
        drag.current = null
        try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* gesture cancelled */ }
        setInteracting(false)
        pauseUntil.current = performance.now() + 2200
        if (currentDrag.moved) {
          suppressClick.current = true
          window.setTimeout(() => { suppressClick.current = false }, 250)
        } else {
          // Tap any visible card, including the left/right seamlessly repeated copies.
          const rect = e.currentTarget.getBoundingClientRect()
          const physical = e.clientX - rect.left
          const s = geometry.current.step
          navigate(Math.round((mod(position.current, geometry.current.cycle) + physical - rect.width / 2) / s))
        }
      }}
      onPointerCancel={() => { drag.current = null; velocity.current = 0; setInteracting(false) }}
      style={{ "--hc-accent": activeAccent } as React.CSSProperties}
    >
      <div aria-hidden="true" className="hc-backdrops">
        <AnimatePresence initial={false}>
          <motion.div key={String(focusItem.id ?? focus)} className="hc-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 1.15 }}>
            <img src={focusItem.image} alt="" className="hc-backdrop__image" draggable={false} />
            <div className="hc-backdrop__tone" style={{ backgroundColor: activeAccent }} />
          </motion.div>
        </AnimatePresence>
        <div className="hc-backdrop__veil" />
        <div className="hc-backdrop__grain" style={{ backgroundImage: GRAIN }} />
      </div>

      <div className="hc-topbar">
        <span className="hc-topbar__side">{onBack && <button onPointerDown={e => e.stopPropagation()} onClick={onBack}>← RETOUR</button>}</span>
        <div className="hc-topbar__brand">{brand || "MOEZ THABET / SERVICES"}</div>
        <span className="hc-topbar__side hc-topbar__side--right">{onMenu && <button onPointerDown={e => e.stopPropagation()} onClick={onMenu}>MENU ↗</button>}</span>
      </div>

      <div className="hc-editorial" aria-live="off">
        <span className="hc-editorial__eyebrow"><i /> EXPERTISES · SERVICES SUR MESURE</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={String(focusItem.id ?? focus)} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={reduced ? { duration: 0 } : { duration: .64, ease: [.22, 1, .36, 1] }} className="hc-editorial__content">
            <h2>{focusItem.title.split("\n").map((line, i) => <span key={i}>{line}</span>)}</h2>
            <div className="hc-editorial__notes">
              <span>{focusItem.credit}</span>
              <span>{focusItem.meta?.join(" — ") || "MOEZ THABET · DIGITAL"}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={"hc-ribbon " + (interacting ? "hc-ribbon--dragging" : "")}
        style={{ top: "46%", height: cardH, perspective: Math.max(box.w, 700) + "px", touchAction: "pan-y" }}>
        <div className="hc-ribbon__track" ref={trackRef} style={{ gap, width: step * 3 * count }}>
          {slides.map((item, j) => {
            const realIndex = j % count
            const selected = realIndex === visualFocus
            return <div key={j + "-" + String(item.id ?? realIndex)} ref={el => { cardRefs.current[j] = el }}
              className={"hc-card " + (selected ? "hc-card--focused" : "")}
              style={{ width: cardW, height: cardH, "--hc-accent": item.accent ?? "#855d78" } as React.CSSProperties}
              aria-hidden={j < count || j >= count * 2 ? true : undefined}>
              <div className="hc-card__mask" style={{ height: selected ? cardH : cardH * .52 }}>
                <ServiceArtwork item={item} ordinal={realIndex}/>
              </div>
            </div>
          })}
        </div>
      </div>

      <div className="hc-bottom">
        <div className="hc-bottom__counter"><span>{String(focus + 1).padStart(2, "0")}</span>
          <div className="hc-bottom__rail" aria-hidden="true"><i style={{ left: 100 * focus / count + "%", width: 100 / count + "%" }} /></div>
          <span>{String(count).padStart(2, "0")}</span>
        </div>
        <div className="hc-bottom__hint">{autoplay && !reduced ? "DÉFILEMENT CONTINU" : "NAVIGATION MANUELLE"} <b>·</b> GLISSEZ POUR EXPLORER <span>↔</span></div>
      </div>
    </section>
  )
}
