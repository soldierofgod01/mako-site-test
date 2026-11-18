import { NextResponse } from "next/server"

// Stores waitlist emails in Supabase (table: waitlist, column: email unique).
// Until SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in Vercel, the route
// refuses signups instead of pretending to save them.
export async function POST(req: Request) {
  let email = ""
  try {
    const body = await req.json()
    email = String(body?.email ?? "").trim().toLowerCase()
  } catch {
    return NextResponse.json({ error: "Send an email address." }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "That email address doesn’t look right." }, { status: 400 })
  }

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    return NextResponse.json({ error: "The waitlist isn’t open yet. Try again soon." }, { status: 503 })
  }

  const r = await fetch(`${url}/rest/v1/waitlist`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=ignore-duplicates,return=minimal",
    },
    body: JSON.stringify({ email, source: "landing" }),
  })
  if (!r.ok && r.status !== 409) {
    return NextResponse.json({ error: "Couldn’t save your email. Try again in a minute." }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}
