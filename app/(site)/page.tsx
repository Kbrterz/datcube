import Link from "next/link";
import { LiveDemo } from "../_components/LiveDemo";
import { WeekDonut, HoursReclaimed } from "../_components/Charts";

export default function Home() {
  return (
    <>
      {/* hero */}
      <section style={{ padding: "clamp(36px,5vw,56px) 0 clamp(44px,6vw,68px)", position: "relative" }}>
        <div className="wrap">
          <div
            className="hero-grid"
            style={{
              display: "grid",
              gap: "clamp(32px,5vw,64px)",
              gridTemplateColumns: "minmax(0,1.02fr) minmax(0,0.98fr)",
              alignItems: "start",
            }}
          >
            <div>
              <p className="eyebrow">No-code analytics</p>
              <h1 className="display" style={{ fontSize: "clamp(2.9rem,6.6vw,5rem)", lineHeight: 1.02 }}>
                Get the hours back.
                <br />
                <span style={{ color: "var(--accent)" }}>Defer</span> the hire.
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
            <div
              style={{
                background: "var(--accent-wash)",
                border: "1px solid var(--line)",
                borderRadius: 18,
                padding: 16,
                borderTop: "4px solid var(--ochre)",
              }}
            >
              <LiveDemo />
            </div>
          </div>
        </div>
      </section>

      {/* by the numbers — saturated blue band */}
      <section className="band band--blue">
        <div className="wrap">
          <div style={{ display: "grid", gap: "clamp(28px,4vw,52px)", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.9fr)", alignItems: "center" }}>
            <div>
              <p className="eyebrow">What a typical customer gets back</p>
              <h2 className="section" style={{ color: "#fff", maxWidth: "20ch" }}>
                Measured in the two things you are short on
              </h2>
              <div className="figures" style={{ marginTop: 32 }}>
                <div className="figure">
                  <div className="big">5.5 hrs</div>
                  <div className="cap" style={{ color: "#dbe8f6" }}>per person, per week, back from manual reporting</div>
                </div>
                <div className="figure">
                  <div className="big">$24,800</div>
                  <div className="cap" style={{ color: "#dbe8f6" }}>measurable value a year for a 60-person team, versus a $2,388 plan</div>
                </div>
                <div className="figure">
                  <div className="big">6 wks</div>
                  <div className="cap" style={{ color: "#dbe8f6" }}>until the tool has paid for the year</div>
                </div>
                <div className="figure">
                  <div className="big">1 hire</div>
                  <div className="cap" style={{ color: "#dbe8f6" }}>the analyst you can put off, or skip</div>
                </div>
              </div>
            </div>
            <WeekDonut />
          </div>
          <p className="mono" style={{ fontSize: "0.74rem", color: "#bcd6f0", marginTop: 22 }}>
            Worked from stated assumptions on the Time &amp; money page, not a benchmark study.
          </p>
        </div>
      </section>

      {/* before / after + reclaimed hours chart */}
      <section className="band band--gold-top">
        <div className="wrap">
          <div style={{ display: "grid", gap: "clamp(28px,4vw,52px)", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)", alignItems: "center" }}>
            <div>
              <p className="eyebrow">The week, before and after</p>
              <h2 className="section" style={{ maxWidth: "16ch" }}>
                Same questions. A fraction of the time.
              </h2>
              <div className="ba">
                <p className="mono" style={{ fontSize: "0.72rem", color: "var(--ink-faint)" }}>WEEKLY REPORT PREP</p>
                <div className="ba-row">
                  <span className="lab">before</span>
                  <div className="ba-track">
                    <div className="ba-fill before" style={{ width: "100%" }}>~6 hrs, four tools, by hand</div>
                  </div>
                </div>
                <div className="ba-row">
                  <span className="lab">with DatCube</span>
                  <div className="ba-track">
                    <div className="ba-fill after" style={{ width: "9%" }}>~30 min</div>
                  </div>
                </div>
                <p className="mono" style={{ fontSize: "0.72rem", color: "var(--ink-faint)", marginTop: 16 }}>ANSWERING A NEW QUESTION</p>
                <div className="ba-row">
                  <span className="lab">before</span>
                  <div className="ba-track">
                    <div className="ba-fill before" style={{ width: "100%" }}>2 to 3 days, via the data team</div>
                  </div>
                </div>
                <div className="ba-row">
                  <span className="lab">with DatCube</span>
                  <div className="ba-track">
                    <div className="ba-fill after" style={{ width: "4%" }}>seconds</div>
                  </div>
                </div>
              </div>
            </div>
            <HoursReclaimed />
          </div>
        </div>
      </section>

      {/* photo break */}
      <section className="band band--paper2" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="wrap" style={{ padding: "clamp(28px,4vw,44px) 0" }}>
          <div className="photo" style={{ aspectRatio: "16 / 5" }}>
            <img
              src="https://picsum.photos/seed/datcube-desk/1600/500"
              alt="A team looking at data together"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* what it does */}
      <section className="band">
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
            <Link href="/product" className="btn btn--ghost">See every feature</Link>
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
              <Link href="/pricing" className="btn">See pricing</Link>
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
          <p className="lede" style={{ margin: "14px auto 0" }}>Sample data is already loaded. Ask it something.</p>
          <div style={{ marginTop: 26 }}>
            <Link href="/app" className="btn">Open the live tool</Link>
          </div>
        </div>
      </section>
    </>
  );
}
