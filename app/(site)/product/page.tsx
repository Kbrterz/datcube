import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Product",
  description:
    "Everything DatCube does: in-browser SQL, plain-language questions, a no-AI query builder, charts, exports and shareable boards.",
};

export default function ProductPage() {
  return (
    <>
      <section className="band" style={{ paddingBottom: "clamp(32px,5vw,48px)" }}>
        <div className="wrap">
          <p className="eyebrow">Product</p>
          <h1 className="display" style={{ maxWidth: "15ch" }}>
            Small surface. Real depth.
          </h1>
          <p className="lede" style={{ marginTop: 20 }}>
            No connectors to configure, no modelling layer to learn, no seat you have to be technical to
            fill. This is the whole feature set, and it all runs in the browser.
          </p>
        </div>
      </section>

      <section className="band band--paper2">
        <div className="wrap">
          <div className="grid-feat">
            <div className="feat">
              <span className="n">SQL, LOCAL</span>
              <h3>Real queries, in your browser</h3>
              <p>
                Your data loads into SQLite compiled to WebAssembly. Queries run on your machine. The
                only thing sent anywhere is a five-row sample, so a model can read the column names.
              </p>
            </div>
            <div className="feat">
              <span className="n">PLAIN LANGUAGE</span>
              <h3>Ask the way you would ask a person</h3>
              <p>
                &ldquo;Revenue by channel.&rdquo; &ldquo;Refund rate by month.&rdquo; Every generated
                query is checked to be read-only before it runs.
              </p>
            </div>
            <div className="feat">
              <span className="n">NO KEY NEEDED</span>
              <h3>A query builder that always works</h3>
              <p>
                Pick an aggregate, a group-by column and a filter. No API key, no setup. The
                plain-language path is a convenience on top, not a requirement.
              </p>
            </div>
            <div className="feat">
              <span className="n">CHARTS</span>
              <h3>The right chart, chosen for you</h3>
              <p>
                Bar for categories, line for anything dated, a single figure when the answer is one
                number. Every result is one CSV download away.
              </p>
            </div>
            <div className="feat">
              <span className="n">BOARDS</span>
              <h3>Pin answers, send a link</h3>
              <p>
                Pin a result to a dashboard. The share link carries the board, so it rebuilds itself
                for whoever opens it.
              </p>
            </div>
            <div className="feat">
              <span className="n">NOTHING TO SIGN</span>
              <h3>No account, no billing, no tracking</h3>
              <p>
                Boards live in your browser&rsquo;s local storage. Close the tab and nothing was
                uploaded.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <p className="eyebrow">Start points</p>
          <h2 className="section">Templates for the shape of business you run</h2>
          <p className="lede" style={{ marginTop: 14 }}>
            Load a template instead of a blank board, then swap in your own data.
          </p>
          <div className="grid-feat" style={{ marginTop: 32 }}>
            <div className="feat">
              <h3>SaaS</h3>
              <p>MRR and growth, churn and net revenue retention, CAC and LTV by channel, an activation funnel.</p>
            </div>
            <div className="feat">
              <h3>E-commerce</h3>
              <p>Revenue, basket and refund rate, ad ROAS and cohorts, lifetime value, profit by product.</p>
            </div>
            <div className="feat">
              <h3>Agency</h3>
              <p>A board per client, weekly sends, a white-label view, campaign performance in one place.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="band band--ink" style={{ textAlign: "center" }}>
        <div className="wrap">
          <h2 className="section" style={{ margin: "0 auto", maxWidth: "20ch" }}>
            The fastest way to understand it is to use it
          </h2>
          <div style={{ marginTop: 24 }}>
            <Link href="/app" className="btn">
              Open the live tool
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
