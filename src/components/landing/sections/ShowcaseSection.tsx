import * as React from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import CardStackDemoPage from "@/components/ui/demo"
import { Arrow, Magnet } from "../ui-primitives"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface ShowcaseSectionProps {
  onAllProjectsClick?: (e: React.MouseEvent) => void
}

export function ShowcaseSection({ onAllProjectsClick }: ShowcaseSectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null)
  const badgeRef = React.useRef<HTMLSpanElement>(null)
  const titleRef = React.useRef<HTMLHeadingElement>(null)
  const descRef = React.useRef<HTMLParagraphElement>(null)
  const cardsRef = React.useRef<HTMLDivElement>(null)
  const ctaRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reducedMotion) return

    const ctx = gsap.context(() => {
      // 1. Coordinated entrance timeline triggered on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 78%",
          once: true,
        },
      })

      // Badge entrance
      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { autoAlpha: 0, y: 22, scale: 0.88 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(2)" },
          0
        )
      }

      // Title word split reveal
      const words = el.querySelectorAll("[data-showcase-word]")
      if (words.length > 0) {
        tl.fromTo(
          words,
          { yPercent: 120, rotate: 3, opacity: 0 },
          { yPercent: 0, rotate: 0, opacity: 1, duration: 1.1, stagger: 0.06, ease: "expo.out" },
          0.1
        )
      }

      // Description text reveal
      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { autoAlpha: 0, y: 25 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" },
          0.3
        )
      }

      // 3D Card Stack entrance
      if (cardsRef.current) {
        tl.fromTo(
          cardsRef.current,
          { autoAlpha: 0, y: 60, scale: 0.93 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" },
          0.4
        )
      }

      // All Projects button entrance
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { autoAlpha: 0, y: 30, scale: 0.88 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.85, ease: "back.out(2)" },
          0.6
        )
      }

      // 2. Interactive scroll parallax scrub on the 3D card stack container
      if (cardsRef.current) {
        gsap.to(cardsRef.current, {
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const titleWords = ["Featured", "Client", "Websites"]

  return (
    <section
      ref={sectionRef}
      id="showcase"
      className="ovs-sec ovs-showcase"
      data-sec="showcase"
    >
      <div className="ovs-showcase-glow" aria-hidden="true" />

      <div className="ovs-wrap ovs-showcase-wrap">
        {/* Centered Section Header */}
        <div className="ovs-showcase-head">
          <span ref={badgeRef} className="ovs-showcase-pill">
            <span className="ovs-showcase-dot" aria-hidden="true" />
            <span>05 / Selected Work</span>
          </span>

          <h2 ref={titleRef} className="ovs-h2 ovs-showcase-title">
            {titleWords.map((word, i) => (
              <span
                key={i}
                className="inline-block overflow-hidden align-top"
                style={{ margin: "0 0.15em" }}
              >
                <span data-showcase-word className="inline-block">
                  {word}
                </span>
              </span>
            ))}
          </h2>

          <p ref={descRef} className="ovs-showcase-desc">
            Explore real websites, e-commerce stores, and digital platforms we&apos;ve designed and engineered for growing brands.
          </p>
        </div>

        {/* Centered Interactive Card Stack Container */}
        <div ref={cardsRef} className="ovs-showcase-stage">
          <CardStackDemoPage />
          <div ref={ctaRef} className="ovs-showcase-cta">
            <Magnet
              className="ovs-btn ovs-btn-lime ovs-btn-xl cursor-pointer"
              href="#contact"
              onClick={onAllProjectsClick}
            >
              <span>All Projects</span>
              <Arrow />
            </Magnet>
          </div>
        </div>
      </div>
    </section>
  )
}
