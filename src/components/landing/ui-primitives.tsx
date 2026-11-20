import * as React from "react"
import { gsap } from "gsap"
import { formatNumber, mulberry32 } from "./canopy-engine"
import { OvsLogo, OvsMark, OvsMock, OvsServiceArt } from "./types"

const useIso = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

export function Mark({ kind, uid }: { kind?: OvsMark; uid: string }) {
  const common = { className: "ovs-svg", viewBox: "0 0 24 24", "aria-hidden": true as const }
  switch (kind) {
    case "watch":
      return (
        <svg {...common} viewBox="0 0 30 24">
          <path fill="currentColor" d="M1 4.5h5.4l3.2 9.6 3.1-9.6h4.6l3.1 9.6 3.2-9.6H29L22.6 20h-4.4L15 10.6 11.8 20H7.4z" />
        </svg>
      )
    case "slash":
      return (
        <svg {...common}>
          <defs>
            <mask id={uid + "sl"}>
              <rect width="24" height="24" fill="#fff" />
              <path d="M16.2 7.6c-.9-1-2.3-1.6-4-1.6-2.2 0-3.8 1.1-3.8 2.8 0 1.8 1.6 2.4 3.8 2.9 2.3.5 3.9 1.2 3.9 3.1 0 1.8-1.7 3.1-4 3.1-1.8 0-3.3-.7-4.3-1.9" fill="none" stroke="#000" strokeWidth="2.6" strokeLinecap="round" />
            </mask>
          </defs>
          <rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill="currentColor" mask={"url(#" + uid + "sl)"} />
        </svg>
      )
    case "scribe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="M16.6 9.2A5.2 5.2 0 1 0 17 14.6M12 12h5.4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      )
    case "knot":
      return (
        <svg {...common}>
          <path fill="currentColor" d="M12 1.5c2.7 2.8 2.7 5.8 0 8.6-2.7-2.8-2.7-5.8 0-8.6zm0 12.4c2.7 2.8 2.7 5.8 0 8.6-2.7-2.8-2.7-5.8 0-8.6zM1.5 12c2.8-2.7 5.8-2.7 8.6 0-2.8 2.7-5.8 2.7-8.6 0zm12.4 0c2.8-2.7 5.8-2.7 8.6 0-2.8 2.7-5.8 2.7-8.6 0z" />
        </svg>
      )
    case "venn":
      return (
        <svg {...common} viewBox="0 0 34 24">
          <path d="M10 3.5 18.5 12 10 20.5 1.5 12zM24 3.5 32.5 12 24 20.5 15.5 12z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <path fill="currentColor" d="M20 3.5C11 3.6 4.5 8.4 4.5 15c0 1.8.5 3.4 1.4 4.6L3.6 22l1.1 1 2.3-2.3c1.3.9 2.9 1.4 4.6 1.4 6.6 0 9.6-7.6 8.4-18.6zM9 17.6c2.4-3.6 5-6.1 8.3-8.2-2.6 2.6-4.9 5.3-7.2 9z" />
        </svg>
      )
  }
}

export function BrandMark() {
  return (
    <svg className="ovs-svg ovs-brandmark" viewBox="0 0 32 32" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} transform={"rotate(" + i * 45 + " 16 16)"} d="M16 1.6c2.6 1.9 3.6 4.4 2.6 7.2-.6 1.6-1.6 2.4-2.6 2.8-1-.4-2-1.2-2.6-2.8-1-2.8 0-5.3 2.6-7.2z" fill="currentColor" opacity={i % 2 ? 0.55 : 1} />
      ))}
      <circle cx="16" cy="16" r="2.4" fill="currentColor" />
    </svg>
  )
}

export function Logo({ logo, uid }: { logo: OvsLogo; uid: string }) {
  return (
    <span className={"ovs-logo ovs-logo-" + (logo.type || "sans")}>
      <Mark kind={logo.mark} uid={uid} />
      <span>{logo.name}</span>
    </span>
  )
}

const NBSP = String.fromCharCode(160)
const CONDENSE = 0.8

export function WordMorph({ words, still }: { words: string[]; still: boolean }) {
  const [i, setI] = React.useState(0)
  const box = React.useRef(null as HTMLSpanElement | null)
  const word = React.useRef(null as HTMLSpanElement | null)
  const paused = React.useRef(false)
  const first = React.useRef(true)

  useIso(() => {
    const b = box.current
    const w = word.current
    if (!b || !w) return
    const width = w.offsetWidth * CONDENSE
    if (first.current || still) {
      first.current = false
      b.style.width = width + "px"
      return
    }
    const ctx = gsap.context(() => {
      gsap.to(b, { width, duration: 0.7, ease: "expo.inOut" })
      gsap.fromTo(
        w.children,
        { yPercent: 105, rotateX: -80, opacity: 0, filter: "blur(6px)" },
        { yPercent: 0, rotateX: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, stagger: 0.045, ease: "expo.out", delay: 0.12, clearProps: "filter" }
      )
    })
    return () => ctx.revert()
  }, [i, still])

  React.useEffect(() => {
    if (still || words.length < 2) return
    const t = window.setInterval(() => {
      const w = word.current
      if (paused.current || !w || document.hidden) return
      gsap.to(w.children, {
        yPercent: -105,
        rotateX: 80,
        opacity: 0,
        filter: "blur(6px)",
        duration: 0.45,
        stagger: 0.03,
        ease: "power3.in",
        onComplete: () => setI((v) => (v + 1) % words.length),
      })
    }, 3200)
    return () => window.clearInterval(t)
  }, [still, words.length])

  React.useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (box.current && word.current) box.current.style.width = word.current.offsetWidth * CONDENSE + "px"
    })
    if (word.current) ro.observe(word.current)
    return () => ro.disconnect()
  }, [i])

  return (
    <span className="ovs-morph" ref={box} onPointerEnter={() => (paused.current = true)} onPointerLeave={() => (paused.current = false)}>
      <span className="ovs-morph-word" ref={word} key={i}>
        {Array.from(words[i] || "").map((ch, k) => (
          <span key={k} className="ovs-ch">
            {ch === " " ? NBSP : ch}
          </span>
        ))}
      </span>
    </span>
  )
}

export function Split({ text, className, as = "h2" }: { text: string; className?: string; as?: "h2" | "h3" | "p" }) {
  const Tag = as
  const words = text.split(" ")
  return (
    <Tag className={className} data-split>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span className="ovs-w">
            <span data-w>{w}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </Tag>
  )
}

export function Kicker({ n, text }: { n: string; text: string }) {
  return (
    <p className="ovs-kicker" data-rv>
      <span className="ovs-kicker-n">( {n} )</span>
      <span>{text}</span>
    </p>
  )
}

export function Arrow() {
  return (
    <svg className="ovs-svg ovs-arrow" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Magnet({ children, className, onClick, href, label }: { children: React.ReactNode; className: string; onClick?: (e: React.MouseEvent) => void; href?: string; label?: string }) {
  const ref = React.useRef(null as HTMLAnchorElement | null)
  const move = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el || e.pointerType !== "mouse") return
    const r = el.getBoundingClientRect()
    gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.22, y: (e.clientY - r.top - r.height / 2) * 0.32, duration: 0.4, ease: "power3.out" })
  }
  const leave = () => {
    if (ref.current) gsap.to(ref.current, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1,0.45)" })
  }
  return (
    <a ref={ref} href={href || "#contact"} className={className} onClick={onClick} onPointerMove={move} onPointerLeave={leave} aria-label={label}>
      {children}
    </a>
  )
}

export function ServiceArt({ art }: { art?: OvsServiceArt }) {
  switch (art) {
    case "brand":
      return (
        <svg className="ovs-svg" viewBox="0 0 240 160" aria-hidden="true">
          <rect width="240" height="160" rx="14" fill="var(--ovs-card)" />
          <rect x="18" y="18" width="96" height="124" rx="10" fill="var(--ovs-accent)" />
          <g transform="translate(66 80) scale(2.2) translate(-16 -16)" fill="var(--ovs-soft)">
            {Array.from({ length: 8 }, (_, i) => (
              <path key={i} transform={"rotate(" + i * 45 + " 16 16)"} d="M16 1.6c2.6 1.9 3.6 4.4 2.6 7.2-.6 1.6-1.6 2.4-2.6 2.8-1-.4-2-1.2-2.6-2.8-1-2.8 0-5.3 2.6-7.2z" opacity={i % 2 ? 0.6 : 1} />
            ))}
          </g>
          {["var(--ovs-soft)", "var(--ovs-ink)", "var(--ovs-mist)", "var(--ovs-accent)"].map((c, i) => (
            <rect key={i} x={128 + (i % 2) * 50} y={18 + Math.floor(i / 2) * 50} width="42" height="42" rx="8" fill={c} stroke="var(--ovs-line)" />
          ))}
          <text x="128" y="138" fontSize="26" fontFamily="Georgia, serif" fill="var(--ovs-ink)">Aa</text>
          <text x="170" y="138" fontSize="26" fontWeight="700" fill="var(--ovs-ink)">Aa</text>
        </svg>
      )
    case "product":
      return (
        <svg className="ovs-svg" viewBox="0 0 240 160" aria-hidden="true">
          <rect width="240" height="160" rx="14" fill="var(--ovs-card)" />
          <rect x="16" y="16" width="62" height="128" rx="8" fill="var(--ovs-mist)" />
          {[0, 1, 2, 3, 4].map((i) => <rect key={i} x="26" y={30 + i * 20} width={i === 1 ? 42 : 34} height="8" rx="4" fill={i === 1 ? "var(--ovs-accent)" : "var(--ovs-line)"} />)}
          <rect x="90" y="16" width="134" height="40" rx="8" fill="var(--ovs-mist)" />
          <rect x="100" y="28" width="60" height="8" rx="4" fill="var(--ovs-ink)" />
          <rect x="100" y="40" width="90" height="6" rx="3" fill="var(--ovs-line)" />
          <rect x="90" y="66" width="64" height="78" rx="8" fill="var(--ovs-soft)" />
          <rect x="160" y="66" width="64" height="78" rx="8" fill="var(--ovs-mist)" />
          <path d="M98 128c10-18 20-6 30-22s18-6 20-14" fill="none" stroke="var(--ovs-accent)" strokeWidth="3" strokeLinecap="round" />
          <circle cx="192" cy="104" r="20" fill="none" stroke="var(--ovs-accent)" strokeWidth="6" strokeDasharray="80 200" strokeLinecap="round" />
        </svg>
      )
    case "site":
      return (
        <svg className="ovs-svg" viewBox="0 0 240 160" aria-hidden="true">
          <rect width="240" height="160" rx="14" fill="var(--ovs-card)" />
          <rect x="12" y="12" width="216" height="136" rx="10" fill="var(--ovs-mist)" />
          {[0, 1, 2].map((i) => <circle key={i} cx={24 + i * 10} cy="23" r="3" fill="var(--ovs-line)" />)}
          <rect x="12" y="32" width="216" height="1" fill="var(--ovs-line)" />
          <rect x="62" y="54" width="116" height="12" rx="6" fill="var(--ovs-ink)" />
          <rect x="82" y="72" width="76" height="12" rx="6" fill="var(--ovs-accent)" />
          <rect x="94" y="94" width="52" height="16" rx="8" fill="var(--ovs-ink)" />
          {[0, 1, 2, 3].map((i) => <rect key={i} x={36 + i * 46} y="122" width="32" height="8" rx="4" fill="var(--ovs-line)" />)}
        </svg>
      )
    case "code":
      return (
        <svg className="ovs-svg" viewBox="0 0 240 160" aria-hidden="true">
          <rect width="240" height="160" rx="14" fill="#0f1a12" />
          {[
            [18, 40, "#c4dc52"], [64, 60, "#8fb7d9"], [18, 30, "#e6b765"], [52, 90, "#c4dc52"], [52, 50, "#d9e3cf"], [18, 70, "#8fb7d9"], [36, 44, "#e6b765"], [18, 20, "#d9e3cf"],
          ].map((r, i) => (
            <rect key={i} x={(r[0] as number) + 14} y={22 + i * 15} width={r[1] as number} height="7" rx="3.5" fill={r[2] as string} opacity="0.85" />
          ))}
          <rect x="160" y="110" width="64" height="30" rx="8" fill="#1c2c1f" />
          <circle cx="174" cy="125" r="4" fill="#9be15d" />
          <rect x="184" y="121" width="30" height="8" rx="4" fill="#d9e3cf" opacity="0.6" />
        </svg>
      )
    default:
      return (
        <svg className="ovs-svg" viewBox="0 0 240 160" aria-hidden="true">
          <rect width="240" height="160" rx="14" fill="var(--ovs-card)" />
          <rect x="16" y="16" width="60" height="22" rx="11" fill="var(--ovs-ink)" />
          <rect x="84" y="16" width="60" height="22" rx="11" fill="none" stroke="var(--ovs-ink)" strokeWidth="1.5" />
          <rect x="152" y="16" width="72" height="22" rx="11" fill="var(--ovs-accent)" />
          <rect x="16" y="48" width="44" height="24" rx="12" fill="var(--ovs-mist)" />
          <circle cx="48" cy="60" r="9" fill="var(--ovs-accent)" />
          <rect x="70" y="52" width="16" height="16" rx="4" fill="var(--ovs-accent)" />
          <path d="M73 60l3 3 6-6" stroke="#fff" strokeWidth="2" fill="none" />
          <rect x="96" y="54" width="128" height="12" rx="6" fill="var(--ovs-mist)" />
          <rect x="96" y="54" width="70" height="12" rx="6" fill="var(--ovs-soft)" />
          <rect x="16" y="84" width="100" height="60" rx="10" fill="var(--ovs-mist)" />
          <rect x="124" y="84" width="100" height="60" rx="10" fill="var(--ovs-mist)" />
          <rect x="28" y="98" width="50" height="8" rx="4" fill="var(--ovs-ink)" />
          <rect x="28" y="112" width="76" height="6" rx="3" fill="var(--ovs-line)" />
          <rect x="136" y="98" width="40" height="8" rx="4" fill="var(--ovs-ink)" />
          <rect x="136" y="112" width="70" height="6" rx="3" fill="var(--ovs-line)" />
        </svg>
      )
  }
}

export function CaseMock({ mock, name }: { mock?: OvsMock; name: string }) {
  if (mock === "mobile")
    return (
      <div
        className="ovs-mock relative w-[220px] sm:w-[240px] rounded-[32px] p-4 pb-5 flex flex-col gap-2.5 bg-[#0f1510] text-white border-[6px] border-[#1c271e] shadow-2xl shadow-black/60 transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-2 group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]"
        data-mock
      >
        <div className="w-20 h-4 rounded-full bg-[#1c271e] mx-auto -mt-1 mb-1 flex items-center justify-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-black/70" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
        </div>
        <div className="flex items-center justify-between text-[10px] text-white/50 px-1 font-mono">
          <span>Shared balance</span>
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE
          </span>
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">$8,240.12</p>
        <div className="flex gap-1.5 h-2 w-full rounded-full overflow-hidden bg-white/10 my-1">
          <span className="h-full bg-emerald-400 rounded-full transition-all duration-1000" style={{ width: "58%" }} />
          <span className="h-full bg-purple-400 rounded-full transition-all duration-1000" style={{ width: "42%" }} />
        </div>
        <div className="flex flex-col divide-y divide-white/10 pt-1">
          {["Groceries", "Rent", "Trip fund"].map((t, i) => (
            <div className="flex items-center justify-between text-xs py-2" key={t}>
              <div className="flex items-center gap-2">
                <i className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: ["#34d399", "#7d9cc4", "#c9a865"][i] }} />
                <span className="text-white/80 font-medium">{t}</span>
              </div>
              <b className="font-mono text-white/95">{["$184", "$1,450", "$620"][i]}</b>
            </div>
          ))}
        </div>
      </div>
    )

  return (
    <div
      className="ovs-mock relative w-full max-w-[480px] sm:max-w-[520px] rounded-2xl bg-white/95 dark:bg-[#121c15]/95 backdrop-blur-xl border border-emerald-950/15 dark:border-white/15 shadow-2xl shadow-emerald-950/20 dark:shadow-black/60 overflow-hidden transition-all duration-700 group-hover:scale-[1.02] group-hover:-translate-y-2 group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.35)]"
      data-mock
    >
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-emerald-950/10 dark:border-white/10 bg-emerald-950/[0.03] dark:bg-white/[0.03]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block" />
          <span className="ml-2 font-mono text-[11px] text-emerald-950/60 dark:text-emerald-100/60 font-medium">
            https://{name.toLowerCase().replace(/\s+/g, "")}.io
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          SECURE
        </div>
      </div>

      <div className="flex min-h-[195px]">
        <div className="w-12 sm:w-14 border-r border-emerald-950/10 dark:border-white/10 p-3 flex flex-col gap-2.5 bg-emerald-950/[0.02] dark:bg-white/[0.02]">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === 1 ? "bg-emerald-500 w-full shadow-sm shadow-emerald-500/50" : "bg-emerald-950/15 dark:bg-white/15 w-4/5"
              }`}
            />
          ))}
        </div>

        {mock === "chat" ? (
          <div className="flex-1 p-4 flex flex-col justify-between gap-3 min-w-0">
            <div className="flex flex-col gap-2">
              <div className="self-start max-w-[85%] text-xs leading-relaxed p-2.5 rounded-2xl rounded-tl-sm bg-emerald-950/5 dark:bg-white/10 text-emerald-950 dark:text-emerald-100 border border-emerald-950/5 dark:border-white/10 font-medium">
                Pricing pushback, 3 min in. Try anchoring on the team plan.
              </div>
              <div className="self-end max-w-[85%] text-xs leading-relaxed p-2.5 rounded-2xl rounded-tr-sm bg-emerald-600 text-white shadow-sm font-medium">
                Nice. Mention the onboarding call?
              </div>
              <div className="self-start max-w-[85%] text-xs leading-relaxed p-2.5 rounded-2xl rounded-tl-sm bg-emerald-950/5 dark:bg-white/10 text-emerald-950 dark:text-emerald-100 border border-emerald-950/5 dark:border-white/10 font-medium">
                Yes! Close rate goes up 18% when you do.
              </div>
            </div>
            <div className="flex items-center gap-1 h-9 px-3 py-1.5 rounded-xl bg-emerald-950/5 dark:bg-white/5 border border-emerald-950/10 dark:border-white/10">
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mr-1.5 font-bold">AI Call Audio</span>
              <div className="flex-1 flex items-center gap-0.5 sm:gap-1 h-full">
                {Array.from({ length: 24 }, (_, i) => {
                  const h = 20 + Math.abs(Math.sin(i * 1.7)) * 70
                  return (
                    <span
                      key={i}
                      className="flex-1 rounded-full bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:animate-pulse"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${(i % 5) * 120}ms`,
                      }}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        ) : mock === "doc" ? (
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-2.5 min-w-0">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium text-emerald-950/60 dark:text-emerald-100/60">
                  Auto-Drafted Clinical / Ops Summary
                </span>
                <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                  SYNCED
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-emerald-950 dark:text-emerald-50">
                Enterprise Incident Triage & Resolution
              </p>
            </div>
            <div className="space-y-1.5 my-0.5">
              {[95, 82, 88, 65].map((w, i) => (
                <div key={i} className="h-2 rounded-full bg-emerald-950/10 dark:bg-white/10" style={{ width: `${w}%` }} />
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-600/15 text-emerald-800 dark:text-emerald-200 border border-emerald-600/20">
                ✓ SLA 99.99% Met
              </span>
              <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-teal-600/15 text-teal-800 dark:text-teal-200 border border-teal-600/20">
                14 hrs/wk Saved
              </span>
            </div>
            <div className="space-y-1.5">
              {[75, 88].map((w, i) => (
                <div key={i} className="h-1.5 rounded-full bg-emerald-950/10 dark:bg-white/10" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-3 min-w-0">
            <div className="grid grid-cols-3 gap-2">
              {[
                ["Active Orders", "2,048", "+24%"],
                ["Avg. Speed", "0.42s", "-65%"],
                ["Conversion", "4.8%", "+182%"],
              ].map((k) => (
                <div key={k[0]} className="p-2 sm:p-2.5 rounded-xl border border-emerald-950/10 dark:border-white/10 bg-emerald-950/[0.02] dark:bg-white/[0.03]">
                  <span className="text-[10px] text-emerald-950/60 dark:text-emerald-100/60 block truncate font-medium">{k[0]}</span>
                  <b className="text-sm sm:text-base font-bold text-emerald-950 dark:text-emerald-50 font-mono block leading-tight">{k[1]}</b>
                  <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono">{k[2]}</span>
                </div>
              ))}
            </div>
            <div className="relative h-20 sm:h-24 w-full rounded-xl overflow-hidden bg-gradient-to-t from-emerald-500/10 to-transparent p-1">
              <svg className="w-full h-full" viewBox="0 0 300 110" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0 90 C 30 84, 50 70, 80 74 S 130 50, 160 54 S 210 30, 240 28 S 280 14, 300 10 V110 H0z" fill="url(#chartGrad)" />
                <path d="M0 90 C 30 84, 50 70, 80 74 S 130 50, 160 54 S 210 30, 240 28 S 280 14, 300 10" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function GrowingTree({ seed }: { seed: number }) {
  const crown = React.useMemo(() => {
    const r = mulberry32(seed + 404)
    return Array.from({ length: 46 }, () => {
      const a = r() * Math.PI * 2
      const d = Math.sqrt(r())
      return { x: 182 + Math.cos(a) * d * 128, y: 132 + Math.sin(a) * d * 86, r: 10 + r() * 16, l: r() }
    })
  }, [seed])
  const tips = [
    [[96, 332], [262, 306]],
    [[70, 214], [292, 186], [122, 270]],
  ]
  return (
    <svg className="ovs-svg ovs-tree" viewBox="0 0 360 540" aria-hidden="true">
      <circle data-sun cx="300" cy="70" r="26" fill="var(--ovs-soft)" opacity="0.8" />
      <ellipse cx="180" cy="508" rx="130" ry="12" fill="var(--ovs-line)" />
      <g fill="none" stroke="var(--ovs-bark)" strokeLinecap="round">
        <path data-grow="0" pathLength={1} strokeWidth="9" d="M180 506 C 176 440, 188 380, 180 320 S 172 200, 182 120" />
        <path data-grow="1" pathLength={1} strokeWidth="4.5" d="M181 386 C 152 366, 122 354, 96 332" />
        <path data-grow="1" pathLength={1} strokeWidth="4.5" d="M180 356 C 210 340, 238 326, 262 306" />
        <path data-grow="2" pathLength={1} strokeWidth="3.5" d="M178 262 C 140 244, 104 238, 70 214" />
        <path data-grow="2" pathLength={1} strokeWidth="3.5" d="M182 232 C 220 216, 262 208, 292 186" />
        <path data-grow="2" pathLength={1} strokeWidth="3" d="M180 300 C 160 292, 140 286, 122 270" />
      </g>
      <g data-leaves="0">
        <path d="M180 470c-18-2-30-12-32-26 16 0 28 8 32 26z" fill="var(--ovs-accent)" />
        <path d="M181 462c16-6 30-4 38 8-14 6-28 4-38-8z" fill="var(--ovs-soft)" />
      </g>
      {tips.map((set, s) => (
        <g data-leaves={s + 1} key={s}>
          {set.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="17" fill="var(--ovs-accent)" />
              <circle cx={x + 9} cy={y - 8} r="12" fill="var(--ovs-soft)" />
              <circle cx={x - 10} cy={y - 5} r="9" fill="var(--ovs-leaf2)" />
            </g>
          ))}
        </g>
      ))}
      <g data-leaves="3">
        {crown.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={c.r} fill={c.l > 0.66 ? "var(--ovs-soft)" : c.l > 0.33 ? "var(--ovs-leaf2)" : "var(--ovs-accent)"} opacity={0.82 + c.l * 0.18} />
        ))}
      </g>
    </svg>
  )
}

export function Price({ value, currency, still }: { value: number; currency: string; still: boolean }) {
  const ref = React.useRef(null as HTMLSpanElement | null)
  const last = React.useRef(value)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const from = last.current
    last.current = value
    if (still || from === value) {
      el.textContent = currency + formatNumber(value)
      return
    }
    const o = { v: from }
    const t = gsap.to(o, { v: value, duration: 0.7, ease: "expo.out", onUpdate: () => (el.textContent = currency + formatNumber(Math.round(o.v))) })
    return () => {
      t.kill()
    }
  }, [value, currency, still])
  return <span ref={ref}>{currency + formatNumber(value)}</span>
}

export function Clock({ timeZone }: { timeZone: string }) {
  const [t, setT] = React.useState("")
  React.useEffect(() => {
    let f: Intl.DateTimeFormat
    try {
      f = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone })
    } catch {
      f = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" })
    }
    const tick = () => setT(f.format(new Date()))
    tick()
    const id = window.setInterval(tick, 15000)
    return () => window.clearInterval(id)
  }, [timeZone])
  return <time>{t || "--:--"}</time>
}
