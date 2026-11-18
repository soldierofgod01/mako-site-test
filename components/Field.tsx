"use client"
import { useEffect, useRef } from "react"

// Halftone field behind the hero. Column heights follow the last 90 minutes of
// Hyperliquid BTC volume (1m candles), so the texture is real order flow.
// Falls back to a seeded shape if the API can't be reached.

const N = 90
const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}

export default function Field({ coin = "BTC" }: { coin?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const target = useRef<number[]>(Array.from({ length: N }, (_, i) => 0.35 + 0.45 * hash(i)))
  const cur = useRef<number[]>([...target.current])

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const end = Date.now()
        const r = await fetch("https://api.hyperliquid.xyz/info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "candleSnapshot", req: { coin, interval: "1m", startTime: end - (N + 2) * 60000, endTime: end } }),
        })
        if (!r.ok) return
        const rows = (await r.json()) as { v: string; c: string }[]
        const v = rows.slice(-N).map((k) => Math.sqrt(Math.max(0, +k.v * +k.c)))
        if (!alive || v.length < 20) return
        const s = [...v].sort((a, b) => a - b)
        const lo = s[Math.floor(s.length * 0.05)] ?? 0
        const hi = s[Math.floor(s.length * 0.95)] ?? 1
        const norm = v.map((x) => Math.min(1, Math.max(0, (x - lo) / Math.max(1e-9, hi - lo))))
        while (norm.length < N) norm.unshift(norm[0])
        target.current = norm
      } catch {
        /* keep seeded shape */
      }
    }
    load()
    const id = setInterval(load, 60000)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [coin])

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext("2d")
    if (!ctx) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let w = 0, h = 0, dpr = 1, raf = 0, last = 0
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      const r = cv.getBoundingClientRect()
      w = r.width
      h = r.height
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(cv)

    const draw = (ms: number) => {
      raf = requestAnimationFrame(draw)
      if (ms - last < 33) return // ~30fps is plenty for a texture
      last = ms
      const t = ms / 1000
      const c = cur.current, tg = target.current
      for (let i = 0; i < N; i++) c[i] += (tg[i] - c[i]) * 0.04
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const pitch = w < 700 ? 6 : 7
      const cols = Math.ceil(w / pitch), rows = Math.ceil(h / pitch)
      for (let ci = 0; ci < cols; ci++) {
        const u = ci / cols
        const f = u * (N - 1), i0 = Math.floor(f), fr = f - i0
        const v = c[i0] * (1 - fr) + c[Math.min(N - 1, i0 + 1)] * fr
        const env = 0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, Math.max(0, u * 1.05 - 0.02)))
        const sway = reduce ? 0 : 0.025 * Math.sin(t * 0.7 + ci * 0.11)
        const reach = (0.18 + 0.55 * v) * env + sway // share of height lit from the bottom
        const x = ci * pitch + pitch / 2
        for (let ri = rows - 1; ri >= 0; ri--) {
          const yy = 1 - ri / rows // 0 bottom .. 1 top
          const d = (reach - yy) / Math.max(0.05, reach)
          if (d < -0.35) break
          const k = d >= 0 ? 0.35 + 0.65 * Math.pow(d, 0.6) : 0.35 * (1 + d / 0.35)
          const rad = (pitch * 0.5) * Math.min(1, k)
          if (rad < 0.35) continue
          const hot = Math.max(0, d - 0.55) / 0.45
          ctx.fillStyle = hot > 0 ? `rgba(169, 212, 245, ${0.5 + 0.4 * hot})` : `rgba(199, 206, 214, ${0.22 + 0.3 * Math.max(0, d)})`
          ctx.beginPath()
          ctx.arc(x, ri * pitch + pitch / 2, rad, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      if (reduce) cancelAnimationFrame(raf)
    }
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={ref} className="field" aria-hidden="true" />
}
