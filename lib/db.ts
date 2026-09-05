// Client-side only: builds an in-memory SQLite database (sql.js / WASM) from
// whatever rows are currently loaded (sample data or an uploaded CSV).
// Nothing here ever leaves the browser except a 5-row sample sent to /api/ask
// so the model can see the schema.

export type ColumnInfo = { name: string; type: "TEXT" | "REAL" | "INTEGER" };

let sqlJsPromise: Promise<any> | null = null;

function loadSqlJs() {
  if (!sqlJsPromise) {
    sqlJsPromise = import("sql.js").then((mod) =>
      (mod.default as any)({
        locateFile: (file: string) =>
          `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`,
      })
    );
  }
  return sqlJsPromise;
}

export function inferColumns(rows: Record<string, unknown>[]): ColumnInfo[] {
  if (rows.length === 0) return [];
  const keys = Object.keys(rows[0]);
  return keys.map((name) => {
    let allInt = true;
    let allNum = true;
    for (const r of rows) {
      const v = r[name];
      if (v === null || v === undefined || v === "") continue;
      const n = typeof v === "number" ? v : Number(v);
      if (Number.isNaN(n)) {
        allNum = false;
        allInt = false;
        break;
      }
      if (!Number.isInteger(n)) allInt = false;
    }
    if (allInt) return { name, type: "INTEGER" as const };
    if (allNum) return { name, type: "REAL" as const };
    return { name, type: "TEXT" as const };
  });
}

export async function buildDatabase(
  rows: Record<string, unknown>[],
  columns: ColumnInfo[]
) {
  const SQL = await loadSqlJs();
  const db = new SQL.Database();
  const colDefs = columns.map((c) => `"${c.name}" ${c.type}`).join(", ");
  db.run(`CREATE TABLE data (${colDefs});`);

  if (rows.length > 0) {
    const placeholders = columns.map(() => "?").join(",");
    const stmt = db.prepare(
      `INSERT INTO data (${columns.map((c) => `"${c.name}"`).join(",")}) VALUES (${placeholders})`
    );
    for (const row of rows) {
      const values = columns.map((c) => {
        const v = row[c.name];
        if (v === undefined || v === "" || v === null) return null;
        if (c.type === "TEXT") return String(v);
        const n = Number(v);
        return Number.isNaN(n) ? null : n;
      });
      stmt.run(values);
    }
    stmt.free();
  }
  return db;
}

const FORBIDDEN = /\b(insert|update|delete|drop|alter|attach|detach|pragma|create|replace|vacuum)\b/i;

export function isSafeSelect(sql: string): boolean {
  const trimmed = sql.trim().replace(/;+\s*$/g, "");
  if (!/^select\b/i.test(trimmed)) return false;
  if (trimmed.includes(";")) return false; // no stacked statements
  if (FORBIDDEN.test(trimmed)) return false;
  return true;
}

export function runQuery(db: any, sql: string) {
  const res = db.exec(sql);
  if (res.length === 0) return { columns: [] as string[], rows: [] as any[][] };
  return { columns: res[0].columns as string[], rows: res[0].values as any[][] };
}
