import { OvsPalette, OvsPlan, OvsSeason } from "./types"

export type Rgb = [number, number, number]

export type OvsTwig = { p: number[]; w: number }
export type OvsLeaf = { x: number; y: number; s: number; a: number; l: number }

export interface OvsPaletteType {
  shadow: Rgb
  mid: Rgb
  lit: Rgb
  glow: Rgb
  twig: Rgb
  accent: string
  soft: string
  shape: number
}

export const SEASONS: Record<OvsSeason, OvsPaletteType> = {
  summer: {
    shadow: [20, 38, 12],
    mid: [74, 114, 22],
    lit: [170, 202, 56],
    glow: [228, 240, 140],
    twig: [42, 38, 26],
    accent: "#3d6a12",
    soft: "#c4dc52",
    shape: 0.42,
  },
  autumn: {
    shadow: [46, 20, 10],
    mid: [146, 62, 18],
    lit: [224, 138, 36],
    glow: [252, 210, 116],
    twig: [46, 30, 22],
    accent: "#a5451a",
    soft: "#f1b24a",
    shape: 0.5,
  },
  blossom: {
    shadow: [92, 44, 64],
    mid: [192, 102, 138],
    lit: [242, 176, 200],
    glow: [255, 230, 238],
    twig: [56, 38, 42],
    accent: "#a33a64",
    soft: "#f3b1c9",
    shape: 0.66,
  },
}

export const SKIES = {
  light: {
    stops: [
      [0.0, [214, 226, 216]],
      [0.45, [226, 234, 224]],
      [1.0, [242, 244, 238]],
    ] as (number | Rgb)[][],
    sun: [0.5, 0.46, 255, 255, 250, 0.55] as [number, number, number, number, number, number],
    cloud: [255, 255, 255, 0.5] as [number, number, number, number],
    haze: [224, 232, 222] as Rgb,
    leaf: 1,
    stars: false,
  },
  dark: {
    stops: [
      [0.0, [10, 16, 26]],
      [0.55, [18, 28, 42]],
      [0.85, [38, 42, 54]],
      [1.0, [72, 56, 62]],
    ] as (number | Rgb)[][],
    sun: [0.5, 0.48, 180, 150, 170, 0.28] as [number, number, number, number, number, number],
    cloud: [160, 140, 170, 0.22] as [number, number, number, number],
    haze: [24, 32, 44] as Rgb,
    leaf: 0.46,
    stars: true,
  },
}

export const LAYERS = [
  { reach: 0.26, band: 0.34, masses: 7, leaf: 0.055, blur: 3.5, res: 0.55, haze: 0.32 },
  { reach: 0.34, band: 0.38, masses: 11, leaf: 0.046, blur: 1.2, res: 0.75, haze: 0.22 },
  { reach: 0.44, band: 0.4, masses: 15, leaf: 0.038, blur: 0, res: 1.0, haze: 0.12 },
  { reach: 0.54, band: 0.42, masses: 18, leaf: 0.031, blur: 0, res: 1.0, haze: 0.04 },
]

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}
export const stepAt = (progress: number, count: number) => clamp(Math.floor(progress * count), 0, count - 1)

export function mulberry32(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}

export function noise2(x: number, y: number) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const h = (i: number, j: number) => hash(i * 57.0 + j * 131.0)
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  return lerp(lerp(h(xi, yi), h(xi + 1, yi), u), lerp(h(xi, yi + 1), h(xi + 1, yi + 1), u), v)
}

export function fbm(x: number, y: number) {
  let v = 0
  let a = 0.55
  let f = 1
  for (let i = 0; i < 4; i++) {
    v += a * noise2(x * f, y * f)
    a *= 0.5
    f *= 2.05
  }
  return v
}

export function ellipse(w: number, h: number) {
  const m = Math.min(w, h)
  return { rx: (m * 0.44) / Math.SQRT2, ry: (m * 0.38) / Math.SQRT2 }
}

export function distAt(x: number, y: number, w: number, h: number) {
  const e = ellipse(w, h)
  const dx = (x - w / 2) / e.rx
  const dy = (y - h / 2) / e.ry
  return Math.sqrt(dx * dx + dy * dy)
}

export function reachAt(theta: number, layer: number, seed: number) {
  const p1 = hash(seed + 1) * 6.283
  const p2 = hash(seed + 2) * 6.283
  const p3 = hash(seed + 3) * 6.283
  const base = LAYERS[layer].reach
  const w1 = Math.sin(theta * 2 + p1) * 0.08
  const w2 = Math.sin(theta * 3 - p2) * 0.05
  const w3 = Math.sin(theta * 5 + p3) * 0.03
  return base + w1 + w2 + w3
}

export function canopyPlan(w: number, h: number, layer: number, seed: number) {
  const spec = LAYERS[layer]
  const rand = mulberry32(seed * 977 + layer * 7919 + 13)
  const gauss = () => (rand() + rand() + rand() - 1.5) / 0.75
  const e = ellipse(w, h)
  const u = Math.max(Math.sqrt(w * h), 1000)
  const leafPx = spec.leaf * u
  const cx = w / 2
  const cy = h / 2
  const area = clamp((w * h) / (1612 * 1008), 0.62, 1.35)
  const twigs = [] as OvsTwig[]
  const clusters = [] as { x: number; y: number; r: number; n: number; d: number }[]

  const branchCap = Math.round(spec.masses * area * 0.9)
  let branchCount = 0

  const thetaOf = (x: number, y: number) => {
    const t = Math.atan2((y - cy) / e.ry, (x - cx) / e.rx)
    return t < 0 ? t + Math.PI * 2 : t
  }

  const grow = (x: number, y: number, dir: number, width: number, depth: number) => {
    const pts = [x, y]
    const step = u * 0.028
    let px = x
    let py = y
    let th = dir
    const stopAt = reachAt(thetaOf(x, y), layer, seed) + 0.02 + rand() * 0.08
    for (let s = 0; s < 9; s++) {
      const d = distAt(px, py, w, h)
      const toC = Math.atan2(cy - py, cx - px)
      let diff = toC - th
      while (diff > Math.PI) diff -= Math.PI * 2
      while (diff < -Math.PI) diff += Math.PI * 2
      th += diff * 0.35 + (rand() - 0.5) * 0.38
      px += Math.cos(th) * step
      py += Math.sin(th) * step
      pts.push(px, py)
      if (d <= stopAt) break
      const here = reachAt(thetaOf(px, py), layer, seed)
      if (s > 1 && d < here + spec.band && branchCount < branchCap && rand() < 0.35 && depth < 2) {
        branchCount++
        const side = rand() > 0.5 ? 1 : -1
        grow(px, py, th + side * (0.6 + rand() * 0.4), width * 0.65, depth + 1)
      }
    }
    twigs.push({ p: pts, w: width })
  }

  const nTrunks = Math.round(spec.masses * 0.5 * area)
  for (let i = 0; i < nTrunks; i++) {
    const t = (i / nTrunks) * Math.PI * 2 + (rand() - 0.5) * 0.4
    const sx = cx + Math.cos(t) * e.rx * 1.55
    const sy = cy + Math.sin(t) * e.ry * 1.55
    grow(sx, sy, Math.atan2(cy - sy, cx - sx), u * (0.007 + rand() * 0.004), 0)
  }

  const want = Math.round(spec.masses * area)
  const off = hash(seed + layer) * 100
  let placed = 0
  for (let tr = 0; tr < want * 3.5 && placed < want; tr++) {
    const a = rand() * Math.PI * 2
    const d = Math.sqrt(rand()) * 0.95 + 0.05
    const x = cx + Math.cos(a) * e.rx * (1 + d * 0.9)
    const y = cy + Math.sin(a) * e.ry * (1 + d * 0.9)
    const r = reachAt(thetaOf(x, y), layer, seed)
    const gap = fbm(x / (u * 0.12) + off, y / (u * 0.12) - off)
    const nearEdge = 1 - (d - r) / spec.band
    if (d < r) continue
    if (gap < 0.28 && nearEdge < 0.7) continue
    clusters.push({ x, y, r: (0.05 + rand() * 0.04) * u, n: Math.round(18 + rand() * 16), d })
    placed++
  }

  clusters.sort((p, q) => q.d - p.d)
  const leaves = [] as OvsLeaf[]
  for (const c of clusters) {
    const r = reachAt(thetaOf(c.x, c.y), layer, seed)
    const depthIn = clamp((c.d - r) / spec.band, 0, 1)
    const tx = cx - c.x
    const ty = cy - c.y
    const tl = Math.hypot(tx, ty) || 1
    const group = [] as OvsLeaf[]
    for (let k = 0; k < c.n; k++) {
      const ox = gauss() * c.r * 0.55
      const oy = gauss() * c.r * 0.55
      const ol = Math.hypot(ox, oy) || 1
      const toward = (ox * tx + oy * ty) / (ol * tl)
      const l = 0.5 + 0.28 * toward * Math.min(1, ol / c.r) + (rand() - 0.5) * 0.36 - depthIn * (0.3 + layer * 0.07) + 0.08
      group.push({ x: c.x + ox, y: c.y + oy, s: leafPx * (0.72 + rand() * 0.6), a: Math.atan2(oy, ox) + (rand() - 0.5) * 1.3, l: clamp(l, 0, 1) })
    }
    group.sort((p, q) => p.l - q.l)
    for (const g of group) leaves.push(g)
  }
  return { twigs, leaves }
}

export function leafColor(p: OvsPaletteType, l: number, haze: Rgb, hazeAmt: number, dim: number) {
  let c: Rgb
  if (l < 0.45) c = mix(p.shadow, p.mid, l / 0.45)
  else if (l < 0.86) c = mix(p.mid, p.lit, (l - 0.45) / 0.41)
  else c = mix(p.lit, p.glow, (l - 0.86) / 0.14)
  c = c.map((v) => v * dim) as Rgb
  return mix(c, haze, hazeAmt)
}

export function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]
}

export const rgb = (c: Rgb, a = 1) => "rgba(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + "," + a + ")"

export function skyAt(stops: (number | Rgb)[][], t: number): Rgb {
  for (let i = 1; i < stops.length; i++) {
    const a = stops[i - 1]
    const b = stops[i]
    if (t <= (b[0] as number)) return mix(a[1] as Rgb, b[1] as Rgb, (t - (a[0] as number)) / ((b[0] as number) - (a[0] as number)))
  }
  return stops[stops.length - 1][1] as Rgb
}

export function formatNumber(v: number, decimals = 0) {
  const s = v.toFixed(decimals)
  const [i, d] = s.split(".")
  return i.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (d ? "." + d : "")
}

export function planPrice(plan: OvsPlan, quarterly: boolean) {
  if (plan.price === null) return null
  return quarterly && plan.quarterly ? plan.quarterly : plan.price
}

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim())

export function manifestoParts(text: string) {
  return text.split(/\s+/).filter(Boolean).map((t) => {
    const m = t.match(/^\[(team|chart|leaf)\]$/)
    return m ? { pic: m[1], word: "" } : { pic: "", word: t }
  })
}

export function skyAmount(r: number, g: number, b: number) {
  const mx = Math.max(r, g, b)
  const mn = Math.min(r, g, b)
  const blue = clamp(((b - Math.max(r, g)) / 255) * 6, 0, 1)
  const cloud = clamp(((mx + mn) / 510 - 0.78) * 5, 0, 1) * clamp(1 - ((mx - mn) / 255) * 4, 0, 1)
  return Math.max(blue, cloud)
}

export function gradePixel(px: number[], y: number, season: string, dark: boolean) {
  const r = px[0] / 255
  const g = px[1] / 255
  const b = px[2] / 255
  const sky = skyAmount(px[0], px[1], px[2])
  const leaf = 1 - sky
  const mx = Math.max(r, g, b)
  const mn = Math.min(r, g, b)
  const d = mx - mn
  let h = d === 0 ? 0 : mx === r ? (((g - b) / d) % 6) / 6 : mx === g ? ((b - r) / d + 2) / 6 : ((r - g) / d + 4) / 6
  let sa = mx === 0 ? 0 : d / mx
  let v = mx
  if (season === "autumn") {
    h -= 0.085 * leaf
    sa = Math.min(1, sa * (1 + 0.3 * leaf))
    v = Math.min(1, v * (1 + 0.04 * leaf))
  } else if (season === "blossom") {
    h = lerp(h, 0.94, 0.9 * leaf)
    sa *= 1 - 0.38 * leaf
    v = Math.min(1, v * (1 + 0.2 * leaf) + 0.06 * leaf)
  }
  h = ((h % 1) + 1) % 1
  const i = Math.floor(h * 6)
  const f = h * 6 - i
  const p = v * (1 - sa)
  const q = v * (1 - f * sa)
  const t = v * (1 - (1 - f) * sa)
  const k = i % 6
  let R = k === 0 ? v : k === 1 ? q : k === 2 ? p : k === 3 ? p : k === 4 ? t : v
  let G = k === 0 ? t : k === 1 ? v : k === 2 ? v : k === 3 ? q : k === 4 ? p : p
  let B = k === 0 ? p : k === 1 ? p : k === 2 ? t : k === 3 ? v : k === 4 ? v : q
  if (dark) {
    const lum = 0.2126 * R + 0.7152 * G + 0.0722 * B
    const glow = 0.42 + 1.15 * lum
    const sr = lerp(0.03, 0.34, y) * glow
    const sg = lerp(0.06, 0.24, y) * glow
    const sb = lerp(0.16, 0.46, y) * glow
    R = lerp(R * 0.24 + 0.01, sr, sky)
    G = lerp(G * 0.3 + 0.02, sg, sky)
    B = lerp(B * 0.3 + 0.05, sb, sky)
  }
  px[0] = clamp(R * 255, 0, 255)
  px[1] = clamp(G * 255, 0, 255)
  px[2] = clamp(B * 255, 0, 255)
  return px
}

export function drawSky(cv: HTMLCanvasElement, w: number, h: number, scheme: "light" | "dark", seed: number) {
  const S = SKIES[scheme]
  const k = 0.32
  const W = Math.max(8, Math.round(w * k))
  const H = Math.max(8, Math.round(h * k))
  cv.width = W
  cv.height = H
  const ctx = cv.getContext("2d")
  if (!ctx) return
  const img = ctx.createImageData(W, H)
  const off = hash(seed) * 50
  const [sx, sy, sr, sg, sb, sa] = S.sun
  for (let y = 0; y < H; y++) {
    const base = skyAt(S.stops, y / (H - 1))
    for (let x = 0; x < W; x++) {
      let c = base
      const dx = x / W - sx
      const dy = (y / H - sy) * (h / w)
      const g = Math.exp(-(dx * dx + dy * dy) * 9) * sa
      c = mix(c, [sr, sg, sb], g)
      const n = fbm(x / (W * 0.16) + off, y / (H * 0.2) - off * 0.5)
      const wisp = fbm(x / (W * 0.05) - off, y / (H * 0.07) + off)
      const cloud = smoothstep(0.5, 0.82, n * 0.8 + wisp * 0.25) * S.cloud[3]
      c = mix(c, [S.cloud[0], S.cloud[1], S.cloud[2]], cloud)
      if (S.stars && hash(x * 13.1 + y * 71.7 + seed) > 0.9965) c = mix(c, [255, 250, 240], 0.75 * (1 - y / H))
      const i = (y * W + x) * 4
      img.data[i] = c[0]
      img.data[i + 1] = c[1]
      img.data[i + 2] = c[2]
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
}

export function drawLayer(cv: HTMLCanvasElement, w: number, h: number, layer: number, seed: number, pal: OvsPaletteType, scheme: "light" | "dark") {
  const spec = LAYERS[layer]
  const S = SKIES[scheme]
  const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 1.6) * spec.res
  const W = Math.max(4, Math.round(w * dpr))
  const H = Math.max(4, Math.round(h * dpr))
  const plan = canopyPlan(w, h, layer, seed)
  const target = spec.blur > 0 ? document.createElement("canvas") : cv
  target.width = W
  target.height = H
  const ctx = target.getContext("2d")
  if (!ctx) return
  ctx.clearRect(0, 0, W, H)
  const hazeAmt = spec.haze * (scheme === "dark" ? 0.7 : 1)

  // branches
  ctx.lineCap = "round"
  ctx.lineJoin = "round"
  ctx.strokeStyle = rgb(mix(pal.twig.map((v) => v * (scheme === "dark" ? 0.5 : 1)) as Rgb, S.haze, hazeAmt))
  for (const t of plan.twigs) {
    const n = t.p.length / 2
    for (let i = 1; i < n; i++) {
      ctx.lineWidth = Math.max(0.6, t.w * (1 - (i / n) * 0.8)) * dpr
      ctx.beginPath()
      ctx.moveTo(t.p[(i - 1) * 2] * dpr, t.p[(i - 1) * 2 + 1] * dpr)
      ctx.lineTo(t.p[i * 2] * dpr, t.p[i * 2 + 1] * dpr)
      ctx.stroke()
    }
  }

  // leaves
  const shape = pal.shape
  const vein = layer >= 2
  for (const f of plan.leaves) {
    const c = Math.cos(f.a) * dpr
    const s = Math.sin(f.a) * dpr
    ctx.setTransform(c, s, -s, c, f.x * dpr, f.y * dpr)
    const L = f.s * 0.5
    const Wd = f.s * shape
    ctx.fillStyle = rgb(leafColor(pal, f.l, S.haze, hazeAmt, S.leaf))
    ctx.beginPath()
    ctx.moveTo(-L, 0)
    ctx.quadraticCurveTo(0, -Wd, L, 0)
    ctx.quadraticCurveTo(0, Wd, -L, 0)
    ctx.fill()
    if (f.l > 0.72) {
      ctx.fillStyle = rgb(leafColor(pal, Math.min(1, f.l + 0.16), S.haze, hazeAmt, S.leaf), 0.7)
      ctx.beginPath()
      ctx.moveTo(-L * 0.55, 0)
      ctx.quadraticCurveTo(0, -Wd * 0.5, L * 0.7, 0)
      ctx.quadraticCurveTo(0, Wd * 0.5, -L * 0.55, 0)
      ctx.fill()
    }
    if (vein && f.s > 14) {
      ctx.strokeStyle = rgb(leafColor(pal, f.l * 0.55, S.haze, hazeAmt, S.leaf), 0.55)
      ctx.lineWidth = 0.7
      ctx.beginPath()
      ctx.moveTo(-L * 0.9, 0)
      ctx.lineTo(L * 0.8, 0)
      ctx.stroke()
    }
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  if (target !== cv) {
    cv.width = W
    cv.height = H
    const out = cv.getContext("2d")
    if (!out) return
    out.filter = "blur(" + spec.blur * dpr + "px)"
    out.drawImage(target, 0, 0)
    out.filter = "none"
  }
}
