# Task: Inisialisasi Project Backend (Bun, ElysiaJS, Drizzle ORM, MySQL)

## 📌 Ringkasan Proyek
Membangun fondasi proyek backend baru menggunakan runtime **Bun**, framework web **ElysiaJS**, serta ORM **Drizzle** yang terhubung ke database **MySQL**. Dokumen ini berfungsi sebagai panduan arsitektur dan langkah kerja high-level untuk diimplementasikan oleh programmer atau model AI pelaksana.

---

## 🎯 Tujuan & Kriteria Keberhasilan (Definition of Done)
1. Project terinisialisasi dengan Bun di direktori saat ini.
2. Server ElysiaJS dapat berjalan dengan baik pada port default (misal: `3000`).
3. Drizzle ORM terkonfigurasi dan mampu berkomunikasi dengan database MySQL melalui file `.env`.
4. Script eksekusi (`dev`, `build`, `db:generate`, `db:migrate`, `db:push`) tersedia di `package.json`.
5. Terdapat minimal 1 endpoint health check (`GET /` atau `GET /health`) yang memverifikasi status server dan konektivitas database.

---

## 📋 Rencana Implementasi (High-Level Steps)

### Tahap 1: Inisialisasi Proyek & Runtime
- Inisialisasi project Bun di root folder (`package.json`, `tsconfig.json`).
- Siapkan konfigurasi TypeScript yang sesuai untuk Elysia dan Bun.
- Siapkan file `.gitignore` (mengabaikan `node_modules`, `.env`, dll).

### Tahap 2: Manajemen Dependensi
Pasang paket-paket inti yang dibutuhkan:
- **Web Framework:** `elysia`
- **Database & ORM:** `drizzle-orm`, driver MySQL (seperti `mysql2`)
- **Dev Tools:** `drizzle-kit`

### Tahap 3: Konfigurasi Database & Drizzle ORM
- Siapkan template variabel lingkungan (`.env.example` dan `.env`) yang memuat kredensial MySQL (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`).
- Buat file konfigurasi koneksi database menggunakan Drizzle dan driver MySQL.
- Konfigurasikan `drizzle.config.ts` untuk manajemen skema dan migrasi.
- Buat struktur folder skema awal (contoh: tabel pengujian/contoh sederhana).

### Tahap 4: Pembuatan Entrypoint Server ElysiaJS
- Buat entrypoint aplikasi (misal: `src/index.ts`).
- Inisialisasi instance Elysia app.
- Tambahkan endpoint health check untuk memastikan server aktif dan dapat merespons permintaan HTTP.

### Tahap 5: Konfigurasi Script & Perintah Kerja
Tambahkan script operasional pada `package.json`:
- Script menjalankan dev server (`bun run --watch ...`).
- Script migrasi dan sinkronisasi skema database Drizzle (`drizzle-kit push` atau `drizzle-kit migrate`).

### Tahap 6: Verifikasi & Uji Coba
- Jalankan server dan lakukan request ke endpoint health check.
- Lakukan uji koneksi ke MySQL untuk memastikan integrasi Drizzle berjalan tanpa error.

---

## 📂 Rekomendasi Struktur Direktori (High-Level)
```text
.
├── src/
│   ├── db/              # Inisialisasi Drizzle, koneksi client, & skema
│   │   ├── index.ts
│   │   └── schema.ts
│   └── index.ts         # Entrypoint aplikasi ElysiaJS
├── .env.example
├── drizzle.config.ts    # Konfigurasi Drizzle Kit
├── package.json
├── tsconfig.json
└── README.md
```
