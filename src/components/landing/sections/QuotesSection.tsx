import * as React from "react"
import { Arrow, Magnet } from "../ui-primitives"

interface QuotesSectionProps {
  usePhoto: boolean
  photo?: string | null
  onBookCall?: (e: React.MouseEvent) => void
}

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
        <p className="ovs-kicker ovs-kicker-light" data-rv>
          <span className="ovs-kicker-n">( ✦ )</span>
          <span>In the shade, with founders</span>
        </p>
        <div className="mt-8 sm:mt-12 max-w-4xl">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#edf1e6] leading-[1.18] sm:leading-[1.15]">
            Trusted by <br />
            founders and teams.
          </h2>
          <p
            className="text-lg sm:text-2xl text-[#edf1e6]/80 font-normal leading-[1.65] sm:leading-[1.7] max-w-2xl block"
            style={{
              paddingTop: "clamp(16px, 2.2vw, 32px)",
              paddingBottom: "clamp(16px, 2.2vw, 32px)",
            }}
          >
            Real feedback from founders who&apos;ve shipped <br className="hidden sm:inline" />
            with us — faster, smarter, built to last.
          </p>
          <div>
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
      </div>
    </section>
  )
}
