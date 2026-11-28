import * as React from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Kicker, Logo, Split } from "../ui-primitives"
import { OvsLogo } from "../types"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface ClientsSectionProps {
  trusted?: string
  logos?: OvsLogo[]
  still: boolean
  uid: string
}

function ClientLogoCard({
  logo,
  uid,
  idx,
  isDuplicate,
}: {
  logo: OvsLogo
  uid: string
  idx: number
  isDuplicate?: boolean
}) {
  return (
    <div className="ovs-cl-card" role={isDuplicate ? undefined : "listitem"}>
      {logo.image ? (
        <div className="ovs-cl-thumb" aria-hidden="true">
          <img src={logo.image} alt="" loading="lazy" />
        </div>
      ) : null}
      <div className="ovs-cl-card-body">
        {logo.image ? (
          <span className={"ovs-logo ovs-logo-" + (logo.type || "sans")}>
            <span>{logo.name}</span>
          </span>
        ) : (
          <Logo logo={logo} uid={uid} />
        )}
        <div className="ovs-cl-card-meta">
          <span className="ovs-cl-card-sector">{logo.sector || "Partner"}</span>
          <span className="ovs-cl-card-num">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
        </div>
      </div>
    </div>
  )
}

export function ClientsSection({ trusted, logos, still, uid }: ClientsSectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null)
  const row1Ref = React.useRef<HTMLDivElement>(null)
  const row2Ref = React.useRef<HTMLDivElement>(null)
  const tween1Ref = React.useRef<gsap.core.Tween | null>(null)
  const tween2Ref = React.useRef<gsap.core.Tween | null>(null)

  React.useEffect(() => {
    const el = sectionRef.current
    if (!el || still || !logos?.length) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    const ctx = gsap.context(() => {
      if (row1Ref.current) {
        tween1Ref.current = gsap.fromTo(
          row1Ref.current,
          { xPercent: 0 },
          { xPercent: -50, duration: 36, ease: "none", repeat: -1 },
        )
      }
      if (row2Ref.current) {
        tween2Ref.current = gsap.fromTo(
          row2Ref.current,
          { xPercent: -50 },
          { xPercent: 0, duration: 40, ease: "none", repeat: -1 },
        )
      }
    }, el)

    return () => {
      tween1Ref.current = null
      tween2Ref.current = null
      ctx.revert()
    }
  }, [still, logos])

  if (!logos || !logos.length) return null

  const half = Math.ceil(logos.length / 2)
  const topLogos = logos.slice(0, half)
  const bottomLogos = logos.length > 3 ? logos.slice(half) : logos

  const slowTracks = () => {
    if (tween1Ref.current) gsap.to(tween1Ref.current, { timeScale: 0.14, duration: 0.45, ease: "power2.out" })
    if (tween2Ref.current) gsap.to(tween2Ref.current, { timeScale: 0.14, duration: 0.45, ease: "power2.out" })
  }

  const resumeTracks = () => {
    if (tween1Ref.current) gsap.to(tween1Ref.current, { timeScale: 1, duration: 0.6, ease: "power2.out" })
    if (tween2Ref.current) gsap.to(tween2Ref.current, { timeScale: 1, duration: 0.6, ease: "power2.out" })
  }

  return (
    <section
      ref={sectionRef}
      id="clients"
      className="ovs-sec ovs-clients"
      data-sec="clients"
      aria-label="Our Clients"
    >
      <div className="ovs-wrap">
        <div className="ovs-cl-head">
          <div className="ovs-cl-titlewrap">
            <Kicker n="00" text="Our Clients" />
            <Split text={"Built with teams\nthat lead their category."} className="ovs-cl-h2" />
          </div>
          <div className="ovs-cl-side" data-rv>
            {trusted ? <p className="ovs-clients-sub">{trusted}</p> : null}
            <div className="ovs-cl-meta">
              <span className="ovs-clients-dot" aria-hidden="true" />
              <span>{logos.length < 10 ? `0${logos.length}` : logos.length}+ Global Partners</span>
            </div>
          </div>
        </div>
      </div>

      {still ? (
        <div className="ovs-wrap">
          <div className="ovs-cl-static-grid" role="list" aria-label={trusted || "Clients"}>
            {logos.map((l, i) => (
              <ClientLogoCard key={l.name + i} logo={l} uid={`${uid}cl${i}`} idx={i} />
            ))}
          </div>
        </div>
      ) : (
        <div
          className="ovs-cl-lanes"
          onPointerEnter={slowTracks}
          onPointerLeave={resumeTracks}
          data-rv
        >
          {/* Lane 1: glides left */}
          <div className="ovs-cl-lane" role="list" aria-label={trusted || "Clients"}>
            <div ref={row1Ref} className="ovs-cl-track">
              {[0, 1].map((dup) => (
                <div key={dup} className="ovs-cl-group" aria-hidden={dup === 1 || undefined}>
                  {topLogos.map((l, i) => (
                    <ClientLogoCard
                      key={`t-${dup}-${l.name}-${i}`}
                      logo={l}
                      uid={`${uid}clt${dup}${i}`}
                      idx={i}
                      isDuplicate={dup === 1}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Lane 2: glides right */}
          <div className="ovs-cl-lane" aria-label="More Clients">
            <div ref={row2Ref} className="ovs-cl-track">
              {[0, 1].map((dup) => (
                <div key={dup} className="ovs-cl-group" aria-hidden={dup === 1 || undefined}>
                  {bottomLogos.map((l, i) => (
                    <ClientLogoCard
                      key={`b-${dup}-${l.name}-${i}`}
                      logo={l}
                      uid={`${uid}clb${dup}${i}`}
                      idx={half + i}
                      isDuplicate={dup === 1}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
