import { afterAll, describe, expect, it } from "bun:test";
import { eq } from "drizzle-orm";
import { app } from "../src/index";
import { db } from "../src/db";
import { users } from "../src/db/schema";

describe("POST /api/users - Registrasi User", () => {
  const testEmail = `test_${Date.now()}@localhost`;

  afterAll(async () => {
    // Bersihkan user testing dari database
    try {
      await db.delete(users).where(eq(users.email, testEmail));
    } catch {
      // Ignore if table or db cleanup is not available
    }
  });

  it("Berhasil registrasi user baru dengan password ter-hash bcrypt", async () => {
    const res = await app.handle(
      new Request("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Eko",
          email: testEmail,
          password: "rahasia",
        }),
      })
    );

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body).toEqual({ data: "OK" });

    // Verifikasi data di database
    const [savedUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, testEmail))
      .limit(1);

    expect(savedUser).toBeDefined();
    if (!savedUser) throw new Error("User was not saved to database");

    expect(savedUser.name).toBe("Eko");
    expect(savedUser.password).not.toBe("rahasia");

    // Pastikan hash bcrypt valid
    const isPasswordMatch = await Bun.password.verify("rahasia", savedUser.password);
    expect(isPasswordMatch).toBe(true);
  });

  it("Gagal registrasi jika email sudah terdaftar", async () => {
    const res = await app.handle(
      new Request("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Eko Duplikat",
          email: testEmail,
          password: "password123",
        }),
      })
    );

    expect(res.status).toBe(400);
    const body = (await res.json()) as any;
    expect(body).toEqual({ error: "Email sudah terdaftar" });
  });

  it("Gagal registrasi jika data request body tidak lengkap", async () => {
    const res = await app.handle(
      new Request("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "",
          email: "",
        }),
      })
    );

    expect(res.status).toBe(400);
    const body = (await res.json()) as any;
    expect(body).toHaveProperty("error");
  });
});
