import { createClient } from "@libsql/client/http";

type DbClient = ReturnType<typeof createClient>;
let _db: DbClient | null = null;

function getDb(): DbClient {
  if (!_db) {
    const rawUrl = process.env.TURSO_DATABASE_URL!;
    const url = rawUrl.startsWith("libsql://")
      ? rawUrl.replace("libsql://", "https://")
      : rawUrl;
    _db = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN! });
  }
  return _db;
}

// 懒加载代理：db.execute() 调用方式不变，连接延迟到首次请求
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db: DbClient = new Proxy({} as DbClient, {
  get(_: DbClient, prop: string | symbol) {
    const client = getDb();
    const val = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === "function" ? val.bind(client) : val;
  },
});
