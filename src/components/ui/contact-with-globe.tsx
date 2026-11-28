"use client"

import * as React from "react"
import * as d3 from "d3"
import { feature } from "topojson-client"
import worldDataJson from "world-atlas/countries-110m.json"
import type { Topology, GeometryCollection, GeometryObject } from "topojson-specification"
import type { GeoPermissibleObjects } from "d3"
import { Arrow, Clock, Kicker, Split } from "../landing/ui-primitives"

/* -------------------------------------------------------------------------- */
/* Globe                                                                      */
/* -------------------------------------------------------------------------- */

interface GeoFeature {
  type: string
  geometry: GeometryObject
  properties: Record<string, unknown>
}

interface WorldAtlasTopology extends Topology {
  objects: { countries: GeometryCollection }
}

const countriesData: GeoFeature[] = (
  feature(
    worldDataJson as unknown as Topology,
    (worldDataJson as unknown as WorldAtlasTopology).objects.countries,
  ) as unknown as { features: GeoFeature[] }
).features

interface GlobeWireframeProps {
  className?: string
  autoRotate?: boolean
  autoRotateSpeed?: number
  initialRotation?: [number, number]
  enableInteraction?: boolean
  /** Rotation target, e.g. the studio's home city: [longitude, latitude]. */
  focus?: [number, number]
}

/**
 * Wireframe globe. Redraws only while it is on screen, pauses for
 * `prefers-reduced-motion`, and can be dragged.
 */
export function GlobeWireframe({
  className = "",
  autoRotate = true,
  autoRotateSpeed = 0.25,
  initialRotation = [-80, -15],
  enableInteraction = true,
  focus,
}: GlobeWireframeProps) {
  const svgRef = React.useRef<SVGSVGElement>(null)
  const boxRef = React.useRef<HTMLDivElement>(null)
  const rotation = React.useRef<[number, number]>(initialRotation)
  const size = React.useRef(300)
  const visible = React.useRef(false)
  const dragging = React.useRef<{ x: number; y: number } | null>(null)
  const raf = React.useRef(0)
  const [drag, setDrag] = React.useState(false)

  const draw = React.useCallback(() => {
    const svgEl = svgRef.current
    if (!svgEl) return
    const w = size.current
    const svg = d3.select(svgEl)
    svg.attr("viewBox", `0 0 ${w} ${w}`)
    svg.selectAll("*").remove()

    const projection = d3
      .geoOrthographic()
      .scale((w / 2) * 0.92)
      .translate([w / 2, w / 2])
      .rotate([rotation.current[0], rotation.current[1]])
      .precision(0.2)
    const path = d3.geoPath().projection(projection)

    svg
      .append("path")
      .datum(d3.geoGraticule()())
      .attr("d", path as never)
      .attr("fill", "none")
      .attr("stroke", "currentColor")
      .attr("stroke-width", 0.6)
      .attr("opacity", 0.14)

    svg
      .append("g")
      .selectAll("path")
      .data(countriesData)
      .enter()
      .append("path")
      .attr("d", (d) => path(d as unknown as GeoPermissibleObjects) || "")
      .attr("fill", "currentColor")
      .attr("fill-opacity", 0.06)
      .attr("stroke", "currentColor")
      .attr("stroke-width", 0.7)
      .attr("stroke-opacity", 0.7)

    svg
      .append("path")
      .datum({ type: "Sphere" } as never)
      .attr("d", path as never)
      .attr("fill", "none")
      .attr("stroke", "currentColor")
      .attr("stroke-width", 1.1)
      .attr("opacity", 0.85)

    if (focus) {
      const p = projection(focus)
      const [cx, cy] = [w / 2, w / 2]
      // only draw the pin on the visible hemisphere
      const visibleSide =
        d3.geoDistance(focus, [-rotation.current[0], -rotation.current[1]]) < Math.PI / 2
      if (p && visibleSide) {
        svg.append("circle").attr("cx", p[0]).attr("cy", p[1]).attr("r", 10).attr("fill", "var(--ovs-accent)").attr("opacity", 0.22)
        svg.append("circle").attr("cx", p[0]).attr("cy", p[1]).attr("r", 4).attr("fill", "var(--ovs-accent)")
        void cx
        void cy
      }
    }
  }, [focus])

  React.useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const measure = () => {
      size.current = Math.max(160, Math.round(box.getBoundingClientRect().width))
      draw()
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting
    })
    io.observe(box)

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let last = 0
    const tick = (t: number) => {
      raf.current = requestAnimationFrame(tick)
      if (!visible.current || dragging.current || !autoRotate || reduced) return
      if (t - last < 33) return // ~30fps is plenty for a wireframe
      last = t
      rotation.current = [(rotation.current[0] + autoRotateSpeed) % 360, rotation.current[1]]
      draw()
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf.current)
      ro.disconnect()
      io.disconnect()
    }
  }, [autoRotate, autoRotateSpeed, draw])

  const onDown = (e: React.PointerEvent) => {
    if (!enableInteraction) return
    dragging.current = { x: e.clientX, y: e.clientY }
    setDrag(true)
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent) => {
    const d = dragging.current
    if (!d) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    dragging.current = { x: e.clientX, y: e.clientY }
    rotation.current = [
      rotation.current[0] + dx * 0.4,
      Math.max(-70, Math.min(70, rotation.current[1] - dy * 0.4)),
    ]
    draw()
  }
  const onUp = () => {
    dragging.current = null
    setDrag(false)
  }

  return (
    <div ref={boxRef} className={className}>
      <svg
        ref={svgRef}
        role="img"
        aria-label="Interactive wireframe globe"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        style={{ width: "100%", height: "auto", display: "block", touchAction: "pan-y", cursor: enableInteraction ? (drag ? "grabbing" : "grab") : "default" }}
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Contact section                                                            */
/* -------------------------------------------------------------------------- */

export type ContactPayload = {
  name: string
  email: string
  phone: string
  company: string
  services: string[]
  budget: string
  message: string
}

export type ContactSocial = { label: string; href: string }

interface ContactWithGlobeProps {
  kicker?: string
  title?: string
  description?: string
  email?: string
  copied?: boolean
  onCopyEmail?: () => void
  phone?: string
  city?: string
  timeZone?: string
  /** [longitude, latitude] of the pin on the globe. */
  coordinates?: [number, number]
  availability?: string
  responseTime?: string
  socials?: ContactSocial[]
  services?: string[]
  budgets?: string[]
  /** Called with the validated form. Return/resolve `false` or throw to show an error. Without it the form opens the visitor's mail app. */
  onSubmit?: (data: ContactPayload) => unknown
}

const DEFAULT_SERVICES = ["Website", "E-Commerce", "Web App", "UI/UX Design", "Marketing", "Something else"]
const DEFAULT_BUDGETS = ["Under ₹25k", "₹25k – ₹75k", "₹75k – ₹2L", "₹2L+"]
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())

type Errors = Partial<Record<"name" | "email" | "message" | "services", string>>

export default function ContactWithGlobe({
  kicker = "Contact",
  title = "Let’s build something exceptional.",
  description = "Have a project in mind, need a dedicated squad, or want to scale your ad campaigns? Send a few details and our team will reply with next steps.",
  email = "hello@vayalcode.com",
  copied = false,
  onCopyEmail,
  phone,
  city = "San Francisco & Remote",
  timeZone = "America/Los_Angeles",
  coordinates = [-122.42, 37.77],
  availability = "Available for new projects",
  responseTime = "Replies within 24 hours",
  socials = [],
  services = DEFAULT_SERVICES,
  budgets = DEFAULT_BUDGETS,
  onSubmit,
}: ContactWithGlobeProps) {
  const uid = React.useId().replace(/:/g, "")
  const [picked, setPicked] = React.useState<string[]>([])
  const [budget, setBudget] = React.useState(budgets[1] ?? budgets[0] ?? "")
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", company: "", message: "" })
  const [errors, setErrors] = React.useState<Errors>({})
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent" | "failed">("idle")

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k as keyof Errors]) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const toggle = (s: string) => {
    setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))
    if (errors.services) setErrors((x) => ({ ...x, services: undefined }))
  }

  const validate = (): Errors => {
    const e: Errors = {}
    if (form.name.trim().length < 2) e.name = "Please enter your name."
    if (!isEmail(form.email)) e.email = "Enter a valid email address."
    if (picked.length === 0) e.services = "Pick at least one service."
    if (form.message.trim().length < 10) e.message = "A sentence or two about the project helps a lot."
    return e
  }

  const submit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0]
      const target = first === "services" ? `${uid}-svc` : `${uid}-${first}`
      document.getElementById(target)?.focus()
      return
    }
    const payload: ContactPayload = { ...form, services: picked, budget }
    setStatus("sending")
    try {
      if (onSubmit) {
        const ok = await onSubmit(payload)
        setStatus(ok === false ? "failed" : "sent")
      } else {
        const body = [
          `Name: ${payload.name}`,
          `Email: ${payload.email}`,
          payload.phone ? `Phone / WhatsApp: ${payload.phone}` : "",
          payload.company ? `Company: ${payload.company}` : "",
          `Services: ${payload.services.join(", ")}`,
          `Budget: ${payload.budget}`,
          "",
          payload.message,
        ]
          .filter((l, i, a) => l !== "" || a[i - 1] !== "")
          .join("\n")
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Project enquiry from ${payload.name}`)}&body=${encodeURIComponent(body)}`
        setStatus("sent")
      }
    } catch {
      setStatus("failed")
    }
  }

  const reset = () => {
    setStatus("idle")
    setForm({ name: "", email: "", phone: "", company: "", message: "" })
    setPicked([])
    setErrors({})
  }

  return (
    <section className="ovs-sec ovs-ct" data-sec="contact" id="contact" aria-labelledby={`${uid}-h`}>
      <div className="ovs-wrap">
        <div className="ovs-ct-panel">
          {/* ------------------------------------------------ info pane */}
          <aside className="ovs-ct-info">
            <GlobeWireframe className="ovs-ct-globe-art" focus={coordinates} initialRotation={[-coordinates[0], -15]} />

            <div className="ovs-ct-intro">
              <span className="ovs-ct-pill">
                <span className="ovs-ct-dot" aria-hidden="true" />
                {availability}
              </span>
              <Kicker n="07" text={kicker} />
              <span id={`${uid}-h`}>
                <Split text={title} className="ovs-h2" />
              </span>
              <p className="ovs-ct-lede" data-rv>
                {description}
              </p>
            </div>

            <div className="ovs-ct-details" data-rv>
              <div className="ovs-ct-mail">
                <span className="ovs-ct-label">Write to us</span>
                <div className="ovs-ct-row">
                  <a href={`mailto:${email}`} className="ovs-ct-email">
                    {email}
                  </a>
                  <button type="button" className="ovs-ct-copy" onClick={onCopyEmail} aria-live="polite">
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <dl className="ovs-ct-meta">
                {phone ? (
                  <div>
                    <dt className="ovs-ct-label">Phone / WhatsApp</dt>
                    <dd>
                      <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a>
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt className="ovs-ct-label">Based in</dt>
                  <dd>
                    {city} · <span className="ovs-ct-time"><Clock timeZone={timeZone} /></span>
                  </dd>
                </div>
                <div>
                  <dt className="ovs-ct-label">Response time</dt>
                  <dd>{responseTime}</dd>
                </div>
                {socials.length ? (
                  <div>
                    <dt className="ovs-ct-label">Elsewhere</dt>
                    <dd className="ovs-ct-socials">
                      {socials.map((s) => (
                        <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="ovs-ct-social">
                          {s.label}
                          <span aria-hidden="true">↗</span>
                        </a>
                      ))}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </aside>

          {/* ------------------------------------------------------- form */}
          <div className="ovs-ct-formcard" data-rv>
            {status === "sent" ? (
              <div className="ovs-ct-done" role="status">
                <span className="ovs-ct-tick" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <h3>Thanks, {form.name.split(" ")[0] || "there"}.</h3>
                <p>
                  {onSubmit
                    ? `Your message is in. Our team will reply to ${form.email} — ${responseTime.toLowerCase()}.`
                    : `Your email app should have opened with the details filled in. Just press send. If nothing opened, write to ${email} directly.`}
                </p>
                <button type="button" className="ovs-btn ovs-btn-line" onClick={reset}>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate aria-describedby={status === "failed" ? `${uid}-err` : undefined}>
                <div className="ovs-ct-formhead">
                  <h3>Tell us about your project</h3>
                  <p>Share a few quick details — we&apos;ll reply with a clear plan &amp; quote within 24 hours.</p>
                </div>

                <fieldset className="ovs-ct-field" aria-describedby={errors.services ? `${uid}-svc-e` : undefined}>
                  <legend>
                    What do you need? <b aria-hidden="true">*</b>
                  </legend>
                  <div className="ovs-ct-chips" id={`${uid}-svc`} tabIndex={-1}>
                    {services.map((s) => {
                      const on = picked.includes(s)
                      return (
                        <button key={s} type="button" className="ovs-ct-chip" aria-pressed={on} data-on={on ? "" : undefined} onClick={() => toggle(s)}>
                          {on ? (
                            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 8.5l3.2 3.2L13 5" />
                            </svg>
                          ) : null}
                          {s}
                        </button>
                      )
                    })}
                  </div>
                  {errors.services ? (
                    <p className="ovs-ct-err" id={`${uid}-svc-e`}>
                      {errors.services}
                    </p>
                  ) : null}
                </fieldset>

                <div className="ovs-ct-two">
                  <Field id={`${uid}-name`} label="Full name" required error={errors.name}>
                    <input id={`${uid}-name`} type="text" autoComplete="name" value={form.name} onChange={set("name")} placeholder="Your name" aria-invalid={!!errors.name} aria-describedby={errors.name ? `${uid}-name-e` : undefined} />
                  </Field>
                  <Field id={`${uid}-email`} label="Email" required error={errors.email}>
                    <input id={`${uid}-email`} type="email" autoComplete="email" inputMode="email" value={form.email} onChange={set("email")} placeholder="you@company.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? `${uid}-email-e` : undefined} />
                  </Field>
                </div>

                <div className="ovs-ct-two">
                  <Field id={`${uid}-phone`} label="Phone / WhatsApp" hint="Optional">
                    <input id={`${uid}-phone`} type="tel" autoComplete="tel" inputMode="tel" value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" />
                  </Field>
                  <Field id={`${uid}-company`} label="Company" hint="Optional">
                    <input id={`${uid}-company`} type="text" autoComplete="organization" value={form.company} onChange={set("company")} placeholder="Company or brand name" />
                  </Field>
                </div>

                {budgets.length ? (
                  <fieldset className="ovs-ct-field">
                    <legend>Budget</legend>
                    <div className="ovs-ct-seg" role="radiogroup" aria-label="Budget">
                      {budgets.map((b) => (
                        <button key={b} type="button" role="radio" aria-checked={budget === b} data-on={budget === b ? "" : undefined} onClick={() => setBudget(b)}>
                          {b}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                ) : null}

                <Field id={`${uid}-message`} label="Project details" required error={errors.message}>
                  <textarea id={`${uid}-message`} rows={5} value={form.message} onChange={set("message")} placeholder="What are you building, what does success look like, and when do you need it?" aria-invalid={!!errors.message} aria-describedby={errors.message ? `${uid}-message-e` : undefined} />
                </Field>

                {status === "failed" ? (
                  <p className="ovs-ct-fail" id={`${uid}-err`} role="alert">
                    Something went wrong sending that. Please try again, or email {email} directly.
                  </p>
                ) : null}

                <div className="ovs-ct-foot">
                  <button type="submit" className="ovs-btn ovs-btn-dark ovs-ct-submit" disabled={status === "sending"}>
                    {status === "sending" ? "Sending…" : "Send message"}
                    {status === "sending" ? null : <Arrow />}
                  </button>
                  <p className="ovs-ct-note">
                    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="7" width="10" height="7" rx="1.6" />
                      <path d="M5.5 7V5a2.5 2.5 0 015 0v2" />
                    </svg>
                    Your details stay private. NDA on request.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="ovs-ct-field" data-invalid={error ? "" : undefined}>
      <label htmlFor={id}>
        {label}
        {required ? <b aria-hidden="true"> *</b> : null}
        {hint ? <em>{hint}</em> : null}
      </label>
      {children}
      {error ? (
        <p className="ovs-ct-err" id={`${id}-e`}>
          {error}
        </p>
      ) : null}
    </div>
  )
}
