# Task: Fitur Registrasi User Baru (`POST /api/users`)

## 📌 Ringkasan Fitur
Menambahkan fitur registrasi akun pengguna baru ke dalam sistem backend. Fitur ini mencakup pembaruan skema database tabel user, pembuatan *service layer* untuk logika hashing password menggunakan **bcrypt** dan pengecekan duplikasi email, serta pembuatan *routes layer* menggunakan **ElysiaJS** dengan validasi input.

Dokumen ini disusun sebagai panduan langkah-demi-langkah yang jelas, terstruktur, dan detail agar mudah diimplementasikan oleh programmer junior maupun model AI.

---

## 🎯 Kriteria Keberhasilan (Definition of Done)
1. Tabel `users` di database memiliki kolom `password` (varchar 255) untuk menyimpan hash bcrypt.
2. Migrasi database berhasil dibuat dan diterapkan (`bun run db:generate` & `bun run db:push`).
3. Endpoint `POST /api/users` aktif dan dapat menerima request body JSON (`name`, `email`, `password`).
4. Password disimpan dalam bentuk hash bcrypt yang aman, tidak pernah disimpan dalam bentuk plain text.
5. Jika email belum pernah terdaftar: data tersimpan ke database dan mengembalikan response status `200` (atau `201`) dengan body `{ "data": "OK" }`.
6. Jika email sudah terdaftar: request ditolak dengan response status `400` (atau `409`) dengan body `{ "error": "Email sudah terdaftar" }`.
7. Kode terstruktur rapi memisahkan antara folder `src/routes/` dan `src/services/` sesuai konvensi penamaan yang ditentukan.
8. Tersedia automated test (`bun test`) untuk memverifikasi skenario sukses dan gagal.

---

## 📂 Konvensi Struktur Folder & Penamaan Berkas
Ikuti aturan struktur berkas di dalam direktori `src/` berikut:
- **`src/routes/`**: Berisi definisi endpoint dan routing ElysiaJS.
  - Penamaan berkas: format kebab-case, contoh: `src/routes/user-routes.ts`.
- **`src/services/`**: Berisi *business logic*, hashing, dan query interaksi database (Drizzle ORM).
  - Penamaan berkas: format kebab-case, contoh: `src/services/user-service.ts`.

Contoh struktur akhir:
```text
src/
├── db/
│   ├── index.ts
│   └── schema.ts           # Perbarui skema tabel users di sini
├── routes/
│   └── user-routes.ts      # Definisi route POST /api/users
├── services/
│   └── user-service.ts     # Logika hashing & registrasi user
└── index.ts                # Daftarkan user-routes ke app utama
```

---

## 🗄️ Spesifikasi Database (Tabel User)

Perbarui definisi tabel pada `src/db/schema.ts` dengan spesifikasi kolom berikut:

| Nama Kolom | Tipe Data | Constraint | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | `int` / `serial` | Primary Key, Auto Increment | ID unik user |
| `name` | `varchar(255)` | NOT NULL | Nama lengkap user |
| `email` | `varchar(255)` | NOT NULL, UNIQUE | Alamat email unik |
| `password` | `varchar(255)` | NOT NULL | Hash password menggunakan bcrypt |
| `created_at` | `timestamp` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Waktu pendaftaran |

Contoh implementasi Drizzle ORM di `src/db/schema.ts`:
```typescript
import { int, mysqlTable, serial, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

---

## 🌐 Spesifikasi API Endpoint

### `POST /api/users`

#### 1. Request
- **Headers:**
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "name": "Eko",
    "email": "eko@localhost",
    "password": "rahasia"
  }
  ```
- **Validasi Input (Elysia `t` schema):**
  - `name`: string, tidak boleh kosong.
  - `email`: string, format email valid.
  - `password`: string, minimal 6 karakter.

#### 2. Response: Sukses (Email belum terdaftar)
- **Status Code:** `200 OK` (atau `201 Created`)
- **Response Body:**
  ```json
  {
    "data": "OK"
  }
  ```

#### 3. Response: Gagal (Email sudah terdaftar)
- **Status Code:** `400 Bad Request` (atau `409 Conflict`)
- **Response Body:**
  ```json
  {
    "error": "Email sudah terdaftar"
  }
  ```

---

## 📋 Langkah Implementasi Detail (Step-by-Step)

### Langkah 1: Perbarui Skema Database & Jalankan Migrasi
1. Buka file `src/db/schema.ts`.
2. Tambahkan kolom `password: varchar("password", { length: 255 }).notNull()`.
3. Jalankan script migrasi di terminal:
   ```bash
   bun run db:generate
   ```
4. Jika database MySQL lokal aktif, sinkronkan skema:
   ```bash
   bun run db:push
   ```

---

### Langkah 2: Buat Service Layer (`src/services/user-service.ts`)
1. Buat berkas baru di `src/services/user-service.ts`.
2. Gunakan fasilitas hashing password bcrypt:
   > **Catatan Teknis untuk Pelaksana:** Runtime Bun memiliki built-in bcrypt hasher:
   > ```typescript
   > const hashedPassword = await Bun.password.hash(password, {
   >   algorithm: "bcrypt",
   >   cost: 10,
   > });
   > ```
3. Buat fungsi `registerUser({ name, email, password })`:
   - Query ke database menggunakan Drizzle: cari apakah `email` sudah ada di tabel `users`.
   - **Jika email sudah ada:** Lemparkan error atau kembalikan response error `{ success: false, message: "Email sudah terdaftar" }`.
   - **Jika email belum ada:**
     - Hash password plain text menggunakan bcrypt.
     - Lakukan `insert` ke tabel `users` dengan `name`, `email`, dan `password` (hasil hash).
     - Kembalikan status sukses `{ success: true }`.

---

### Langkah 3: Buat Routing Layer (`src/routes/user-routes.ts`)
1. Buat berkas baru di `src/routes/user-routes.ts`.
2. Inisialisasi instance Elysia baru dengan prefix `/api/users`.
3. Definisikan endpoint `POST /` (sehingga route lengkapnya menjadi `/api/users`).
4. Gunakan schema validator dari Elysia (`t`) untuk memvalidasi request body.

---

### Langkah 4: Registrasikan Routes ke Server Utama (`src/index.ts`)
1. Buka file `src/index.ts`.
2. Import `userRoutes` dari `./routes/user-routes`.
3. Daftarkan router menggunakan method `.use(userRoutes)` pada instance Elysia utama.

---

### Langkah 5: Pengujian & Verifikasi (Testing)

1. **Jalankan Typecheck:**
   ```bash
   bun run typecheck
   ```
2. **Jalankan Automated Test:**
   ```bash
   bun test
   ```
