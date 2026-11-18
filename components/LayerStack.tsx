"use client"
import { useState } from "react"

const LAYERS = [
  {
    id: "read",
    name: "The read",
    body: "One call in plain English: who is in control, how strongly, and what would change it. This is what you act on.",
  },
  {
    id: "crowd",
    name: "Crowd",
    body: "Which way traders are leaning and how hard. Crowded trades unwind fast, so knowing the lean matters more than knowing the price.",
  },
  {
    id: "positioning",
    name: "Positioning",
    body: "Open interest, funding and where the liquidations sit. It shows where the leverage is, and where it breaks.",
  },
  {
    id: "flow",
    name: "Order flow",
    body: "Every trade on Hyperliquid by side and size. Who is hitting the bid, who is lifting the offer, and when size shows up.",
  },
] as const

export default function LayerStack() {
  const [active, setActive] = useState(0)
  return (
    <div className="layers">
      <div className="stack" aria-hidden="true">
        {LAYERS.map((l, i) => (
          <div
            key={l.id}
            className={`plate plate-${l.id}${i === active ? " on" : ""}`}
            style={{ ["--z" as string]: `${(LAYERS.length - 1 - i) * 52}px` }}
          />
        ))}
      </div>
      <ul className="layer-list">
        {LAYERS.map((l, i) => (
          <li key={l.id} className={i === active ? "on" : ""}>
            <button
              aria-expanded={i === active}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span>{l.name}</span>
              <span className="layer-sign" aria-hidden="true">{i === active ? "–" : "+"}</span>
            </button>
            <p hidden={i !== active}>{l.body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
