import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Who it's for",
  description: "People who work with data every day but were never meant to be the analyst.",
};

const PEOPLE = [
  {
    initial: "D",
    color: "var(--accent)",
    name: "The growth lead",
    role: "60-person SaaS company",
    body: "Cannot write SQL. Loses about six hours a week joining reports across four tools. Wants one board the rest of the team trusts before the Monday meeting.",
  },
  {
    initial: "E",
    color: "var(--money)",
    name: "The founder",
    role: "Direct-to-consumer brand",
    body: "Cannot see the ad platform, the store and the shipping data in one place. Wants real profit per product, tracked daily, without hiring for it.",
  },
  {
    initial: "M",
    color: "var(--ochre)",
    name: "The account manager",
    role: "Digital agency",
    body: "Builds a weekly report by hand for twelve clients. Wants branded boards that send themselves, so the work goes back to the client work.",
  },
];

export default function ForPage() {
  return (
    <>
      <section className="band" style={{ paddingBottom: "clamp(24px,4vw,40px)" }}>
        <div className="wrap">
          <p className="eyebrow">Who it&rsquo;s for</p>
          <h1 className="display" style={{ maxWidth: "18ch" }}>
            People who work with data, but were never the analyst
          </h1>
          <p className="lede" style={{ marginTop: 20 }}>
            Not data teams. The person who has to defend a number in a meeting and has no one to ask.
            The examples below are illustrative.
          </p>
        </div>
      </section>

      <section className="band" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="people">
            {PEOPLE.map((p) => (
              <div key={p.name} className="person">
                <div className="av" style={{ background: p.color }}>
                  {p.initial}
                </div>
                <h3>{p.name}</h3>
                <div className="role">{p.role}</div>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band band--ink">
        <div className="wrap" style={{ display: "grid", gap: 28, gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", alignItems: "center" }}>
          <p className="statement">
            The common thread: the data exists. The person who needs the answer just cannot get to it.
          </p>
          <div>
            <p className="lede">
              DatCube closes that gap in fifteen minutes, without adding a hire or a quarter-long
              rollout.
            </p>
            <div style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/app" className="btn">
                Open the tool
              </Link>
              <Link href="/value" className="btn btn--ghost">
                See the math
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
