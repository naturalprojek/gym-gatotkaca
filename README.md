# 🏋️ Gym Expert System - Gatot Kaca Gym

Sistem Pakar FitMind untuk rekomendasi latihan gym berbasis AI, dibangun dengan React + Vite + Supabase.

## 🚀 Deploy ke Netlify

Proyek ini sudah siap dideploy ke Netlify dengan **Netlify Functions** sebagai pengganti Express server.

### 1. Prasyarat

- Akun [Supabase](https://supabase.com) — database utama
- Akun [Netlify](https://netlify.com) — hosting
- Repository GitHub (push project ini ke GitHub terlebih dahulu)

### 2. Setup Database di Supabase

1. Buat project baru di Supabase
2. Buka **SQL Editor** dan jalankan semua query dari file `server/db.sql`
3. Catat **Project URL** dan **service_role key** dari:
   Settings → API → Project API keys

### 3. Deploy ke Netlify

#### Opsi A: Deploy via Netlify Dashboard

1. Login ke [app.netlify.com](https://app.netlify.com)
2. Klik **Add new site** → **Import an existing project**
3. Hubungkan dengan repository GitHub
4. Set konfigurasi build (otomatis terbaca dari `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
5. Klik **Advanced** → **Environment variables**, lalu tambahkan:

#### Opsi B: Deploy via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login ke akun Netlify
netlify login

# Init site (dari project folder)
netlify init

# Deploy
netlify deploy --prod
```

### 4. Environment Variables (wajib)

Set variabel berikut di **Netlify Dashboard → Site settings → Environment variables**:

| Variable | Deskripsi |
|----------|-----------|
| `SUPABASE_URL` | URL project Supabase (https://your-project.supabase.co) |
| `SUPABASE_SERVICE_KEY` | Service Role Key dari Supabase (jangan pernah expose ke frontend!) |
| `JWT_SECRET` | Secret key untuk JWT token (gunakan string random yang kuat) |
| `VITE_API_URL` | **Set ke `/api`** agar frontend menggunakan relative path ke Netlify Functions |

> ⚠️ **WAJIB set `VITE_API_URL=/api`** di Netlify! Jika tidak diisi, frontend akan mencoba `http://localhost:4000/api` yang tidak ada di production sehingga semua API call gagal.

### 5. Struktur API (Netlify Functions)

File `server/index.js` (Express) **tidak digunakan** di Netlify. Sebagai gantinya:

```
📁 netlify/
  📁 functions/
    📄 api.js    ← Serverless function (Express + serverless-http)
📄 netlify.toml  ← Konfigurasi build & redirect
```

Semua route `/api/*` otomatis di-redirect ke `/.netlify/functions/api/:splat`.

### 6. Testing Lokal dengan Netlify Dev

Untuk testing serverless function secara lokal:

```bash
npm install -g netlify-cli
netlify dev
```

Perintah ini akan menjalankan Vite dev server + Netlify Functions secara simultan.

## 🛠️ Development Lokal

### Setup
```bash
# Copy environment variables
cp .env.example .env

# Edit .env dengan credentials Supabase kamu
# SUPABASE_URL, SUPABASE_SERVICE_KEY, JWT_SECRET

# Jalankan backend (Express server)
npm run server

# Terminal terpisah - jalankan frontend
npm run dev
```

### Default Admin
- **Email:** `gatotkaca@gmail.com`
- **Password:** `adminmin123`

> Admin akan dibuat otomatis saat pertama kali server dijalankan.

## 📁 Struktur Proyek

```
📁 src/
  📁 components/     ← Komponen React
  📁 context/        ← Context (Auth)
  📁 logic/          ← Expert system, exercise data
  📁 pages/          ← Halaman (Home, Login, Admin, dll)
📁 server/
  📄 index.js        ← Express API (development lokal)
  📄 db.sql          ← SQL untuk setup Supabase
📁 netlify/
  📁 functions/
    📄 api.js        ← Serverless function (Netlify)
📄 netlify.toml      ← Konfigurasi Netlify
📄 .env.example      ← Template environment variables
```

## 🧩 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registrasi user baru |
| POST | `/api/auth/login` | Login user |
| GET | `/api/albums` | Ambil semua album |
| POST | `/api/albums` | Tambah foto album |
| PUT | `/api/albums/:id` | Edit foto album |
| DELETE | `/api/albums/:id` | Hapus foto album |
| GET | `/api/comments` | Ambil semua komentar |
| POST | `/api/comments` | Kirim komentar |
| DELETE | `/api/comments/:id` | Hapus komentar |
| GET | `/api/users` | Ambil semua user (admin) |
| PUT | `/api/users/:id` | Edit user (admin) |
| DELETE | `/api/users/:id` | Hapus user (admin) |
