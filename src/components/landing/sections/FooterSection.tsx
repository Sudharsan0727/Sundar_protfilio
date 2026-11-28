import * as React from "react"
import { OvsLink } from "../types"
import vayalcodeLogo from "@/Img/logo/Logo.webp"

interface FooterSectionProps {
  brand: string
  columns: { title: string; links: OvsLink[] }[]
  city?: string
  timeZone?: string
  note?: string
  email: string
  mail: string
  mailState: "idle" | "sending" | "done" | "error" | "invalid"
  uid: string
  still: boolean
  rootRef: React.RefObject<HTMLDivElement | null>
  onMailChange: (value: string) => void
  onSubscribe: (e: React.FormEvent) => void
  onNavigate: (href?: string) => (e: React.MouseEvent) => void
}

export function FooterSection({
  brand,
  columns,
  city = "San Francisco & Remote",
  timeZone = "America/Los_Angeles",
  note = "Websites · E-Commerce · Software · Digital Marketing.",
  email,
  mail,
  mailState,
  uid,
  still,
  rootRef,
  onMailChange,
  onSubscribe,
  onNavigate,
}: FooterSectionProps) {
  return (
    <footer className="ovs-foot">
      <div className="ovs-wrap">
        <div className="ovs-foot-top">
          <div>
            <div className="mb-5">
              <span className="ovs-brand-pill ovs-brand-pill-foot">
                <img src={vayalcodeLogo} alt={brand} className="ovs-brand-logo ovs-brand-logo-foot" />
              </span>
            </div>
            <form className="ovs-news" onSubmit={onSubscribe} noValidate>
              <label htmlFor={uid + "mail"}>Growth insights, once a month. Conversion tips &amp; case studies.</label>
              <div className="ovs-news-row">
                <input
                  id={uid + "mail"}
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={mail}
                  onChange={(e) => onMailChange(e.target.value)}
                  aria-invalid={mailState === "invalid" || mailState === "error"}
                  aria-describedby={uid + "mailmsg"}
                />
                <button type="submit" className="ovs-btn ovs-btn-lime" disabled={mailState === "sending"}>
                  {mailState === "sending" ? "Sending" : "Subscribe"}
                </button>
              </div>
              <p id={uid + "mailmsg"} className="ovs-news-msg" aria-live="polite" data-state={mailState}>
                {mailState === "invalid"
                  ? "That email does not look right."
                  : mailState === "error"
                  ? "Something went wrong. Try again?"
                  : mailState === "done"
                  ? "You are in. First notes land next month."
                  : ""}
              </p>
            </form>
          </div>
          <div className="ovs-foot-cols">
            {columns.map((col) => (
              <div key={col.title}>
                <p>{col.title}</p>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href || "#"} onClick={onNavigate(l.href)}>
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="ovs-wordmark" data-wordmark aria-label={brand}>
        {Array.from(brand).map((ch, i) => (
          <span key={i}>{ch === " " ? "\u00A0" : ch}</span>
        ))}
      </div>
      <div className="ovs-wrap ovs-foot-bottom">
        <span>
          © {new Date().getFullYear()} {brand} Studio
        </span>
        <span>{note}</span>
        <button
          type="button"
          className="ovs-top"
          onClick={() => rootRef.current?.scrollIntoView({ behavior: still ? "auto" : "smooth" })}
        >
          Back to top
          <svg className="ovs-svg ovs-arrow" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M8 13V3M4 7l4-4 4 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </footer>
  )
}
