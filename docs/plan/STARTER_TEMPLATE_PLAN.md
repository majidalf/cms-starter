# Starter Template Plan — Next.js + Sanity + Cloudflare Workers

> **Status:** Rencana final, belum ada kode. Dibuat 2026-10-04. Semua keputusan T0 (D-1 s.d. D-8) sudah diambil 2026-10-04 — lihat Section 11.
> **Tujuan dokumen:** menjadi acuan sebelum template repo dibuat, supaya isi, batasan, dan urutan kerjanya disepakati dulu.
> **Segmen target:** website klien korporat formal — lihat [CORPORATE_CLIENT_PLAN.md](CORPORATE_CLIENT_PLAN.md).
> **Sumber pola:** `web-majidalf.com/` dan `studio-majidalf.com/` di repo majidalf.com (lihat `documentation/project_architecture.md` Section 5 di sana).

---

## 1. Tujuan

Membuat satu template repo yang memungkinkan project website baru:

1. Dimulai dari stack yang sudah terbukti di majidalf.com (Next.js App Router di Cloudflare Workers, Sanity sebagai CMS, Studio terpisah).
2. Sudah membawa QA, CI, security headers, SEO dasar, dan dokumentasi sejak hari pertama — tidak ditambal belakangan.
3. Bisa sampai ke **Worker live dengan konten contoh dalam waktu kurang dari 1 jam** hanya dengan mengikuti README.

**Bukan tujuan:**
- Bukan design system. Template sengaja netral secara visual; desain dibuat per project.
- Bukan multi-tenant. Satu repo + satu Sanity project + satu Worker per website/klien.
- Bukan shared npm package (belum). Lihat Section 9.

---

## 2. Apa yang diambil dari majidalf.com

### 2.1 Diambil hampir apa adanya

| Sumber di repo majidalf.com | Tujuan di template | Catatan |
|---|---|---|
| `web-majidalf.com/lib/sanity/client.ts` | `web/lib/sanity/client.ts` | Sudah baca dari env, tanpa hardcode |
| `web-majidalf.com/lib/sanity/image.ts`, `imageLoader.ts` | `web/lib/sanity/` | Loader ke Sanity CDN — wajib karena `sharp` tidak jalan di Workers |
| `web-majidalf.com/lib/sanity/portableText.ts`, `components/PortableTextRenderer.tsx` | sama | Styling dinetralkan |
| `web-majidalf.com/open-next.config.ts` | `web/open-next.config.ts` | R2 (incremental cache) + D1 (tag cache) |
| `web-majidalf.com/migrations/0001_create_revalidations.sql` | `web/migrations/` | Schema tabel D1 tag cache |
| `web-majidalf.com/qa-config/.oxlintrc.json`, `.prettierrc.json` | `web/qa-config/` | Hapus `ignorePatterns` yang spesifik |
| `web-majidalf.com/public/_headers` | `web/public/_headers` | Ditambah security headers (Section 5.4) |
| Script npm `lint`, `format`, `format:check`, `cf:preview`, `cf:deploy`, `cf:typegen` | `web/package.json` | Ditambah `typecheck`, `test`, `test:e2e` |
| `studio-majidalf.com/schemaTypes/objects/{seo,link,socialLink,blockContent}.ts` | `studio/schemaTypes/objects/` | Komentar migrasi MySQL dihapus |

### 2.2 Diambil lalu diubah (generalisasi)

| Item | Masalah di majidalf.com | Perubahan di template |
|---|---|---|
| `app/api/revalidate/route.ts` | `switch` per `_type` hardcoded di handler | Handler generik + `web/lib/revalidate.config.ts` berisi peta `_type → paths(doc)`. Project baru cukup mengubah peta ini |
| `siteSettings` | Berisi field portfolio (`expertise`, `partnerLogos`, `servicesSection`, `cta`, `portfolioPdf`) | Hanya field generik: identitas organisasi, kontak, logo, social links, default SEO, analytics |
| Singleton `siteSettings` | Belum di-enforce (masih TODO di schema) | Enforce via `structureTool` custom structure: pinned, tanpa "create new", tanpa delete |
| `queries.ts` | Interface TypeScript ditulis manual, bisa tidak sinkron dengan schema | Pakai `defineQuery` + `sanity typegen generate` sehingga tipe dihasilkan dari schema |
| `sanity.config.ts` / `sanity.cli.ts` | `projectId`, `appId`, title hardcoded | Dibaca dari env (`SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`) |
| `wrangler.jsonc` | Nama Worker, bucket, D1 id hardcoded | Placeholder `{{WORKER_NAME}}`; `database_id` diisi saat provisioning |
| `next.config.ts` | Ada redirect `/case-studies` + komentar monorepo khusus | Redirect dihapus; `turbopack.root` tetap (folder `web/` punya lockfile sendiri) |

### 2.3 Tidak diambil

- Semua schema dokumen spesifik portfolio (`project`, `post`, `service`, `partnerLogo`). Diganti `page` generik (Section 4.2) dan preset korporat (Section 4.3).
- Semua komponen visual: `components/sections/*`, `components/templates/*`, framer-motion, Unicorn Studio, `lib/theme/*`.
- `lib/analytics.ts` versi WhatsApp/Meta Pixel — diganti modul analytics opsional (Section 5.6).
- Seluruh stack lama (Vite, PHP, MySQL, `scripts/migrate-to-sanity/`).

---

## 3. Struktur repo template

Mengikuti pola majidalf.com: dua folder sibling, masing-masing dengan `package.json` dan lockfile sendiri. **Tanpa** npm workspaces / Turborepo — pola ini sudah terbukti berjalan dan lebih sederhana.

```bash
cms-starter/
├── web/                              # Next.js 16 (App Router) → Cloudflare Workers
│   ├── app/
│   │   ├── [locale]/                 # id | en — semua halaman di bawah sini (Section 4.4)
│   │   │   ├── layout.tsx            # <html lang>, metadata default dari siteSettings
│   │   │   ├── page.tsx              # Home (render dokumen page dengan slug "home")
│   │   │   ├── [slug]/page.tsx       # halaman generik dari dokumen `page`
│   │   │   ├── about/leadership/     # ┐
│   │   │   ├── services/[slug]/      # │ preset korporat (Section 4.3)
│   │   │   ├── industries/[slug]/    # │ hapus folder yang tidak dipakai klien
│   │   │   ├── case-studies/[slug]/  # │
│   │   │   ├── insights/[slug]/      # │
│   │   │   ├── careers/, contact/    # ┘
│   │   │   └── not-found.tsx
│   │   ├── sitemap.ts, robots.ts     # dari Sanity, kedua bahasa + hreflang
│   │   └── api/revalidate/route.ts   # handler generik
│   ├── components/
│   │   ├── PortableTextRenderer.tsx
│   │   ├── sections/                 # renderer per section page builder (Section 4.2)
│   │   └── ui/                       # primitive tanpa gaya khusus (Container, Button, Heading)
│   ├── lib/
│   │   ├── sanity/                   # client, image, imageLoader, portableText, queries
│   │   ├── seo.ts                    # buildMetadata() + helper JSON-LD + alternates/hreflang
│   │   ├── i18n.ts                   # daftar locale, default locale, kamus teks UI (id/en)
│   │   ├── routes.ts                 # nama route di satu tempat (Section 4.3)
│   │   └── revalidate.config.ts      # peta _type → paths
│   ├── sanity.types.ts               # hasil `sanity typegen` (di-commit)
│   ├── migrations/0001_create_revalidations.sql
│   ├── tests/
│   │   ├── unit/                     # Vitest
│   │   └── e2e/                      # Playwright (smoke + a11y)
│   ├── qa-config/
│   ├── public/_headers
│   ├── next.config.ts, open-next.config.ts, wrangler.jsonc
│   ├── .env.example, .dev.vars.example
│   └── package.json
├── studio/                           # Sanity Studio standalone
│   ├── schemaTypes/{documents,objects}/
│   ├── structure.ts                  # singleton + urutan menu
│   ├── sanity.config.ts, sanity.cli.ts
│   ├── seed/                         # konten contoh (NDJSON) untuk `sanity dataset import`
│   └── package.json
├── scripts/
│   └── setup.mjs                     # ganti placeholder, cetak langkah provisioning
├── docs/                             # lihat Section 7
├── .gitlab-ci.yml                    # lihat Section 6
├── CLAUDE.md                         # instruksi agent untuk project turunan
└── README.md
```

### 3.1 Membuat project baru dari template (GitLab)

GitLab tidak punya tombol "Use this template" seperti GitHub. Fitur *custom project templates* tingkat group/instance bergantung paket GitLab, jadi **cek paket yang dipakai** sebelum mengandalkannya. Cara yang selalu bisa dipakai di paket mana pun:

```bash
git clone git@gitlab.com:<namespace>/cms-starter.git <nama-project-baru>
cd <nama-project-baru>
rm -rf .git && git init -b main          # mulai history baru, tidak membawa history template
node scripts/setup.mjs                   # ganti placeholder (Section 8)
git remote add origin git@gitlab.com:<namespace>/<nama-project-baru>.git
git add . && git commit -m "chore: init from cms-starter" && git push -u origin main
```

Catat versi template yang dipakai (tag atau commit hash `cms-starter`) di `README.md` project baru. Ini dibutuhkan saat nanti mem-port perbaikan dari template (Section 9).

---

## 4. Content model dasar

### 4.1 Objects (generik, dipakai ulang)

| Object | Field | Asal |
|---|---|---|
| `seo` | metaTitle, metaDescription, canonicalUrl, ogImage, `noIndex` (baru). Field teks dalam versi id/en. `keywords` dihapus (tidak dipakai mesin pencari) | majidalf.com |
| `link` | text, href, `isExternal` (baru) | majidalf.com |
| `socialLink` | platform, url | majidalf.com |
| `blockContent` | Portable Text + image + link annotation | majidalf.com |
| `imageWithAlt` (baru) | image + `alt` wajib | Baru — supaya alt text tidak bisa kosong (a11y) |
| `address` (baru) | street, city, province, postalCode, country, mapUrl | Baru — umum untuk situs perusahaan |
| `localeString`, `localeText`, `localeBlockContent`, `localeSlug` (baru) | Field `id` + `en` | Baru — dasar dwibahasa (Section 4.4) |

### 4.2 Documents

| Document | Fungsi |
|---|---|
| `siteSettings` (singleton) | Nama organisasi, nama legal, logo, kontak utama, alamat, social links, default SEO, ID analytics, teks footer/disclaimer |
| `navigation` (singleton) | Menu header + footer (array `link`). Di majidalf.com menu masih hardcoded di komponen |
| `page` | Halaman generik: `title`, `slug`, `seo`, `sections[]` |

**Page builder terbatas.** `page.sections[]` hanya berisi beberapa tipe section netral: `heroSection`, `richTextSection`, `ctaSection`, `featureListSection`, `imageTextSection`. Setiap project menambah section sesuai kebutuhannya.

Alasan dibatasi: page builder yang terlalu bebas membuat editor bisa merusak layout, terutama untuk klien formal yang butuh konsistensi. Koleksi yang terstruktur (misalnya `person`, `service`, `insight`) **tetap** dibuat sebagai document type sendiri, bukan section (Section 4.3).

### 4.3 Preset korporat (default, keputusan D-6)

Karena segmen target adalah klien korporat formal, template langsung membawa koleksi korporat beserta halaman, query, dan seed data-nya. Detail field ada di [CORPORATE_CLIENT_PLAN.md](CORPORATE_CLIENT_PLAN.md) Section 4.2.

| Document | Halaman di `web/app/` |
|---|---|
| `person` | `/about/leadership` (+ vCard per orang) |
| `service` | `/services`, `/services/[slug]` |
| `industry` | `/industries`, `/industries/[slug]` |
| `caseStudy` | `/case-studies`, `/case-studies/[slug]` — query hanya mengambil `clientConsent == true` |
| `insight` | `/insights`, `/insights/[slug]` |
| `office` | `/contact`, footer |
| `jobOpening` | `/careers` |
| `credential` | section di `/about` — query hanya mengambil `approvedForDisplay == true` |

Aturan preset:
- **Nama schema tetap generik, label disesuaikan per klien.** Misalnya `service` diberi `title: 'Practice Area'` untuk law firm. Query, komponen, dan test tidak perlu diubah.
- **Penamaan route** (`/services` vs `/practice-areas` vs `/solutions`) diatur di satu tempat (`web/lib/routes.ts`), yang dipakai oleh link, sitemap, dan `revalidate.config.ts`. Mengganti nama route cukup di file itu dan nama folder `app/`.
- **Menghapus koleksi yang tidak dipakai** didokumentasikan sebagai checklist di `docs/NEW_PROJECT_CHECKLIST.md`: hapus schema, folder route, query, entri revalidate map, dan seed data terkait.
- **Halaman preset tetap netral secara visual.** Strukturnya lengkap dan aksesibel, tetapi desainnya dibuat per project.

### 4.4 Dwibahasa Indonesia + Inggris (keputusan D-3)

Setiap project dari template **selalu** dua bahasa: Indonesia (`id`, default) dan Inggris (`en`). Ini bagian inti template, bukan modul opsional.

**URL**
- Semua halaman berada di bawah prefix bahasa: `/id/...` dan `/en/...`.
- `/` di-redirect ke `/id` lewat `redirects()` di `next.config.ts` (307, tidak permanen). `proxy.ts` tidak dipakai karena redirect statis sudah cukup. Prefix lain yang tidak valid menghasilkan 404 lewat `isLocale()` di layout.
- **Jangan pakai `dynamicParams = false` di layout `[locale]`.** Setting itu ikut memblokir route anak yang belum di-prerender, sehingga halaman yang baru di-publish akan 404 sampai build berikutnya. Bug ini ditemukan dan diperbaiki saat T2a.
- Segmen route sama di kedua bahasa (`/id/services/...` dan `/en/services/...`); hanya slug konten yang berbeda per bahasa. Segmen route yang diterjemahkan (misalnya `/id/layanan`) sengaja tidak dibuat di versi awal karena menambah kerumitan routing. Kalau klien membutuhkannya, bisa ditambahkan lewat `lib/routes.ts`.
- Tombol ganti bahasa di header membawa pengunjung ke halaman padanannya, bukan kembali ke Home.

**Konten di Sanity: terjemahan per field, bukan per dokumen**
- Satu dokumen berisi kedua bahasa. Contoh: `service.title` bertipe `localeString` dengan field `id` dan `en`. Di Studio, editor melihat kedua bahasa berdampingan di dokumen yang sama.
- Pendekatan ini dipilih daripada terjemahan per dokumen (`@sanity/document-internationalization`) supaya relasi antar dokumen tetap satu. Referensi `person` → `service` cukup dibuat sekali, tanpa perlu menautkan versi ID dan EN masing-masing. Gambar, tanggal, urutan, dan flag persetujuan juga tidak terduplikasi.
- Hanya field teks yang diterjemahkan. Field seperti foto, tanggal, email, dan `clientConsent` hanya ada satu.
- **Validasi:** kedua bahasa wajib diisi sebelum dokumen bisa di-publish. Tidak ada fallback diam-diam ke bahasa lain, supaya pengunjung tidak melihat halaman dengan bahasa campuran.
  - Setiap tipe punya dua varian: `localeString` (opsional, tapi kalau satu bahasa diisi semua wajib) dan `requiredLocaleString` (wajib di semua bahasa). Sama untuk `localeText` dan `localeBlockContent`.
  - **Aturan dipasang di field per-bahasa (`title.id`, `title.en`), bukan di object-nya.** Temuan T2a: aturan pada nilai bertipe object (termasuk `Rule.required()` bawaan dan `.error()` eksplisit) selalu dilaporkan sebagai *warning*, yang tidak memblokir publish. Aturan pada field primitif dilaporkan sebagai *error*. Diuji dengan `sanity documents validate`; perilaku tombol Publish di Studio dicek ulang secara manual di T6.
  - Konsekuensinya, `Rule.required()` pada field object seperti gambar wajib (`imageTextSection.image`) atau tombol (`ctaSection.cta`) hanya menjadi warning. Renderer menangani nilai kosong tanpa error.
- **Slug per bahasa berupa string, bukan tipe `slug` Sanity** (karena `slug` adalah object, lihat poin di atas). Validasinya: wajib, format `huruf-kecil-dengan-tanda-hubung`, dan unik per bahasa. Sebagai pengganti tombol "Generate", pesan error menampilkan saran slug yang dibuat dari judul di bahasa yang sama.
- Query mengambil kedua bahasa, lalu komponen memilih satu bahasa lewat `localize(value, locale)` di `lib/sanity/localize.ts`. Ini menggantikan rencana awal `title[$locale]` di GROQ, karena tipe dari typegen jadi lebih tepat dan query lebih sederhana. Filter slug tetap di GROQ: `slug[$locale] == $slug`.
- **Home page** dipilih lewat referensi `siteSettings.homePage`, bukan slug khusus `home`. Mengganti nama slug tidak akan memutus halaman utama.

**Teks UI** (label tombol, menu statis, pesan form) disimpan di kamus `lib/i18n.ts`, bukan di Sanity. Teks yang perlu bisa diubah klien (menu, footer, disclaimer) tetap di Sanity sebagai field dwibahasa.

**SEO**
- `<html lang>` sesuai bahasa halaman.
- Setiap halaman punya `alternates.languages` (hreflang `id`, `en`, dan `x-default` → `id`) lewat `lib/seo.ts`.
- Sitemap memuat kedua versi setiap halaman.

**Dampak ke bagian lain template**
- `revalidate.config.ts` me-revalidate path kedua bahasa sekaligus.
- Seed data berisi konten contoh dalam kedua bahasa.
- E2E menguji kedua locale, tombol ganti bahasa, dan keberadaan hreflang.
- `docs/CMS_GUIDE.md` menjelaskan cara mengisi kedua bahasa.

### 4.5 Bantuan terjemahan ID → EN (keputusan D-7 dan D-8)

Mesin membuat draf terjemahan, manusia wajib mereview sebelum publish. Terjemahan **tidak pernah** langsung live tanpa dicek.

**Alur di Studio (semi-otomatis)**
1. Editor mengisi atau mengubah versi Indonesia.
2. Editor klik tombol **"Terjemahkan ke EN"** (custom document action di Studio).
3. Field EN terisi hasil terjemahan mesin dengan status `auto`.
4. Editor mengecek dan merapikan EN, lalu menandainya `reviewed`.
5. Dokumen di-publish.

**Status terjemahan per field EN**

| Status | Arti |
|---|---|
| `auto` | Hasil mesin, belum dicek manusia |
| `reviewed` | Sudah dicek manusia |
| `stale` | Versi ID berubah setelah EN berstatus `reviewed` (dideteksi lewat hash teks sumber yang disimpan saat review) |

- Dokumen **tidak bisa di-publish** kalau masih ada field EN berstatus `auto` atau `stale`.
- Terjemahan ulang hanya mengisi field yang dipilih editor. EN yang sudah `reviewed` tidak pernah ditimpa diam-diam.

**Mesin terjemahan: Cloudflare Workers AI (D-8)**
- Dijalankan lewat binding `AI` di Worker yang sama. Tidak perlu API key atau akun layanan lain, dan konten klien tidak keluar dari Cloudflare.
- Paket gratis Cloudflare memberi kuota harian Workers AI. Untuk pemakaian editor yang sesekali menekan tombol, kuota ini seharusnya cukup. **Angka kuota dan daftar model dicek ulang di dokumentasi resmi saat T5.**
- Kandidat model (dibandingkan saat T5 memakai beberapa contoh teks korporat):
  - LLM open-source instruct (keluarga Llama/Mistral/Gemma di katalog Workers AI). Bisa diberi glosarium istilah klien dan instruksi tone formal, serta bisa menjaga struktur Portable Text (heading, link, bold).
  - `m2m100` (model khusus terjemahan) sebagai cadangan yang lebih ringan. Kualitasnya biasanya di bawah LLM, dan tidak bisa diberi instruksi.
- Glosarium per klien (misalnya nama layanan, jabatan, istilah hukum yang tidak boleh diterjemahkan) disimpan di Sanity sebagai dokumen `translationGlossary` dan ikut dikirim ke model.
- Mesin dibungkus interface `web/lib/translate/` (`translate(text, { from, to, glossary })`), sehingga per klien bisa diganti ke layanan berbayar (DeepL, Claude) tanpa mengubah Studio. Pakai layanan berbayar kalau klien butuh kualitas lebih tinggi atau kuota gratisnya tidak cukup.

**Keamanan endpoint**
- Tombol Studio memanggil `POST /api/translate` di Worker.
- Endpoint memverifikasi token user Sanity yang dikirim Studio (harus anggota project Sanity tersebut), lalu menerapkan rate limit per user. Tujuannya supaya endpoint tidak bisa dipakai pihak luar untuk menghabiskan kuota.
- Endpoint tidak menulis ke Sanity. Hasil terjemahan dikembalikan ke Studio, dan Studio yang mengisi field atas nama editor yang sedang login.

**Tidak dipakai:** free tier API LLM eksternal (misalnya Gemini free tier). Beberapa penyedia boleh memakai data dari free tier untuk melatih model, sementara draf konten klien korporat bisa bersifat rahasia sebelum terbit (misalnya siaran pers atau aksi korporasi).

---

## 5. Lapisan non-fungsional yang dibawa template

### 5.1 QA

| Gate | Tool | Status di majidalf.com | Di template |
|---|---|---|---|
| Lint | oxlint (`qa-config/.oxlintrc.json`) | ✅ ada | ✅ |
| Format | Prettier | ✅ ada | ✅ |
| Typecheck | `tsc --noEmit` | ❌ tidak ada script terpisah | ✅ `npm run typecheck` |
| Schema | `sanity schema validate` | manual | ✅ di CI |
| Unit test | Vitest | ❌ tidak ada | ✅ untuk `lib/` (revalidate map, image loader, seo helper) |
| E2E smoke | Playwright | ❌ tidak ada | ✅ setiap route 200, `<title>` dan meta ada, tidak ada error console |
| Accessibility | `@axe-core/playwright` | ❌ | ✅ tidak boleh ada pelanggaran serious/critical |
| Performance | Lighthouse CI | ❌ (gate Phase 4.6 belum dijalankan) | ✅ budget: Performance/A11y/SEO/Best Practices ≥ 90 |

Target coverage unit test 80% hanya untuk `web/lib/**`. Komponen visual diuji lewat E2E/a11y, bukan snapshot.

### 5.2 Rendering dan cache

- Server Components fetch langsung via GROQ, dibungkus `cache()` dari React (pola `queries.ts`).
- Revalidasi via webhook Sanity → `revalidatePath`. Tetap `revalidatePath`, bukan `revalidateTag`, karena `@sanity/client` tidak lewat `fetch` yang di-patch Next (alasan lengkap ada di komentar `route.ts` majidalf.com).
- Webhook diverifikasi dengan `@sanity/webhook` `isValidSignature`.

### 5.3 SEO

- `lib/seo.ts`: `buildMetadata(seo, fallback)` dipakai semua `generateMetadata`.
- `app/sitemap.ts` dan `app/robots.ts` dihasilkan dari Sanity. Di situs lama, `sitemap.xml` sempat error 500.
- Helper JSON-LD: `Organization`, `WebSite`, `BreadcrumbList`. Tipe yang spesifik (misalnya `LegalService`) ditambah per project.
- Dataset non-production dan preview deployment otomatis `noindex`.

### 5.4 Security

- `public/_headers` atau `headers()` di `next.config.ts`: HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options: DENY`, dan CSP dasar (izinkan `cdn.sanity.io`).
- Tidak ada token Sanity di frontend. Dataset public-read; token write hanya ada di CI/script bila diperlukan.
- Secret hanya di `.dev.vars` (lokal) dan `wrangler secret put` (production). `.env.example` tidak berisi nilai asli.
- **Pelajaran dari majidalf.com:** jangan pernah menaruh contoh credential di dokumentasi (lihat Known Issues di `project_architecture.md`).

### 5.5 Modul opsional (dinyalakan per project)

Modul ini ada di template tapi dimatikan secara default, supaya tidak membebani project yang tidak membutuhkannya.

| Modul | Isi | Kenapa opsional |
|---|---|---|
| `contact-form` | Server Action → Resend via HTTP API (D-5), Cloudflare Turnstile, honeypot, validasi zod, checkbox persetujuan data | majidalf.com tidak pakai form (WhatsApp saja). Workers tidak bisa SMTP mentah |
| `analytics` | Cloudflare Web Analytics (cookieless) sebagai default, GA4 opsional di balik consent | GA4 butuh consent banner (UU PDP) |

### 5.6 Analytics dan privasi

Default-nya Cloudflare Web Analytics karena tidak memakai cookie, sehingga tidak perlu consent banner. GA4/GTM/Meta Pixel hanya dinyalakan kalau klien memang butuh, dan selalu di balik consent.

### 5.7 Tailwind 4 (keputusan D-4)

Template memakai Tailwind 4, berbeda dari majidalf.com yang masih di 3.4. Konsekuensinya:

- **Konfigurasi berbasis CSS.** Tidak ada `tailwind.config.ts`. Design token (warna, font, spacing) didefinisikan di `app/globals.css` lewat `@theme`, sehingga token per klien cukup diganti di satu file CSS.
- **Plugin PostCSS berganti** ke `@tailwindcss/postcss`; plugin typography dimuat lewat `@plugin "@tailwindcss/typography";` di CSS.
- **Komponen dari majidalf.com tidak bisa disalin mentah.** Kelas utilitas yang namanya berubah di v4 perlu dikonversi, misalnya dengan `npx @tailwindcss/upgrade`. Karena template hanya mengambil sedikit komponen (Section 2.3), dampaknya kecil.
- **Dukungan browser:** v4 menargetkan browser modern (Safari 16.4+, Chrome 111+, Firefox 128+). Klien korporat kadang memakai perangkat kantor dengan browser lama, jadi tanyakan ini saat discovery. Kalau ternyata wajib mendukung browser lama, project itu perlu kembali ke 3.4.
- Detail di atas dicek ulang ke dokumentasi resmi Tailwind saat T1.

---

## 6. CI/CD

Pipeline di GitLab CI (`.gitlab-ci.yml`, keputusan D-1). Secret `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, dan `SANITY_AUTH_TOKEN` disimpan sebagai CI/CD variable bertipe *masked* + *protected*:

```
on merge request:
  web:    npm ci → lint → format:check → typecheck → test → build
  studio: npm ci → sanity schema validate → sanity build
  e2e:    opennextjs-cloudflare build → preview → playwright (smoke + axe)

on push ke main:
  semua langkah di atas → opennextjs-cloudflare deploy (secret CLOUDFLARE_API_TOKEN)
  studio: sanity deploy (secret SANITY_AUTH_TOKEN) — hanya jika studio/ berubah
```

Yang wajib dicatat di template:
- Deploy hanya mengirim `.open-next/`, sama seperti prinsip "hanya artifact build yang dikirim" di majidalf.com.
- CI berjalan di Linux, sehingga race condition build Windows (`Failed to parse JSON file`) tidak terjadi di sana. Untuk build lokal di Windows, README tetap mencantumkan solusinya: `rm -rf .next .open-next` lalu build ulang.
- Deploy manual (`npm run cf:deploy`) tetap tersedia sebagai cadangan.

---

## 7. Dokumentasi yang ikut di template

| File | Pembaca | Isi |
|---|---|---|
| `README.md` | Developer | Quickstart: dari membuat repo baru dari `cms-starter` sampai Worker live |
| `docs/NEW_PROJECT_CHECKLIST.md` | Developer | Checklist provisioning: Sanity project, dataset, CORS origin, webhook, R2 bucket, D1 + migration, secrets, domain, Studio deploy |
| `docs/ARCHITECTURE.md` | Developer / agent | Versi bersih dari Section 5 `project_architecture.md` |
| `docs/DEVELOPMENT_WORKFLOW.md` | Developer | Perintah harian, env file mana untuk apa, cara menambah schema + query + halaman |
| `docs/CMS_GUIDE.md` | **Editor konten klien** (Bahasa Indonesia, non-teknis) | Login Studio, draft vs publish, gambar + alt text, cara cek perubahan sudah live |
| `docs/DECISIONS.md` | Developer | Log keputusan (ADR singkat): kenapa R2 bukan KV, kenapa `revalidatePath`, kenapa Studio terpisah, dll. |
| `docs/TROUBLESHOOTING.md` | Developer | Windows build race, port Studio bentrok (alasan port 3334), webhook 401, gambar tidak muncul |
| `CLAUDE.md` | Agent | Aturan project + pointer ke `AGENTS.md` Next.js |

`CMS_GUIDE.md` sengaja ditulis untuk klien, karena dokumen ini yang akan diserahkan ke klien saat handover.

---

## 8. Setup script (`scripts/setup.mjs`)

Ditulis dalam Node, bukan bash, supaya jalan di Windows tanpa WSL.

1. Menanyakan: nama situs, slug repo, Sanity project ID, nama Worker, domain production.
2. Mengganti placeholder `{{SITE_NAME}}`, `{{SANITY_PROJECT_ID}}`, `{{WORKER_NAME}}`, `{{DOMAIN}}` di file yang terdaftar.
3. Menyalin `.env.example` → `.env.local` dan `.dev.vars.example` → `.dev.vars`.
4. Mencetak langkah yang harus dijalankan manual (tidak dijalankan otomatis karena membuat resource berbayar/eksternal):
   ```bash
   npx wrangler r2 bucket create {{WORKER_NAME}}-cache
   npx wrangler d1 create {{WORKER_NAME}}-tag-cache       # salin database_id ke wrangler.jsonc
   npx wrangler d1 execute {{WORKER_NAME}}-tag-cache --remote --file=migrations/0001_create_revalidations.sql
   npx wrangler secret put SANITY_REVALIDATE_SECRET
   cd ../studio && npx sanity dataset import seed/sample.ndjson production
   ```
5. Menghapus dirinya sendiri setelah selesai (opsional, dengan konfirmasi).

---

## 9. Template repo sekarang, shared package nanti

Mulai dengan **template repo** (copy sekali, lalu bebas berubah per project).

Pertimbangkan ekstrak ke shared package (misalnya `@majidalf/sanity-kit`) **hanya jika** sudah ada sekitar 3 project aktif dan perbaikan yang sama terus harus disalin manual. Kandidat isinya: `lib/sanity/*`, handler revalidate, objects schema, `lib/seo.ts`.

Sampai titik itu, perbaikan di template dicatat di `CHANGELOG.md` template, lalu di-port manual ke project turunan yang masih aktif.

---

## 10. Fase pengerjaan

| Fase | Isi | Selesai jika |
|---|---|---|
| **T0 — Keputusan** ✅ | Jawab D-1 s.d. D-8 (Section 11) | Selesai 2026-10-04 |
| **T1 — Skeleton** ✅ | Buat repo, salin bagian Section 2.1, generalisasi Section 2.2, placeholder | Selesai 2026-10-04: build, typecheck, lint, format `web/` lulus; `sanity schema validate` + build `studio/` lulus. Penyimpangan: (1) `next` naik ke 16.3.8 karena `@opennextjs/cloudflare` 1.20.8 mensyaratkan `>=16.3.8`; (2) nama Worker di `wrangler.jsonc` memakai default valid `cms-starter`, bukan placeholder, karena `next build` memvalidasi file itu. Pembersihan `siteSettings`, singleton, dan typegen (Section 2.2) dikerjakan di T2a bersama content model |
| **T2a — Content model dasar** ✅ | Objects (termasuk `locale*`) + `siteSettings` + `navigation` + `page` + section dasar, routing `/[locale]` + redirect `/`, structure singleton, typegen | Selesai 2026-10-04. Sanity project dev `cms-starter-dev` (`wxyhn8wb`, dataset `production` public) dibuat dan diisi seed `studio/seed/sample.ndjson`. Terverifikasi lewat `next start`: `/id`, `/en`, `/id/tentang-kami`, `/en/about-us` 200 dengan `lang`, hreflang, canonical, dan satu `h1`; slug bahasa lain redirect ke slug yang benar; prefix asing 404; halaman yang di-publish setelah build langsung tampil. Validasi dua bahasa dan slug teruji sebagai error. Penyimpangan dari rencana dicatat di Section 4.4. Ditemukan dan diperbaiki: `useCdn: true` (data basi setelah publish) dan `dynamicParams = false` (halaman baru 404). **Diselesaikan setelah T2a (2026-10-04):** (1) *404*: `notFound()` di Next 16.3 selalu mengirim kerangka error di HTML server dan merender halaman 404 di browser dari payload RSC (perilaku bawaan Next, juga terjadi di majidalf.com). Status 404 tetap benar; diverifikasi di browser sungguhan (Edge via playwright-core) bahwa pengunjung melihat 404 template lengkap dengan header/footer. URL tanpa route mana pun ditangani `app/global-not-found.tsx` (`experimental.globalNotFound`) dengan HTML lengkap. Locale tidak valid (`/fr`) tidak lagi dilempar dari layout, supaya 404 template yang tampil, bukan 404 polos Next. (2) *Webhook revalidate*: balapan publish-webhook direproduksi (konten basi tersangkut di 2 dari 5 percobaan); diperbaiki di `lib/sanity/revision.ts` dengan menunggu revisi payload terlihat (503 agar Sanity retry kalau lewat 10 detik) plus jeda 3 detik seperti `next-sanity` `parseBody()`. Hasil: 0 basi dari 30 percobaan. Projection webhook sekarang wajib membawa `_id`, `_rev`, dan `operation` (lihat `lib/revalidate.config.ts`). Review kode T2a (agent code-reviewer): tidak ada CRITICAL/HIGH; temuan MEDIUM/LOW sudah diperbaiki (canonical per bahasa, guard skema URL `safeHref`, `isHomePage` untuk link tanpa referensi, rich text kosong, `aria-label` logo, batas panjang slug, body webhook non-object) |
| **T2b — Preset korporat** | Schema Section 4.3, `lib/routes.ts`, query + halaman list/detail, vCard, seed data korporat contoh (perusahaan fiktif) | Semua route preset 200 dengan seed data; filter `clientConsent`/`approvedForDisplay` teruji; checklist "hapus koleksi" sudah dicoba sekali (hapus `industry`, build tetap lulus) |
| **T3 — Lapisan non-fungsional** | SEO helper, sitemap/robots, security headers, revalidate config | Header terlihat di response; sitemap valid; webhook teruji end-to-end di Worker yang sudah di-deploy (uji lokal `next start` sudah lulus di T2a, termasuk balapan publish-webhook). Daftarkan webhook Sanity dengan projection dari `lib/revalidate.config.ts`. Cek juga bahwa `experimental.globalNotFound` didukung OpenNext di Cloudflare |
| **T4 — QA & CI** | Vitest, Playwright + axe, Lighthouse CI, workflow CI | Pipeline hijau di PR contoh; deploy otomatis dari `main` |
| **T5 — Modul opsional + bantuan terjemahan** | `contact-form`, `analytics`; tombol terjemahan + status + endpoint `/api/translate` (Section 4.5, ini inti, bukan opsional) | Modul opsional bisa dinyalakan dengan langkah yang terdokumentasi; tombol terjemahan teruji end-to-end, termasuk deteksi `stale` dan blokir publish; hasil uji perbandingan model tercatat di `docs/DECISIONS.md` |
| **T6 — Docs & dry run** | Tulis docs Section 7, lalu buat satu project percobaan dari nol hanya dengan mengikuti README | Project percobaan live dalam < 1 jam; semua hambatan yang ditemukan diperbaiki di docs |

Project klien korporat pertama dimulai dari template setelah T6 selesai. Kalau waktunya mendesak, project bisa dimulai setelah T4, lalu modul opsional dikerjakan langsung di project tersebut dan di-port balik ke template.

---

## 11. Keputusan (T0) — semua sudah diambil

| ID | Pertanyaan | Opsi | Rekomendasi |
|---|---|---|---|
| D-1 | Template di-host di mana? | GitHub / GitLab | ✅ **Diputuskan 2026-10-04: GitLab.** CI ditulis sebagai `.gitlab-ci.yml`. Cara membuat project baru dari template dijelaskan di Section 3.1 |
| D-2 | Nama repo dan lokasi lokal | — | ✅ **Diputuskan 2026-10-04: `cms-starter`**, lokal di `E:\DEV\cms-starter` |
| D-3 | Apakah i18n masuk inti template atau modul? | Selalu dua bahasa / modul opsional / tanpa i18n | ✅ **Diputuskan 2026-10-04: selalu dua bahasa, Indonesia (default) + Inggris, sebagai bagian inti template.** Lihat Section 4.4 |
| D-4 | Versi Tailwind | 3.4 (sama dengan majidalf.com) / 4.x | ✅ **Diputuskan 2026-10-04: Tailwind 4.** Konsekuensinya dicatat di Section 5.7 |
| D-5 | Penyedia email untuk `contact-form` | Resend / Postmark / Cloudflare Email Routing (`send_email` binding) | ✅ **Diputuskan 2026-10-04: Resend** (HTTP API, cocok di Workers). Verifikasi harga dan batas paket gratis saat T5 |
| D-6 | Apakah content model korporat (`person`, `service`, `industry`, `caseStudy`, `insight`, `office`, `jobOpening` — lihat [CORPORATE_CLIENT_PLAN.md](CORPORATE_CLIENT_PLAN.md) Section 4.2) ikut masuk template? | Masuk template sebagai preset default / dibuat ulang per project | ✅ **Diputuskan 2026-10-04: masuk template sebagai preset default.** Lihat Section 4.3 dan fase T2b |
| D-7 | Bagaimana versi EN diperbarui saat konten ID berubah? | Tombol terjemahan di Studio (semi-otomatis) / otomatis saat publish sebagai draft / otomatis penuh | ✅ **Diputuskan 2026-10-04: tombol "Terjemahkan ke EN" + status `auto`/`reviewed`/`stale`.** Mesin membuat draf, manusia wajib mereview. Lihat Section 4.5 |
| D-8 | Mesin terjemahan default | Cloudflare Workers AI (gratis dalam kuota harian) / free tier API LLM eksternal / layanan berbayar | ✅ **Diputuskan 2026-10-04: Cloudflare Workers AI, model open-source.** Bisa diganti per klien lewat `lib/translate/`. Kuota dan model dicek saat T5 |

---

## 12. Perbaikan di majidalf.com yang sebaiknya dikerjakan dulu (atau paralel)

Hal-hal ini ditemukan saat menyusun rencana. Memperbaikinya di majidalf.com lebih dulu membuat versi yang masuk ke template sudah teruji di production:

1. Enforce singleton `siteSettings` di Studio (masih TODO di `siteSettings.ts`).
2. Ubah `switch` di `app/api/revalidate/route.ts` menjadi peta config.
3. CI deploy ke Cloudflare. Saat ini deploy masih manual, dan `.github/workflows/deploy.yml` masih menargetkan Hostinger.
4. Jalankan gate CWV/Lighthouse (Phase 4.6) untuk mendapat baseline angka.
