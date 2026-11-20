import * as React from "react"
import { gsap } from "gsap"
import { planPrice } from "../canopy-engine"
import { Arrow, Kicker, Price, Split } from "../ui-primitives"
import { OvsPlan } from "../types"

interface PricingSectionProps {
  kicker: string
  title: string
  text: string
  quarterlyNote?: string
  plans: OvsPlan[]
  currency: string
  still: boolean
  quarterly: boolean
  uid: string
  onToggleQuarterly: (quarterly: boolean) => void
  onBookPlan: (planName: string) => (e: React.MouseEvent) => void
}

export function PricingSection({
  kicker,
  title,
  text,
  quarterlyNote,
  plans,
  currency,
  still,
  quarterly,
  uid,
  onToggleQuarterly,
  onBookPlan,
}: PricingSectionProps) {
  return (
    <section className="ovs-sec ovs-pricing" data-sec="pricing" aria-labelledby={uid + "pc"}>
      <div className="ovs-wrap">
        <div className="ovs-head">
          <div>
            <Kicker n="05" text={kicker} />
            <span id={uid + "pc"}>
              <Split text={title} className="ovs-h2" />
            </span>
          </div>
          <div className="ovs-head-side" data-rv>
            <p className="ovs-lede">{text}</p>
            <div className="ovs-seg" role="group" aria-label="Billing" data-q={quarterly ? "" : undefined}>
              <span className="ovs-seg-pill" aria-hidden="true" />
              <button type="button" aria-pressed={!quarterly} onClick={() => onToggleQuarterly(false)}>
                Monthly
              </button>
              <button type="button" aria-pressed={quarterly} onClick={() => onToggleQuarterly(true)}>
                Quarterly <em>{quarterlyNote}</em>
              </button>
            </div>
          </div>
        </div>

        <div className="ovs-plans">
          {plans.map((p) => {
            const v = planPrice(p, quarterly)
            return (
              <div
                key={p.name}
                className="ovs-plan"
                data-featured={p.featured ? "" : undefined}
                data-rv
                onPointerMove={(e) => {
                  if (still || e.pointerType !== "mouse") return
                  const b = e.currentTarget.getBoundingClientRect()
                  gsap.to(e.currentTarget, {
                    rotateY: ((e.clientX - b.left) / b.width - 0.5) * 7,
                    rotateX: -((e.clientY - b.top) / b.height - 0.5) * 7,
                    duration: 0.5,
                    ease: "power3.out",
                    transformPerspective: 900,
                  })
                  e.currentTarget.style.setProperty("--mx", e.clientX - b.left + "px")
                  e.currentTarget.style.setProperty("--my", e.clientY - b.top + "px")
                }}
                onPointerLeave={(e) =>
                  gsap.to(e.currentTarget, { rotateY: 0, rotateX: 0, duration: 0.9, ease: "elastic.out(1,0.5)" })
                }
              >
                {p.featured ? <span className="ovs-plan-ring" aria-hidden="true" /> : null}
                <div className="ovs-plan-in">
                  <p className="ovs-plan-name">
                    {p.name}
                    {p.badge ? <span>{p.badge}</span> : null}
                  </p>
                  <p className="ovs-plan-price">
                    {v === null ? <span>Custom</span> : <Price value={v} currency={currency} still={still} />}
                    {v !== null ? <small>{p.unit === "/mo" ? "/month" : p.unit || ""}</small> : null}
                  </p>
                  <p className="ovs-plan-text">{p.text}</p>
                  <ul>
                    {p.features.map((f) => (
                      <li key={f}>
                        <svg className="ovs-svg" viewBox="0 0 16 16" aria-hidden="true">
                          <path
                            d="M3.5 8.5l3 3 6-7"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className={"ovs-btn " + (p.featured ? "ovs-btn-lime" : "ovs-btn-line")}
                    onClick={onBookPlan(p.name)}
                  >
                    {p.cta} <Arrow />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
