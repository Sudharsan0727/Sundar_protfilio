import * as React from "react"
import { formatNumber, manifestoParts } from "../canopy-engine"
import { BrandMark, Kicker } from "../ui-primitives"
import { OvsStat } from "../types"

interface ManifestoSectionProps {
  kicker: string
  text: string
  stats?: OvsStat[] | null
}

export function ManifestoSection({ kicker, text, stats }: ManifestoSectionProps) {
  return (
    <section className="ovs-sec ovs-manifesto" data-sec="about" aria-label="About">
      <div className="ovs-wrap">
        <Kicker n="01" text={kicker} />
        <p className="ovs-man" data-manifesto>
          {manifestoParts(text).map((p, i) =>
            p.pic ? (
              <span key={i} className={"ovs-pic ovs-pic-" + p.pic} aria-hidden="true">
                {p.pic === "team" ? (
                  <>
                    <i>
                      <b>MO</b>
                    </i>
                    <i>
                      <b>DR</b>
                    </i>
                    <i>
                      <b>PN</b>
                    </i>
                  </>
                ) : p.pic === "chart" ? (
                  <svg className="ovs-svg" viewBox="0 0 80 40">
                    <path
                      d="M4 34 L20 26 L32 30 L48 16 L60 20 L76 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="76" cy="6" r="4" fill="currentColor" />
                  </svg>
                ) : (
                  <BrandMark />
                )}
              </span>
            ) : (
              <React.Fragment key={i}>
                <span data-mw>{p.word}</span>{" "}
              </React.Fragment>
            ),
          )}
        </p>

        {stats && stats.length ? (
          <dl className="ovs-stats">
            {stats.map((s, idx) => (
              <div key={s.label} className="ovs-stat" data-rv>
                <div className="ovs-stat-head">
                  <span className="ovs-stat-tag">
                    <span className="ovs-stat-spark">✦</span>
                    <span>{"0" + (idx + 1)}</span>
                  </span>
                  <span className="ovs-stat-accent-bar" />
                </div>
                <dd data-count={s.value} data-dec={s.decimals || 0} data-pre={s.prefix || ""} data-suf={s.suffix || ""}>
                  {(s.prefix || "") + formatNumber(s.value, s.decimals || 0) + (s.suffix || "")}
                </dd>
                <dt>{s.label}</dt>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  )
}
