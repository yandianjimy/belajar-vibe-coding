import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const dbHost = process.env.DB_HOST || "localhost";
const dbPort = Number(process.env.DB_PORT) || 3306;
const dbUser = process.env.DB_USER || "root";
const dbPassword = process.env.DB_PASSWORD || "";
const dbName = process.env.DB_NAME || "belajar_vibe_coding";

export const poolConnection = mysql.createPool({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(poolConnection, { schema, mode: "default" });

export async function checkDbConnection(): Promise<{ ok: boolean; message: string; error?: string }> {
  try {
    const connection = await poolConnection.getConnection();
    await connection.ping();
    connection.release();
    return { ok: true, message: "Database connected successfully" };
  } catch (err: any) {
    return {
      ok: false,
      message: "Database connection failed",
      error: err?.message || String(err),
    };
  }
}
