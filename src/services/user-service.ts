import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export type RegisterResult =
  | { success: true }
  | { success: false; error: string };

export async function registerUser(payload: RegisterDTO): Promise<RegisterResult> {
  const normalizedEmail = payload.email.trim().toLowerCase();

  // 1. Cek apakah email sudah terdaftar
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existingUser.length > 0) {
    return {
      success: false,
      error: "Email sudah terdaftar",
    };
  }

  // 2. Hash password menggunakan bcrypt
  const hashedPassword = await Bun.password.hash(payload.password, {
    algorithm: "bcrypt",
    cost: 10,
  });

  // 3. Simpan user ke database
  await db.insert(users).values({
    name: payload.name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  return {
    success: true,
  };
}
