# cms-starter

Template untuk website klien korporat: **Next.js 16 di Cloudflare Workers + Sanity CMS**, dua bahasa (Indonesia + Inggris).

> **Status: skeleton (fase T1).** Belum siap dipakai untuk project klien. Content model, routing dua bahasa, QA, CI, dan setup script menyusul di fase T2–T6. Lihat [docs/plan/STARTER_TEMPLATE_PLAN.md](docs/plan/STARTER_TEMPLATE_PLAN.md) Section 10.

## Struktur

| Folder | Isi |
|---|---|
| `web/` | Situs Next.js (App Router), di-deploy ke Cloudflare Workers via OpenNext. Membaca konten dari Sanity (read-only) |
| `studio/` | Sanity Studio standalone untuk editor konten |
| `docs/plan/` | Rencana template dan semua keputusan desainnya |

Keduanya project npm terpisah, masing-masing dengan `package.json` dan lockfile sendiri.

## Menjalankan skeleton secara lokal

```bash
# web
cd web
cp .env.example .env.local        # isi NEXT_PUBLIC_SANITY_PROJECT_ID
npm install
npm run dev                       # http://localhost:3000

# studio
cd studio
cp .env.example .env              # isi SANITY_STUDIO_PROJECT_ID
npm install
npm run dev                       # http://localhost:3334
```

## Catatan Windows

Kalau `next build` menampilkan warning `Failed to parse JSON file ...`, hapus `.next` dan `.open-next` lalu build ulang sebelum deploy. Ini race condition file di Windows yang diketahui dari majidalf.com; di CI (Linux) tidak terjadi.
