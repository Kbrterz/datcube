"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Papa from "papaparse";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { generateSampleOrders, SAMPLE_QUESTIONS } from "../../lib/sample-data";
import { buildDatabase, inferColumns, runQuery, type ColumnInfo } from "../../lib/db";

type ResultShape = {
  question: string;
  sql: string;
  columns: string[];
  rows: any[][];
  summary: string;
};

type PinnedItem = { id: string; question: string; sql: string };

const DATE_RE = /^\d{4}-\d{2}(-\d{2})?/;

function formatVal(v: any) {
  if (typeof v === "number") return Number.isInteger(v) ? v.toString() : v.toFixed(2);
  return String(v);
}

function summarize(cols: string[], rows: any[][]): string {
  if (rows.length === 0) return "No rows matched this query.";
  if (rows.length === 1) {
    return rows[0].map((v, i) => `${cols[i]}: ${formatVal(v)}`).join(" · ");
  }
  const first = rows[0];
  return `${rows.length} rows returned. Top row — ${first
    .map((v, i) => `${cols[i]}: ${formatVal(v)}`)
    .join(", ")}.`;
}

function friendlyError(msg: string): string {
  if (/no such column/i.test(msg))
    return "That query refers to a column that isn't in this dataset. Try the query builder, or rephrase the question.";
  if (/no such table/i.test(msg))
    return "No data is loaded yet. Load the sample data or upload a CSV first.";
  if (/syntax error|near /i.test(msg))
    return "The generated query wasn't valid SQL. Try rephrasing, or use the query builder.";
  return `Query failed: ${msg}`;
}

function downloadCsv(filename: string, cols: string[], rows: any[][]) {
  const esc = (v: any) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [cols.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function pickChart(cols: string[], rows: any[][]) {
  if (rows.length === 0) return null;
  const objRows = rows.map((r) => {
    const o: Record<string, any> = {};
    cols.forEach((c, i) => (o[c] = r[i]));
    return o;
  });
  const numericCols = cols.filter((c) => objRows.every((r) => typeof r[c] === "number"));
  const catCols = cols.filter((c) => !numericCols.includes(c));
  if (numericCols.length === 0) return null;
  if (rows.length === 1) {
    return {
      kind: "stat" as const,
      label: catCols[0] ? String(objRows[0][catCols[0]]) : numericCols[0],
      value: objRows[0][numericCols[0]],
    };
  }
  if (catCols.length >= 1) {
    const catKey = catCols[0];
    const isDate = objRows.every((r) => DATE_RE.test(String(r[catKey])));
    const data = objRows.map((r) => ({ label: String(r[catKey]), value: r[numericCols[0]] }));
    return { kind: isDate ? ("line" as const) : ("bar" as const), data };
  }
  return null;
}

function ChartBlock({ cols, rows }: { cols: string[]; rows: any[][] }) {
  const chart = pickChart(cols, rows);
  if (!chart) return null;
  if (chart.kind === "stat") {
    return (
      <div style={{ marginTop: 12 }}>
        <div className="panel-title">{chart.label}</div>
        <div style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontSize: "2rem", fontWeight: 700 }}>
          {formatVal(chart.value)}
        </div>
      </div>
    );
  }
  return (
    <div style={{ marginTop: 12, height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        {chart.kind === "line" ? (
          <LineChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#263837" />
            <XAxis dataKey="label" stroke="#6a807e" fontSize={11} />
            <YAxis stroke="#6a807e" fontSize={11} />
            <Tooltip
              contentStyle={{ background: "#1a2b29", border: "1px solid #263837", color: "#eef4f3" }}
            />
            <Line type="monotone" dataKey="value" stroke="#2ed3c6" strokeWidth={2} dot={false} />
          </LineChart>
        ) : (
          <BarChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#263837" />
            <XAxis dataKey="label" stroke="#6a807e" fontSize={11} />
            <YAxis stroke="#6a807e" fontSize={11} />
            <Tooltip
              contentStyle={{ background: "#1a2b29", border: "1px solid #263837", color: "#eef4f3" }}
            />
            <Bar dataKey="value" fill="#2ed3c6" radius={[3, 3, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export default function AppPage() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [db, setDb] = useState<any>(null);
  const [datasetLabel, setDatasetLabel] = useState("Sample orders (2026 H1)");
  const [usingSample, setUsingSample] = useState(true);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<ResultShape | null>(null);
  const [tab, setTab] = useState<"ask" | "builder">("ask");

  const [bMetric, setBMetric] = useState("");
  const [bAgg, setBAgg] = useState("SUM");
  const [bGroup, setBGroup] = useState("");
  const [bFilterCol, setBFilterCol] = useState("");
  const [bFilterOp, setBFilterOp] = useState("=");
  const [bFilterVal, setBFilterVal] = useState("");

  const [pinned, setPinned] = useState<PinnedItem[]>([]);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [digestOn, setDigestOn] = useState(false);

  const engineReady = !!db;

  useEffect(() => {
    setRows(generateSampleOrders() as any);
  }, []);

  useEffect(() => {
    if (rows.length === 0) {
      setColumns([]);
      setDb(null);
      return;
    }
    const cols = inferColumns(rows);
    setColumns(cols);
    const numeric = cols.find((c) => c.type !== "TEXT");
    const text = cols.find((c) => c.type === "TEXT");
    setBMetric((v) => (cols.some((c) => c.name === v) ? v : numeric?.name || cols[0].name));
    setBGroup((v) => (cols.some((c) => c.name === v) ? v : text?.name || cols[0].name));
    setBFilterCol((v) => (cols.some((c) => c.name === v) ? v : ""));
    let cancelled = false;
    setDb(null);
    buildDatabase(rows, cols).then((d) => {
      if (!cancelled) setDb(d);
    });
    return () => {
      cancelled = true;
    };
  }, [rows]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const stateParam = params.get("state");
      if (stateParam) {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(stateParam))));
        if (Array.isArray(decoded.pinned)) {
          setPinned(decoded.pinned);
          return;
        }
      }
    } catch {
      /* malformed share state */
    }
    try {
      const saved = localStorage.getItem("datcube_pinned_v1");
      if (saved) setPinned(JSON.parse(saved));
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("datcube_pinned_v1", JSON.stringify(pinned));
    } catch {
      /* ignore */
    }
  }, [pinned]);

  useEffect(() => {
    try {
      setDigestOn(localStorage.getItem("datcube_digest_v1") === "1");
    } catch {
      /* ignore */
    }
  }, []);

  function toggleDigest() {
    setDigestOn((v) => {
      const nv = !v;
      try {
        localStorage.setItem("datcube_digest_v1", nv ? "1" : "0");
      } catch {
        /* ignore */
      }
      return nv;
    });
  }

  function loadSample() {
    setRows(generateSampleOrders() as any);
    setDatasetLabel("Sample orders (2026 H1)");
    setUsingSample(true);
    setResult(null);
    setErrorMsg(null);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (res) => {
        const parsed = (res.data as Record<string, unknown>[]).filter(
          (r) => r && Object.keys(r).length > 0
        );
        if (parsed.length === 0) {
          setErrorMsg("That CSV had no readable rows.");
          return;
        }
        if (parsed.length > 20000) {
          setErrorMsg(
            `That CSV has ${parsed.length.toLocaleString()} rows. Using the first 20,000 to keep the browser responsive.`
          );
          setRows(parsed.slice(0, 20000));
        } else {
          setRows(parsed);
          setErrorMsg(null);
        }
        setDatasetLabel(file.name);
        setUsingSample(false);
        setResult(null);
      },
      error: (err) => setErrorMsg(`Could not parse CSV: ${err.message}`),
    });
    e.target.value = "";
  }

  function runSql(sql: string, label: string) {
    if (!db) {
      setErrorMsg("The query engine is still loading — try again in a second.");
      return;
    }
    try {
      const { columns: cols, rows: outRows } = runQuery(db, sql);
      setResult({ question: label, sql, columns: cols, rows: outRows, summary: summarize(cols, outRows) });
      setErrorMsg(null);
    } catch (e: any) {
      setErrorMsg(friendlyError(e?.message || String(e)));
    }
  }

  async function handleAsk() {
    if (!db || !question.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    setResult(null);
    try {
      const resp = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          columns: columns.map((c) => ({ name: c.name, type: c.type })),
          sample: rows.slice(0, 5),
        }),
      });
      const data = await resp.json();
      if (data.fallback) {
        setTab("builder");
        setErrorMsg("No AI key is configured on this deployment — use the query builder below instead.");
      } else if (data.error) {
        setErrorMsg(data.error);
      } else if (data.sql) {
        runSql(data.sql, question);
      }
    } catch (e: any) {
      setErrorMsg(`Request failed: ${e?.message || e}`);
    }
    setLoading(false);
  }

  function runBuilder() {
    if (!bMetric || !bGroup) {
      setErrorMsg("Pick a metric and a group-by column.");
      return;
    }
    let sql = `SELECT "${bGroup}", ${bAgg}("${bMetric}") AS value FROM data`;
    let label = `${bAgg} of ${bMetric} by ${bGroup}`;
    if (bFilterCol && bFilterVal !== "") {
      const colType = columns.find((c) => c.name === bFilterCol)?.type;
      const raw = bFilterVal.trim();
      const val =
        colType === "TEXT" || Number.isNaN(Number(raw)) ? `'${raw.replace(/'/g, "''")}'` : raw;
      sql += ` WHERE "${bFilterCol}" ${bFilterOp} ${val}`;
      label += ` where ${bFilterCol} ${bFilterOp} ${raw}`;
    }
    // time series reads better in date order; everything else ranked by value
    const isDateGroup =
      rows.length > 0 && rows.every((r) => DATE_RE.test(String(r[bGroup] ?? "")));
    sql += ` GROUP BY "${bGroup}" ORDER BY ${isDateGroup ? `"${bGroup}" ASC` : "value DESC"}`;
    runSql(sql, label);
  }

  function pin() {
    if (!result) return;
    setPinned((p) => [...p, { id: String(Date.now()), question: result.question, sql: result.sql }]);
  }

  function removePinned(id: string) {
    setPinned((p) => p.filter((x) => x.id !== id));
  }

  function handleShare() {
    const payload = { usingSample, pinned };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    setShareUrl(`${window.location.origin}${window.location.pathname}?state=${encoded}`);
  }

  const nextSend = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  return (
    <>
      <nav className="nav">
        <div className="container nav-inner">
          <Link href="/" className="brand">
            Dat<span>Cube</span>
          </Link>
          <div className="nav-links">
            <span className="pill">{datasetLabel}</span>
          </div>
        </div>
      </nav>

      <div className="container app-grid" style={{ padding: "32px 24px 80px" }}>
        {/* left column: data + ask/builder */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="panel-title">Data</div>
            <button className="btn ghost" onClick={loadSample} style={{ width: "100%", marginBottom: 8 }}>
              Load sample data
            </button>
            <label className="btn ghost" style={{ width: "100%", justifyContent: "center", cursor: "pointer" }}>
              Upload a CSV
              <input type="file" accept=".csv" onChange={handleFile} style={{ display: "none" }} />
            </label>
            <p className="hint">
              {rows.length.toLocaleString()} rows · {columns.length} columns. Nothing leaves your browser.
            </p>
            {!engineReady && (
              <div className="loading-note" style={{ marginTop: 8 }}>
                <span className="spinner" /> Loading query engine…
              </div>
            )}
          </div>

          <div className="card">
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button className={tab === "ask" ? "btn" : "btn ghost"} onClick={() => setTab("ask")} style={{ flex: 1 }}>
                Ask
              </button>
              <button
                className={tab === "builder" ? "btn" : "btn ghost"}
                onClick={() => setTab("builder")}
                style={{ flex: 1 }}
              >
                Build a query
              </button>
            </div>

            {tab === "ask" && (
              <>
                <textarea
                  rows={3}
                  placeholder="e.g. revenue by channel"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                  {SAMPLE_QUESTIONS.map((q) => (
                    <button key={q} className="pill" style={{ cursor: "pointer" }} onClick={() => setQuestion(q)}>
                      {q}
                    </button>
                  ))}
                </div>
                <button
                  className="btn"
                  style={{ width: "100%", marginTop: 12 }}
                  onClick={handleAsk}
                  disabled={loading || !engineReady}
                >
                  {loading ? "Thinking…" : !engineReady ? "Loading engine…" : "Ask"}
                </button>
              </>
            )}

            {tab === "builder" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label className="panel-title">Aggregate</label>
                <select value={bAgg} onChange={(e) => setBAgg(e.target.value)}>
                  {["SUM", "AVG", "COUNT", "MIN", "MAX"].map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                <label className="panel-title">Of column</label>
                <select value={bMetric} onChange={(e) => setBMetric(e.target.value)}>
                  {columns.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <label className="panel-title">Grouped by</label>
                <select value={bGroup} onChange={(e) => setBGroup(e.target.value)}>
                  {columns.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <label className="panel-title">Filter (optional)</label>
                <div style={{ display: "flex", gap: 6 }}>
                  <select value={bFilterCol} onChange={(e) => setBFilterCol(e.target.value)} style={{ flex: 2 }}>
                    <option value="">— none —</option>
                    {columns.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <select value={bFilterOp} onChange={(e) => setBFilterOp(e.target.value)} style={{ flex: 1 }}>
                    {["=", "!=", ">", "<", ">=", "<="].map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="filter value"
                  value={bFilterVal}
                  onChange={(e) => setBFilterVal(e.target.value)}
                  disabled={!bFilterCol}
                />
                <button className="btn" style={{ marginTop: 8 }} onClick={runBuilder} disabled={!engineReady}>
                  {engineReady ? "Run" : "Loading engine…"}
                </button>
              </div>
            )}

            {errorMsg && <p style={{ color: "var(--coral)", fontSize: "0.85rem", marginTop: 10 }}>{errorMsg}</p>}
          </div>
        </div>

        {/* right column: result + dashboard */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
          <div className="card">
            <div className="panel-title">Result</div>
            {!result && <p style={{ color: "var(--ink-faint)" }}>Ask a question or run a query to see a result here.</p>}
            {result && (
              <>
                <p style={{ fontSize: "1.02rem" }}>{result.summary}</p>
                <ChartBlock cols={result.columns} rows={result.rows} />
                <details style={{ marginTop: 12 }}>
                  <summary className="mono" style={{ fontSize: "0.78rem", color: "var(--ink-faint)", cursor: "pointer" }}>
                    Generated SQL
                  </summary>
                  <pre className="mono" style={{ fontSize: "0.78rem", overflowX: "auto", marginTop: 6 }}>
                    {result.sql}
                  </pre>
                </details>
                <div style={{ overflowX: "auto", marginTop: 12 }}>
                  <table>
                    <thead>
                      <tr>
                        {result.columns.map((c) => (
                          <th key={c}>{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.slice(0, 20).map((r, i) => (
                        <tr key={i}>
                          {r.map((v, j) => (
                            <td key={j}>{formatVal(v)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {result.rows.length > 20 && (
                    <p className="hint">Showing first 20 of {result.rows.length} rows — download for the full set.</p>
                  )}
                </div>
                <div className="row-actions">
                  <button className="btn ghost" onClick={pin}>
                    Pin to dashboard
                  </button>
                  <button
                    className="btn ghost"
                    onClick={() => downloadCsv("datcube-result.csv", result.columns, result.rows)}
                  >
                    Download CSV
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="panel-title" style={{ margin: 0 }}>
                Dashboard ({pinned.length})
              </div>
              <button
                className="btn ghost"
                style={{ marginLeft: "auto" }}
                onClick={handleShare}
                disabled={pinned.length === 0}
              >
                Share
              </button>
            </div>

            {shareUrl && (
              <>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <input type="text" readOnly value={shareUrl} onFocus={(e) => e.target.select()} />
                  <button className="btn ghost" onClick={() => navigator.clipboard?.writeText(shareUrl)}>
                    Copy
                  </button>
                </div>
                <p className="hint">
                  {usingSample
                    ? "This link reproduces the board for anyone — it re-loads the sample data on open."
                    : "Heads up: your uploaded CSV isn't in this link (too large). Whoever opens it will need to upload the same file to see these cards."}
                </p>
              </>
            )}

            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                marginTop: 14,
              }}
            >
              {pinned.length === 0 && <p style={{ color: "var(--ink-faint)" }}>Nothing pinned yet.</p>}
              {pinned.map((item) => (
                <PinnedCard key={item.id} item={item} db={db} onRemove={() => removePinned(item.id)} />
              ))}
            </div>

            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem" }}>
                <input type="checkbox" checked={digestOn} onChange={toggleDigest} />
                Email me this board weekly <span className="stub">(demo — no email is sent)</span>
              </label>
              {digestOn && <p className="hint">Next send: {nextSend}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function PinnedCard({ item, db, onRemove }: { item: PinnedItem; db: any; onRemove: () => void }) {
  let cols: string[] = [];
  let outRows: any[][] = [];
  let error: string | null = null;
  if (db) {
    try {
      const r = runQuery(db, item.sql);
      cols = r.columns;
      outRows = r.rows;
    } catch (e: any) {
      error = "Couldn't run this card against the current dataset.";
    }
  }
  return (
    <div className="card" style={{ background: "var(--surface-2)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <p style={{ fontSize: "0.88rem", fontWeight: 600 }}>{item.question}</p>
        <button className="btn ghost" style={{ padding: "2px 8px", fontSize: "0.7rem" }} onClick={onRemove}>
          ✕
        </button>
      </div>
      {!db && <p className="hint">Loading…</p>}
      {error && <p style={{ color: "var(--coral)", fontSize: "0.78rem" }}>{error}</p>}
      {!error && db && <ChartBlock cols={cols} rows={outRows} />}
    </div>
  );
}
