import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const FORBIDDEN = /\b(insert|update|delete|drop|alter|attach|detach|pragma|create|replace|vacuum)\b/i;

function isSafeSelect(sql: string): boolean {
  const trimmed = (sql || "").trim().replace(/;+\s*$/g, "");
  if (!/^select\b/i.test(trimmed)) return false;
  if (trimmed.includes(";")) return false;
  if (FORBIDDEN.test(trimmed)) return false;
  return true;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ fallback: true, reason: "no-groq-key" });
  }

  let body: { question?: string; columns?: { name: string; type: string }[]; sample?: any[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const question = (body.question || "").trim();
  const columns = body.columns || [];
  const sample = body.sample || [];

  if (!question || columns.length === 0) {
    return NextResponse.json({ error: "Missing question or schema." }, { status: 400 });
  }

  const schemaText = columns.map((c) => `${c.name} (${c.type})`).join(", ");
  const sampleText = JSON.stringify(sample.slice(0, 5));

  const systemPrompt =
    'You translate a plain-language question into ONE read-only SQLite SELECT statement ' +
    'against a single table named "data". Rules: ' +
    "1) Output ONLY JSON: {\"sql\": \"...\"}. No prose, no markdown fences. " +
    "2) The query must be a single SELECT statement, no semicolons, no other statement types. " +
    "3) Only reference columns that exist in the schema given. " +
    "4) Prefer aggregates (SUM/AVG/COUNT) with GROUP BY when the question asks for a comparison across a category. " +
    "5) If the question mentions a time period you cannot resolve exactly, use your best reasonable interpretation of the date column (ISO text, sortable). " +
    "6) Never invent columns; never modify data.";

  const userPrompt = `Table "data" columns: ${schemaText}\nSample rows: ${sampleText}\nQuestion: ${question}`;

  try {
    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json(
        { error: `Groq API error (${resp.status}): ${text.slice(0, 300)}` },
        { status: 502 }
      );
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content || "{}";
    let parsed: { sql?: string };
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json({ error: "Model returned invalid JSON." }, { status: 502 });
    }

    const sql = (parsed.sql || "").trim();
    if (!isSafeSelect(sql)) {
      return NextResponse.json(
        { error: "Generated query was rejected by the safety check.", rejectedSql: sql },
        { status: 422 }
      );
    }

    return NextResponse.json({ sql });
  } catch (err: any) {
    return NextResponse.json({ error: `Request to Groq failed: ${err?.message || err}` }, { status: 502 });
  }
}
