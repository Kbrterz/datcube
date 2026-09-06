import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Time & money",
  description:
    "The worked math: hours returned to the team, the analyst hire you can defer, and how fast the plan pays for itself.",
};

export default function ValuePage() {
  return (
    <>
      <section className="band" style={{ paddingBottom: "clamp(32px,5vw,48px)" }}>
        <div className="wrap">
          <p className="eyebrow">Time &amp; money</p>
          <h1 className="display" style={{ maxWidth: "16ch" }}>
            The math, shown
          </h1>
          <p className="lede" style={{ marginTop: 20 }}>
            Every number here is worked from a stated assumption, not a benchmark study. Change the
            assumptions and the shape holds: the value is a large multiple of the price.
          </p>
        </div>
      </section>

      {/* before / after */}
      <section className="band band--paper2">
        <div className="wrap">
          <p className="eyebrow">Before and after</p>
          <h2 className="section">Where the hours go, and where they come back</h2>
          <div className="tbl" style={{ marginTop: 28 }}>
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Today</th>
                  <th>With DatCube</th>
                  <th>What you get back</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Weekly report prep</td>
                  <td>Four tools, stitched by hand, ~6 hrs/week</td>
                  <td>One board, scheduled to send, ~30 min</td>
                  <td>~5.5 hrs per person, per week</td>
                </tr>
                <tr>
                  <td>Answering a new question</td>
                  <td>A ticket to the data team, 2 to 3 days</td>
                  <td>Plain-language query, seconds</td>
                  <td>Decisions made the same day</td>
                </tr>
                <tr>
                  <td>Analytics capability</td>
                  <td>Hire a data analyst, ~$60k to $90k a year</td>
                  <td>The team queries its own data</td>
                  <td>A hire deferred, often skipped</td>
                </tr>
                <tr>
                  <td>Tool stack</td>
                  <td>Analytics plus a spreadsheet plus point tools</td>
                  <td>One place</td>
                  <td>Fewer subscriptions, simpler contract</td>
                </tr>
                <tr>
                  <td>Board people trust</td>
                  <td>Copy, paste, version confusion</td>
                  <td>One live source, one link</td>
                  <td>Fewer &ldquo;which number is right&rdquo; threads</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* annual value */}
      <section className="band">
        <div className="wrap">
          <p className="eyebrow">Worked example</p>
          <h2 className="section">A 60-person team on the $199 plan</h2>
          <p className="lede" style={{ marginTop: 14 }}>
            Plan cost for the year: <strong>$2,388</strong>. Here is what it offsets.
          </p>

          <div className="tbl" style={{ marginTop: 28 }}>
            <table>
              <thead>
                <tr>
                  <th>Value line</th>
                  <th className="num">Per year</th>
                  <th>Basis</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Team time returned</td>
                  <td className="num">$8,600</td>
                  <td>5.5 hrs/week &times; ~45 weeks &times; ~$35/hr loaded</td>
                </tr>
                <tr>
                  <td>Analyst hire deferred (partial)</td>
                  <td className="num">$15,000</td>
                  <td>A share of one full-time analyst&rsquo;s cost</td>
                </tr>
                <tr>
                  <td>Tool consolidation</td>
                  <td className="num">$1,200</td>
                  <td>Point-tool subscriptions retired</td>
                </tr>
                <tr className="total">
                  <td>Total measurable value</td>
                  <td className="num">$24,800</td>
                  <td>About 10&times; the price</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* CSS stacked bar */}
          <div style={{ marginTop: 32 }}>
            <p className="mono" style={{ fontSize: "0.72rem", color: "var(--ink-faint)", marginBottom: 8 }}>
              $24,800 VALUE vs $2,388 PRICE
            </p>
            <div
              style={{
                display: "flex",
                height: 44,
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid var(--line)",
              }}
            >
              <div style={{ flex: 8600, background: "var(--money)" }} title="Time returned $8,600" />
              <div style={{ flex: 15000, background: "var(--accent)" }} title="Hire deferred $15,000" />
              <div style={{ flex: 1200, background: "var(--ochre)" }} title="Tool consolidation $1,200" />
              <div style={{ flex: 5808, background: "var(--paper-2)" }} title="Remaining headroom" />
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 10, flexWrap: "wrap", fontSize: "0.82rem", color: "var(--ink-soft)" }}>
              <span><b style={{ color: "var(--money)" }}>■</b> Time returned</span>
              <span><b style={{ color: "var(--accent)" }}>■</b> Hire deferred</span>
              <span><b style={{ color: "var(--ochre)" }}>■</b> Tools</span>
              <span className="mono" style={{ marginLeft: "auto" }}>price = the leftmost sliver</span>
            </div>
          </div>
        </div>
      </section>

      {/* payback */}
      <section className="band band--ink">
        <div className="wrap" style={{ display: "grid", gap: 28, gridTemplateColumns: "minmax(0,1fr) minmax(0,1.1fr)", alignItems: "center" }}>
          <div>
            <p className="eyebrow">Payback</p>
            <div className="figure">
              <div className="big money">~6 weeks</div>
              <div className="cap">from first board to &ldquo;this has paid for the year&rdquo;</div>
            </div>
          </div>
          <div>
            <p className="lede">
              At a $199 plan and ~$35/hr loaded time, the hours returned cover the annual price in about
              a month and a half. Everything after that is margin: the deferred hire, the faster
              decisions, the calmer week.
            </p>
          </div>
        </div>
      </section>

      {/* per-plan multiple */}
      <section className="band">
        <div className="wrap">
          <p className="eyebrow">By plan</p>
          <h2 className="section">Value scales with how much the team leans on it</h2>
          <div className="figures">
            <div className="figure">
              <div className="big">~5&times;</div>
              <div className="cap">Starter: one team, one board, occasional questions</div>
            </div>
            <div className="figure">
              <div className="big accent">~10&times;</div>
              <div className="cap">Growth: the whole team self-serves, reports schedule themselves</div>
            </div>
            <div className="figure">
              <div className="big money">~12 to 15&times;</div>
              <div className="cap">Business: many teams, shared boards, real reporting load</div>
            </div>
          </div>
          <div style={{ marginTop: 30, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/pricing" className="btn">
              See the plans
            </Link>
            <Link href="/app" className="btn btn--ghost">
              Try it with your own CSV
            </Link>
          </div>
        </div>
      </section>

      <section className="band band--paper2">
        <div className="wrap">
          <p className="eyebrow">Assumptions</p>
          <p className="lede">
            Loaded hourly cost ~$35. About 45 working weeks. Analyst fully-loaded cost $60k to $90k, of
            which a partial share is offset. Tool savings are retired point-tool subscriptions. These
            are planning figures; in a real evaluation you would run them against your own numbers,
            which the tool lets you do directly.
          </p>
        </div>
      </section>
    </>
  );
}
