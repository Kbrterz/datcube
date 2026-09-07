"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

/* blue + green + gold + two supporting tints */
export const SERIES = ["#1c5faa", "#2e7d5b", "#c8a02e", "#5b91c4", "#8a6d2e"];
const GRID = "#e2e7ec";
const AXIS = "#7d8894";
const NEUTRAL = "#dfe4ea";
const TIP = { background: "#ffffff", border: "1px solid #e2e7ec", color: "#12233a", fontSize: 12 };

function seed(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Frame({ title, note, children }: { title?: string; note?: string; children: React.ReactNode }) {
  return (
    <figure
      style={{
        margin: 0,
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: 14,
        padding: "18px 18px 12px",
      }}
    >
      {title && (
        <figcaption
          className="mono"
          style={{
            fontSize: "0.66rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--ink-faint)",
            marginBottom: 8,
          }}
        >
          {title}
        </figcaption>
      )}
      {children}
      {note && (
        <p className="mono" style={{ fontSize: "0.7rem", color: "var(--ink-faint)", marginTop: 6 }}>
          {note}
        </p>
      )}
    </figure>
  );
}

/* ---------- shared synthetic dataset the analytical charts read from ---------- */
type Chan = { channel: string; spend: number; revenue: number; orders: number };
function channelData(): Chan[] {
  const r = seed(4242);
  const base = [
    ["Organic", 900, 24000],
    ["Paid search", 8200, 28000],
    ["Email", 1400, 19800],
    ["Social", 5100, 23200],
    ["Referral", 600, 20100],
    ["Affiliate", 3300, 17400],
    ["Marketplace", 4700, 15200],
  ] as const;
  return base.map(([channel, spend, revenue]) => {
    const s = spend * (0.85 + r() * 0.3);
    const rev = revenue * (0.9 + r() * 0.2);
    return {
      channel,
      spend: Math.round(s),
      revenue: Math.round(rev),
      orders: Math.round(rev / (35 + r() * 25)),
    };
  });
}

/* ---------- TREND ANALYSIS: series + least-squares fit ---------- */
export function TrendAnalysis() {
  const r = seed(90210);
  const weeks = 24;
  const raw = Array.from({ length: weeks }, (_, i) => {
    const trend = 120 + i * 4.4;
    const season = Math.sin(i / 3.2) * 14;
    const noise = (r() - 0.5) * 22;
    return { i, week: `W${i + 1}`, orders: Math.max(0, Math.round(trend + season + noise)) };
  });
  // linear regression
  const n = raw.length;
  const sx = raw.reduce((a, d) => a + d.i, 0);
  const sy = raw.reduce((a, d) => a + d.orders, 0);
  const sxy = raw.reduce((a, d) => a + d.i * d.orders, 0);
  const sxx = raw.reduce((a, d) => a + d.i * d.i, 0);
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const intercept = (sy - slope * sx) / n;
  const data = raw.map((d) => ({ ...d, fit: Math.round(intercept + slope * d.i) }));
  const perWeek = slope.toFixed(1);

  return (
    <Frame title="Trend analysis · weekly orders" note={`Fitted trend: +${perWeek} orders per week`}>
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -14 }}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="week" stroke={AXIS} fontSize={10} tickLine={false} axisLine={{ stroke: GRID }} interval={3} />
            <YAxis stroke={AXIS} fontSize={10} tickLine={false} axisLine={false} width={40} />
            <Tooltip contentStyle={TIP} />
            <Line isAnimationActive={false} type="monotone" dataKey="orders" name="Actual" stroke={SERIES[0]} strokeWidth={2} dot={false} />
            <Line isAnimationActive={false} type="linear" dataKey="fit" name="Trend" stroke={SERIES[2]} strokeWidth={2} dot={false} strokeDasharray="5 4" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Frame>
  );
}

/* ---------- SCATTER: spend vs revenue, bubble = orders ---------- */
export function ScatterDiagram() {
  const d = channelData().map((c) => ({ x: c.spend, y: c.revenue, z: c.orders, name: c.channel }));
  return (
    <Frame title="Scatter · ad spend vs revenue" note="Bubble size = order count. Top-left is cheap and productive.">
      <div style={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 12, bottom: 6, left: 2 }}>
            <CartesianGrid stroke={GRID} />
            <XAxis
              type="number"
              dataKey="x"
              name="Spend"
              stroke={AXIS}
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: GRID }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Revenue"
              stroke={AXIS}
              fontSize={10}
              tickLine={false}
              axisLine={false}
              width={44}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <ZAxis type="number" dataKey="z" range={[60, 520]} />
            <Tooltip
              contentStyle={TIP}
              formatter={(v: any, k: any) => (k === "z" ? [`${v}`, "orders"] : [`$${Number(v).toLocaleString()}`, k])}
              cursor={{ strokeDasharray: "3 3" }}
            />
            <Scatter isAnimationActive={false} data={d} fill={SERIES[1]} fillOpacity={0.7} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </Frame>
  );
}

/* ---------- MONTE CARLO: distribution of first-year ROI multiple ---------- */
export function MonteCarloROI() {
  const runs = 4000;
  const rnd = seed(1337);
  const cost = 2388;
  const reportingPeople = 6;
  const results: number[] = [];
  for (let i = 0; i < runs; i++) {
    const hoursWeek = 3 + rnd() * 4; // 3 to 7
    const weeks = 40 + rnd() * 8; // 40 to 48
    const rate = 28 + rnd() * 16; // 28 to 44
    const adoption = 0.55 + rnd() * 0.45; // 0.55 to 1.0
    const hireOffset = 6000 + rnd() * 18000;
    const toolSave = 600 + rnd() * 1200;
    const value = hoursWeek * weeks * rate * reportingPeople * adoption + hireOffset * adoption + toolSave;
    results.push(value / cost);
  }
  results.sort((a, b) => a - b);
  const pct = (p: number) => results[Math.floor(p * runs)];
  const p10 = pct(0.1);
  const p50 = pct(0.5);
  const p90 = pct(0.9);
  // histogram
  const min = Math.floor(results[0]);
  const max = Math.ceil(results[runs - 1]);
  const bins = 22;
  const step = (max - min) / bins;
  const hist = Array.from({ length: bins }, (_, i) => ({
    x: Math.round(min + step * (i + 0.5)),
    count: 0,
  }));
  results.forEach((v) => {
    let idx = Math.floor((v - min) / step);
    if (idx >= bins) idx = bins - 1;
    if (idx < 0) idx = 0;
    hist[idx].count++;
  });

  return (
    <Frame
      title="Monte Carlo · first-year ROI multiple"
      note={`4,000 simulations. P10 ${p10.toFixed(1)}x · median ${p50.toFixed(1)}x · P90 ${p90.toFixed(1)}x`}
    >
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hist} margin={{ top: 8, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="x" stroke={AXIS} fontSize={10} tickLine={false} axisLine={{ stroke: GRID }} tickFormatter={(v) => `${v}x`} interval={2} />
            <YAxis stroke={AXIS} fontSize={10} tickLine={false} axisLine={false} width={40} />
            <Tooltip contentStyle={TIP} formatter={(v: any) => [`${v} runs`, "count"]} labelFormatter={(l) => `~${l}x return`} />
            <Bar isAnimationActive={false} dataKey="count" fill={SERIES[0]} radius={[2, 2, 0, 0]}>
              {hist.map((h, i) => (
                <Cell key={i} fill={h.x >= p10 && h.x <= p90 ? SERIES[0] : NEUTRAL} />
              ))}
            </Bar>
            <ReferenceLine x={Math.round(p50)} stroke={SERIES[1]} strokeWidth={2} label={{ value: "median", fill: SERIES[1], fontSize: 10, position: "top" }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Frame>
  );
}

/* ---------- ROI OVER HORIZONS: 3mo / 6mo / 1yr / 3yr / 5yr / 10yr ---------- */
export function RoiHorizons() {
  const annualValue = 24800;
  const annualCost = 2388;
  const horizons = [
    { label: "3 mo", yrs: 0.25 },
    { label: "6 mo", yrs: 0.5 },
    { label: "1 yr", yrs: 1 },
    { label: "3 yr", yrs: 3 },
    { label: "5 yr", yrs: 5 },
    { label: "10 yr", yrs: 10 },
  ];
  const data = horizons.map((h) => {
    // value compounds mildly as the team leans on it more; cost is flat per year
    const value = annualValue * h.yrs * (1 + 0.05 * Math.max(0, h.yrs - 1));
    const cost = annualCost * h.yrs;
    return {
      label: h.label,
      value: Math.round(value),
      cost: Math.round(cost),
      roi: +(value / cost).toFixed(1),
    };
  });
  return (
    <Frame title="ROI by time horizon" note="Value compounds as adoption grows; price stays flat per year.">
      <div style={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 18, right: 10, bottom: 0, left: 2 }}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="label" stroke={AXIS} fontSize={11} tickLine={false} axisLine={{ stroke: GRID }} />
            <YAxis stroke={AXIS} fontSize={10} tickLine={false} axisLine={false} width={30} tickFormatter={(v) => `${v}x`} />
            <Tooltip
              contentStyle={TIP}
              formatter={(v: any, k: any) => (k === "roi" ? [`${v}x`, "ROI"] : [`$${Number(v).toLocaleString()}`, k])}
            />
            <Bar isAnimationActive={false} dataKey="roi" name="ROI multiple" radius={[3, 3, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={SERIES[i % 3]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Frame>
  );
}

/* ---------- PAYBACK: cumulative value line vs cumulative price line ---------- */
export function PaybackCurve() {
  const price = 199;
  const data = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    return { m: `M${m}`, value: Math.round(m * 2066), cost: price * m };
  });
  return (
    <Frame title="Cumulative value vs cumulative price" note="The lines cross inside the first two months. Everything after is margin.">
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: 2 }}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="m" stroke={AXIS} fontSize={10} tickLine={false} axisLine={{ stroke: GRID }} />
            <YAxis stroke={AXIS} fontSize={10} tickLine={false} axisLine={false} width={48} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip contentStyle={TIP} formatter={(v: any) => `$${Number(v).toLocaleString()}`} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line isAnimationActive={false} type="monotone" dataKey="value" name="Value returned" stroke={SERIES[1]} strokeWidth={2.5} dot={false} />
            <Line isAnimationActive={false} type="monotone" dataKey="cost" name="What you pay" stroke={SERIES[0]} strokeWidth={2} dot={false} strokeDasharray="4 4" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Frame>
  );
}

/* ---------- lighter supporting charts ---------- */
export function WeekDonut() {
  const data = [
    { name: "Pulling data together", value: 6, fill: SERIES[0] },
    { name: "Actual analysis", value: 1.5, fill: SERIES[1] },
    { name: "Reconciling numbers", value: 1, fill: SERIES[2] },
    { name: "Everything else", value: 31.5, fill: NEUTRAL },
  ];
  return (
    <Frame title="A 40-hour week, before DatCube">
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie isAnimationActive={false} data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={2} stroke="none">
              {data.map((d, i) => (
                <Cell key={i} fill={d.fill} />
              ))}
            </Pie>
            <Tooltip contentStyle={TIP} formatter={(v: any) => `${v} hrs`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "grid", gap: 4, fontSize: "0.8rem", color: "var(--ink-soft)", marginTop: 4 }}>
        {data.slice(0, 3).map((d) => (
          <span key={d.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <b style={{ width: 9, height: 9, borderRadius: 2, background: d.fill, display: "inline-block" }} />
            {d.name} <span className="mono" style={{ marginLeft: "auto" }}>{d.value} hrs</span>
          </span>
        ))}
      </div>
    </Frame>
  );
}

export function HoursReclaimed() {
  const data = Array.from({ length: 13 }, (_, i) => ({ week: `W${i + 1}`, hours: Math.round(i * 5.5 * 10) / 10 }));
  return (
    <Frame title="Hours reclaimed per person, over a quarter">
      <div style={{ height: 210 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: -14 }}>
            <defs>
              <linearGradient id="g-hours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={SERIES[1]} stopOpacity={0.35} />
                <stop offset="100%" stopColor={SERIES[1]} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="week" stroke={AXIS} fontSize={10} tickLine={false} axisLine={{ stroke: GRID }} interval={1} />
            <YAxis stroke={AXIS} fontSize={10} tickLine={false} axisLine={false} width={38} />
            <Tooltip contentStyle={TIP} formatter={(v: any) => `${v} hrs`} />
            <Area isAnimationActive={false} type="monotone" dataKey="hours" stroke={SERIES[1]} strokeWidth={2} fill="url(#g-hours)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Frame>
  );
}

export function ValueByPlan() {
  const data = [
    { plan: "Starter", price: 588, value: 3200 },
    { plan: "Growth", price: 2388, value: 24800 },
    { plan: "Business", price: 7188, value: 95000 },
  ];
  return (
    <Frame title="Annual value vs annual price, by plan">
      <div style={{ height: 230 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: 2 }}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="plan" stroke={AXIS} fontSize={11} tickLine={false} axisLine={{ stroke: GRID }} />
            <YAxis stroke={AXIS} fontSize={10} tickLine={false} axisLine={false} width={48} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip contentStyle={TIP} formatter={(v: any) => `$${Number(v).toLocaleString()}`} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar isAnimationActive={false} dataKey="price" name="Price" fill={SERIES[0]} radius={[3, 3, 0, 0]} />
            <Bar isAnimationActive={false} dataKey="value" name="Value" fill={SERIES[1]} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Frame>
  );
}

export function BoardMock() {
  const rev = channelData().slice(0, 5).map((c) => ({ k: c.channel, v: Math.round(c.revenue / 1000) }));
  const trend = Array.from({ length: 8 }, (_, i) => ({ k: `W${i + 1}`, v: 40 + Math.round(Math.sin(i) * 8) + i * 2 }));
  const mix = [
    { name: "New", value: 62, fill: SERIES[0] },
    { name: "Returning", value: 38, fill: SERIES[1] },
  ];
  const cell = { border: "1px solid var(--line)", borderRadius: 10, padding: 12 } as const;
  const lab = { fontSize: "0.6rem", color: "var(--ink-faint)", textTransform: "uppercase" as const, letterSpacing: "0.08em" };
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: 16,
        padding: 18,
        boxShadow: "0 30px 70px -40px rgba(18,35,58,0.28)",
      }}
    >
      <div className="mono" style={{ fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 12 }}>
        Growth board · shared link
      </div>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
        <div style={cell}>
          <div className="mono" style={lab}>Revenue by channel</div>
          <div style={{ height: 92 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rev} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
                <Bar isAnimationActive={false} dataKey="v" radius={[3, 3, 0, 0]}>
                  {rev.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? SERIES[0] : NEUTRAL} />
                  ))}
                </Bar>
                <XAxis dataKey="k" hide />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={cell}>
          <div className="mono" style={lab}>Orders per week</div>
          <div style={{ height: 92 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
                <Line isAnimationActive={false} type="monotone" dataKey="v" stroke={SERIES[3]} strokeWidth={2} dot={false} />
                <XAxis dataKey="k" hide />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={cell}>
          <div className="mono" style={lab}>New vs returning</div>
          <div style={{ height: 92 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie isAnimationActive={false} data={mix} dataKey="value" innerRadius={22} outerRadius={38} paddingAngle={2} stroke="none">
                  {mix.map((d, i) => (
                    <Cell key={i} fill={d.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={{ ...cell, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div className="mono" style={lab}>Lowest cost per order</div>
          <div style={{ fontFamily: "Newsreader, serif", fontSize: "1.9rem", color: SERIES[1], marginTop: 4 }}>$9</div>
          <div style={{ fontSize: "0.78rem", color: "var(--ink-soft)" }}>Referral, down 23% on Q1</div>
        </div>
      </div>
    </div>
  );
}
