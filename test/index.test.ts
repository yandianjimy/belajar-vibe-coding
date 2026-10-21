import { describe, expect, it } from "bun:test";
import { app } from "../src/index";

describe("Elysia App API Endpoints", () => {
  it("GET / returns 200 with server info", async () => {
    const res = await app.handle(new Request("http://localhost:3000/"));
    expect(res.status).toBe(200);

    const data = (await res.json()) as any;
    expect(data.status).toBe("ok");
    expect(data.framework).toBe("ElysiaJS");
    expect(data.runtime).toBe("Bun");
    expect(data.orm).toBe("Drizzle ORM");
    expect(data.database).toBe("MySQL");
  });

  it("GET /health responds and returns health information", async () => {
    const res = await app.handle(new Request("http://localhost:3000/health"));
    expect([200, 503]).toContain(res.status);

    const data = (await res.json()) as any;
    expect(data.server).toBe("running");
    expect(data).toHaveProperty("database");
    expect(data.database).toHaveProperty("status");
    expect(data).toHaveProperty("timestamp");
  });
});
