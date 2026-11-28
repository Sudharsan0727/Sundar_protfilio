import * as React from "react"

function getContextLabel(target: HTMLElement | null): string | null {
  if (!target) return null
  if (target.closest("input, textarea, select")) return "Type"
  const liveBtn = target.closest('.ovs-cs-livebtn, .ovs-proj-media, .ovs-proj-visit, a[target="_blank"]')
  if (liveBtn) return "Open ↗"
  const card = target.closest(".ovs-ads-stage, .ovs-testi-card, .ovs-proj-card, .ovs-cl-card")
  if (card && !target.closest("a, button")) return "View"
  if (target.closest('a, button, [role="button"], [role="tab"], [role="radio"], label')) return "Click"
  return null
}

export function CustomCursor() {
  const arrowRef = React.useRef<HTMLDivElement>(null)
  const pillRef = React.useRef<HTMLDivElement>(null)
  const [label, setLabel] = React.useState<string>("")

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!isFinePointer || reduced) return

    const arrow = arrowRef.current
    const pill = pillRef.current
    if (!arrow || !pill) return

    document.documentElement.classList.add("ovs-has-cursor")

    let mouseX = -100
    let mouseY = -100
    let pillX = -100
    let pillY = -100
    let visible = false
    let pressed = false
    let currentLabel = ""
    let rafId = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!visible) {
        visible = true
        pillX = mouseX
        pillY = mouseY
        arrow.style.opacity = "1"
      }
      arrow.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(${pressed ? 0.85 : 1})`

      const nextLabel = getContextLabel(e.target as HTMLElement | null) || ""
      if (nextLabel !== currentLabel) {
        currentLabel = nextLabel
        setLabel(nextLabel)
        pill.classList.toggle("is-on", !!nextLabel)
      }
    }

    const onDown = () => {
      pressed = true
      arrow.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(0.85)`
      pill.classList.add("is-down")
    }

    const onUp = () => {
      pressed = false
      arrow.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1)`
      pill.classList.remove("is-down")
    }

    const onLeave = () => {
      visible = false
      arrow.style.opacity = "0"
      pill.classList.remove("is-on")
    }

    const tick = () => {
      pillX += (mouseX - pillX) * 0.22
      pillY += (mouseY - pillY) * 0.22
      pill.style.transform = `translate3d(${pillX + 24}px, ${pillY + 24}px, 0)`
      rafId = window.requestAnimationFrame(tick)
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("mousedown", onDown)
    window.addEventListener("mouseup", onUp)
    document.addEventListener("mouseleave", onLeave)
    rafId = window.requestAnimationFrame(tick)

    return () => {
      document.documentElement.classList.remove("ovs-has-cursor")
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mousedown", onDown)
      window.removeEventListener("mouseup", onUp)
      document.removeEventListener("mouseleave", onLeave)
      window.cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div ref={arrowRef} className="ovs-cursor-arrow" aria-hidden="true">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path
            d="M4.5 3.5L19.5 11.2L12.4 13.4L9.8 20.5L4.5 3.5Z"
            fill="#10150d"
            stroke="#cbf34d"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div ref={pillRef} className="ovs-cursor-pill" aria-hidden="true">
        <span>{label}</span>
      </div>
    </>
  )
}
