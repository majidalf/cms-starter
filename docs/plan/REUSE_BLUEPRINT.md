# Reuse Blueprint: cms-starter as Base for New Client Projects

Panduan operasional dan arsitektur ini mendefinisikan cara mendaur ulang (*reuse*) repositori `cms-starter` sebagai templat dasar (*base template*) untuk setiap proyek website korporat klien baru ke depannya.

---

## 1. Filosofi & Alasan Daur Ulang (`cms-starter` sebagai Base)
Alih-alih memulai dari awal (*scratch*), `cms-starter` menyediakan struktur siap pakai yang telah teruji secara performa dan keamanan:
- **Zero-Config Deployment:** Siap dideploy ke Cloudflare Workers lewat OpenNext dengan performa *edge* yang sangat cepat.
- **Bilingual Native:** Struktur multibahasa (ID/EN) dengan routing dinamis `[locale]`.
- **Decoupled CMS:** Menggunakan Sanity Studio terpisah untuk memudahkan klien mengelola konten tanpa merusak struktur frontend.
- **Strict Quality Gates:** Sudah dilengkapi rangkaian tes otomatis (Vitest, Playwright, Linter, Prettier) yang menjamin kode bebas error.

---

## 2. Langkah-Langkah Kloning & Inisialisasi Proyek Baru

Saat mendapatkan klien baru (misalnya Klien: `[Nama Klien]`), ikuti prosedur berikut di VPS atau mesin lokal:

### Step 1: Buat Repo Baru dari Template
1. Buat repositori privat baru di GitHub/GitLab (misalnya `cms-[nama-klien]`).
2. Clone `cms-starter` sebagai basis atau jadikan `cms-starter` sebagai *template repository* di GitHub.
   ```bash
   git clone https://github.com/majidalf/cms-starter.git cms-[nama-klien]
   cd cms-[nama-klien]
   ```
3. Ganti remote origin ke repository baru klien:
   ```bash
   git remote set-url origin https://github.com/majidalf/cms-[nama-klien].git
   ```

### Step 2: Konfigurasi Identitas Proyek Baru
1. **Ganti Placeholder di Konfigurasi:**
   - Perbarui nama proyek di `web/package.json` dan `studio/package.json`.
   - Perbarui konfigurasi Worker di `web/wrangler.jsonc` (ubah nama Worker sesuai nama klien).
2. **Setup Sanity Project Baru:**
   - Buat project baru di dashboard Sanity untuk klien tersebut.
   - Perbarui `ProjectId` di file env:
     - `web/.env.local` (`NEXT_PUBLIC_SANITY_PROJECT_ID`)
     - `studio/.env` (`SANITY_STUDIO_PROJECT_ID`)

### Step 3: Instalasi Dependensi & Validasi Awal
Jalankan perintah instalasi di kedua folder secara terpisah (karena tidak menggunakan npm workspaces):
```bash
cd web && npm ci
cd ../studio && npm ci
```
Jalankan tes validasi awal untuk memastikan templat siap dikustomisasi:
```bash
cd web && npm run lint && npm run typecheck && npm run test && npm run build
cd ../studio && npm run schema:validate && npm run build
```

---

## 3. Kustomisasi Per-Klien (Customization Checklist)
Setiap kali mengadopsi base ini untuk klien baru, lakukan penyesuaian berikut:

1. **Design Tokens & Tema (`web/app/globals.css`):**
   - Sesuaikan variabel warna `@theme` (Primary, Secondary, Accent, Background) berdasarkan *brand guidelines* atau file desain klien dari `pen.dev`.
2. **Konten Model / Skema Sanity (`studio/schemaTypes/`):**
   - Sesuaikan dokumen *services*, *team/leadership*, *case studies*, atau *insights* dengan kebutuhan spesifik industri klien (misal: firma hukum, manufaktur, properti/vila, dll.).
3. **Bahasa Default:**
   - Ubah konfigurasi bahasa default situs (`id` atau `en`) di *middleware* atau *routing config* sesuai preferensi regional klien.

---

## 4. Standar Pemeliharaan & Git Workflow
- Gunakan konvensional commit (`feat:`, `fix:`, `docs:`, `refactor:`).
- Pastikan setiap perubahan besar mematuhi *Quality Gates* (linter, typecheck, unit test lulus) sebelum di-push ke branch utama.
