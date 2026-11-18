"use client"
import { useState } from "react"

type State = { kind: "idle" | "sending" | "done" | "error"; msg?: string }

export default function Waitlist({ id, tone = "dark" }: { id: string; tone?: "dark" | "light" }) {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<State>({ kind: "idle" })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState({ kind: "sending" })
    try {
      const r = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) return setState({ kind: "error", msg: j.error || "Couldn’t join. Try again." })
      setState({ kind: "done" })
    } catch {
      setState({ kind: "error", msg: "No connection. Check your network and try again." })
    }
  }

  if (state.kind === "done")
    return (
      <p className={`wl-done wl-${tone}`} role="status">
        You’re on the list. We’ll email you when Mako opens.
      </p>
    )

  return (
    <form className={`wl wl-${tone}`} onSubmit={submit} noValidate>
      <label htmlFor={id} className="sr">Email address</label>
      <input
        id={id}
        type="email"
        required
        autoComplete="email"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={state.kind === "error"}
        aria-describedby={`${id}-msg`}
      />
      <button type="submit" disabled={state.kind === "sending"}>
        {state.kind === "sending" ? "Joining…" : "Join the waitlist"}
      </button>
      <p id={`${id}-msg`} className="wl-msg" role="alert">
        {state.kind === "error" ? state.msg : ""}
      </p>
    </form>
  )
}
