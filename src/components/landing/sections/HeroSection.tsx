import * as React from "react"
import { Canopy, PhotoCanopy } from "../canopy"
import { OvsPaletteType } from "../canopy-engine"
import { WordMorph } from "../ui-primitives"
import { OvsSeason } from "../types"

interface HeroSectionProps {
  usePhoto: boolean
  photo?: string | null
  season: OvsSeason
  scheme: "light" | "dark"
  seed: number
  pal: OvsPaletteType
  onHeroReady: () => void
  onPhotoFail: () => void
  onGust: (xNorm: number) => void
  status?: string | null
  lead: string
  words: string[]
  tail: string
  cue: string
  still: boolean
  onCueClick: (e: React.MouseEvent) => void
}

export function HeroSection({
  usePhoto,
  photo,
  season,
  scheme,
  seed,
  pal,
  onHeroReady,
  onPhotoFail,
  onGust,
  status,
  lead,
  words,
  tail,
  cue,
  still,
  onCueClick,
}: HeroSectionProps) {
  return (
    <section className="ovs-hero" data-hero data-sec="top" aria-label="Introduction">
      <div
        className="ovs-stage"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a,button")) return
          const b = e.currentTarget.getBoundingClientRect()
          onGust((e.clientX - b.left) / b.width)
        }}
      >
        {usePhoto ? (
          <PhotoCanopy src={photo as string} season={season} scheme={scheme} onReady={onHeroReady} onFail={onPhotoFail} />
        ) : (
          <Canopy seed={seed} scheme={scheme} palette={pal} onReady={onHeroReady} />
        )}

        <div className="ovs-falls" aria-hidden="true">
          {Array.from({ length: 14 }, (_, i) => (
            <span key={i} className="ovs-fall" data-fall={i < 5 ? "idle" : "burst"}>
              <svg className="ovs-svg" viewBox="0 0 24 24" style={{ color: i % 3 ? "var(--ovs-accent)" : "var(--ovs-soft)" }}>
                <path fill="currentColor" d="M2 12C6 5 14 3.5 22 12c-8 8.5-16 7-20 0z" />
                <path d="M3 12h17" stroke="rgba(0,0,0,.25)" strokeWidth="0.8" />
              </svg>
            </span>
          ))}
        </div>

        <div className="ovs-copy">
          {status ? (
            <p className="ovs-status">
              <i />
              {status}
            </p>
          ) : null}

          <h1 className="ovs-h1">
            <span className="ovs-line">
              <span>{lead}</span>
            </span>
            <span className="ovs-line">
              <span>
                <span className="ovs-sr">{words[0]} </span>
                <span aria-hidden="true">
                  <WordMorph words={words} still={still} />
                </span>{" "}
                {tail}
              </span>
            </span>
          </h1>
        </div>

        <a className="ovs-cue" href="#about" onClick={onCueClick}>
          <span className="ovs-cue-line" />
          {cue}
        </a>

        <div className="ovs-veil" aria-hidden="true">
          <p className="ovs-above">Above the canopy</p>
        </div>
      </div>
    </section>
  )
}
