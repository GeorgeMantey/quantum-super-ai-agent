import Database from "better-sqlite3";
import { MemoryAdapter } from "@qsa/shared/types";

export const sqliteMemory = (path = ":memory:"): MemoryAdapter => {
  const db = new Database(path);
  db.prepare(`CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT);`).run();

  return {
    async upsert(key, value) {
      const v = JSON.stringify(value);
      db.prepare(`INSERT INTO kv (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v=excluded.v`).run(key, v);
    },
    async get(key) {
      const row = db.prepare(`SELECT v FROM kv WHERE k=?`).get(key) as { v?: string } | undefined;
      return row?.v ? JSON.parse(row.v) : null;
    },
    async search(query) {
      const rows = db.prepare(`SELECT k, v FROM kv`).all() as { k: string; v: string }[];
      return rows.filter(r => r.v.toLowerCase().includes(query.toLowerCase())).slice(0, 10);
    }
  };
};
