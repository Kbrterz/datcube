import type { Metadata } from "next";
import Link from "next/link";
import { RoiHorizons, MonteCarloROI, PaybackCurve, ValueByPlan } from "../../_components/Charts";

export const metadata: Metadata = {
  title: "Time & money",
  description:
    "The worked math: hours returned, the analyst hire you can defer, ROI across 3 months to 10 years, and a Monte Carlo on the outcome.",
};

export default function ValuePage() {
  return (
    <>
      <section className="band" style={{ paddingBottom: "clamp(24px,4vw,40px)" }}>
        <div className="wrap">
          <p className="eyebrow">Time &amp; money</p>
          <h1 className="display" style={{ maxWidth: "16ch" }}>
            The math, shown four ways
          </h1>
          <p className="lede" style={{ marginTop: 20 }}>
            Every number is worked from a stated assumption, not a benchmark study. Change the
            assumptions and the shape holds: the value is a large multiple of the price.
          </p>
        </div>
      </section>

      {/* ROI by horizon + Monte Carlo */}
      <section className="band band--paper2 band--gold-top">
        <div className="wrap">
          <p className="eyebrow">Return over time</p>
          <h2 className="section">From the first quarter to the tenth year</h2>
          <p className="lede" style={{ marginTop: 14 }}>
            Value compounds as more of the team leans on it. Price is a flat annual number. The gap
            widens every year.
          </p>
          <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(2, minmax(0, 1fr))", marginTop: 30 }}>
            <RoiHorizons />
            <PaybackCurve />
          </div>
          <div style={{ marginTop: 18 }}>
            <MonteCarloROI />
          </div>
          <p className="mono" style={{ fontSize: "0.74rem", color: "var(--ink-faint)", marginTop: 12 }}>
            Monte Carlo: 4,000 runs, each drawing hours saved, loaded rate, team adoption and hire
            offset from plausible ranges. Even the pessimistic tenth percentile clears the price
            several times over.
          </p>
        </div>
      </section>

      {/* before / after */}
      <section className="band">
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

      {/* annual value worked example */}
      <section className="band band--paper2">
        <div className="wrap">
          <p className="eyebrow">Worked example</p>
          <h2 className="section">A 60-person team on the $199 plan</h2>
          <p className="lede" style={{ marginTop: 14 }}>
            Plan cost for the year: <strong>$2,388</strong>. Here is what it offsets.
          </p>
          <div style={{ display: "grid", gap: 18, gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)", alignItems: "start", marginTop: 28 }}>
            <div className="tbl">
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
                    <td>5.5 hrs/week &times; ~45 weeks &times; ~$35/hr</td>
                  </tr>
                  <tr>
                    <td>Analyst hire deferred (partial)</td>
                    <td className="num">$15,000</td>
                    <td>A share of one analyst&rsquo;s cost</td>
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
            <ValueByPlan />
          </div>

          <div style={{ marginTop: 30 }}>
            <p className="mono" style={{ fontSize: "0.72rem", color: "var(--ink-faint)", marginBottom: 8 }}>
              $24,800 VALUE vs $2,388 PRICE
            </p>
            <div style={{ display: "flex", height: 44, borderRadius: 8, overflow: "hidden", border: "1px solid var(--line)" }}>
              <div style={{ flex: 8600, background: "var(--money)" }} title="Time returned $8,600" />
              <div style={{ flex: 15000, background: "var(--accent)" }} title="Hire deferred $15,000" />
              <div style={{ flex: 1200, background: "var(--ochre)" }} title="Tool consolidation $1,200" />
              <div style={{ flex: 5808, background: "var(--paper-2)" }} title="Remaining headroom" />
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 10, flexWrap: "wrap", fontSize: "0.82rem", color: "var(--ink-soft)" }}>
              <span><b style={{ color: "var(--money)" }}>&#9632;</b> Time returned</span>
              <span><b style={{ color: "var(--accent)" }}>&#9632;</b> Hire deferred</span>
              <span><b style={{ color: "var(--ochre)" }}>&#9632;</b> Tools</span>
              <span className="mono" style={{ marginLeft: "auto" }}>price = the leftmost sliver</span>
            </div>
          </div>
        </div>
      </section>

      {/* payback statement */}
      <section className="band band--green">
        <div className="wrap" style={{ display: "grid", gap: 28, gridTemplateColumns: "minmax(0,1fr) minmax(0,1.1fr)", alignItems: "center" }}>
          <div>
            <p className="eyebrow">Payback</p>
            <div className="figure">
              <div className="big" style={{ color: "#fff" }}>~6 weeks</div>
              <div className="cap" style={{ color: "#daf0e5" }}>from first board to &ldquo;this has paid for the year&rdquo;</div>
            </div>
          </div>
          <p className="lede">
            At a $199 plan and ~$35/hr loaded time, the hours returned cover the annual price in about
            a month and a half. Everything after that is margin.
          </p>
        </div>
      </section>

      <section className="band band--paper2">
        <div className="wrap">
          <p className="eyebrow">Assumptions</p>
          <p className="lede">
            Loaded hourly cost ~$35. About 45 working weeks. Analyst fully-loaded cost $60k to $90k, of
            which a partial share is offset. Tool savings are retired point-tool subscriptions. These
            are planning figures; in a real evaluation you run them against your own numbers, which the
            tool lets you do directly.
          </p>
          <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/pricing" className="btn">See the plans</Link>
            <Link href="/app" className="btn btn--ghost">Try it with your own CSV</Link>
          </div>
        </div>
      </section>
    </>
  );
}
