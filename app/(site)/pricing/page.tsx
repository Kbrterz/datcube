import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Four flat monthly plans. No usage surprises, no contact-us wall. Yearly billing gets two months free.",
};

const PLANS = [
  {
    name: "Starter",
    price: "$49",
    who: "One team getting its first board off the ground.",
    features: ["3 connectors", "2 seats", "Plain-language questions", "Email support"],
    cta: "Start",
    pop: false,
  },
  {
    name: "Growth",
    price: "$199",
    who: "A whole team that wants to stop waiting on reports.",
    features: ["10 connectors", "10 seats", "Scheduled sends to email and Slack", "Template library"],
    cta: "Start",
    pop: true,
  },
  {
    name: "Business",
    price: "$599",
    who: "Several teams sharing boards and reporting load.",
    features: ["Unlimited connectors", "Role-based access", "Priority support", "White-label boards"],
    cta: "Start",
    pop: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    who: "200+ people, with compliance and SLA needs.",
    features: ["SSO and SAML", "Audit log", "Data processing agreement, EU region", "Named SLA"],
    cta: "Talk to us",
    pop: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="band" style={{ paddingBottom: "clamp(24px,4vw,40px)" }}>
        <div className="wrap">
          <p className="eyebrow">Pricing</p>
          <h1 className="display" style={{ maxWidth: "16ch" }}>
            Flat, and readable in ten seconds
          </h1>
          <p className="lede" style={{ marginTop: 20 }}>
            One monthly number per plan. No metered usage, no &ldquo;contact us for a quote&rdquo; as the
            default. Yearly billing gets two months free.
          </p>
        </div>
      </section>

      <section className="band" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="prices">
            {PLANS.map((p) => (
              <div key={p.name} className={p.pop ? "price price--pop" : "price"}>
                {p.pop && <span className="badge">Most teams pick this</span>}
                <h3>{p.name}</h3>
                <div className="amt">
                  {p.price}
                  {p.price !== "Custom" && <small> /mo</small>}
                </div>
                <p className="who">{p.who}</p>
                <ul>
                  {p.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link href={p.name === "Enterprise" ? "/for" : "/app"} className={p.pop ? "btn" : "btn btn--ghost"}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band band--paper2">
        <div className="wrap">
          <p className="eyebrow">Worth saying plainly</p>
          <p className="statement" style={{ maxWidth: "28ch" }}>
            If pricing takes a spreadsheet to understand, the product already lost the person it is for.
          </p>
          <p className="lede" style={{ marginTop: 18 }}>
            Every plan includes unlimited boards and plain-language questions. You move up a plan when
            you hit a seat or connector limit, not when usage spikes.
          </p>
          <div style={{ marginTop: 24 }}>
            <Link href="/value" className="btn btn--ghost">
              See what a plan is worth
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
