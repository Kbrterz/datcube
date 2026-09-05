import Link from "next/link";

export default function Home() {
  return (
    <>
      <nav className="nav">
        <div className="container nav-inner">
          <Link href="/" className="brand">
            Dat<span>Cube</span>
          </Link>
          <div className="nav-links">
            <a href="#how">How it works</a>
            <a href="#faq">FAQ</a>
            <Link href="/app">Open the app</Link>
          </div>
          <Link href="/app" className="btn">
            Try it now
          </Link>
        </div>
      </nav>

      <header style={{ padding: "80px 0 56px" }}>
        <div className="container">
          <p className="panel-title mono" style={{ color: "var(--accent)" }}>
            NO-CODE ANALYTICS · WORKING DEMO
          </p>
          <h1 style={{ fontSize: "clamp(2.4rem,6vw,4rem)", lineHeight: 1.02 }}>
            Ask your data.
            <br />
            <span style={{ color: "var(--accent)" }}>See the answer.</span>
          </h1>
          <p style={{ marginTop: 20, color: "var(--ink-soft)", fontSize: "1.1rem", maxWidth: "56ch" }}>
            Load a dataset, ask a question in plain English, get a chart and a straight answer. This is a
            real, working tool — not a screenshot. Everything runs in your browser; your data is never
            uploaded anywhere.
          </p>
          <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/app" className="btn">
              Open the live tool →
            </Link>
            <a href="#how" className="btn ghost">
              How it works
            </a>
          </div>
        </div>
      </header>

      <section id="how" className="section">
        <div className="container">
          <h2>How it works</h2>
          <p className="lead">Three steps, no setup, no account.</p>
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
            }}
          >
            <div className="card">
              <div className="panel-title">01 · Load</div>
              <p>Use the built-in sample dataset or upload your own CSV. It is parsed into a real
                in-browser SQL database instantly.</p>
            </div>
            <div className="card">
              <div className="panel-title">02 · Ask</div>
              <p>Type a question in plain language — a model turns it into a safe, read-only query. Or use
                the no-AI query builder, which works with zero configuration.</p>
            </div>
            <div className="card">
              <div className="panel-title">03 · Pin &amp; share</div>
              <p>Pin results to a dashboard, export a query as CSV, or share the board as a URL that
                reproduces it for anyone who opens it.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>What it actually does</h2>
          <p className="lead">
            No vague promises. This is the whole feature set, and it all runs client-side.
          </p>
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))",
            }}
          >
            <div className="card">
              <strong>Real SQL, in your browser</strong>
              <p style={{ color: "var(--ink-soft)", marginTop: 6 }}>
                Data loads into SQLite compiled to WebAssembly. Queries run locally — the only thing sent
                to a server is a 5-row sample, so a model can read the schema.
              </p>
            </div>
            <div className="card">
              <strong>Plain-language questions</strong>
              <p style={{ color: "var(--ink-soft)", marginTop: 6 }}>
                Ask &ldquo;revenue by channel&rdquo; or &ldquo;refund rate by month&rdquo;. Every
                generated query is checked to be read-only before it runs.
              </p>
            </div>
            <div className="card">
              <strong>Query builder fallback</strong>
              <p style={{ color: "var(--ink-soft)", marginTop: 6 }}>
                Pick an aggregate, a group-by column and an optional filter. No AI key required — this
                path always works.
              </p>
            </div>
            <div className="card">
              <strong>Charts &amp; export</strong>
              <p style={{ color: "var(--ink-soft)", marginTop: 6 }}>
                Bar and line charts are picked automatically from the result shape. Download any result
                as CSV.
              </p>
            </div>
            <div className="card">
              <strong>Shareable boards</strong>
              <p style={{ color: "var(--ink-soft)", marginTop: 6 }}>
                Pin queries to a dashboard; the share link encodes the board so it rebuilds on open (with
                the sample dataset).
              </p>
            </div>
            <div className="card">
              <strong>Nothing to sign up for</strong>
              <p style={{ color: "var(--ink-soft)", marginTop: 6 }}>
                No account, no billing, no tracking. Pinned boards live in your browser&rsquo;s local
                storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="section">
        <div className="container">
          <h2>FAQ</h2>
          <div style={{ marginTop: 8 }}>
            <details className="faq-item">
              <summary>Is my data uploaded anywhere?</summary>
              <p>
                No. The file stays in your browser. Only a small sample of rows is sent to the server so a
                model can see column names when you use the &ldquo;Ask&rdquo; tab. The query builder
                sends nothing at all.
              </p>
            </details>
            <details className="faq-item">
              <summary>Do I need an API key?</summary>
              <p>
                Only for natural-language questions. The query builder works with zero configuration. If
                no key is set, the app tells you and switches to the builder automatically.
              </p>
            </details>
            <details className="faq-item">
              <summary>What file formats work?</summary>
              <p>CSV with a header row. Column types (number, date, text) are inferred automatically.</p>
            </details>
            <details className="faq-item">
              <summary>Why is this a &ldquo;demo&rdquo;?</summary>
              <p>
                DatCube is a concept product built as a portfolio piece. It has no live data connectors,
                no multi-user accounts, and no persistence beyond your browser. The parts that exist are
                real and work.
              </p>
            </details>
          </div>
        </div>
      </section>

      <footer className="section" style={{ paddingBottom: 48 }}>
        <div className="container">
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "space-between" }}>
            <div>
              <Link href="/" className="brand">
                Dat<span>Cube</span>
              </Link>
              <p className="mono" style={{ fontSize: "0.76rem", color: "var(--ink-faint)", marginTop: 8, maxWidth: "40ch" }}>
                A concept product built as a working portfolio piece. No accounts, no billing, no data
                leaves your browser.
              </p>
            </div>
            <div className="mono" style={{ fontSize: "0.82rem", color: "var(--ink-soft)", display: "flex", flexDirection: "column", gap: 6 }}>
              <Link href="/app">Open the app</Link>
              <a href="#how">How it works</a>
              <a href="#faq">FAQ</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
