"use client"

import * as React from "react"
import Lenis from "lenis"
import "lenis/dist/lenis.css"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import "./overstory-studio-landing.css"

import {
  clamp,
  formatNumber,
  isEmail,
  SEASONS,
  stepAt,
} from "../landing/canopy-engine"
import { OVS_PHOTO } from "../landing/canopy-photo"
import {
  DEFAULT_CASES,
  DEFAULT_CTA,
  DEFAULT_FOOTER,
  DEFAULT_HERO,
  DEFAULT_LINKS,
  DEFAULT_LOGOS,
  DEFAULT_MANIFESTO,
  DEFAULT_PLANS,
  DEFAULT_QUOTES,
  DEFAULT_SERVICES,
  DEFAULT_STATS,
  DEFAULT_STEPS,
} from "../landing/constants"
import { ContactSection } from "../landing/sections/ContactSection"
import { ClientsSection } from "../landing/sections/ClientsSection"
import { FinaleSection } from "../landing/sections/FinaleSection"
import { MetaAdsSection } from "../landing/sections/MetaAdsSection"
import { TestimonialsSection } from "../landing/sections/TestimonialsSection"
import { FooterSection } from "../landing/sections/FooterSection"
import { HeroSection } from "../landing/sections/HeroSection"
import { ManifestoSection } from "../landing/sections/ManifestoSection"
import { Navbar } from "../landing/sections/Navbar"
import { PricingSection } from "../landing/sections/PricingSection"
import { ProcessSection } from "../landing/sections/ProcessSection"
import { QuotesSection } from "../landing/sections/QuotesSection"
import { ServicesSection } from "../landing/sections/ServicesSection"
import { ResponsiveSection } from "../landing/sections/ResponsiveSection"
import { ShowcaseSection } from "../landing/sections/ShowcaseSection"
import {
  OverstoryStudioLandingProps,
  OvsCase,
  OvsCta,
  OvsFaq,
  OvsHero,
  OvsLink,
  OvsLogo,
  OvsManifesto,
  OvsMark,
  OvsMock,
  OvsPlan,
  OvsQuote,
  OvsSeason,
  OvsService,
  OvsServiceArt,
  OvsStat,
  OvsStep,
} from "../landing/types"

// Re-export all types so existing imports from this file remain 100% backwards-compatible
export type {
  OverstoryStudioLandingProps,
  OvsCase,
  OvsCta,
  OvsFaq,
  OvsHero,
  OvsLink,
  OvsLogo,
  OvsManifesto,
  OvsMark,
  OvsMock,
  OvsPlan,
  OvsQuote,
  OvsSeason,
  OvsService,
  OvsServiceArt,
  OvsStat,
  OvsStep,
}

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger)

const useIso = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

function readScheme(theme: "auto" | "light" | "dark") {
  if (theme !== "auto") return theme
  if (typeof document === "undefined") return "light"
  return document.documentElement.classList.contains("dark") || document.body.classList.contains("dark") ? "dark" : "light"
}

export default function OverstoryStudioLanding({
  brand = "Overstory",
  links = DEFAULT_LINKS,
  status = null,
  hero,
  logos = DEFAULT_LOGOS as OvsLogo[],
  manifesto = DEFAULT_MANIFESTO,
  stats = DEFAULT_STATS,
  services,
  work,
  process,
  quotes = DEFAULT_QUOTES as OvsQuote[],
  pricing,
  faq,
  cta = DEFAULT_CTA,
  footer = DEFAULT_FOOTER,
  email = "hello@vayalcode.com",
  currency = "₹",
  season = "summer",
  photo = OVS_PHOTO,
  seed = 7,
  theme = "auto",
  themeToggle = true,
  onBook,
  onAllProjects,
  onSubscribe,
  height = "100svh",
  className = "",
}: OverstoryStudioLandingProps) {
  const uid = "ovs" + React.useId().replace(/[^a-zA-Z0-9]/g, "")
  const root = React.useRef(null as HTMLDivElement | null)
  const H = { ...DEFAULT_HERO, ...hero }
  const words = H.words && H.words.length ? H.words : DEFAULT_HERO.words

  const svc = services === null ? null : {
    kicker: services?.kicker || "Our Services",
    title: services?.title || "End-to-end digital services\nbuilt to scale your business.",
    text: services?.text || "From high-converting landing pages to bespoke software, custom e-commerce stores, and performance marketing, we deliver results that move the needle.",
    items: services?.items || (DEFAULT_SERVICES as OvsService[]),
  }

  const pr = process === null ? null : {
    kicker: process?.kicker || "How We Work",
    title: process?.title || "A clear, collaborative path from discovery to scale.",
    steps: process?.steps || DEFAULT_STEPS,
  }

  const pc = pricing === null ? null : {
    kicker: pricing?.kicker || "Engagement Models",
    title: pricing?.title || "Transparent pricing. No hidden fees or surprises.",
    text: pricing?.text || "Every project starts with a detailed discovery consultation and a written proposal.",
    plans: pricing?.plans || (DEFAULT_PLANS as OvsPlan[]),
    quarterlyNote: pricing?.quarterlyNote || "Save 10%",
  }

  const ft = footer === null ? null : {
    columns: footer?.columns || DEFAULT_FOOTER.columns,
    city: footer?.city || DEFAULT_FOOTER.city,
    timeZone: footer?.timeZone || DEFAULT_FOOTER.timeZone,
    note: footer?.note || DEFAULT_FOOTER.note,
  }

  const pal = SEASONS[season] || SEASONS.summer

  const [scheme, setScheme] = React.useState("light" as "light" | "dark")
  const [override, setOverride] = React.useState(null as null | "light" | "dark")
  const [still, setStill] = React.useState(false)
  const [menu, setMenu] = React.useState(false)
  const [photoFail, setPhotoFail] = React.useState(false)
  const usePhoto = !!photo && !photoFail
  const [active, setActive] = React.useState("")
  const [quarterly, setQuarterly] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const [mail, setMail] = React.useState("")
  const [mailState, setMailState] = React.useState("idle" as "idle" | "sending" | "done" | "error" | "invalid")
  const [svcIdx, setSvcIdx] = React.useState(-1)

  const goToSvc = React.useCallback((idx: number) => {
    setSvcIdx(idx)
  }, [])

  const heroIn = React.useRef(null as null | (() => void))
  const heroReady = React.useRef(false)
  const gust = React.useRef(null as null | ((x: number) => void))
  const lenisRef = React.useRef<Lenis | null>(null)

  // Lenis smooth scrolling synced with GSAP ScrollTrigger
  React.useEffect(() => {
    if (still) return
    const lenis = new Lenis({
      duration: 1.65,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.48,
      touchMultiplier: 0.85,
    })
    lenisRef.current = lenis
    lenis.on("scroll", ScrollTrigger.update)

    const update = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [still])

  // scheme: explicit theme, else the nav switch, else host's .dark class
  React.useEffect(() => {
    const apply = () => setScheme(override || readScheme(theme))
    apply()
    if (theme !== "auto" || override) return
    const mo = new MutationObserver(apply)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => mo.disconnect()
  }, [theme, override])

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const on = () => setStill(mq.matches)
    on()
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])

  const go = React.useCallback(
    (href?: string) => (e?: React.MouseEvent) => {
      if (!href) return
      if (href === "/projects" && onAllProjects) {
        e?.preventDefault()
        setMenu(false)
        onAllProjects()
        return
      }
      if (!href.startsWith("#") || href.length < 2) return
      const el = root.current?.querySelector('[data-sec="' + href.slice(1) + '"]')
      if (!el) return
      e?.preventDefault()
      setMenu(false)
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (!reduced && lenisRef.current) {
        lenisRef.current.scrollTo(el as HTMLElement, { duration: 1.35 })
      } else {
        el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })
      }
    },
    [onAllProjects],
  )

  const book = (from: string) => (e: React.MouseEvent) => {
    if (onBook) {
      e.preventDefault()
      onBook(from)
    } else go("#contact")(e)
  }

  // nav scroll styling & intersection observer
  React.useEffect(() => {
    const r = root.current
    if (!r) return
    let last = window.scrollY
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        const top = r.getBoundingClientRect().top + y
        r.toggleAttribute("data-solid", y > top + 40)
        r.toggleAttribute("data-navhide", y > last + 4 && y > top + 400)
        if (y < last - 4) r.removeAttribute("data-navhide")
        last = y
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.sec || "")
      },
      { rootMargin: "-45% 0px -50% 0px" },
    )
    r.querySelectorAll("[data-sec]").forEach((s) => io.observe(s))
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])

  // mobile menu dialog
  const menuBtn = React.useRef(null as HTMLButtonElement | null)
  const sheet = React.useRef(null as HTMLDivElement | null)
  React.useEffect(() => {
    if (!menu) return
    const first = sheet.current?.querySelector("a,button") as HTMLElement | null
    first?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false)
        menuBtn.current?.focus()
      }
      if (e.key === "Tab" && sheet.current) {
        const f = Array.from(sheet.current.querySelectorAll("a,button")) as HTMLElement[]
        if (!f.length) return
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault()
          f[f.length - 1].focus()
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault()
          f[0].focus()
        }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [menu])

  /* ------------------------------------------------ GSAP scroll storyboard */
  useIso(() => {
    const r = root.current
    if (!r) return
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          wide: "(min-width: 820px)",
          fine: "(hover: hover) and (pointer: fine)",
        },
        (c) => {
          const { motion, wide, fine } = c.conditions as { motion: boolean; wide: boolean; fine: boolean }
          const q = gsap.utils.selector(r)
          const heroEl = q("[data-hero]")[0] as HTMLElement
          const heroLayers = q("[data-hero] [data-layer]") as HTMLElement[]
          const heroZoom = q("[data-hero] [data-zoom]") as HTMLElement[]
          const photoMode = !!heroEl.querySelector("[data-photo]")
          const undo = [] as (() => void)[]

          if (!motion) {
            r.setAttribute("data-still", "")
            heroIn.current = null
            return () => r.removeAttribute("data-still")
          }

          /* 1. arrival: words rise, trees close around the sky */
          const intro = gsap.timeline({ defaults: { ease: "expo.out" } })
          intro
            .fromTo(q(".ovs-nav-in"), { y: -28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2 }, 0.2)
            .fromTo(q("[data-hero] .ovs-status"), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, 0.25)
            .fromTo(
              q("[data-hero] .ovs-line > span"),
              { yPercent: 115, rotate: 2.5 },
              { yPercent: 0, rotate: 0, duration: 1.5, stagger: 0.12 },
              0.3,
            )
            .fromTo(q("[data-hero] .ovs-cue"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 0.95)

          gsap.set(heroLayers, { autoAlpha: 0 })
          if (!photoMode) gsap.set(q("[data-hero] [data-sky]"), { scale: 1.08 })
          let entered = false
          heroIn.current = () => {
            if (entered) return
            entered = true
            if (photoMode) {
              gsap.set(heroLayers[1], { autoAlpha: 1 })
              gsap.fromTo(
                heroLayers[0],
                { autoAlpha: 0, scale: 1.24, rotate: -4, filter: "blur(18px) brightness(1.25)" },
                {
                  autoAlpha: 1,
                  scale: 1,
                  rotate: 0,
                  filter: "blur(0px) brightness(1)",
                  duration: 2.9,
                  ease: "expo.out",
                  clearProps: "filter",
                },
              )
              return
            }
            gsap.to(q("[data-hero] [data-sky]"), { scale: 1, duration: 2.6, ease: "expo.out" })
            gsap.fromTo(
              heroLayers,
              { autoAlpha: 0, scale: (i: number) => 1.45 + i * 0.28, rotate: (i: number) => (i % 2 ? -6 : 6) },
              { autoAlpha: 1, scale: 1, rotate: 0, duration: 2.6, stagger: 0.14, ease: "expo.out" },
            )
          }
          if (heroReady.current) heroIn.current()

          /* 2. rise: scroll lifts you through canopy into open sky */
          const rise = gsap.timeline({
            scrollTrigger: { trigger: heroEl, start: "top top", end: "bottom bottom", scrub: 0.9 },
          })
          const zs = [1.55, 1.95, 2.6, 3.6]
          const rs = [2, -3, 5, -9]
          if (photoMode) {
            rise
              .to(heroZoom[0], { scale: 2.5, rotate: 6, ease: "power2.in", duration: 1 }, 0)
              .fromTo(heroZoom[1], { scale: 1.04, opacity: 0 }, { scale: 3.6, opacity: 1, ease: "power2.in", duration: 0.7 }, 0.04)
              .to(heroZoom[1], { opacity: 0, ease: "none", duration: 0.25 }, 0.74)
          } else {
            heroZoom.forEach((z, i) => rise.to(z, { scale: zs[i], rotate: rs[i], ease: "power2.in", duration: 1 }, 0))
            rise.to(q("[data-hero] [data-sky] canvas"), { scale: 1.22, ease: "none", duration: 1 }, 0)
          }
          rise
            .to(
              q("[data-hero] .ovs-copy"),
              {
                y: () => -window.innerHeight * 0.16,
                scale: 0.92,
                autoAlpha: 0,
                filter: "blur(10px)",
                ease: "power1.in",
                duration: 0.5,
              },
              0.05,
            )
            .to(q("[data-hero] .ovs-cue"), { autoAlpha: 0, duration: 0.1 }, 0)
            .fromTo(q("[data-hero] .ovs-veil"), { yPercent: 50 }, { yPercent: -50, ease: "power1.inOut", duration: 0.55 }, 0.45)
            .fromTo(q("[data-hero] .ovs-above"), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.62)

          /* pointer parallax and gust */
          if (fine) {
            const depth = photoMode ? [16, 48] : [8, 14, 24, 40]
            const xs = heroLayers.map((l) => gsap.quickTo(l, "x", { duration: 1.4, ease: "power3.out" }))
            const ys = heroLayers.map((l) => gsap.quickTo(l, "y", { duration: 1.4, ease: "power3.out" }))
            const cx = gsap.quickTo(q("[data-hero] .ovs-copy"), "x", { duration: 1.6, ease: "power3.out" })
            const onMove = (e: PointerEvent) => {
              const b = heroEl.getBoundingClientRect()
              const nx = (e.clientX - b.left) / b.width - 0.5
              const ny = (e.clientY - b.top) / window.innerHeight - 0.5
              heroLayers.forEach((_, i) => {
                xs[i](-nx * depth[i])
                ys[i](-ny * depth[i] * 0.7)
              })
              cx(nx * 6)
            }
            heroEl.addEventListener("pointermove", onMove)
            undo.push(() => heroEl.removeEventListener("pointermove", onMove))
          }
          gust.current = (x: number) => {
            const dir = x < 0.5 ? 1 : -1
            heroLayers.forEach((l, i) => {
              gsap
                .timeline()
                .to(l, { rotate: dir * (0.6 + i * 0.5), duration: 0.35 + i * 0.05, ease: "power2.out" })
                .to(l, { rotate: 0, duration: 1.6, ease: "elastic.out(1,0.35)" })
            })
            const burst = q("[data-hero] [data-fall='burst']") as HTMLElement[]
            burst.forEach((leaf, i) => {
              const b = heroEl.getBoundingClientRect()
              gsap.killTweensOf(leaf)
              gsap.fromTo(
                leaf,
                { x: b.width * (0.15 + Math.random() * 0.7), y: -40, rotate: Math.random() * 360, autoAlpha: 1 },
                {
                  x: "+=" + (dir * (80 + Math.random() * 220)),
                  y: window.innerHeight * (0.7 + Math.random() * 0.5),
                  rotate: "+=" + (220 + Math.random() * 300),
                  duration: 3.2 + Math.random() * 2,
                  delay: i * 0.06,
                  ease: "power1.in",
                  onComplete: () => {
                    gsap.set(leaf, { autoAlpha: 0 })
                  },
                },
              )
            })
          }
          undo.push(() => (gust.current = null))

          /* idle falling leaves */
          const falling = q("[data-hero] [data-fall='idle']") as HTMLElement[]
          const fall = (leaf: HTMLElement, delay: number) => {
            const b = heroEl.getBoundingClientRect()
            gsap.fromTo(
              leaf,
              { x: b.width * Math.random(), y: -60, rotate: Math.random() * 360, autoAlpha: 0.9 },
              {
                y: window.innerHeight + 60,
                x: "+=" + (Math.random() * 240 - 120),
                rotate: "+=" + (Math.random() * 540 - 270),
                duration: 11 + Math.random() * 8,
                delay,
                ease: "none",
                onComplete: () => fall(leaf, Math.random() * 3),
              },
            )
          }
          falling.forEach((l, i) => fall(l, 1.6 + i * 2.4))
          q("[data-fall] > *").forEach((inner: Element, i: number) =>
            gsap.to(inner, {
              rotateX: 70,
              rotateY: 30,
              x: i % 2 ? 16 : -16,
              duration: 1.4 + (i % 3) * 0.5,
              yoyo: true,
              repeat: -1,
              ease: "sine.inOut",
            }),
          )

          /* 3. headings reveal */
          q("[data-split]").forEach((h: Element) => {
            gsap.fromTo(
              h.querySelectorAll("[data-w]"),
              { yPercent: 115, rotate: 3 },
              {
                yPercent: 0,
                rotate: 0,
                duration: 1.3,
                stagger: 0.045,
                ease: "expo.out",
                scrollTrigger: { trigger: h, start: "top 88%", once: true },
              },
            )
          })

          const rv = q("[data-rv]") as HTMLElement[]
          gsap.set(rv, { autoAlpha: 0, y: 34 })
          ScrollTrigger.batch(rv, {
            start: "top 90%",
            once: true,
            onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, ease: "expo.out", overwrite: true }),
          })

          /* 4. manifesto */
          const man = q("[data-manifesto]")[0]
          if (man) {
            gsap.fromTo(
              man.querySelectorAll("[data-mw]"),
              { opacity: 0.12 },
              {
                opacity: 1,
                stagger: 0.08,
                ease: "none",
                scrollTrigger: { trigger: man, start: "top 78%", end: "bottom 45%", scrub: true },
              },
            )
            gsap.fromTo(
              man.querySelectorAll(".ovs-pic"),
              { scale: 0, rotate: -12 },
              {
                scale: 1,
                rotate: 0,
                ease: "back.out(2)",
                duration: 0.9,
                stagger: 0.2,
                scrollTrigger: { trigger: man, start: "top 60%", once: true },
              },
            )
          }

          q("[data-count]").forEach((el: Element) => {
            const e = el as HTMLElement
            const to = Number(e.dataset.count)
            const dec = Number(e.dataset.dec || 0)
            const o = { v: 0 }
            e.textContent = (e.dataset.pre || "") + formatNumber(0, dec) + (e.dataset.suf || "")
            gsap.to(o, {
              v: to,
              duration: 2.2,
              ease: "expo.out",
              scrollTrigger: { trigger: e, start: "top 88%", once: true },
              onUpdate: () => (e.textContent = (e.dataset.pre || "") + formatNumber(o.v, dec) + (e.dataset.suf || "")),
            })
          })

          /* 5. services accordion transitions are handled in ServicesSection */

          /* 6. process: tree growth animation */
          const proc = q("[data-process]")[0] as HTMLElement | undefined
          if (proc) {
            const grow = gsap.timeline({
              scrollTrigger: { trigger: proc.querySelector(".ovs-steps"), start: "top 65%", end: "bottom 70%", scrub: 0.8 },
            })
            gsap.set(proc.querySelectorAll("[data-grow]"), { strokeDasharray: 1, strokeDashoffset: 1 })
            gsap.set(proc.querySelectorAll("[data-leaves] > *"), { scale: 0, transformOrigin: "50% 50%" })
            for (let s = 0; s < 4; s++) {
              const stems = proc.querySelectorAll('[data-grow="' + s + '"]')
              if (stems.length) grow.to(stems, { strokeDashoffset: 0, duration: 1, ease: "none" }, s)
              grow.to(
                proc.querySelectorAll('[data-leaves="' + s + '"] > *'),
                { scale: 1, duration: 0.7, stagger: s === 3 ? 0.01 : 0.12, ease: "back.out(2.2)" },
                s + 0.45,
              )
            }
            grow.fromTo(proc.querySelector("[data-sun]"), { attr: { cy: 210 } }, { attr: { cy: 70 }, duration: 4, ease: "none" }, 0)
            proc
              .querySelectorAll(".ovs-step")
              .forEach((st) =>
                ScrollTrigger.create({ trigger: st, start: "top 62%", end: "bottom 62%", toggleClass: { targets: st, className: "ovs-on" } }),
              )
          }

          /* 7. finale canopy drop */
          const fin = q("[data-fin]")[0] as HTMLElement | undefined
          if (fin) {
            const tl = gsap.timeline({
              scrollTrigger: { trigger: fin, start: "top 75%", end: "bottom bottom", scrub: 0.9 },
            })
            tl.fromTo(
              fin.querySelector(".ovs-window"),
              { "--ovs-wi": "9%", "--ovs-wr": "40px" },
              { "--ovs-wi": "0%", "--ovs-wr": "0px", ease: "power2.inOut", duration: 0.6 },
              0,
            )
            const fz = fin.querySelectorAll("[data-zoom]")
            if (fin.querySelector("[data-photo]")) {
              tl.fromTo(fz[0], { scale: 2.4, rotate: -6 }, { scale: 1, rotate: 0, ease: "power3.out", duration: 0.9 }, 0)
              tl.fromTo(fz[1], { scale: 3.4, opacity: 1 }, { scale: 1.05, opacity: 0, ease: "power3.out", duration: 0.7 }, 0)
            } else {
              const from = [1.5, 1.9, 2.5, 3.4]
              fz.forEach((z, i) =>
                tl.fromTo(z, { scale: from[i], rotate: i % 2 ? 6 : -6 }, { scale: 1, rotate: 0, ease: "power3.out", duration: 0.9 }, 0),
              )
            }
            tl.fromTo(
              fin.querySelector(".ovs-fin-copy"),
              { autoAlpha: 0, y: 60, scale: 0.94 },
              { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" },
              0.45,
            )
          }

          /* 8. footer wordmark */
          const wm = q("[data-wordmark]")[0]
          if (wm) {
            gsap.fromTo(
              wm.querySelectorAll("span"),
              { yPercent: 105 },
              { yPercent: 0, duration: 1.2, stagger: 0.04, ease: "expo.out", scrollTrigger: { trigger: wm, start: "top bottom", once: true } },
            )
          }

          return () => {
            heroIn.current = null
            undo.forEach((f) => f())
          }
        },
      )
    }, r)

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => {
      cancelAnimationFrame(raf)
      ctx.revert()
    }
  }, [usePhoto])

  const onHeroReady = React.useCallback(() => {
    heroReady.current = true
    heroIn.current?.()
  }, [])

  const copyEmail = () => {
    const done = () => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    }
    if (navigator.clipboard) navigator.clipboard.writeText(email).then(done, done)
    else done()
  }

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEmail(mail)) {
      setMailState("invalid")
      return
    }
    setMailState("sending")
    let ok = true
    try {
      const res = onSubscribe ? await onSubscribe(mail.trim()) : await new Promise((r) => window.setTimeout(() => r(true), 700))
      if (res === false) ok = false
    } catch {
      ok = false
    }
    setMailState(ok ? "done" : "error")
    if (ok) setMail("")
  }

  const style = {
    "--ovs-h": height,
    "--ovs-accent": pal.accent,
    "--ovs-soft": pal.soft,
  } as React.CSSProperties

  return (
    <div
      ref={root}
      className={"ovs-root " + (scheme === "dark" ? "dark " : "") + className}
      data-scheme={scheme}
      data-season={season}
      data-photo={usePhoto ? "" : undefined}
      data-menu={menu ? "" : undefined}
      style={style}
    >
      <a className="ovs-skip" href={"#" + uid + "main"}>
        Skip to content
      </a>

      {/* ---------------------------------------------------------- nav */}
      <Navbar
        brand={brand}
        links={links}
        active={active}
        themeToggle={themeToggle}
        scheme={scheme}
        still={still}
        menu={menu}
        uid={uid}
        rootRef={root}
        menuBtnRef={menuBtn}
        sheetRef={sheet}
        onToggleTheme={() => setOverride(scheme === "dark" ? "light" : "dark")}
        onToggleMenu={() => setMenu((m) => !m)}
        onNavigate={go}
        onBookCall={book("nav")}
      />

      <main id={uid + "main"}>
        {/* ---------------------------------------------------------- hero */}
        <HeroSection
          usePhoto={usePhoto}
          photo={photo}
          season={season}
          scheme={scheme}
          seed={seed}
          pal={pal}
          onHeroReady={onHeroReady}
          onPhotoFail={() => setPhotoFail(true)}
          onGust={(x) => gust.current?.(x)}
          status={status}
          lead={H.lead || DEFAULT_HERO.lead}
          words={words}
          tail={H.tail || DEFAULT_HERO.tail}
          cue={H.cue || DEFAULT_HERO.cue}
          still={still}
          onCueClick={go("#about")}
        />

        {/* -------------------------------------------------------- clients */}
        <ClientsSection
          trusted={H.trusted}
          logos={logos}
          still={still}
          uid={uid}
        />

        {/* ------------------------------------------------------ manifesto */}
        {manifesto ? (
          <ManifestoSection
            kicker={manifesto.kicker || DEFAULT_MANIFESTO.kicker}
            text={manifesto.text || DEFAULT_MANIFESTO.text}
            stats={stats}
          />
        ) : null}

        {/* ------------------------------------------------------- services */}
        {svc ? (
          <ServicesSection
            kicker={svc.kicker}
            title={svc.title}
            items={svc.items}
            svcIdx={svcIdx}
            uid={uid}
            onGoToSvc={goToSvc}
            onContactClick={go("#contact")}
          />
        ) : null}

        {/* ------------------------------------------------------- meta ads */}
        <MetaAdsSection onCtaClick={go("#contact")} />

        {/* --------------------------------------------------- responsive */}
        <ResponsiveSection uid={uid} onContactClick={go("#contact")} />

        {/* ----------------------------------------------------------- 3D Card Stack Showcase */}
        <ShowcaseSection
          onAllProjectsClick={(e) => {
            if (onAllProjects) {
              e.preventDefault()
              onAllProjects()
            } else if (onBook) {
              book("all_projects")(e)
            }
          }}
        />

        {/* -------------------------------------------------------- process */}
        {pr ? (
          <ProcessSection
            kicker={pr.kicker}
            title={pr.title}
            steps={pr.steps}
            seed={seed}
            uid={uid}
          />
        ) : null}

        {/* --------------------------------------------------------- quotes */}
        <QuotesSection
          usePhoto={usePhoto}
          photo={photo}
          onBookCall={onBook ? book("shade") : undefined}
        />

        {/* -------------------------------------------------------- pricing */}
        {pc ? (
          <PricingSection
            kicker={pc.kicker}
            title={pc.title}
            text={pc.text}
            quarterlyNote={pc.quarterlyNote}
            plans={pc.plans}
            currency={currency}
            still={still}
            quarterly={quarterly}
            uid={uid}
            onToggleQuarterly={setQuarterly}
            onBookPlan={(planName) => book("plan:" + planName)}
          />
        ) : null}

        {/* --------------------------------------------------- testimonials */}
        <TestimonialsSection onReviewClick={go("#contact")} />

        {/* -------------------------------------------------------- contact */}
        <ContactSection email={email} copied={copied} onCopyEmail={copyEmail} city={ft?.city} timeZone={ft?.timeZone} />

        {/* --------------------------------------------------------- finale */}
        {cta ? (
          <FinaleSection
            usePhoto={usePhoto}
            photo={photo}
            season={season}
            scheme={scheme}
            seed={seed}
            pal={pal}
            title={cta.title || DEFAULT_CTA.title}
            text={cta.text || DEFAULT_CTA.text}
            button={cta.button || DEFAULT_CTA.button}
            email={email}
            copied={copied}
            uid={uid}
            onBookFinale={onBook ? book("finale") : undefined}
            onCopyEmail={copyEmail}
          />
        ) : null}
      </main>

      {/* ---------------------------------------------------------- footer */}
      {ft ? (
        <FooterSection
          brand={brand}
          columns={ft.columns}
          city={ft.city}
          timeZone={ft.timeZone}
          note={ft.note}
          email={email}
          mail={mail}
          mailState={mailState}
          uid={uid}
          still={still}
          rootRef={root}
          onMailChange={(v) => {
            setMail(v)
            if (mailState !== "sending") setMailState("idle")
          }}
          onSubscribe={subscribe}
          onNavigate={go}
        />
      ) : null}
    </div>
  )
}
