# Corporate Client Website — Project Plan

> **Status:** Draft rencana. Dibuat 2026-10-04.
> **Dibangun dari:** starter template — lihat [STARTER_TEMPLATE_PLAN.md](STARTER_TEMPLATE_PLAN.md).
> **Cakupan:** website untuk klien korporasi formal, yaitu perusahaan B2B, jasa profesional (hukum, konsultan, akuntan), lembaga keuangan, perusahaan publik, industri, dan energi. Dokumen ini mencatat apa yang **ditambahkan di atas template** untuk segmen tersebut, plus varian per industri di Section 8.

---

## 1. Karakter segmen

Klien korporat formal punya kebutuhan yang berbeda dari website portfolio atau brand konsumen:

| Karakter | Implikasi untuk website |
|---|---|
| Keputusan pembelian lewat banyak orang (direksi, procurement, legal) | Informasi harus lengkap, mudah dirujuk, dan mudah dibagikan (URL per halaman, PDF, versi cetak) |
| Kepercayaan lebih penting dari daya tarik | Tone faktual dan tenang; bukti konkret (sertifikasi, pengalaman, tim) lebih penting dari slogan |
| Diatur regulasi industri dan/atau kode etik profesi | Setiap klaim, testimoni, dan data klien harus lewat persetujuan (Section 5) |
| Konten disetujui berlapis sebelum terbit | Workflow draft → review → publish di CMS wajib jelas |
| Sering punya klien/investor asing | Situs selalu dua bahasa, Indonesia + Inggris (bawaan template) |
| Brand sudah mapan | Desain mengikuti brand guideline klien, bukan gaya pribadi |

**Prinsip konten:** website korporat berfungsi sebagai **sumber informasi resmi perusahaan**. Ia dirujuk oleh calon klien, mitra, investor, regulator, media, dan calon karyawan, jadi tujuannya bukan sekadar menjual.

---

## 2. Audiens

| Audiens | Yang dicari | Halaman utama |
|---|---|---|
| Calon klien / procurement | Layanan, kapabilitas, pengalaman sektor, kontak yang tepat | Services, Industries, Case Studies, Contact |
| Direksi / pengambil keputusan | Kredibilitas, skala, kepemimpinan | About, Leadership, Insights |
| Investor / pemegang saham | Laporan, tata kelola, pengumuman | Investor Relations (opsional, Section 8) |
| Mitra / media | Profil resmi, siaran pers, aset brand | News, Media Kit |
| Calon karyawan | Budaya, lowongan | Careers |
| Regulator / publik | Informasi legal, kebijakan | Governance, Legal pages |

---

## 3. Arah desain

**Arah:** *editorial formal* — tenang, berwibawa, dan banyak ruang kosong. Rujukannya situs perusahaan multinasional dan publikasi bisnis, bukan landing page startup.

| Aspek | Arahan |
|---|---|
| Brand | Mengikuti brand guideline klien. Kalau belum ada, tetapkan palet + font dulu sebelum desain halaman |
| Tipografi | Hierarki lewat skala dan bobot. Pasangan serif + sans atau satu sans berkarakter. Maksimal 2 family |
| Warna | Satu warna utama brand + netral hangat (ivory, abu batu) + satu aksen. Warna dipakai untuk makna (status, kategori), bukan sekadar hiasan |
| Layout | Grid editorial, ritme spasi yang disengaja, garis tipis sebagai pemisah, tabel dan angka ditata rapi |
| Fotografi | Foto asli: tim, kantor, fasilitas, proyek. Portrait dengan pencahayaan dan latar seragam (perlu di-brief ke fotografer) |
| Motion | Minimal: fade/reveal halus dan transisi hover. Tanpa WebGL atau parallax berat |
| Data | Angka kunci, timeline, dan peta lokasi diperlakukan sebagai bagian desain, bukan tempelan |
| Hindari | Stok foto generik (jabat tangan, gedung kaca, orang menunjuk layar), superlatif besar di hero, carousel testimoni, ikon generik di setiap kartu |
| Aksesibilitas | WCAG 2.2 AA: kontras, navigasi keyboard, fokus terlihat, `prefers-reduced-motion` |

**Referensi internal:** `CorporateTemplate` di `web-majidalf.com/components/templates/corporate/` bisa dipakai sebagai titik awal pola section korporat. Nadanya perlu dibuat lebih formal dan lebih sedikit elemen "marketing".

Sebelum desain dimulai: kumpulkan 5–8 referensi dari industri klien (lokal dan internasional), lalu tetapkan palet dan tipografi, misalnya lewat skill `design-consultation`.

---

## 4. Sitemap dan content model inti

### 4.1 Halaman inti

```
/                         Home
/about                    Profil, sejarah, visi-misi, nilai
/about/leadership         Direksi / partner / tim kunci
/services                 Layanan / kapabilitas / solusi
/services/[slug]          Detail layanan + orang kunci + studi kasus + insights terkait
/industries               (opsional) Sektor yang dilayani
/industries/[slug]
/case-studies             (opsional, butuh izin klien — Section 5)
/case-studies/[slug]
/insights                 Artikel, berita, siaran pers, publikasi (filter kategori)
/insights/[slug]
/careers                  Budaya + lowongan
/contact                  Kantor, peta, formulir kontak
/privacy-policy           Wajib (UU PDP)
/terms, /disclaimer       Sesuai kebutuhan industri
```

Semua route di atas berada di bawah prefix bahasa: `/id/...` dan `/en/...` ([STARTER_TEMPLATE_PLAN.md](STARTER_TEMPLATE_PLAN.md) Section 4.4).

Penamaan route disesuaikan dengan istilah industri. Contoh: `/services` menjadi `/practice-areas` di law firm, `/solutions` di perusahaan teknologi, `/products` di manufaktur. Strukturnya tetap sama.

### 4.2 Document types inti

Semua document type di bawah **sudah termasuk di template** sebagai preset korporat (keputusan D-6, [STARTER_TEMPLATE_PLAN.md](STARTER_TEMPLATE_PLAN.md) Section 4.3), di samping `siteSettings`, `navigation`, dan `page`. Per project, pekerjaannya tinggal menyesuaikan label, menghapus yang tidak dipakai, dan menambah field varian industri (Section 8).

| Document | Field utama | Relasi |
|---|---|---|
| `person` | name, slug, position, `group` (Board / Leadership / Partner / Team), photo (`imageWithAlt`), bio (`blockContent`), credentials[] (pendidikan, sertifikasi, lisensi), languages[], email, linkedin, `order`, `seo` | → `service[]`, → `office` |
| `service` | title, slug, summary, body, `order`, `seo` | → `person[]` (kontak kunci), → `industry[]` |
| `industry` | title, slug, summary, body, `seo` | → `service[]` |
| `caseStudy` | title, slug, client (boleh anonim), challenge, approach, outcome, year, `clientConsent` (wajib true untuk tampil), `seo` | → `service[]`, → `industry[]` |
| `insight` | title, slug, category (Article / News / Press Release / Publication / Update), publishedAt, excerpt, body, attachment (PDF opsional), `seo` | → `person[]` (penulis), → `service[]` |
| `office` | name, `address`, phone, email, mapUrl, `order` | — |
| `jobOpening` | title, slug, location, type, description, deadline, `isOpen` | — |
| `credential` (opsional) | title (ISO, penghargaan, keanggotaan asosiasi), issuer, year, logo, `approvedForDisplay` | — |

**Tambahan untuk `siteSettings`:** nama legal perusahaan, nomor registrasi/izin usaha (jika relevan), teks disclaimer footer, dan email penerima formulir kontak.

Nama document type sengaja generik (`person`, `service`). Di Studio, **label**-nya disesuaikan per klien (misalnya "Lawyer", "Practice Area") lewat `title` di schema, tanpa mengganti `name`. Dengan begitu query dan komponen tetap bisa dipakai ulang antar project.

### 4.3 Revalidate map (contoh untuk `revalidate.config.ts`)

| `_type` | Path yang di-revalidate |
|---|---|
| `person` | `/about/leadership`, halaman `service` terkait |
| `service` | `/services`, `/services/[slug]`, `/` |
| `caseStudy` | `/case-studies`, `/case-studies/[slug]`, halaman `service` terkait |
| `insight` | `/insights`, `/insights/[slug]`, `/` |
| `office` | `/contact`, layout (footer) |
| `siteSettings`, `navigation` | semua halaman (layout) |

---

## 5. Kepatuhan dan persetujuan konten

> ⚠️ Bagian ini **bukan nasihat hukum**. Ini daftar hal yang harus **dikonfirmasi ke klien** (legal/compliance internal mereka). Klien yang bertanggung jawab atas isi situsnya.

### 5.1 Berlaku untuk semua klien

**UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP):**
- Checkbox persetujuan eksplisit di formulir, dengan tautan ke Privacy Policy.
- Kumpulkan data seminimal mungkin (nama, email, perusahaan, pesan).
- Tentukan retensi data: berapa lama disimpan, dan siapa yang mengakses.
- Analytics default memakai Cloudflare Web Analytics (cookieless). GA4/Meta Pixel hanya dipakai dengan consent banner.
- Lamaran kerja (CV) lebih aman diarahkan ke email HR atau platform rekrutmen daripada di-upload ke situs.

**Klaim dan bukti:**
- Klaim kuantitatif ("500+ klien", "20 tahun") harus bisa dibuktikan dan disetujui tertulis.
- Logo klien, studi kasus, dan testimoni hanya tampil dengan izin. Schema memakai field `clientConsent` / `approvedForDisplay`, dan query hanya mengambil dokumen yang bernilai `true`.
- Penghargaan dan sertifikasi harus masih berlaku. Cantumkan tahun.

### 5.2 Spesifik per industri

Lihat Section 8. Misalnya kode etik advokat untuk law firm, aturan OJK untuk lembaga keuangan dan perusahaan publik, serta kode etik profesi untuk akuntan dan konsultan.

---

## 6. Fitur di atas template

| Fitur | Implementasi | Catatan |
|---|---|---|
| Direktori orang dengan filter | Filter group + layanan via search params (URL sebagai state) | Bisa di-bookmark dan dibagikan |
| Unduh vCard | Route handler `app/.../[slug]/vcard/route.ts` menghasilkan `.vcf` | Relevan untuk jasa profesional |
| Insights + lampiran PDF | File asset Sanity, unduh langsung dari CDN Sanity | Laporan, publikasi, siaran pers |
| Cetak halaman | Stylesheet `@media print` untuk insight dan halaman layanan | Konten korporat sering dicetak/diteruskan |
| Formulir kontak | Modul `contact-form` dari template (Turnstile + honeypot + Resend) | Penerima diambil dari `siteSettings`; bisa dirouting per layanan/kantor |
| Dwibahasa ID/EN | Bawaan template, termasuk tombol "Terjemahkan ke EN" ([STARTER_TEMPLATE_PLAN.md](STARTER_TEMPLATE_PLAN.md) Section 4.5) | Mesin membuat draf, klien wajib mereview setiap terjemahan sebelum publish. Untuk halaman sensitif (disclaimer, legal, profil direksi), review sebaiknya oleh penerjemah profesional atau tim legal klien. Siapkan glosarium istilah klien di awal. Jadwal review terjemahan masuk timeline konten (C4) |
| Structured data | `Organization` (atau subtipe: `LegalService`, `FinancialService`, `ProfessionalService`, dll.), `Person`, `Article`, `BreadcrumbList` | Lewat `lib/seo.ts` |
| Media kit (opsional) | Halaman unduhan logo, profil perusahaan, foto resmi | Untuk media dan mitra |

**Sengaja tidak dibuat di fase 1:** portal klien/login, chatbot, live chat, booking online, newsletter. Semuanya bisa didiskusikan setelah launch.

---

## 7. Workflow editorial (Sanity)

- **Pengedit:** biasanya tim marketing/corporate communication. Persetujuan dari manajemen, legal, atau compliance.
- **Draft → review → publish:** dokumen draft tidak tampil di situs sampai di-publish.
- **Role dan scheduled publishing:** ketersediaan role granular dan fitur jadwal publish bergantung paket Sanity. **Cek paket dan harga terbaru sebelum menjanjikan fitur ini ke klien.**
- **Validasi di schema:** alt text wajib, meta description maksimal 160 karakter, dokumen yang butuh izin tidak bisa tampil tanpa flag persetujuan.
- **Handover:** `docs/CMS_GUIDE.md` dari template disesuaikan dengan document types klien, lalu diserahkan bersama sesi training.

---

## 8. Varian per industri

Content model inti (Section 4) tetap dipakai. Tabel ini hanya mencatat **tambahan** dan **perhatian khusus** per industri.

| Industri | Tambahan content/halaman | Perhatian kepatuhan (konfirmasi ke klien) |
|---|---|---|
| **Law firm** | Label: Practice Areas, Lawyers. Field `admissions[]` (PERADI, yurisdiksi asing) di `person`. Representative matters | Kode Etik Advokat Indonesia membatasi iklan untuk menarik klien: tone informatif, tanpa superlatif atau janji hasil, testimoni default tidak dipakai. Disclaimer "bukan nasihat hukum / tidak menimbulkan hubungan advokat–klien" |
| **Konsultan / akuntan / jasa profesional** | Case studies, publikasi riset, `credentials[]` (CPA, CFA, dll.) | Kode etik asosiasi profesi masing-masing, kerahasiaan klien, independensi (untuk auditor) |
| **Lembaga keuangan** | Produk, suku bunga/biaya, laporan, layanan pengaduan | Aturan OJK tentang informasi produk dan iklan jasa keuangan; disclaimer risiko; informasi layanan pengaduan konsumen |
| **Perusahaan publik (Tbk)** | Modul Investor Relations: laporan tahunan/keuangan, keterbukaan informasi, RUPS, tata kelola (GCG), profil direksi & komisaris, struktur pemegang saham | POJK tentang situs web emiten/perusahaan publik mengatur informasi minimum yang wajib ada. Verifikasi daftar wajibnya dengan corporate secretary klien |
| **Manufaktur / industri** | Produk/kapabilitas, fasilitas, sertifikasi (ISO, SNI, halal), distributor/lokasi | Klaim sertifikasi harus valid dan masih berlaku |
| **Energi / pertambangan / konstruksi** | Proyek, HSE, sustainability/ESG report, CSR | Laporan keberlanjutan (perusahaan publik); akurasi data lingkungan |

Varian yang dipakai berulang (misalnya Investor Relations) sebaiknya dijadikan modul opsional di template setelah dipakai di 2 project atau lebih.

---

## 9. Definition of Done untuk launch

- [ ] Semua halaman terisi konten asli (bukan placeholder)
- [ ] Seluruh copy, Privacy Policy, dan disclaimer disetujui tertulis oleh klien
- [ ] Logo klien, studi kasus, testimoni, dan penghargaan yang tampil sudah ada izin tertulis
- [ ] Kewajiban kepatuhan industri (Section 8) sudah dicek bersama klien
- [ ] Lighthouse ≥ 90 (mobile) di Home, satu halaman layanan, satu profil, satu insight
- [ ] Axe: 0 pelanggaran serious/critical; navigasi keyboard penuh berhasil
- [ ] Formulir kontak teruji end-to-end (email sampai; spam diblokir Turnstile)
- [ ] Webhook revalidate teruji: edit di Studio → tampil di situs
- [ ] Sitemap dan robots benar; staging `noindex`; redirect URL lama (jika ada situs lama)
- [ ] Domain + HTTPS + security headers aktif
- [ ] Editor klien sudah dilatih dan menerima `CMS_GUIDE.md`

---

## 10. Pertanyaan discovery untuk klien

1. Industri dan regulasi yang berlaku. Apakah perusahaan publik atau diawasi OJK? Apakah terikat kode etik profesi?
2. Situs dibuat dalam Indonesia + Inggris. Siapa yang menerjemahkan konten ke Inggris, dan siapa yang mereview terjemahannya?
3. Apakah sudah ada brand guideline (logo, warna, font, fotografi)?
4. Daftar layanan/produk dan sektor industri yang dilayani.
5. Siapa saja yang ditampilkan di Leadership/Team, berapa orang, dan apakah ada foto resmi?
6. Berapa kantor/lokasi?
7. Studi kasus, logo klien, penghargaan, dan sertifikasi apa yang **boleh** ditampilkan?
8. Siapa yang mengedit konten, dan siapa yang menyetujui sebelum publish?
9. Domain dan email yang dipakai sekarang; siapa yang mengelola DNS?
10. Apakah ada situs lama yang kontennya perlu dipindahkan atau URL-nya perlu di-redirect?
11. Kebutuhan analytics di luar statistik kunjungan dasar?
12. Siapa penerima email dari formulir kontak? Apakah dirouting per layanan atau kantor?
13. Apakah ada kebutuhan mendukung browser lama di lingkungan kantor klien atau pengunjungnya? Template memakai Tailwind 4 yang hanya mendukung browser modern ([STARTER_TEMPLATE_PLAN.md](STARTER_TEMPLATE_PLAN.md) Section 5.7).

---

## 11. Fase project

| Fase | Isi |
|---|---|
| **C0 — Discovery** | Jawaban Section 10, tentukan varian industri (Section 8), finalisasi sitemap dan label |
| **C1 — Design** | Arah visual, palet, tipografi; desain Home, detail layanan, profil, insight (desktop + mobile) |
| **C2 — Setup** | Repo dari template, provisioning (checklist template), sesuaikan label dan route preset, hapus koleksi yang tidak dipakai, tambah field/modul varian industri |
| **C3 — Build** | Halaman, filter direktori, formulir, modul varian (jika dipakai) |
| **C4 — Konten** | Klien mengisi konten kedua bahasa di Studio (dataset staging), penerjemahan + review, training editor |
| **C5 — QA & review** | Definition of Done Section 9, review copy dan kepatuhan oleh klien |
| **C6 — Launch** | Pindah ke dataset production, domain, monitoring awal |

Temuan selama project yang berlaku umum dikembalikan ke template dan dicatat di `CHANGELOG.md` template.
