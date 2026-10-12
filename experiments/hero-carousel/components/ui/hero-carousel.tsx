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

const mod = (n: number, m: number) => ((n % m) + m) % m
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n))

export function HeroCarousel({
  items, index: controlled, defaultIndex = 0, onIndexChange,
  brand, onBack, onMenu, autoplay = true, autoplayDelay = 5400, className,
}: HeroCarouselProps) {
  const reduce = useReducedMotion()
  const stage = React.useRef<HTMLDivElement>(null)
  const ribbon = React.useRef<HTMLDivElement>(null)
  const [size, setSize] = React.useState({ width: 1100, height: 620 })
  const [internal, setInternal] = React.useState(defaultIndex)
  const [selected, setSelected] = React.useState(defaultIndex)
  const index = clamp(controlled ?? internal, 0, Math.max(0, items.length - 1))
  const n = items.length
  const position = React.useRef(defaultIndex)
  const momentum = React.useRef(0)
  const snap = React.useRef<number | null>(null)
  const dragging = React.useRef<{ start: number; previous: number; t: number; origin: number; moved: boolean } | null>(null)
  const pauseUntil = React.useRef(0)
  const hovering = React.useRef(false)
  const focusing = React.useRef(false)
  const visibility = React.useRef(true)
  const current = React.useRef(defaultIndex)
  const notified = React.useRef(onIndexChange)
  const playing = React.useRef(autoplay)
  const lastStep = React.useRef(1)
  const clickBlock = React.useRef(false)

  const height = clamp(size.height * .57, 260, 505)
  const width = height * .71
  const step = width + clamp(size.width * .012, 9, 20)
  const gap = step - width
  const distance = step * n

  React.useEffect(() => { notified.current = onIndexChange }, [onIndexChange])
  React.useEffect(() => { playing.current = autoplay }, [autoplay])
  React.useEffect(() => {
    const el = stage.current
    if (!el) return
    const read = () => setSize({ width: el.clientWidth, height: el.clientHeight })
    read()
    const ro = new ResizeObserver(read)
    ro.observe(el)
    const io = new IntersectionObserver(entries => { visibility.current = entries[0]?.isIntersecting ?? true }, { threshold: .03 })
    io.observe(el)
    return () => { ro.disconnect(); io.disconnect() }
  }, [])

  const geom = React.useRef({ step, distance, width, center: size.width / 2 })
  React.useEffect(() => {
    if (lastStep.current > 1 && step !== lastStep.current) position.current = position.current * step / lastStep.current
    lastStep.current = step
    geom.current = { step, distance, width, center: size.width / 2 }
  }, [step, distance, width, size.width])

  const go = React.useCallback((value: number) => {
    if (!n) return
    const next = mod(value, n)
    const s = geom.current.step
    const d = geom.current.distance
    const currentPosition = position.current
    // Nearest repeated instance avoids a backwards jump at the sixth card.
    snap.current = next * s + Math.round((currentPosition - next * s) / d) * d
    momentum.current = 0
    pauseUntil.current = performance.now() + 2600
    current.current = next
    setSelected(next)
    if (controlled === undefined) setInternal(next)
    notified.current?.(next)
  }, [n, controlled])

  React.useEffect(() => {
    if (controlled !== undefined && controlled !== current.current) go(controlled)
  }, [controlled, go])

  React.useEffect(() => {
    if (!n) return
    let raf = 0
    let previous = 0
    const render = (t: number) => {
      const dt = clamp(t - (previous || t), 0, 50)
      previous = t
      const { step: s, distance: d, width: w, center } = geom.current
      if (!s || !d) { raf = requestAnimationFrame(render); return }
      const now = t
      const paused = hovering.current || focusing.current || !visibility.current || document.hidden
      if (reduce) {
        if (!dragging.current) position.current = current.current * s
        snap.current = null
        momentum.current = 0
      } else if (!dragging.current) {
        if (snap.current !== null) {
          // Delta-time-stable critically damped approach.
          position.current += (snap.current - position.current) * (1 - Math.exp(-dt / 205))
          if (Math.abs(position.current - snap.current) < .2) {
            position.current = snap.current
            snap.current = null
          }
        } else if (Math.abs(momentum.current) > 6) {
          position.current += momentum.current * dt / 1000
          momentum.current *= Math.exp(-dt / 350)
        } else if (playing.current && !paused && now > pauseUntil.current) {
          position.current += s * dt / Math.max(2700, autoplayDelay)
        }
      }
      // Only ONE composited transform per frame. No per-card DOM writes.
      const looped = mod(position.current, d)
      if (ribbon.current) ribbon.current.style.transform =
        "translate3d(" + (center - w / 2 - n * s - looped).toFixed(2) + "px,0,0)"
      const nearest = mod(Math.round(looped / s), n)
      if (snap.current === null && !dragging.current && nearest !== current.current) {
        current.current = nearest
        setSelected(nearest)
        if (controlled === undefined) setInternal(nearest)
        notified.current?.(nearest)
      }
      if (Math.abs(position.current) > d * 64) {
        position.current = mod(position.current, d)
        if (snap.current !== null) snap.current = mod(snap.current, d)
      }
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)
    return () => cancelAnimationFrame(raf)
  }, [n, controlled, reduce, autoplayDelay])

  React.useEffect(() => {
    const el = stage.current
    if (!el) return
    const wheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) < Math.abs(event.deltaY) * 1.3) return
      event.preventDefault()
      position.current += event.deltaX * .8
      snap.current = null
      momentum.current = 0
      pauseUntil.current = performance.now() + 1100
    }
    el.addEventListener("wheel", wheel, { passive: false })
    return () => el.removeEventListener("wheel", wheel)
  }, [])

  if (!items.length) return null
  const active = items[index] ?? items[0]
  const triple = [0, 1, 2]
  const start = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return
    dragging.current = { start: e.clientX, previous: e.clientX, t: performance.now(), origin: position.current, moved: false }
    snap.current = null
    momentum.current = 0
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragging.current
    if (!d) return
    const dx = e.clientX - d.start
    d.moved ||= Math.abs(dx) > 7
    position.current = d.origin - dx
    const time = performance.now()
    const delta = Math.max(time - d.t, 16)
    momentum.current = clamp(-(e.clientX - d.previous) * 1000 / delta, -520, 520)
    d.previous = e.clientX
    d.t = time
  }
  const release = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    const moved = dragging.current.moved
    dragging.current = null
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* cancelled */ }
    pauseUntil.current = performance.now() + 1600
    if (moved) {
      clickBlock.current = true
      window.setTimeout(() => { clickBlock.current = false }, 180)
    } else {
      momentum.current = 0
      const rect = e.currentTarget.getBoundingClientRect()
      const g = geom.current
      if (g.distance > 0 && g.step > 0) {
        const touchedCard = Math.round((e.clientX - rect.left - rect.width / 2 + mod(position.current, g.distance)) / g.step)
        go(mod(touchedCard, n))
      }
    }
  }
  const clickCard = (i: number) => { if (!clickBlock.current) go(i) }

  return <section
    ref={stage} tabIndex={0} role="region" aria-roledescription="carousel"
    aria-label="Six services — carrousel photographique"
    className={cn("photo-carousel relative isolate h-full w-full overflow-hidden text-white", className)}
    style={{ "--photo-accent": active.accent ?? "#af745e" } as React.CSSProperties}
    onPointerEnter={() => { hovering.current = false }}
    onPointerLeave={() => { hovering.current = false }}
    onFocusCapture={() => { /* pointer selection should not freeze autoplay */ }}
    onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) focusing.current = false }}
    onKeyDown={e => {
      if (e.key === "ArrowRight") { focusing.current = true; e.preventDefault(); go(current.current + 1) }
      if (e.key === "ArrowLeft") { focusing.current = true; e.preventDefault(); go(current.current - 1) }
      if (e.key === "Home") { e.preventDefault(); go(0) }
      if (e.key === "End") { e.preventDefault(); go(n - 1) }
    }}
  >
    <div className="photo-carousel__atmosphere" aria-hidden="true"/>
    <div className="photo-carousel__top">
      <span>{onBack ? <button type="button" onClick={onBack}>← RETOUR</button> : null}</span>
      <strong>{brand ?? "MOEZ THABET · 6 SOLUTIONS"}</strong>
      <span>{onMenu ? <button type="button" onClick={onMenu}>MENU ↗</button> : null}</span>
    </div>
    <div className="photo-carousel__caption" aria-live="off">
      <span className="photo-carousel__eyebrow">DES EXPERTISES CONCRÈTES · UN SEUL INTERLOCUTEUR</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={String(active.id ?? index)}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -9 }}
          transition={reduce ? { duration: 0 } : { duration: .55, ease: [.2, .8, .2, 1] }}>
          <h2>{active.title.split("\n").map((line, i) => <span key={i}>{line}</span>)}</h2>
          <p>{active.credit}</p>
        </motion.div>
      </AnimatePresence>
    </div>
    <div className="photo-carousel__viewport"
      style={{ top: "43%", height, touchAction: "pan-y" }}
      onPointerDown={start} onPointerMove={move} onPointerUp={release} onPointerCancel={() => { dragging.current = null; momentum.current = 0 }}>
      <div className="photo-carousel__track" ref={ribbon} style={{ gap, width: 3 * distance }}>
        {triple.map(copy => items.map((item, i) =>
          <button
            type="button" key={copy + "-" + String(item.id ?? i)}
            tabIndex={copy === 1 ? 0 : -1}
            aria-hidden={copy === 1 ? undefined : true}
            aria-label={"Choisir " + item.title.replace(/\n/g, " ")}
            aria-current={copy === 1 && i === selected ? "true" : undefined}
            onClick={() => clickCard(i)}
            className={"photo-carousel__card " + (selected === i ? "is-focused" : "")}
            style={{ width, height, flex: "0 0 " + width + "px" }}
          >
            <img
              className="photo-carousel__photo"
              src={item.image}
              alt=""
              draggable={false}
              loading={copy === 1 ? "eager" : "lazy"}
              decoding="async"
            />
            <span className="photo-carousel__shade"/>
            <span className="photo-carousel__cardtop">
              <small>{String(i + 1).padStart(2, "0")} / 06</small><b>↗</b>
            </span>
            <span className="photo-carousel__cardbottom">
              <small>{item.meta?.[0] ?? "MOEZ · SERVICES"}</small>
              <b>{["Sites internet", "Service client", "Avis clients", "Appels et relances", "Dossiers clients", "Automatisation"][i] ?? item.title.replace(/\n/g, " ")}</b>
            </span>
          </button>
        ))}
      </div>
    </div>
    <div className="photo-carousel__footer">
      <div className="photo-carousel__progress">
        <strong>{String(index + 1).padStart(2, "0")}</strong>
        <span><i style={{ left: (index / n * 100) + "%", width: (100 / n) + "%" }}/></span>
        <small>{String(n).padStart(2, "0")}</small>
      </div>
      <span>{autoplay && !reduce ? "DÉFILEMENT AUTOMATIQUE · " : ""}GLISSER POUR EXPLORER ↔</span>
    </div>
  </section>
}
