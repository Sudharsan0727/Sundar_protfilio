import * as React from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { OvsService, OvsServiceArt } from "../types"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface ServicesSectionProps {
  kicker: string
  title: string
  items: OvsService[]
  svcIdx: number
  uid: string
  onGoToSvc: (idx: number) => void
  onContactClick: (e: React.MouseEvent) => void
}

const CARD_PILLS: Record<OvsServiceArt, { label: string; bg: string }> = {
  site: { label: "DEVELOPMENT", bg: "#16a34a" },
  brand: { label: "MARKETING", bg: "#e11d48" },
  system: { label: "ECOMMERCE", bg: "#ea580c" },
  code: { label: "SOFTWARE", bg: "#7c3aed" },
  product: { label: "SEO & GROWTH", bg: "#d97706" },
}

const CARD_THEMES = [
  { base: "#062111", halo: "#22c55e" }, // 01: Web Development (Emerald Green)
  { base: "#8c3203", halo: "#fb923c" }, // 02: E-Commerce (Burnt Orange)
  { base: "#3b1575", halo: "#a855f7" }, // 03: WordPress, Shopify & Dashboards (Royal Purple)
  { base: "#690c17", halo: "#f43f5e" }, // 04: Meta Ads Campaigns (Crimson Red)
  { base: "#472510", halo: "#f59e0b" }, // 05: SEO & Digital Growth (Warm Bronze)
  { base: "#15325b", halo: "#38bdf8" }, // 06: Landing Page & Website Redesign (Cobalt Blue)
]

export function ServicesSection({
  items,
  uid,
  onContactClick,
}: ServicesSectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null)
  const stageRef = React.useRef<HTMLDivElement>(null)
  const haloRef = React.useRef<HTMLDivElement>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const progressRef = React.useRef<HTMLSpanElement>(null)
  const cardRefs = React.useRef<(HTMLElement | null)[]>([])
  const stRef = React.useRef<ScrollTrigger | null>(null)
  const [activeCard, setActiveCard] = React.useState(0)

  React.useLayoutEffect(() => {
    const stage = stageRef.current
    const track = trackRef.current
    if (!stage || !track || !items.length) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const mm = gsap.matchMedia()
    const baseColors = items.map((_, i) => CARD_THEMES[i % CARD_THEMES.length].base)
    const haloColors = items.map((_, i) => CARD_THEMES[i % CARD_THEMES.length].halo)
    const interpBase = gsap.utils.interpolate(baseColors)
    const interpHalo = gsap.utils.interpolate(haloColors)

    mm.add("(min-width: 769px)", () => {
      if (reduced) return

      const updateArc = (progress = 0) => {
        const clampedProgress = gsap.utils.clamp(0, 1, progress)

        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${Math.max(0.06, clampedProgress)})`
        }

        if (sectionRef.current) {
          sectionRef.current.style.backgroundColor = interpBase(clampedProgress)
        }
        if (haloRef.current) {
          haloRef.current.style.backgroundColor = interpHalo(clampedProgress)
        }

        const vw = stage.clientWidth
        const center = vw / 2
        let closestIdx = 0
        let closestDist = Infinity

        cardRefs.current.forEach((card, idx) => {
          if (!card) return
          const rect = card.getBoundingClientRect()
          const cardCenter = rect.left + rect.width / 2
          const norm = (cardCenter - center) / Math.max(rect.width * 1.15, 340)
          const abs = Math.abs(norm)

          if (abs < closestDist) {
            closestDist = abs
            closestIdx = idx
          }

          const rot = gsap.utils.clamp(-14, 14, norm * 10.5)
          const yOffset = -10 + Math.min(96, abs * abs * 42)
          const sc = Math.max(0.76, 1.04 - abs * 0.22)
          const op = Math.max(0.52, 1 - abs * 0.26)

          gsap.set(card, {
            rotate: rot,
            y: yOffset,
            scale: sc,
            opacity: op,
            zIndex: Math.round(20 - abs * 10),
          })
        })

        setActiveCard(closestIdx)
      }

      const getDistance = () => {
        const cards = cardRefs.current.filter(Boolean) as HTMLElement[]
        if (cards.length <= 1) return 0
        const first = cards[0]
        const last = cards[cards.length - 1]
        return Math.max(0, last.offsetLeft - first.offsetLeft)
      }

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${Math.max(1200, getDistance() * 1.15)}`,
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => updateArc(self.progress),
          onRefresh: (self) => updateArc(self.progress),
        },
      })

      stRef.current = tween.scrollTrigger ?? null
      updateArc(0)

      return () => {
        stRef.current = null
      }
    })

    return () => mm.revert()
  }, [items.length])

  const jumpToCard = (idx: number) => {
    const targetIdx = Math.max(0, Math.min(items.length - 1, idx))
    const st = stRef.current
    if (st && items.length > 1) {
      const progress = targetIdx / (items.length - 1)
      const y = st.start + (st.end - st.start) * progress
      window.scrollTo({ top: y, behavior: "smooth" })
    } else {
      cardRefs.current[targetIdx]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
      setActiveCard(targetIdx)
    }
  }

  return (
    <section
      ref={sectionRef}
      id="services"
      className="ovs-sec ovs-services"
      data-sec="services"
      aria-labelledby={uid + "svc"}
    >
      <div ref={stageRef} className="ovs-svc-stage">
        {/* Ambient Stage Layers */}
        <div className="ovs-svc-stage-grid" aria-hidden="true" />
        <div ref={haloRef} className="ovs-svc-stage-halo" aria-hidden="true" />

        {/* Top Bar: Episode Pill + Interactive Dots + Controls */}
        <div className="ovs-svc-topbar">
          <div className="ovs-svc-episode" id={uid + "svc"}>
            <span className="ovs-svc-ep-dot" aria-hidden="true" />
            <span>02 | SERVICES — SCROLL TO EXPLORE</span>
          </div>

          <div className="ovs-svc-nav">
            <div className="ovs-svc-dots" role="tablist" aria-label="Service cards">
              {items.map((s, idx) => (
                <button
                  key={s.title}
                  type="button"
                  role="tab"
                  aria-selected={activeCard === idx}
                  aria-label={`View ${s.title}`}
                  className="ovs-svc-pip"
                  data-active={activeCard === idx ? "" : undefined}
                  onClick={() => jumpToCard(idx)}
                />
              ))}
            </div>
            <span className="ovs-svc-counter">
              {activeCard + 1 < 10 ? `0${activeCard + 1}` : activeCard + 1} /{" "}
              {items.length < 10 ? `0${items.length}` : items.length}
            </span>
            <button
              type="button"
              className="ovs-svc-navbtn"
              onClick={() => jumpToCard(activeCard - 1)}
              disabled={activeCard === 0}
              aria-label="Previous service"
            >
              ←
            </button>
            <button
              type="button"
              className="ovs-svc-navbtn"
              onClick={() => jumpToCard(activeCard + 1)}
              disabled={activeCard === items.length - 1}
              aria-label="Next service"
            >
              →
            </button>
          </div>
        </div>

        {/* Massive Outlined Watermark */}
        <div className="ovs-svc-watermark" aria-hidden="true">
          SERVICES
        </div>

        {/* Horizontal Arc Card Deck */}
        <div className="ovs-svc-deck">
          <div ref={trackRef} className="ovs-svc-deck-track">
            {items.map((s, i) => {
              const pill = CARD_PILLS[s.art || "site"] || CARD_PILLS.site
              const num = i + 1 < 10 ? `0${i + 1}` : String(i + 1)

              return (
                <article
                  key={s.title}
                  ref={(el) => {
                    cardRefs.current[i] = el
                  }}
                  className="ovs-svc-pcard"
                  data-active={activeCard === i ? "" : undefined}
                  onClick={() => {
                    if (activeCard !== i) jumpToCard(i)
                  }}
                >
                  {/* Full-bleed Background Image */}
                  {s.image ? (
                    <img
                      src={s.image}
                      alt={s.title}
                      className="ovs-svc-pcard-bg"
                      loading="lazy"
                    />
                  ) : null}

                  {/* Gradient Scrim for Foreground Readability */}
                  <div className="ovs-svc-pcard-scrim" aria-hidden="true" />

                  {/* Top Row: Category Pill + Index */}
                  <div className="ovs-svc-pcard-top">
                    <span className="ovs-svc-pcard-pill" style={{ background: pill.bg }}>
                      {pill.label}
                    </span>
                    <span className="ovs-svc-pcard-idx">{num}</span>
                  </div>

                  {/* Bottom Foreground Content in front of Image */}
                  <div className="ovs-svc-pcard-foot">
                    <h3 className="ovs-svc-pcard-title">{s.title}</h3>
                    <p className="ovs-svc-pcard-desc">{s.text}</p>
                    <div className="ovs-svc-pcard-actions">
                      <a
                        href="#contact"
                        className="ovs-svc-pcard-cta"
                        onClick={(e) => {
                          e.stopPropagation()
                          onContactClick(e)
                        }}
                      >
                        <span>START PROJECT</span>
                        <span className="ovs-svc-pcard-arrow" aria-hidden="true">
                          →
                        </span>
                      </a>
                      <span className="ovs-svc-pcard-time">{s.time}</span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        {/* Bottom Scroll Progress Track */}
        <div className="ovs-svc-progress" aria-hidden="true">
          <span ref={progressRef} className="ovs-svc-progress-fill" />
        </div>
      </div>
    </section>
  )
}
