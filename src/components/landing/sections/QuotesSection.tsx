import * as React from "react"
import { CheckCircle2, Clock, ShieldCheck, Sparkles } from "lucide-react"
import { Arrow, Magnet } from "../ui-primitives"

interface QuotesSectionProps {
  usePhoto: boolean
  photo?: string | null
  onBookCall?: (e: React.MouseEvent) => void
}

const CONSULTATION_ITEMS = [
  {
    title: "Architecture & Growth Audit",
    desc: "We review your current site, funnel, or software idea and pinpoint the fastest wins.",
    Icon: Sparkles,
  },
  {
    title: "Clear Scope, Timeline & Fixed Quote",
    desc: "Walk away with a realistic sprint plan and transparent pricing — zero guesswork.",
    Icon: CheckCircle2,
  },
  {
    title: "100% Ownership & Direct Senior Team",
    desc: "You speak directly with the engineers and designers building your product.",
    Icon: ShieldCheck,
  },
]

export function QuotesSection({ usePhoto, photo, onBookCall }: QuotesSectionProps) {
  return (
    <section className="ovs-shade" data-sec="quotes" aria-label="What founders say">
      {usePhoto ? (
        <div className="ovs-shade-photo" aria-hidden="true" style={{ backgroundImage: "url(" + photo + ")" }} />
      ) : null}
      <div className="ovs-dapple" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="ovs-wrap ovs-quote-wrap">
        <div className="ovs-qt-grid">
          {/* Left Column: Headline & CTA */}
          <div className="ovs-qt-left">
            <p className="ovs-kicker ovs-kicker-light" data-rv>
              <span className="ovs-kicker-dot" aria-hidden="true" />
              <span className="ovs-kicker-n">07</span>
              <span className="ovs-kicker-sep" aria-hidden="true">/</span>
              <span className="ovs-kicker-txt">In the shade, with founders</span>
            </p>

            <h2 className="ovs-qt-h2">
              Trusted by founders{" "}
              <span className="ovs-qt-accent">and teams.</span>
            </h2>

            <p className="ovs-qt-desc">
              Real momentum for ambitious teams who ship with us — faster,
              smarter, built to last.
            </p>

            <div className="ovs-qt-cta">
              <Magnet
                className="ovs-btn ovs-btn-lime ovs-btn-xl cursor-pointer"
                href="#contact"
                onClick={onBookCall}
              >
                <span>Schedule a free consultation</span>
                <Arrow />
              </Magnet>
            </div>
          </div>

          {/* Right Column: What You Get in Your Free Consultation Card */}
          <div className="ovs-qt-card" data-rv>
            <div className="ovs-qt-card-top">
              <div className="ovs-qt-session">
                <Clock className="w-4 h-4 text-[var(--ovs-soft)]" />
                <span className="ovs-qt-score">30-Min Strategy Call</span>
              </div>
              <span className="ovs-qt-badge">No Obligation</span>
            </div>

            <div className="ovs-qt-list">
              {CONSULTATION_ITEMS.map(({ title, desc, Icon }) => (
                <div key={title} className="ovs-qt-item">
                  <span className="ovs-qt-item-ico" aria-hidden="true">
                    <Icon className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="ovs-qt-item-title">{title}</h3>
                    <p className="ovs-qt-item-desc">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
