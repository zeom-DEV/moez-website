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
  autoplay?: boolean
  autoplayDelay?: number
  className?: string
}

const clamp = (n: number, low: number, high: number) => Math.min(high, Math.max(low, n))
const mod = (n: number, m: number) => ((n % m) + m) % m
const SERVICE_NAMES = [
  "Sites internet", "Service client", "Avis clients", "Appels et relances",
  "Dossiers clients", "Automatisation",
]
const SERVICE_CAPTIONS = [
  "UN SITE PENSÉ POUR CONVAINCRE",
  "CHAQUE DEMANDE COMPTE",
  "CONSTRUIRE LA CONFIANCE",
  "UN ÉCHANGE, UNE OPPORTUNITÉ",
  "CHAQUE INFORMATION À SA PLACE",
  "VOS OUTILS TRAVAILLENT ENSEMBLE",
]

export function HeroCarousel({
  items, index: controlled, defaultIndex = 0, onIndexChange, brand,
  onBack, onMenu, autoplay = true, autoplayDelay = 5200, className,
}: HeroCarouselProps) {
  const reduced = useReducedMotion()
  const stage = React.useRef<HTMLElement>(null)
  const orbit = React.useRef<HTMLDivElement>(null)
  const cards = React.useRef<(HTMLButtonElement | null)[]>([])
  const [bounds, setBounds] = React.useState({ w: 1060, h: 650 })
  const [localIndex, setLocalIndex] = React.useState(defaultIndex)
  const [focusIndex, setFocusIndex] = React.useState(defaultIndex)
  const [isDragging, setIsDragging] = React.useState(false)

  const n = items.length
  const currentIndex = clamp(controlled ?? localIndex, 0, Math.max(0, n - 1))
  const selected = items[currentIndex] ?? items[0]
  const phase = React.useRef(defaultIndex)
  const springTo = React.useRef<number | null>(null)
  const angularVelocity = React.useRef(0)
  const drag = React.useRef<{ startX: number; origin: number; lastX: number; lastT: number; moved: boolean; tapIndex: number | null } | null>(null)
  const pauseUntil = React.useRef(0)
  const focusRef = React.useRef(defaultIndex)
  const reducedRef = React.useRef(Boolean(reduced))
  const onChangeRef = React.useRef(onIndexChange)
  const playingRef = React.useRef(autoplay)
  const visibleRef = React.useRef(true)
  const pointer = React.useRef({ x: 0, y: 0 })
  const desiredPointer = React.useRef({ x: 0, y: 0 })
  const sizeRef = React.useRef({ w: bounds.w, h: bounds.h })
  const suppressed = React.useRef(false)
  const interacting = React.useRef(false)

  React.useEffect(() => { onChangeRef.current = onIndexChange }, [onIndexChange])
  React.useEffect(() => { playingRef.current = autoplay }, [autoplay])
  React.useEffect(() => { reducedRef.current = Boolean(reduced) }, [reduced])
  React.useEffect(() => {
    const el = stage.current
    if (!el) return
    const read = () => {
      const rect = el.getBoundingClientRect()
      const w = rect.width || 1060
      const h = rect.height || 650
      sizeRef.current = { w, h }
      setBounds(prev => prev.w === w && prev.h === h ? prev : { w, h })
    }
    read()
    const resize = new ResizeObserver(read)
    resize.observe(el)
    const watch = new IntersectionObserver(entries => {
      visibleRef.current = entries[0]?.isIntersecting ?? true
    }, { threshold: .05 })
    watch.observe(el)
    return () => { resize.disconnect(); watch.disconnect() }
  }, [])

  const choose = React.useCallback((newIndex: number, notify = true) => {
    if (!n) return
    const next = mod(newIndex, n)
    // Seek the closest revolution, keeping physical direction continuous.
    springTo.current = next + Math.round((phase.current - next) / n) * n
    pauseUntil.current = performance.now() + 2900
    interacting.current = false
    focusRef.current = next
    setFocusIndex(next)
    if (controlled === undefined) setLocalIndex(next)
    if (notify && next !== currentIndex) onChangeRef.current?.(next)
  }, [n, controlled, currentIndex])

  React.useEffect(() => {
    if (controlled !== undefined && controlled !== focusRef.current) choose(controlled, false)
  }, [controlled, choose])

  // A single time-based physics simulation (6 cards) with no layout reads or
  // React renders per frame. Friction and spring constants are dt-independent.
  React.useEffect(() => {
    if (!n) return
    let id = 0
    let prev = 0
    const frame = (now: number) => {
      const dtMs = clamp(now - (prev || now), 0, 34)
      prev = now
      const dt = dtMs / 1000
      const reduce = reducedRef.current

      if (reduce) {
        if (!drag.current) phase.current = focusRef.current
        springTo.current = null
        angularVelocity.current = 0
      } else if (!drag.current) {
        if (springTo.current !== null) {
          const error = springTo.current - phase.current
          // Natural spring: x'' = stiffness * error - damping * velocity.
          const stiffness = 47
          const damping = 14
          angularVelocity.current += (error * stiffness - angularVelocity.current * damping) * dt
          phase.current += angularVelocity.current * dt
          if (Math.abs(error) < .0025 && Math.abs(angularVelocity.current) < .007) {
            phase.current = springTo.current
            springTo.current = null
            angularVelocity.current = 0
          }
        } else if (Math.abs(angularVelocity.current) > .012) {
          phase.current += angularVelocity.current * dt
          angularVelocity.current *= Math.exp(-4.8 * dt)
        } else if (playingRef.current && visibleRef.current && !document.hidden && now > pauseUntil.current) {
          phase.current += dtMs / Math.max(3000, autoplayDelay)
        }
      }

      // Bound phase so it cannot drift indefinitely after hours of running.
      if (Math.abs(phase.current) > n * 80 && springTo.current === null) phase.current = mod(phase.current, n)

      const { w } = sizeRef.current
      const mobile = w < 650
      const radiusX = mobile ? Math.max(190, w * .48) : Math.min(w * .42, 560)
      const radiusZ = mobile ? 250 : 375
      const radiusY = mobile ? 18 : 28
      const p = phase.current
      const cameraSpeed = reduce ? 1 : (1 - Math.exp(-4 * dt))
      pointer.current.x += (desiredPointer.current.x - pointer.current.x) * cameraSpeed
      pointer.current.y += (desiredPointer.current.y - pointer.current.y) * cameraSpeed
      if (orbit.current) orbit.current.style.transform =
        "translate3d(" + (pointer.current.x * (mobile ? 4 : 13)).toFixed(2) + "px," +
        (pointer.current.y * (mobile ? 3 : 8)).toFixed(2) + "px,0) rotateX(" +
        (-pointer.current.y * (mobile ? .5 : 2)).toFixed(2) + "deg)"

      cards.current.forEach((node, i) => {
        if (!node) return
        const theta = (i - p) * Math.PI * 2 / n
        const sin = Math.sin(theta)
        const cos = Math.cos(theta)
        const x = sin * radiusX
        const y = (1 - cos) * radiusY + sin * 12
        const z = (cos - 1) * radiusZ
        const twist = -sin * (mobile ? 38 : 48)
        const lean = sin * 3.2
        const scale = .67 + .33 * ((cos + 1) / 2)
        node.style.transform =
          "translate3d(calc(-50% + " + x.toFixed(2) + "px)," + y.toFixed(2) +
          "px," + z.toFixed(2) + "px) rotateY(" + twist.toFixed(2) +
          "deg) rotateZ(" + lean.toFixed(2) + "deg) scale(" + scale.toFixed(4) + ")"
        node.style.opacity = String(clamp(.14 + .86 * (cos + 1) / 2, .14, 1))
        node.style.zIndex = String(100 + Math.round(cos * 30))
        // Do not alter visibility at the wrap boundary. The closed orbit has no seam.
      })

      const nearest = mod(Math.round(phase.current), n)
      if (nearest !== focusRef.current && springTo.current === null && !drag.current) {
        focusRef.current = nearest
        setFocusIndex(nearest)
        if (controlled === undefined) setLocalIndex(nearest)
        onChangeRef.current?.(nearest)
      }
      id = requestAnimationFrame(frame)
    }
    id = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(id)
  }, [n, autoplayDelay, controlled])

  React.useEffect(() => {
    const el = stage.current
    if (!el) return
    let sum = 0
    let last = 0
    const wheel = (event: WheelEvent) => {
      // Preserve natural page scroll. Horizontal trackpad movement navigates.
      if (Math.abs(event.deltaX) < Math.abs(event.deltaY) * 1.15) return
      event.preventDefault()
      const now = performance.now()
      if (now - last > 360) sum = 0
      last = now
      sum += event.deltaX
      if (Math.abs(sum) > 65) {
        const direction = Math.sign(sum)
        sum = 0
        choose(focusRef.current + direction)
      }
    }
    el.addEventListener("wheel", wheel, { passive: false })
    return () => el.removeEventListener("wheel", wheel)
  }, [choose])

  if (!n || !selected) return null
  const mobile = bounds.w < 650
  const cardW = clamp(mobile ? bounds.w * .55 : bounds.w * .285, 205, 385)
  const cardH = clamp(mobile ? bounds.h * .52 : bounds.h * .55, mobile ? 245 : 300, mobile ? 360 : 485)

  const beginDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return
    const now = performance.now()
    const clicked = e.target instanceof Element ? e.target.closest("[data-hero-card]") : null
    const tapIndex = clicked ? Number(clicked.getAttribute("data-hero-card")) : null
    drag.current = { startX: e.clientX, origin: phase.current, lastX: e.clientX, lastT: now, moved: false, tapIndex }
    springTo.current = null
    angularVelocity.current = 0
    setIsDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const dragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) {
      if (e.pointerType === "mouse") {
        const r = e.currentTarget.getBoundingClientRect()
        desiredPointer.current = {
          x: clamp(((e.clientX - r.left) / r.width - .5) * 2, -1, 1),
          y: clamp(((e.clientY - r.top) / r.height - .5) * 2, -1, 1),
        }
      }
      return
    }
    const info = drag.current
    const delta = e.clientX - info.startX
    info.moved ||= Math.abs(delta) > 9
    const sensitivity = Math.max(120, sizeRef.current.w * (sizeRef.current.w < 650 ? .48 : .27))
    phase.current = info.origin - delta / sensitivity
    const now = performance.now()
    const time = Math.max(16, now - info.lastT)
    angularVelocity.current = clamp(-(e.clientX - info.lastX) * 1000 / (time * sensitivity), -2.7, 2.7)
    info.lastX = e.clientX
    info.lastT = now
  }
  const finishDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const info = drag.current
    if (!info) return
    drag.current = null
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* gesture cancelled */ }
    setIsDragging(false)
    pauseUntil.current = performance.now() + 1900
    if (!info.moved) {
      angularVelocity.current = 0
      if (info.tapIndex !== null) {
        suppressed.current = true
        choose(info.tapIndex)
        window.setTimeout(() => { suppressed.current = false }, 180)
      }
    } else {
      suppressed.current = true
      window.setTimeout(() => { suppressed.current = false }, 200)
    }
  }

  return (
    <section ref={stage}
      className={cn("orbit-hero relative isolate h-full w-full min-h-[26rem] overflow-hidden bg-[#080a0e] text-white", className)}
      role="region" tabIndex={0} aria-roledescription="carrousel"
      aria-label="Six offres de Moez Thabet, défilement tridimensionnel"
      style={{ "--orbit-tone": selected.accent ?? "#a7785b" } as React.CSSProperties}
      onKeyDown={e => {
        if (e.key === "ArrowRight") { e.preventDefault(); choose(focusRef.current + 1) }
        else if (e.key === "ArrowLeft") { e.preventDefault(); choose(focusRef.current - 1) }
        else if (e.key === "Home") { e.preventDefault(); choose(0) }
        else if (e.key === "End") { e.preventDefault(); choose(n - 1) }
      }}
    >
      <div className="orbit-hero__backdrop" aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.img key={String(selected.id ?? currentIndex)} src={selected.image} alt="" className="orbit-hero__background-photo"
            initial={{ opacity: 0 }} animate={{ opacity: .28 }} exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 1.35 }} draggable={false}/>
        </AnimatePresence>
        <div className="orbit-hero__background-wash" />
        <div className="orbit-hero__grid" />
      </div>

      <div className="orbit-hero__top">
        <div>{onBack && <button type="button" onClick={onBack}>← RETOUR</button>}</div>
        <strong>{brand ?? "MOEZ THABET · SIX SOLUTIONS"}</strong>
        <div>{onMenu && <button type="button" onClick={onMenu}>MENU ↗</button>}</div>
      </div>

      <div className="orbit-hero__narrative" aria-live="off">
        <span className="orbit-hero__eyebrow"><i/> 01 — 06 / DES EXPERTISES QUI PRENNENT VIE</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={String(selected.id ?? currentIndex)}
            initial={{ opacity: 0, y: 23 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -11 }}
            transition={reduced ? { duration: 0 } : { duration: .7, ease: [.22, 1, .36, 1] }}>
            <h2>{selected.title.split("\n").map((line, j) => <span key={j}>{line}</span>)}</h2>
            <p>{selected.credit ?? "MOEZ THABET · DIGITAL SERVICES"}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={"orbit-hero__world" + (isDragging ? " orbit-hero__world--dragging" : "")}
        onPointerDown={beginDrag} onPointerMove={dragMove}
        onPointerUp={finishDrag}
        onPointerCancel={e => {
          drag.current = null
          angularVelocity.current = 0
          setIsDragging(false)
          try { e.currentTarget.releasePointerCapture(e.pointerId) } catch {}
        }}
        onPointerLeave={() => { if (!drag.current) desiredPointer.current = { x: 0, y: 0 } }}
        style={{ perspective: (mobile ? 830 : 1450) + "px", touchAction: "pan-y" }}>
        <div ref={orbit} className="orbit-hero__ring">
          {items.map((item, i) => (
            <button
              ref={el => { cards.current[i] = el }}
              key={item.id ?? i} type="button"
              data-hero-card={i}
              onClick={() => { if (!suppressed.current && !drag.current) choose(i) }}
              aria-label={"Choisir le service " + (SERVICE_NAMES[i] || item.title.replace(/\n/g, " "))}
              aria-pressed={i === focusIndex}
              className={"orbit-hero__card" + (focusIndex === i ? " orbit-hero__card--active" : "")}
              style={{ width: cardW, height: cardH, "--card-accent": item.accent || "#c0a2a0" } as React.CSSProperties}
            >
              <img className="orbit-hero__card-image" src={item.image} alt="" loading="eager" decoding="async" draggable={false}/>
              <div className="orbit-hero__card-tint" />
              <div className="orbit-hero__card-top"><span>{String(i + 1).padStart(2, "0")} / 06</span><span>↗</span></div>
              <div className="orbit-hero__card-footer">
                <span>{SERVICE_CAPTIONS[i] || "SERVICES SUR MESURE"}</span>
                <strong>{SERVICE_NAMES[i] || item.title.replace(/\n/g, " ")}</strong>
                <div className="orbit-hero__card-line"><i/><b>EXPLORER</b></div>
              </div>
              <div className="orbit-hero__card-sheen" />
            </button>
          ))}
        </div>
      </div>

      <div className="orbit-hero__floor" aria-hidden="true">
        <div className="orbit-hero__floor-line"/>
        <div className="orbit-hero__floor-light"/>
      </div>

      <div className="orbit-hero__bottom">
        <div className="orbit-hero__count">
          <strong>{String(currentIndex + 1).padStart(2, "0")}</strong>
          <span className="orbit-hero__progress">
            {items.map((item, i) => <i key={item.id ?? i} className={i === currentIndex ? "active" : ""}/>)}
          </span>
          <small>{String(n).padStart(2, "0")}</small>
        </div>
        <div className="orbit-hero__legend">{autoplay && !reduced ? "MOUVEMENT CONTINU" : "MODE MANUEL"} <i/> GLISSER · EXPLORER <b>↔</b></div>
      </div>
    </section>
  )
}
