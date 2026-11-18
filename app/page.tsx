import Field from "@/components/Field"
import LiveRead from "@/components/LiveRead"
import LayerStack from "@/components/LayerStack"
import Waitlist from "@/components/Waitlist"

const EVIDENCE = [
  ["Aggression", "Buyers lifted the offer on 64% of volume in the last hour."],
  ["Funding", "−0.0031% per hour. Shorts are paying longs to stay in."],
  ["Open interest", "Down 2.4% in four hours while price rose 1.9%. Shorts are closing, not new longs opening."],
  ["Liquidations", "$41M of short liquidations sit within 1.5% above price."],
]

export default function Home() {
  return (
    <main>
      <header className="nav">
        <div className="wrap nav-in">
          <a href="#top" className="brand" aria-label="Mako home">
            <img src="/mako-star.svg" alt="" width={22} height={22} />
            <span>Mako</span>
          </a>
          <nav aria-label="Sections" className="nav-links">
            <a href="#layers">How it reads</a>
            <a href="#example">Example read</a>
            <a href="#hyperliquid">Hyperliquid</a>
          </nav>
          <a href="#join" className="btn btn-ice">Join the waitlist</a>
        </div>
      </header>

      <section className="hero" id="top">
        <Field />
        <div className="wrap hero-in">
          <h1 className="display hero-title">
            <span>The interpretation</span>
            <span>layer for</span>
            <span>Hyperliquid.</span>
          </h1>
          <div className="hero-foot">
            <div className="hero-copy">
              <p className="lede">
                Order flow, positioning and crowd behaviour on Hyperliquid, read for you and put into plain English, so you know who’s in control before you click.
              </p>
              <Waitlist id="email-hero" />
            </div>
            <LiveRead />
          </div>
        </div>
      </section>

      <section className="light" id="layers">
        <div className="wrap sec">
          <div className="sec-head">
            <h2 className="display h2">Four layers between the tape and your trade.</h2>
            <p className="sec-copy">
              Every terminal shows the bottom layer. Mako works up through the stack and hands you the top one.
            </p>
          </div>
          <LayerStack />
        </div>
      </section>

      <section className="dark" id="example">
        <div className="wrap sec ex">
          <div className="sec-head">
            <h2 className="display h2">What a read looks like.</h2>
            <p className="sec-copy">The call comes first. The evidence sits underneath, so you can check it instead of trusting it.</p>
          </div>
          <article className="ex-card" aria-label="Example read for BTC">
            <header className="ex-top">
              <span className="ex-coin">BTC-PERP</span>
              <span className="ex-tag">Example. Numbers are illustrative.</span>
            </header>
            <p className="ex-call">Shorts are being squeezed.</p>
            <p className="ex-sub">Buyers are in control, and the short side is paying for every tick higher.</p>
            <dl className="ex-ev">
              {EVIDENCE.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <footer className="ex-flip">
              <span>What would change it</span>
              <p>A move back under the level where the squeeze started, with funding turning positive.</p>
            </footer>
          </article>
        </div>
      </section>

      <section className="dark hl" id="hyperliquid">
        <div className="wrap sec">
          <h2 className="display h2">Built on Hyperliquid, and only Hyperliquid.</h2>
          <div className="hl-grid">
            <div>
              <h3>On-chain, not estimated</h3>
              <p>Trades, positions and funding on Hyperliquid are public. The read starts from what actually happened, not from a model of it.</p>
            </div>
            <div>
              <h3>Every perp market</h3>
              <p>Not just the majors. If it trades on Hyperliquid, Mako reads it, including the coins where the crowd is thinnest.</p>
            </div>
            <div>
              <h3>No hit-rate claims</h3>
              <p>We won’t quote accuracy numbers before there’s a record to stand on. When there is, it goes up in full, losses included.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta" id="join">
        <div className="wrap sec cta-in">
          <h2 className="display cta-title">Get the read before launch.</h2>
          <div className="cta-side">
            <p>Waitlist members get in first. One email when it opens, nothing else.</p>
            <Waitlist id="email-cta" tone="light" />
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap foot-in">
          <span className="brand">
            <img src="/mako-star.svg" alt="" width={18} height={18} />
            <span>Mako</span>
          </span>
          <p>Market information, not financial advice. Trading perpetuals carries a high risk of loss.</p>
          <span>© {new Date().getFullYear()} Mako</span>
        </div>
      </footer>
    </main>
  )
}
