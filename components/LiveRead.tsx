"use client"
import { useEffect, useState } from "react"

// A deliberately simple live read built from Hyperliquid's public market data.
// It shows the idea (numbers in, plain English out), not Mako's full model.

const COINS = ["BTC", "ETH", "SOL", "HYPE"] as const
type Coin = (typeof COINS)[number]
type Row = { coin: Coin; mark: number; change: number; funding: number; oiUsd: number }

const BASE_FUNDING = 0.0000125 // HL baseline hourly funding (0.00125%)

function readFor(r: Row): { call: string; why: string } {
  const up = r.change > 0.005, down = r.change < -0.005
  const hot = r.funding > BASE_FUNDING * 1.6
  const neg = r.funding < 0
  if (neg && up) return { call: "Shorts are being squeezed", why: "Price is rising while shorts still pay to hold. Their exits add fuel." }
  if (neg && down) return { call: "Shorts are in control", why: "Price is falling and shorts are paying for the privilege. The crowd leans short." }
  if (hot && up) return { call: "Longs are crowded", why: "Longs pay well above baseline to stay in. Rallies built on this unwind fast." }
  if (hot && down) return { call: "Longs look trapped", why: "Funding is still elevated while price falls. Late longs haven’t given up yet." }
  if (up) return { call: "Buyers lead, without excess", why: "Price is up and funding sits near baseline. No side is overextended." }
  if (down) return { call: "Sellers lead, without panic", why: "Price is down and funding is calm. Selling looks orderly, not forced." }
  return { call: "Balanced", why: "Price is flat and funding is near baseline. Neither side is pressing." }
}

const pct = (x: number, d = 2) => `${x >= 0 ? "+" : ""}${(x * 100).toFixed(d)}%`
const usd = (x: number) => (x >= 1e9 ? `$${(x / 1e9).toFixed(2)}B` : `$${(x / 1e6).toFixed(0)}M`)

export default function LiveRead() {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [active, setActive] = useState<Coin>("BTC")
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const r = await fetch("https://api.hyperliquid.xyz/info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "metaAndAssetCtxs" }),
        })
        const [meta, ctxs] = (await r.json()) as [{ universe: { name: string }[] }, { markPx: string; prevDayPx: string; funding: string; openInterest: string }[]]
        const out: Row[] = []
        meta.universe.forEach((u, i) => {
          if ((COINS as readonly string[]).includes(u.name)) {
            const c = ctxs[i]
            const mark = +c.markPx
            out.push({ coin: u.name as Coin, mark, change: mark / +c.prevDayPx - 1, funding: +c.funding, oiUsd: +c.openInterest * mark })
          }
        })
        if (alive && out.length) {
          setRows(COINS.map((k) => out.find((o) => o.coin === k)).filter(Boolean) as Row[])
          setFailed(false)
        }
      } catch {
        if (alive) setFailed(true)
      }
    }
    load()
    const id = setInterval(load, 15000)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  useEffect(() => {
    if (pinned || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = setInterval(() => setActive((a) => COINS[(COINS.indexOf(a) + 1) % COINS.length]), 6000)
    return () => clearInterval(id)
  }, [pinned])

  const row = rows?.find((r) => r.coin === active)
  const read = row ? readFor(row) : null

  return (
    <section className="read" aria-label="Live read">
      <div className="read-head">
        <span className="read-live">
          <i aria-hidden="true" />
          {failed ? "Feed unavailable" : "Live from Hyperliquid"}
        </span>
        <div className="read-tabs" role="tablist" aria-label="Market">
          {COINS.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={c === active}
              className={c === active ? "on" : ""}
              onClick={() => {
                setActive(c)
                setPinned(true)
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <p className="read-call" aria-live="polite">{read ? read.call : failed ? "No data right now" : "Reading the market…"}</p>
      <p className="read-why">{read ? read.why : " "}</p>
      <dl className="read-nums">
        <div>
          <dt>24h</dt>
          <dd className="num">{row ? pct(row.change) : "–"}</dd>
        </div>
        <div>
          <dt>Funding / hr</dt>
          <dd className="num">{row ? pct(row.funding, 4) : "–"}</dd>
        </div>
        <div>
          <dt>Open interest</dt>
          <dd className="num">{row ? usd(row.oiUsd) : "–"}</dd>
        </div>
      </dl>
      <p className="read-note">Simplified rules for the demo. The product reads order flow too.</p>
    </section>
  )
}
