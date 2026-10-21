import { Elysia } from "elysia";
import { checkDbConnection } from "./db";

const port = Number(process.env.PORT) || 3000;

export const app = new Elysia()
  .get("/", () => ({
    message: "Selamat datang di Belajar Vibe Coding API!",
    runtime: "Bun",
    framework: "ElysiaJS",
    orm: "Drizzle ORM",
    database: "MySQL",
    status: "ok",
    endpoints: {
      health: "/health",
    },
  }))
  .get("/health", async ({ set }) => {
    const dbHealth = await checkDbConnection();

    if (!dbHealth.ok) {
      set.status = 503;
    }

    return {
      status: dbHealth.ok ? "healthy" : "degraded",
      server: "running",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: {
        status: dbHealth.ok ? "connected" : "disconnected",
        message: dbHealth.message,
        ...(dbHealth.error ? { error: dbHealth.error } : {}),
      },
    };
  })
  .listen(port);

console.log(
  `🚀 Elysia server is running at http://${app.server?.hostname}:${app.server?.port}`
);
