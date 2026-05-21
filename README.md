# SIRIS (Sistem Informasi Pelaporan Pelanggaran QRIS) — Web Frontend

Platform pelaporan pelanggaran Merchant Discount Rate (MDR) QRIS berbasis web untuk mendukung pengawasan kepatuhan merchant di Indonesia.

## Latar Belakang & Masalah

Kebijakan Bank Indonesia (PBI No. 23/6/PBI/2021) secara tegas melarang pedagang untuk membebankan biaya tambahan (surcharge) kepada konsumen yang bertransaksi menggunakan QRIS. Biaya MDR (Merchant Discount Rate) sepenuhnya adalah kewajiban pedagang. Namun di lapangan, masih banyak merchant nakal yang mengalihkan beban ini ke konsumen.

SIRIS hadir untuk menjembatani perlindungan konsumen. Sistem ini memberdayakan konsumen untuk berani melaporkan praktik curang, sekaligus menjadi alat bagi regulator (Bank Indonesia / OJK) dalam mengawasi dan menindaklanjuti laporan pelanggaran.

## Tech Stack

- **Framework:** React 19 + Vite + TypeScript
- **Styling:** Tailwind CSS v4 + `@tailwindcss/vite`
- **Routing:** React Router v7
- **State Management:** Zustand
- **Auth:** Better Auth (Client-side integration)
- **Data Fetching:** `@tanstack/react-query`
- **UI Components:** Shadcn UI + Radix UI + Lucide React
- **Linting & Formatting:** Oxlint & Oxfmt

## Cara Menjalankan (Development)

1. **Lakukan Instalasi Dependensi:**

   ```bash
   bun install
   ```

2. **Konfigurasi Environment Variables:**

   Buat file `.env` di root folder `web-SIRIS` berdasarkan file `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Sesuaikan nilai `VITE_API_URL` ke URL API backend Anda (lokal default: `http://localhost:8000`).

3. **Jalankan Server Lokal (Development):**

   ```bash
   bun run dev
   ```

4. **Build untuk Produksi:**

   ```bash
   bun run build
   ```

5. **Lint & Format:**
   ```bash
   bun run fl
   bun run check
   ```

## Deployment di Vercel

Aplikasi web ini siap dideploy ke **Vercel**. Pastikan konfigurasi di bawah ini telah disesuaikan di dashboard Vercel:

1. **Framework Preset:** Pilih `Vite` atau `Other` (jika terdeteksi otomatis sebagai Vite).
2. **Build & Development Settings:**
   - **Build Command:** `bun run build` atau `tsc && vite build`
   - **Output Directory:** `dist`
   - **Install Command:** `bun install`
3. **Environment Variables:**
   Tambahkan key berikut di bagian settings Vercel:
   - `VITE_API_URL`: URL API backend Anda yang sudah online (misalnya: `https://api-siris.torikhnaser42.workers.dev`).
4. **Single Page Application Routing:**
   File `vercel.json` telah disediakan untuk mengatur rewrite rules agar routing dari React Router v7 berjalan dengan mulus di Vercel tanpa error 404 saat melakukan refresh halaman.
