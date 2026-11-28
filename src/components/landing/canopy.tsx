import * as React from "react"
import { drawLayer, drawSky, gradePixel, LAYERS, OvsPaletteType } from "./canopy-engine"
import { OvsSeason } from "./types"

export type CanopyProps = {
  seed: number
  scheme: "light" | "dark"
  palette: OvsPaletteType
  lazy?: boolean
  onReady?: () => void
  className?: string
}

/** The generated view up through the trees: a sky and four leaf layers, each nested for pointer, scroll and sway. */
export function Canopy({ seed, scheme, palette, lazy, onReady, className }: CanopyProps) {
  const box = React.useRef(null as HTMLDivElement | null)
  const sky = React.useRef(null as HTMLCanvasElement | null)
  const layers = React.useRef([] as (HTMLCanvasElement | null)[])
  const ready = React.useRef(onReady)
  ready.current = onReady

  React.useEffect(() => {
    const el = box.current
    if (!el) return
    let size = { w: 0, h: 0 }
    let job = 0
    let alive = true
    let seen = !lazy
    let drawn = false
    const draw = () => {
      cancelAnimationFrame(job)
      const w = el.clientWidth
      const h = el.clientHeight
      if (w < 2 || h < 2) return
      size = { w, h }
      const work = [
        () => sky.current && drawSky(sky.current, w, h, scheme, seed),
        ...LAYERS.map((_, i) => () => {
          const cv = layers.current[i]
          if (cv && cv.parentElement) drawLayer(cv, cv.parentElement.clientWidth, cv.parentElement.clientHeight, i, seed, palette, scheme)
        }),
      ]
      let i = 0
      const next = () => {
        if (!alive) return
        try {
          work[i]()
        } catch {
          /* a canvas that cannot draw leaves the CSS sky behind it */
        }
        i++
        if (i < work.length) job = requestAnimationFrame(next)
        else {
          drawn = true
          el.setAttribute("data-drawn", "")
          ready.current?.()
        }
      }
      job = requestAnimationFrame(next)
    }
    const ro = new ResizeObserver(() => {
      if (!seen) return
      const w = el.clientWidth
      const h = el.clientHeight
      if (drawn && Math.abs(w - size.w) < 40 && Math.abs(h - size.h) < 140) return
      draw()
    })
    ro.observe(el)
    let io: IntersectionObserver | null = null
    if (lazy) {
      io = new IntersectionObserver(
        (es) => {
          if (es.some((e) => e.isIntersecting) && !seen) {
            seen = true
            draw()
          }
        },
        { rootMargin: "900px 0px" },
      )
      io.observe(el)
    } else draw()
    return () => {
      alive = false
      cancelAnimationFrame(job)
      ro.disconnect()
      io?.disconnect()
    }
  }, [seed, scheme, palette, lazy])

  return (
    <div ref={box} className={"ovs-canopy " + (className || "")} aria-hidden="true">
      <div className="ovs-skybox" data-sky>
        <canvas ref={sky} className="ovs-cv ovs-skycv" />
      </div>
      {LAYERS.map((_, i) => (
        <div key={i} className="ovs-layer" data-layer={i}>
          <div className="ovs-zoom" data-zoom={i}>
            <div className={"ovs-sway ovs-sway-" + i}>
              <canvas ref={(c) => { layers.current[i] = c }} className="ovs-cv" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export type PhotoProps = {
  src: string
  season: OvsSeason
  scheme: "light" | "dark"
  /** Turn the photo upside down (looking up, any way round is still the sky). */
  turn?: boolean
  onReady?: () => void
  onFail?: () => void
}

/**
 * The real canopy: one photo, graded per season and scheme in canvas, plus a
 * soft-focus copy of its rim that rushes past when you rise through it.
 */
export function PhotoCanopy({ src, season, scheme, turn, onReady, onFail }: PhotoProps) {
  const box = React.useRef(null as HTMLDivElement | null)
  const base = React.useRef(null as HTMLCanvasElement | null)
  const fore = React.useRef(null as HTMLCanvasElement | null)
  const cbs = React.useRef({ onReady, onFail })
  cbs.current = { onReady, onFail }
  const [portrait, setPortrait] = React.useState(false)

  React.useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(() => setPortrait(el.clientHeight > el.clientWidth * 1.05))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  React.useEffect(() => {
    let alive = true
    const img = document.createElement("img")
    img.decoding = "async"
    const paint = () => {
      const cv = base.current
      const fv = fore.current
      if (!cv || !fv) return
      const iw = img.naturalWidth
      const ih = img.naturalHeight
      const W = portrait ? ih : iw
      const H = portrait ? iw : ih
      cv.width = W
      cv.height = H
      const ctx = cv.getContext("2d", { willReadFrequently: true })
      if (!ctx) throw new Error("no 2d")
      ctx.save()
      if (portrait) {
        ctx.translate(W, 0)
        ctx.rotate(Math.PI / 2)
      }
      if (turn) {
        ctx.translate(iw, ih)
        ctx.rotate(Math.PI)
      }
      ctx.drawImage(img, 0, 0)
      ctx.restore()
      const dark = scheme === "dark"
      if (season !== "summer" || dark) {
        const data = ctx.getImageData(0, 0, W, H)
        const a = data.data
        const px = [0, 0, 0]
        for (let y = 0; y < H; y++) {
          const yy = y / (H - 1)
          for (let x = 0; x < W; x++) {
            const o = (y * W + x) * 4
            px[0] = a[o]
            px[1] = a[o + 1]
            px[2] = a[o + 2]
            gradePixel(px, yy, season, dark)
            a[o] = px[0]
            a[o + 1] = px[1]
            a[o + 2] = px[2]
          }
        }
        ctx.putImageData(data, 0, 0)
      }
      // the rim, out of focus, for the rise
      fv.width = Math.round(W / 2)
      fv.height = Math.round(H / 2)
      const f = fv.getContext("2d")
      if (f) {
        f.filter = "blur(7px)"
        f.drawImage(cv, 0, 0, fv.width, fv.height)
        f.filter = "none"
        f.globalCompositeOperation = "destination-in"
        const gr = f.createRadialGradient(fv.width / 2, fv.height / 2, Math.min(fv.width, fv.height) * 0.22, fv.width / 2, fv.height / 2, Math.max(fv.width, fv.height) * 0.62)
        gr.addColorStop(0, "rgba(0,0,0,0)")
        gr.addColorStop(1, "rgba(0,0,0,1)")
        f.fillStyle = gr
        f.fillRect(0, 0, fv.width, fv.height)
        f.globalCompositeOperation = "source-over"
      }
      box.current?.setAttribute("data-drawn", "")
    }
    img.onload = () => {
      if (!alive) return
      try {
        paint()
        cbs.current.onReady?.()
      } catch {
        cbs.current.onFail?.()
      }
    }
    img.onerror = () => {
      if (alive) cbs.current.onFail?.()
    }
    img.src = src
    return () => {
      alive = false
      img.onload = null
      img.onerror = null
    }
  }, [src, season, scheme, turn, portrait])

  return (
    <div ref={box} className="ovs-canopy ovs-photo" data-photo aria-hidden="true">
      <div className="ovs-layer" data-layer={0}>
        <div className="ovs-zoom" data-zoom={0}>
          <div className="ovs-sway ovs-sway-p">
            <canvas ref={base} className="ovs-cv ovs-pcv" />
          </div>
        </div>
      </div>
      <div className="ovs-layer ovs-fore" data-layer={1}>
        <div className="ovs-zoom" data-zoom={1}>
          <canvas ref={fore} className="ovs-cv ovs-pcv" />
        </div>
      </div>
    </div>
  )
}
