import * as React from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Arrow, Kicker, Magnet, Split } from "../ui-primitives"
import desktopViewImg from "../../../Img/screen_size/Desktop_view.webp"
import tabletViewImg from "../../../Img/screen_size/Tablet_view.webp"
import mobileViewImg from "../../../Img/screen_size/Mobile_view.webp"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface ResponsiveSectionProps {
  uid: string
  onContactClick?: (e: React.MouseEvent) => void
}

export function ResponsiveSection({ uid, onContactClick }: ResponsiveSectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null)
  const [hovered, setHovered] = React.useState<"desktop" | "tablet" | "phone" | null>(null)

  React.useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    const ctx = gsap.context(() => {
      const stats = el.querySelectorAll(".ovs-resp-statblock")
      const devices = el.querySelectorAll(".ovs-resp-device")
      const cubesA = el.querySelectorAll(".ovs-resp-cube-a")
      const cubesB = el.querySelectorAll(".ovs-resp-cube-b")
      const cubesC = el.querySelectorAll(".ovs-resp-cube-c")
      const isoGrid = el.querySelector(".ovs-resp-isogrid")
      const tiles = el.querySelectorAll(".ovs-resp-tile")
      const beams = el.querySelectorAll(".ovs-resp-beam")
      const nodes = el.querySelectorAll(".ovs-resp-node")
      const glowOrb = el.querySelector(".ovs-resp-glow-orb")

      if (cubesA.length) {
        gsap.to(cubesA, {
          y: -22,
          x: 8,
          rotation: 4,
          scale: 1.04,
          transformOrigin: "50% 50%",
          duration: 3.6,
          stagger: 0.7,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      }
      if (cubesB.length) {
        gsap.to(cubesB, {
          y: 18,
          x: -9,
          rotation: -5,
          scale: 0.96,
          transformOrigin: "50% 50%",
          duration: 4.4,
          stagger: 0.9,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      }
      if (cubesC.length) {
        gsap.to(cubesC, {
          y: -16,
          x: -6,
          rotation: 8,
          scale: 1.08,
          transformOrigin: "50% 50%",
          duration: 3.2,
          stagger: 0.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      }
      if (tiles.length) {
        gsap.fromTo(
          tiles,
          { opacity: 0.25, scale: 0.92, transformOrigin: "50% 50%" },
          {
            opacity: 1,
            scale: 1.04,
            duration: 2.2,
            stagger: { each: 0.45, repeat: -1, yoyo: true },
            ease: "sine.inOut",
          },
        )
      }
      if (beams.length) {
        beams.forEach((beam, i) => {
          gsap.set(beam, { strokeDasharray: "0.22 0.78", strokeDashoffset: 1 })
          gsap.to(beam, {
            strokeDashoffset: -1,
            duration: 3.4 + i * 0.9,
            delay: i * 0.8,
            ease: "none",
            repeat: -1,
          })
        })
      }
      if (nodes.length) {
        gsap.to(nodes, {
          scale: 1.7,
          opacity: 0.4,
          transformOrigin: "50% 50%",
          duration: 1.6,
          stagger: { each: 0.35, repeat: -1, yoyo: true },
          ease: "sine.inOut",
        })
      }
      if (glowOrb) {
        gsap.to(glowOrb, {
          scale: 1.15,
          opacity: 0.85,
          transformOrigin: "50% 50%",
          duration: 4.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      }
      if (isoGrid) {
        gsap.to(isoGrid, {
          y: 24,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        })
      }

      if (stats.length) {
        gsap.fromTo(
          stats,
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.75,
            stagger: 0.14,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: { trigger: el, start: "top 78%", once: true },
          },
        )
      }
      if (devices.length) {
        gsap.fromTo(
          devices,
          { y: 36, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: { trigger: el, start: "top 76%", once: true },
          },
        )
      }
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="responsive"
      className="ovs-sec ovs-resp"
      data-sec="responsive"
      aria-labelledby={uid + "resp"}
    >
      <div className="ovs-resp-glow" aria-hidden="true" />
      <div className="ovs-resp-bgshapes" aria-hidden="true">
        <svg viewBox="0 0 600 420" fill="none">
          <defs>
            <radialGradient id={uid + "rg"} cx="72%" cy="28%" r="58%">
              <stop offset="0%" stopColor="var(--ovs-accent)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--ovs-accent)" stopOpacity="0" />
            </radialGradient>

            {/* Isometric 30-degree grid tile (width 69.28, height 40) */}
            <pattern
              id={uid + "isogrid"}
              width="69.282"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 0 20 L 34.641 0 L 69.282 20 L 34.641 40 Z"
                stroke="currentColor"
                strokeOpacity="0.14"
                strokeWidth="0.9"
                fill="none"
              />
              <path
                d="M 34.641 0 L 34.641 40"
                stroke="currentColor"
                strokeOpacity="0.07"
                strokeWidth="0.8"
                strokeDasharray="2 3"
              />
            </pattern>
          </defs>

          {/* Soft Ambient Glow */}
          <circle className="ovs-resp-glow-orb" cx="430" cy="125" r="220" fill={`url(#${uid}rg)`} />

          {/* Isometric 3D Grid Plane */}
          <g className="ovs-resp-isogrid">
            <rect x="60" y="-20" width="560" height="440" fill={`url(#${uid}isogrid)`} />

            {/* Animated Pulsing Isometric Grid Diamonds */}
            <path
              className="ovs-resp-tile"
              d="M 346.41 80 L 381.05 60 L 415.69 80 L 381.05 100 Z"
              fill="var(--ovs-accent)"
              fillOpacity="0.18"
              stroke="var(--ovs-accent)"
              strokeOpacity="0.45"
              strokeWidth="1.1"
            />
            <path
              className="ovs-resp-tile"
              d="M 450.33 140 L 484.97 120 L 519.61 140 L 484.97 160 Z"
              fill="var(--ovs-soft)"
              fillOpacity="0.16"
              stroke="var(--ovs-soft)"
              strokeOpacity="0.4"
              strokeWidth="1.1"
            />
            <path
              className="ovs-resp-tile"
              d="M 277.13 180 L 311.77 160 L 346.41 180 L 311.77 200 Z"
              fill="var(--ovs-accent)"
              fillOpacity="0.14"
              stroke="var(--ovs-accent)"
              strokeOpacity="0.32"
              strokeWidth="1"
            />
            <path
              className="ovs-resp-tile"
              d="M 381.05 200 L 415.69 180 L 450.33 200 L 415.69 220 Z"
              fill="var(--ovs-soft)"
              fillOpacity="0.12"
              stroke="var(--ovs-soft)"
              strokeOpacity="0.3"
              strokeWidth="1"
            />

            {/* Glowing Isometric Data Beams tracing along the 30° grid */}
            <path
              className="ovs-resp-beam"
              pathLength={1}
              d="M 207.85 140 L 381.05 40 L 554.25 140"
              stroke="var(--ovs-accent)"
              strokeOpacity="0.65"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              className="ovs-resp-beam"
              pathLength={1}
              d="M 242.49 240 L 415.69 140 L 588.9 240"
              stroke="var(--ovs-soft)"
              strokeOpacity="0.6"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              className="ovs-resp-beam"
              pathLength={1}
              d="M 311.77 20 L 484.97 120 L 346.41 200"
              stroke="var(--ovs-accent)"
              strokeOpacity="0.55"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </g>

          {/* Cube 1 — Hero Large Translucent Isometric Cube (Top Right) */}
          <g className="ovs-resp-cube-a">
            {/* Top face */}
            <path
              d="M 445 64 L 497 94 L 445 124 L 393 94 Z"
              fill="var(--ovs-soft)"
              fillOpacity="0.18"
              stroke="var(--ovs-accent)"
              strokeOpacity="0.48"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            {/* Left face */}
            <path
              d="M 393 94 L 445 124 L 445 184 L 393 154 Z"
              fill="var(--ovs-accent)"
              fillOpacity="0.14"
              stroke="var(--ovs-accent)"
              strokeOpacity="0.42"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            {/* Right face */}
            <path
              d="M 445 124 L 497 94 L 497 154 L 445 184 Z"
              fill="currentColor"
              fillOpacity="0.07"
              stroke="var(--ovs-accent)"
              strokeOpacity="0.36"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            {/* Glowing corner node */}
            <circle className="ovs-resp-node" cx="445" cy="124" r="3.2" fill="var(--ovs-soft)" fillOpacity="0.95" />
          </g>

          {/* Cube 2 — Medium Wireframe Cube (Mid-Left of Cluster) */}
          <g className="ovs-resp-cube-b">
            <path
              d="M 305 110 L 343 132 L 305 154 L 267 132 Z"
              fill="var(--ovs-accent)"
              fillOpacity="0.08"
              stroke="currentColor"
              strokeOpacity="0.32"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d="M 267 132 L 305 154 L 305 198 L 267 176 Z"
              stroke="currentColor"
              strokeOpacity="0.26"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d="M 305 154 L 343 132 L 343 176 L 305 198 Z"
              stroke="currentColor"
              strokeOpacity="0.2"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Internal dashed depth edges */}
            <path
              d="M 305 110 L 305 154 M 267 176 L 305 154 M 343 176 L 305 154"
              stroke="var(--ovs-accent)"
              strokeOpacity="0.24"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle className="ovs-resp-node" cx="305" cy="110" r="2.8" fill="var(--ovs-accent)" fillOpacity="0.9" />
            <circle cx="305" cy="198" r="2.5" fill="currentColor" fillOpacity="0.45" />
          </g>

          {/* Cube 3 — Small Accent Floating Cube (Lower Right) */}
          <g className="ovs-resp-cube-b">
            <path
              d="M 522 188 L 552 205 L 522 222 L 492 205 Z"
              fill="var(--ovs-accent)"
              fillOpacity="0.25"
              stroke="var(--ovs-soft)"
              strokeOpacity="0.55"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d="M 492 205 L 522 222 L 522 256 L 492 239 Z"
              fill="var(--ovs-accent)"
              fillOpacity="0.16"
              stroke="var(--ovs-accent)"
              strokeOpacity="0.45"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d="M 522 222 L 552 205 L 552 239 L 522 256 Z"
              fill="currentColor"
              fillOpacity="0.08"
              stroke="var(--ovs-accent)"
              strokeOpacity="0.35"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <circle className="ovs-resp-node" cx="522" cy="222" r="2.6" fill="var(--ovs-soft)" fillOpacity="0.9" />
          </g>

          {/* Cube 4 — Tiny Geometric Cube (Upper Center) */}
          <g className="ovs-resp-cube-c">
            <path
              d="M 366 36 L 386 48 L 366 60 L 346 48 Z"
              fill="var(--ovs-soft)"
              fillOpacity="0.24"
              stroke="var(--ovs-soft)"
              strokeOpacity="0.5"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            <path
              d="M 346 48 L 366 60 L 366 84 L 346 72 Z"
              fill="var(--ovs-accent)"
              fillOpacity="0.18"
              stroke="var(--ovs-accent)"
              strokeOpacity="0.4"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            <path
              d="M 366 60 L 386 48 L 386 72 L 366 84 Z"
              fill="currentColor"
              fillOpacity="0.08"
              stroke="var(--ovs-accent)"
              strokeOpacity="0.32"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
          </g>

          {/* Cube 5 — Subtle Wireframe Cube (Bottom Center) */}
          <g className="ovs-resp-cube-a">
            <path
              d="M 412 222 L 438 237 L 412 252 L 386 237 Z"
              stroke="var(--ovs-accent)"
              strokeOpacity="0.34"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            <path
              d="M 386 237 L 412 252 L 412 282 L 386 267 Z"
              stroke="currentColor"
              strokeOpacity="0.22"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            <path
              d="M 412 252 L 438 237 L 438 267 L 412 282 Z"
              stroke="currentColor"
              strokeOpacity="0.18"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            <circle className="ovs-resp-node" cx="412" cy="252" r="2.4" fill="var(--ovs-accent)" fillOpacity="0.8" />
          </g>
        </svg>
      </div>

      <div className="ovs-wrap">
        <div className="ovs-resp-top">
          <Kicker n="04" text="Multi-Device Craft" />
          <span id={uid + "resp"} className="block">
            <Split text="Optimized for every screen size." className="ovs-h2" />
          </span>
        </div>

        <div className="ovs-resp-layout">
          {/* Left Stats Column */}
          <div className="ovs-resp-left">
            <div className="ovs-resp-statblock">
              <div className="ovs-resp-num">
                <span>&gt;60</span>
                <sup className="ovs-resp-pct">%</sup>
              </div>
              <p className="ovs-resp-copy">
                of your users will visit on mobile first. We{" "}
                <strong>design and build for that reality.</strong>
              </p>
            </div>

            <div className="ovs-resp-statblock">
              <div className="ovs-resp-num">
                <span>1 second</span>
              </div>
              <p className="ovs-resp-copy">
                of extra load time can drop{" "}
                <strong>conversion by up to 20%</strong>
              </p>
            </div>

            <div className="ovs-resp-cta" data-rv>
              <Magnet className="ovs-btn ovs-btn-dark" href="#contact" onClick={onContactClick}>
                <span>Build Mobile-First</span>
                <Arrow />
              </Magnet>
            </div>
          </div>

          {/* Right 3-Device Showcase: Desktop, Tablet, Phone */}
          <div
            className="ovs-resp-devices"
            data-hovering={hovered ? "" : undefined}
            onPointerLeave={() => setHovered(null)}
          >
            {/* Desktop */}
            <div
              className="ovs-resp-device ovs-resp-device-desktop"
              data-focused={hovered === "desktop" ? "" : undefined}
              onPointerEnter={() => setHovered("desktop")}
            >
              <div className="ovs-resp-shell">
                <div className="ovs-resp-bezel-bar" aria-hidden="true">
                  <span className="ovs-resp-bdots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="ovs-resp-burl">vayalcode.com</span>
                </div>
                <div className="ovs-resp-screen">
                  <img
                    src={desktopViewImg}
                    alt="Desktop responsive view"
                    className="ovs-resp-img"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="ovs-resp-label">
                <span className="ovs-resp-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </span>
                <span>Desktop</span>
                <small>1440px</small>
              </div>
            </div>

            {/* Tablet */}
            <div
              className="ovs-resp-device ovs-resp-device-tablet"
              data-focused={hovered === "tablet" ? "" : undefined}
              onPointerEnter={() => setHovered("tablet")}
            >
              <div className="ovs-resp-shell">
                <span className="ovs-resp-cam" aria-hidden="true" />
                <div className="ovs-resp-screen">
                  <img
                    src={tabletViewImg}
                    alt="Tablet responsive view"
                    className="ovs-resp-img"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="ovs-resp-label">
                <span className="ovs-resp-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                </span>
                <span>Tablet</span>
                <small>768px</small>
              </div>
            </div>

            {/* Phone */}
            <div
              className="ovs-resp-device ovs-resp-device-phone"
              data-focused={hovered === "phone" ? "" : undefined}
              onPointerEnter={() => setHovered("phone")}
            >
              <div className="ovs-resp-shell">
                <span className="ovs-resp-notch" aria-hidden="true" />
                <div className="ovs-resp-screen">
                  <img
                    src={mobileViewImg}
                    alt="Phone responsive view"
                    className="ovs-resp-img"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="ovs-resp-label">
                <span className="ovs-resp-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="2" width="12" height="20" rx="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                </span>
                <span>Phone</span>
                <small>390px</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
