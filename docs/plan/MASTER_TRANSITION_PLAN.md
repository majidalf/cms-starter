# Master Transition Plan: cms-starter

Dokumen ini disusun sebagai panduan teknis universal untuk mengarahkan agen AI lain (seperti Gemini atau OpenCode) dalam melanjutkan pengembangan, pemeliharaan, dan penambahan fitur pada proyek `cms-starter`.

---

## 1. Konteks Proyek & Arsitektur Eksisting
- **Nama Proyek:** `cms-starter` (Template korporat klien).
- **Stack Utama:**
  - **Frontend:** Next.js 16 (App Router) dengan Tailwind CSS v4 (token di `@theme` pada `globals.css`).
  - **Deployment / Hosting:** Cloudflare Workers via OpenNext (`wrangler.jsonc`).
  - **CMS:** Standalone Sanity Studio (`studio/` folder terpisah, tanpa workspace npm gabungan).
  - **Bahasa:** Bilingual (Default Inggris untuk kasus klien korporat tertentu, atau ID/EN dinamis via `[locale]`).
- **Status Integrasi Saat Ini:**
  - T0 - T4 (Setup, Sanity Schema, Routing i18n, Layout, Data Fetching & Caching) sudah selesai dan diverifikasi.
  - Test suite (115 unit tests Vitest, Lint, Prettier, TypeScript typecheck) lulus 100%.
  - Sanity schema validate: 0 errors, 0 warnings.
  - Server dev aktif di port 3000 dengan Cloudflare Tunnel publik aktif.

---

## 2. Evaluasi Fitur Eksisting (Audit)
| Fitur / Modul | Status | Catatan Teknis / Penanganan |
|---|---|---|
| **Sanity Studio (`studio/`)** | Stabil & Teruji | Skema bersih, dataset production (public-read), typegen & schema validate aktif. |
| **Next.js 16 App Router (`web/`)** | Stabil & Build OK | Menggunakan App Router, dynamic params `[locale]`, Turbopack aktif. |
| **Cloudflare Workers (OpenNext)** | Teruji Lokal | Kompatibel dengan wrangler preview & production build Workers. |
| **Testing & QA Gates** | Aktif & Hijau | Wajib menjalankan linter (`oxlint`/`eslint`), Prettier, Typecheck, dan Vitest sebelum commit. |

---

## 3. Rencana Pembaruan & Fitur Baru (Roadmap)
### A. Integrasi Desain dari pen.dev (Pencil.dev)
- **Tujuan:** Menyinkronkan file desain `.pen` atau spesifikasi komponen dari pen.dev ke dalam struktur kode komponen React/Tailwind v4 di `web/components/`.
- **Langkah Eksekusi:**
  1. Letakkan/ekspor spesifikasi atau aset dari pen.dev ke folder project.
  2. Gunakan design token yang selaras dengan tema (Navy `#081426`, Emas `#D99A2B`, dll.).
  3. Pastikan komponen modular dan mendukung aksesibilitas (a11y).

### B. Pengembangan Fitur Lanjutan (`T5` & Seterusnya)
- **Formulir Kontak (`T5b`):** Integrasi Resend (email delivery) dan Cloudflare Turnstile (captcha proteksi spam).
- **Analytics (`T5c`):** Pemasangan Cloudflare Web Analytics di layout utama.
- **Glosarium Terjemahan (`translationGlossary`):** Peningkatan modul terjemahan otomatis konten Sanity Studio.

---

## 4. Aturan Wajib untuk Agen Pengganti (Gemini/OpenCode/Lainnya)
1. **Jangan Menebak:** Selalu periksa file eksisting (`CLAUDE.md`, `STARTER_TEMPLATE_PLAN.md`, `ACTIVITY_LOG.md`) sebelum mengubah struktur.
2. **Jalankan Gate Sebelum Commit:** 
   - Di `web/`: `npm run lint && npm run format:check && npm run typecheck && npm run test && npm run build`
   - Di `studio/`: `npm run schema:validate && npm run build && npm test`
3. **Pertahankan Kualitas:** Jangan melewati hook atau menurunkan standar pengujian demi meloloskan kode cepat-cepat.
