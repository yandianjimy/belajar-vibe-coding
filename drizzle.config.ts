import { defineConfig } from "drizzle-kit";

const host = process.env.DB_HOST || "127.0.0.1";
const port = Number(process.env.DB_PORT) || 3306;
const user = process.env.DB_USER || "root";
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME || "belajar_vibe_coding";

const userAuth = password ? `${user}:${password}` : user;
const url = `mysql://${userAuth}@${host}:${port}/${database}`;

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url,
  },
});
