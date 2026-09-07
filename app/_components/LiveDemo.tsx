"use client";

import { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";

type Scene = {
  q: string;
  cap: string;
  data: { label: string; value: number }[];
  highlight: number;
};

const SCENES: Scene[] = [
  {
    q: "Which channel had the lowest cost per order last quarter?",
    cap: "Cost per order by channel · Q2",
    data: [
      { label: "Referral", value: 9 },
      { label: "Organic", value: 12 },
      { label: "Email", value: 18 },
      { label: "Social", value: 39 },
      { label: "Paid", value: 44 },
    ],
    highlight: 0,
  },
  {
    q: "Revenue by channel this half",
    cap: "Revenue by channel · 2026 H1",
    data: [
      { label: "Paid", value: 27.7 },
      { label: "Social", value: 23.2 },
      { label: "Organic", value: 23.1 },
      { label: "Referral", value: 20.1 },
      { label: "Email", value: 19.9 },
    ],
    highlight: 0,
  },
  {
    q: "Refund rate by month",
    cap: "Refund rate % · Jan to Jun",
    data: [
      { label: "Jan", value: 5.1 },
      { label: "Feb", value: 6.4 },
      { label: "Mar", value: 4.8 },
      { label: "Apr", value: 7.2 },
      { label: "May", value: 5.6 },
      { label: "Jun", value: 4.2 },
    ],
    highlight: 3,
  },
];

export function LiveDemo() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % SCENES.length), 3800);
    return () => clearInterval(t);
  }, [paused]);

  const s = SCENES[i];

  return (
    <div className="livecard" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="q">
        <span className="dot" />
        {s.q}
      </div>
      <div className="cap">{s.cap}</div>
      <div style={{ height: 210 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={s.data} margin={{ top: 6, right: 4, bottom: 0, left: -18 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="#e2e7ec" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#7d8894"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#e2e7ec" }}
            />
            <YAxis stroke="#7d8894" fontSize={11} tickLine={false} axisLine={false} width={38} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive>
              {s.data.map((_, idx) => (
                <Cell key={idx} fill={idx === s.highlight ? "#1c5faa" : "#dfe4ea"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        {SCENES.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Show example ${idx + 1}`}
            onClick={() => setI(idx)}
            style={{
              width: 22,
              height: 4,
              borderRadius: 2,
              border: 0,
              cursor: "pointer",
              background: idx === i ? "#1c5faa" : "#e2e7ec",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
