import * as React from "react"
import { Kicker, ServiceArt, Split } from "../ui-primitives"
import { OvsService } from "../types"

interface ServicesSectionProps {
  kicker: string
  title: string
  items: OvsService[]
  svcIdx: number
  uid: string
  onGoToSvc: (idx: number) => void
  onContactClick: (e: React.MouseEvent) => void
}

export function ServicesSection({
  kicker,
  title,
  items,
  svcIdx,
  uid,
  onGoToSvc,
  onContactClick,
}: ServicesSectionProps) {
  return (
    <section
      id="services"
      className="ovs-services relative bg-[#f4f7f2] dark:bg-[#0c140e] mb-20 md:mb-32 transition-colors duration-500"
      data-services
      data-sec="services"
      aria-labelledby={uid + "svc"}
    >
      <div className="ovs-svc-stage pt-10 sm:pt-12 md:pt-16 pb-16 md:pb-24" data-svcstage>
        <div className="ovs-wrap ovs-svc-head flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 md:mb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Kicker n="02" text={kicker} />
            <span id={uid + "svc"} className="block mt-2">
              <Split
                text={title}
                className="ovs-h2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-black dark:text-white"
              />
            </span>
          </div>

          <div className="ovs-svc-meter flex flex-col items-end gap-3 min-w-[200px]" aria-hidden="true">
            <div className="ovs-svc-meter-top flex items-center gap-4">
              <span className="ovs-svc-count font-mono text-sm font-semibold tracking-wider text-emerald-950 dark:text-emerald-100">
                {String(svcIdx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <div className="ovs-svc-nav-btns flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Previous service"
                  className="ovs-svc-nav-btn inline-flex items-center justify-center w-8 h-8 rounded-full border border-emerald-950/15 dark:border-white/15 bg-white/80 dark:bg-white/5 text-emerald-950 dark:text-white hover:border-emerald-600 dark:hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-sm hover:-translate-y-0.5 active:translate-y-0"
                  onClick={() => onGoToSvc(svcIdx - 1)}
                  disabled={svcIdx === 0}
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Next service"
                  className="ovs-svc-nav-btn inline-flex items-center justify-center w-8 h-8 rounded-full border border-emerald-950/15 dark:border-white/15 bg-white/80 dark:bg-white/5 text-emerald-950 dark:text-white hover:border-emerald-600 dark:hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-sm hover:-translate-y-0.5 active:translate-y-0"
                  onClick={() => onGoToSvc(svcIdx + 1)}
                  disabled={svcIdx >= items.length - 1}
                >
                  →
                </button>
              </div>
            </div>
            <span className="ovs-svc-track-bar w-48 h-0.5 bg-emerald-950/10 dark:bg-white/10 rounded-full overflow-hidden block">
              <i data-svcbar className="block h-full bg-emerald-600 dark:bg-emerald-400 origin-left scale-x-0" />
            </span>
          </div>
        </div>

        <div className="ovs-svc-track flex flex-col md:flex-row gap-6 md:gap-8 px-4 md:px-12" data-svctrack>
          {items.map((s, i) => (
            <article
              key={s.title}
              className={`ovs-svc-card ovs-svc-card-${i + 1} group relative flex flex-col rounded-3xl overflow-hidden bg-white/85 dark:bg-emerald-950/45 backdrop-blur-xl border border-emerald-950/10 dark:border-white/10 shadow-lg hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-500`}
              data-svccard
            >
              <div className="ovs-svc-card-art relative h-60 md:h-64 overflow-hidden bg-emerald-950/5 dark:bg-black/40 border-b border-emerald-950/10 dark:border-white/10">
                {s.image ? (
                  <div className="ovs-svc-img-wrap absolute inset-0 w-full h-full overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="ovs-svc-img w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      data-svcimg
                      loading="lazy"
                    />
                    <div className="ovs-svc-img-overlay absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/5 pointer-events-none" />
                  </div>
                ) : (
                  <ServiceArt art={s.art} />
                )}
                <div className="ovs-svc-card-art-badges absolute bottom-3.5 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                  <span className="ovs-svc-card-num font-mono text-xs font-bold tracking-wider text-white bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-sm">
                    {"0" + (i + 1)}
                  </span>
                  <span className="ovs-svc-card-pill inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/95 text-emerald-950 dark:bg-emerald-900/90 dark:text-emerald-100 backdrop-blur-md shadow-md">
                    <span className="ovs-svc-card-dot w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                    {s.time}
                  </span>
                </div>
              </div>
              <div className="ovs-svc-card-content p-6 md:p-8 flex flex-col flex-1 justify-center gap-2.5">
                <h3 className="ovs-svc-card-title text-xl md:text-2xl font-medium tracking-tight text-emerald-950 dark:text-emerald-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                  {s.title}
                </h3>
                <p className="ovs-svc-card-text text-sm md:text-base leading-relaxed text-emerald-950/70 dark:text-emerald-100/70 font-normal">
                  {s.text}
                </p>
              </div>
            </article>
          ))}

          {/* Final Bespoke Custom Project Card in the scroll track */}
          <article
            className="ovs-svc-card ovs-svc-card-end flex flex-col justify-center items-center text-center rounded-3xl p-8 md:p-10 bg-emerald-900/10 dark:bg-emerald-950/50 border border-dashed border-emerald-600/40 dark:border-emerald-500/30 backdrop-blur-xl"
            data-svccard
          >
            <div className="ovs-svc-end-inner flex flex-col items-center gap-4 max-w-sm">
              <span className="ovs-svc-end-pill text-xs font-semibold uppercase tracking-widest px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                Bespoke Squads
              </span>
              <h3 className="ovs-svc-end-title text-xl md:text-2xl font-medium text-emerald-950 dark:text-emerald-50 leading-tight">
                Need a Custom Blend or Enterprise Architecture?
              </h3>
              <p className="ovs-svc-end-text text-sm md:text-base text-emerald-950/70 dark:text-emerald-100/70 leading-relaxed">
                We assemble dedicated digital squads tailored to your exact tech stack, timeline, and growth KPIs.
              </p>
              <div className="ovs-svc-end-actions mt-2">
                <a
                  href="#contact"
                  onClick={onContactClick}
                  className="ovs-svc-cta ovs-svc-cta-btn inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <span>Book a Discovery Call</span>
                  <span className="ovs-svc-arrow inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
