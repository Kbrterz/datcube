import Link from "next/link";
import { LiveDemo } from "../_components/LiveDemo";

export default function Home() {
  return (
    <>
      {/* hero */}
      <section style={{ padding: "clamp(36px,5vw,56px) 0 clamp(44px,6vw,68px)" }}>
        <div className="wrap">
          <div
            style={{
              display: "grid",
              gap: "clamp(32px,5vw,64px)",
              gridTemplateColumns: "minmax(0,1.05fr) minmax(0,0.95fr)",
              alignItems: "start",
            }}
            className="hero-grid"
          >
            <div>
              <p className="eyebrow">No-code analytics</p>
              <h1 className="display">
                Get the hours back.
                <br />
                Defer the hire.
              </h1>
              <p className="lede" style={{ marginTop: 22 }}>
                Your team loses about six hours a week stitching reports together by hand, and the fix
                everyone reaches for is hiring an analyst. DatCube is the cheaper answer: connect a
                dataset, ask in plain language, share a live board.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
                <Link href="/app" className="btn">
                  Open the live tool
                </Link>
                <Link href="/value" className="btn btn--ghost">
                  See the math
                </Link>
              </div>
              <p className="mono" style={{ fontSize: "0.78rem", color: "var(--ink-faint)", marginTop: 18 }}>
                15 minute setup · no account · nothing leaves your browser
              </p>
            </div>
            <LiveDemo />
          </div>
        </div>
      </section>

      {/* by the numbers */}
      <section className="band band--paper2">
        <div className="wrap">
          <p className="eyebrow">What a typical customer gets back</p>
          <h2 className="section">Measured in the two things you are short on</h2>
          <div className="figures">
            <div className="figure">
              <div className="big accent">5.5 hrs</div>
              <div className="cap">per person, per week, back from manual reporting</div>
            </div>
            <div className="figure">
              <div className="big money">$24,800</div>
              <div className="cap">measurable value a year for a 60-person team, versus a $2,388 plan</div>
            </div>
            <div className="figure">
              <div className="big">6 weeks</div>
              <div className="cap">until the tool has paid for the year, at typical loaded rates</div>
            </div>
            <div className="figure">
              <div className="big">1 hire</div>
              <div className="cap">the data analyst you can put off, or skip, while the team stays self-serve</div>
            </div>
          </div>
          <p className="hint" style={{ marginTop: 22 }}>
            Figures are worked from stated assumptions on the{" "}
            <Link href="/value" style={{ color: "var(--accent-deep)", textDecoration: "underline" }}>
              Time &amp; money
            </Link>{" "}
            page, not a benchmark study.
          </p>
        </div>
      </section>

      {/* before / after */}
      <section className="band">
        <div className="wrap" style={{ display: "grid", gap: "clamp(28px,5vw,56px)", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.2fr)", alignItems: "center" }} >
          <div>
            <p className="eyebrow">The week, before and after</p>
            <h2 className="section" style={{ maxWidth: "16ch" }}>
              Same questions. A fraction of the time.
            </h2>
            <p className="lede" style={{ marginTop: 16 }}>
              The point is not more dashboards. It is getting the answer before the meeting, without a
              ticket and a two-day wait.
            </p>
          </div>
          <div className="ba">
            <p className="mono" style={{ fontSize: "0.72rem", color: "var(--ink-faint)" }}>
              WEEKLY REPORT PREP
            </p>
            <div className="ba-row">
              <span className="lab">before</span>
              <div className="ba-track">
                <div className="ba-fill before" style={{ width: "100%" }}>
                  ~6 hrs, four tools, by hand
                </div>
              </div>
            </div>
            <div className="ba-row">
              <span className="lab">with DatCube</span>
              <div className="ba-track">
                <div className="ba-fill after" style={{ width: "9%" }} />
              </div>
            </div>
            <p className="hint">About 30 minutes: one board, scheduled to send itself.</p>

            <p className="mono" style={{ fontSize: "0.72rem", color: "var(--ink-faint)", marginTop: 18 }}>
              ANSWERING A NEW QUESTION
            </p>
            <div className="ba-row">
              <span className="lab">before</span>
              <div className="ba-track">
                <div className="ba-fill before" style={{ width: "100%" }}>
                  2 to 3 days, via the data team
                </div>
              </div>
            </div>
            <div className="ba-row">
              <span className="lab">with DatCube</span>
              <div className="ba-track">
                <div className="ba-fill after" style={{ width: "4%" }} />
              </div>
            </div>
            <p className="hint">Seconds: ask in plain language, read the chart.</p>
          </div>
        </div>
      </section>

      {/* what it does */}
      <section className="band band--paper2">
        <div className="wrap">
          <p className="eyebrow">What it does</p>
          <h2 className="section">Three moves, no setup project</h2>
          <div className="grid-feat" style={{ marginTop: 36 }}>
            <div className="feat">
              <span className="n">01</span>
              <h3>Connect</h3>
              <p>Load the sample data or upload a CSV. It becomes a real, queryable database in your browser.</p>
            </div>
            <div className="feat">
              <span className="n">02</span>
              <h3>Ask</h3>
              <p>Type a question in plain language, or point and click in the query builder. No SQL.</p>
            </div>
            <div className="feat">
              <span className="n">03</span>
              <h3>Share</h3>
              <p>Pin the answer to a board, export it, or send a link that rebuilds the board for anyone.</p>
            </div>
          </div>
          <div style={{ marginTop: 26 }}>
            <Link href="/product" className="btn btn--ghost">
              See every feature
            </Link>
          </div>
        </div>
      </section>

      {/* statement */}
      <section className="band band--ink">
        <div className="wrap" style={{ display: "grid", gap: 28, gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)", alignItems: "center" }}>
          <p className="statement">
            You are already paying an analyst&rsquo;s salary. It is just hidden in lost hours across the
            team.
          </p>
          <div>
            <p className="lede">
              DatCube costs a fraction of that. The team keeps its own hands on the data, and the
              &ldquo;why&rdquo; questions get answered the same day.
            </p>
            <div style={{ marginTop: 22 }}>
              <Link href="/pricing" className="btn">
                See pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* final cta */}
      <section className="band" style={{ textAlign: "center" }}>
        <div className="wrap">
          <h2 className="section" style={{ margin: "0 auto", maxWidth: "20ch" }}>
            Open the tool and run a real query in a minute
          </h2>
          <p className="lede" style={{ margin: "14px auto 0" }}>
            Sample data is already loaded. Ask it something.
          </p>
          <div style={{ marginTop: 26 }}>
            <Link href="/app" className="btn">
              Open the live tool
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
