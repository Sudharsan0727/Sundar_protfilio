import * as React from "react"
import { Canopy, PhotoCanopy } from "../canopy"
import { OvsPaletteType } from "../canopy-engine"
import { Arrow, Magnet } from "../ui-primitives"
import { OvsSeason } from "../types"

interface FinaleSectionProps {
  usePhoto: boolean
  photo?: string | null
  season: OvsSeason
  scheme: "light" | "dark"
  seed: number
  pal: OvsPaletteType
  title: string
  text: string
  button: string
  email: string
  copied: boolean
  uid: string
  onBookFinale?: (e: React.MouseEvent) => void
  onCopyEmail: () => void
}

export function FinaleSection({
  usePhoto,
  photo,
  season,
  scheme,
  seed,
  pal,
  title,
  text,
  button,
  email,
  copied,
  uid,
  onBookFinale,
  onCopyEmail,
}: FinaleSectionProps) {
  return (
    <section id="contact" className="ovs-fin" data-fin data-sec="contact" aria-labelledby={uid + "cta"}>
      <div className="ovs-fin-stage">
        <div className="ovs-window">
          {usePhoto ? (
            <PhotoCanopy src={photo as string} season={season} scheme={scheme} turn />
          ) : (
            <Canopy seed={seed + 31} scheme={scheme} palette={pal} lazy />
          )}
          <div className="ovs-fin-copy">
            <h2 id={uid + "cta"} className="ovs-fin-h">
              {title}
            </h2>
            <p>{text}</p>
            <div className="ovs-fin-actions">
              <Magnet className="ovs-btn ovs-btn-dark ovs-btn-xl" href={"mailto:" + email} onClick={onBookFinale}>
                <span>{button}</span>
                <Arrow />
              </Magnet>
              <button type="button" className="ovs-btn ovs-btn-glass ovs-btn-xl" onClick={onCopyEmail}>
                <span aria-live="polite">{copied ? "Copied" : email}</span>
                <svg className="ovs-svg ovs-arrow" viewBox="0 0 16 16" aria-hidden="true">
                  {copied ? (
                    <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  ) : (
                    <path
                      d="M5.5 5.5V3.5h7v7h-2M3.5 5.5h7v7h-7z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
