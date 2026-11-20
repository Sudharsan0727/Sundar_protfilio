import * as React from "react"
import { Kicker, Split } from "../ui-primitives"
import { OvsFaq } from "../types"

interface FaqSectionProps {
  kicker: string
  title: string
  text: string
  email: string
  copied: boolean
  items: OvsFaq[]
  faqOpen: number
  uid: string
  onCopyEmail: () => void
  onToggleFaq: (index: number) => void
}

export function FaqSection({
  kicker,
  title,
  text,
  email,
  copied,
  items,
  faqOpen,
  uid,
  onCopyEmail,
  onToggleFaq,
}: FaqSectionProps) {
  return (
    <section className="ovs-sec ovs-faq" data-sec="faq" aria-labelledby={uid + "fq"}>
      <div className="ovs-wrap ovs-faq-grid">
        <div>
          <Kicker n="06" text={kicker} />
          <span id={uid + "fq"}>
            <Split text={title} className="ovs-h2" />
          </span>
          <div className="ovs-faq-card" data-rv>
            <p>{text}</p>
            <button type="button" className="ovs-btn ovs-btn-line" onClick={onCopyEmail}>
              <span aria-live="polite">{copied ? "Copied to clipboard" : email}</span>
            </button>
          </div>
        </div>

        <div className="ovs-acc">
          {items.map((f, i) => {
            const open = faqOpen === i
            return (
              <div key={f.q} className="ovs-acc-item" data-open={open ? "" : undefined} data-rv>
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={uid + "fa" + i}
                    onClick={() => onToggleFaq(open ? -1 : i)}
                  >
                    {f.q}
                    <span className="ovs-plus" aria-hidden="true" />
                  </button>
                </h3>
                <div id={uid + "fa" + i} className="ovs-fold" role="region" aria-label={f.q}>
                  <div>
                    <p>{f.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
