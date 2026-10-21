# Belajar Vibe Coding - Backend API

Backend starter project yang dibangun menggunakan runtime **Bun**, web framework **ElysiaJS**, ORM **Drizzle**, dan database **MySQL**.

## 🛠️ Tech Stack

- **Runtime:** [Bun](https://bun.com)
- **Web Framework:** [ElysiaJS](https://elysiajs.com)
- **Database & ORM:** [Drizzle ORM](https://orm.drizzle.team) + `mysql2`
- **Migration & Dev Tooling:** [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)
- **Language:** TypeScript

---

## 📂 Struktur Direktori

```text
.
├── drizzle/             # File migrasi SQL hasil generate Drizzle Kit
├── src/
│   ├── db/              # Koneksi Drizzle, pool MySQL, & definisi skema
│   │   ├── index.ts
│   │   └── schema.ts
│   └── index.ts         # Entrypoint aplikasi ElysiaJS
├── test/
│   └── index.test.ts    # Automated test suite
├── .env.example         # Template environment variables
├── .env                 # Environment variables lokal (diabaikan git)
├── drizzle.config.ts    # Konfigurasi Drizzle Kit
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Memulai (Quick Start)

### 1. Prasyarat
Pastikan runtime **Bun** telah terpasang di sistem:
```bash
bun --version
```

### 2. Instalasi Dependensi
```bash
bun install
```

### 3. Konfigurasi Lingkungan (.env)
Salin `.env.example` ke `.env` dan sesuaikan kredensial MySQL:
```bash
cp .env.example .env
```

Contoh konfigurasi:
```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=belajar_vibe_coding
```

---

## 📜 Perintah & Script (Scripts)

| Perintah | Deskripsi |
| :--- | :--- |
| `bun run dev` | Menjalankan server dalam watch mode (auto reload saat ada perubahan) |
| `bun run start` | Menjalankan server aplikasi production |
| `bun run build` | Melakukan compile & bundle aplikasi ke folder `dist/` |
| `bun run test` | Menjalankan automated test suite |
| `bun run typecheck` | Menjalankan typecheck TypeScript (`bun check`) |
| `bun run db:generate` | Menghasilkan file migrasi SQL berdasarkan perubahan skema di `src/db/schema.ts` |
| `bun run db:migrate` | Menerapkan migrasi database |
| `bun run db:push` | Sinkronisasi skema langsung ke database MySQL tanpa file migrasi |

---

## 🌐 Endpoint API

### 1. Root Info
- **URL:** `GET /`
- **Deskripsi:** Menampilkan informasi umum mengenai server, framework, dan runtime.
- **Contoh Respons:**
  ```json
  {
    "message": "Selamat datang di Belajar Vibe Coding API!",
    "runtime": "Bun",
    "framework": "ElysiaJS",
    "orm": "Drizzle ORM",
    "database": "MySQL",
    "status": "ok",
    "endpoints": {
      "health": "/health"
    }
  }
  ```

### 2. Health Check
- **URL:** `GET /health`
- **Deskripsi:** Memverifikasi kesehatan server dan konektivitas ke database MySQL.
- **Status Code:** `200 OK` (jika database terhubung), `503 Service Unavailable` (jika koneksi database gagal/terputus).
- **Contoh Respons (Connected):**
  ```json
  {
    "status": "healthy",
    "server": "running",
    "uptime": 12.34,
    "timestamp": "2026-10-21T12:00:00.000Z",
    "database": {
      "status": "connected",
      "message": "Database connected successfully"
    }
  }
  ```

### 3. Registrasi User Baru
- **URL:** `POST /api/users`
- **Deskripsi:** Mendaftarkan pengguna baru dengan password yang otomatis di-hash menggunakan bcrypt.
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "name": "Eko",
    "email": "eko@localhost",
    "password": "rahasia"
  }
  ```
- **Respons Sukses (`200 OK`):**
  ```json
  {
    "data": "OK"
  }
  ```
- **Respons Gagal (`400 Bad Request`):**
  ```json
  {
    "error": "Email sudah terdaftar"
  }
  ```

