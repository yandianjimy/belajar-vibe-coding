import { Elysia, t } from "elysia";
import { registerUser } from "../services/user-service";

export const userRoutes = new Elysia({ prefix: "/api/users" })
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      return {
        error: error.message || "Validasi input gagal",
      };
    }
  })
  .post(
    "/",
    async ({ body, set }) => {
      const result = await registerUser(body);

      if (!result.success) {
        set.status = 400;
        return {
          error: result.error,
        };
      }

      set.status = 200;
      return {
        data: "OK",
      };
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1, error: "Nama tidak boleh kosong" }),
        email: t.String({ minLength: 3, error: "Email tidak valid" }),
        password: t.String({ minLength: 1, error: "Password tidak boleh kosong" }),
      }),
    }
  );
