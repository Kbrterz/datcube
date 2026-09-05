// Deterministic sample dataset (no external file, no randomness across runs).
// 5 channels x ~26 weeks of Jan-Jun 2026 = ~130 rows of order data.

export type OrderRow = {
  date: string; // ISO yyyy-mm-dd
  channel: string;
  order_id: string;
  revenue: number;
  cost: number;
  refunded: number; // 0 or 1
};

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CHANNELS: { name: string; baseRevenue: number; baseCac: number; volatility: number }[] = [
  { name: "Organic", baseRevenue: 180, baseCac: 12, volatility: 0.25 },
  { name: "Paid Search", baseRevenue: 210, baseCac: 46, volatility: 0.3 },
  { name: "Email", baseRevenue: 150, baseCac: 18, volatility: 0.2 },
  { name: "Social", baseRevenue: 165, baseCac: 39, volatility: 0.35 },
  { name: "Referral", baseRevenue: 140, baseCac: 9, volatility: 0.22 },
];

export function generateSampleOrders(): OrderRow[] {
  const rand = mulberry32(20260101);
  const rows: OrderRow[] = [];
  const start = new Date(Date.UTC(2026, 0, 5)); // first Monday of 2026
  let orderSeq = 1;

  for (let week = 0; week < 26; week++) {
    const weekDate = new Date(start.getTime() + week * 7 * 86400000);
    const iso = weekDate.toISOString().slice(0, 10);
    // Paid Search CAC trends down over the half (the "why" the demo is built to surface)
    const paidSearchDrift = 1 - week * 0.012;

    for (const ch of CHANNELS) {
      const ordersThisWeek = 3 + Math.floor(rand() * 5);
      for (let i = 0; i < ordersThisWeek; i++) {
        const noise = 1 + (rand() - 0.5) * ch.volatility;
        const revenue = Math.round(ch.baseRevenue * noise * 100) / 100;
        let cacFactor = ch.name === "Paid Search" ? paidSearchDrift : 1;
        const cost = Math.round(ch.baseCac * cacFactor * (1 + (rand() - 0.5) * 0.3) * 100) / 100;
        const refunded = rand() < 0.06 ? 1 : 0;
        rows.push({
          date: iso,
          channel: ch.name,
          order_id: `ORD-${String(orderSeq).padStart(5, "0")}`,
          revenue,
          cost,
          refunded,
        });
        orderSeq++;
      }
    }
  }
  return rows;
}

export const SAMPLE_QUESTIONS = [
  "Revenue by channel",
  "Which channel had the lowest cost per order last quarter?",
  "Refund rate by month",
  "Total revenue and total cost by channel",
];
