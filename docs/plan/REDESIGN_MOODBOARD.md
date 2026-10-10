# Redesign Plan & Moodboard: cms-starter Custom Client Skin

Dokumen perencanaan dan *moodboard* konseptual untuk melakukan *redesign* template `cms-starter` berdasarkan referensi UI/UX modern (mengambil inspirasi dari standar platform seperti Refero / Mobbin).

---

## 1. Design Direction & Core Philosophy
- **Gaya Visual:** *Editorial Corporate Modern* dengan sentuhan *High-End FinTech / Professional Services*.
- **Prinsip Utama:** 
  - **Whitespace yang Luas:** Memberikan kesan mewah (*luxury feel*), elegan, dan tidak padat.
  - **Tipografi Kontras Tinggi:** Mengombinasikan Serif klasik yang elegan untuk tajuk utama (*headings*) dengan Sans-serif modern yang bersih untuk teks isi (*body*).
  - **Desain Fungsional:** Mengutamakan hierarki visual yang jelas, aksesibilitas tinggi, serta transisi interaktif yang halus (*subtle animations*).

---

## 2. Color Palette & Tokens (Tailwind v4 `@theme`)
- **Primary / Brand:** Deep Navy / Midnight (`#0A1128` / `#081426`) untuk kesan otoritas dan kepercayaan.
- **Accent / Highlight:** Warm Gold / Amber (`#D99A2B` atau `#C5A059`) untuk memberikan sentuhan eksklusif pada tombol CTA dan elemen penting.
- **Surface / Background:** Clean Off-White / Soft Paper (`#F9F9FB` / `#ECE8DF`) untuk mode terang, serta Dark Charcoal (`#121212`) untuk mode gelap.
- **Text / Ink:** Rich Charcoal (`#1F2937`) untuk keterbacaan optimal tanpa kontras hitam pekat yang melelahkan mata.

---

## 3. Typography Hierarchy
- **Heading / Serif:** *Playfair Display* atau *Libre Caslon* (memberikan karakter editorial yang kuat dan berwibawa).
- **Body / Sans:** *Inter* atau *Plus Jakarta Sans* (bersih, geometris, sangat mudah dibaca di berbagai ukuran layar).

---

## 4. Layout & UI Component Moodboard
- **Hero Section:** 
  - *Split layout* atau *Editorial centered* dengan headline berdampak tinggi, teks sub-heading ringkas, dan tombol aksi (*dual CTA: primary solid + secondary outline*).
- **Cards & Containers:** 
  - Menggunakan *border tipis* (`border-neutral-200/60`), sudut melengkung halus (`rounded-xl`), dan efek bayangan lembut saat di-hover (`hover:shadow-lg transition-all`).
- **Navigation (Header & Footer):**
  - *Sticky minimalist header* dengan efek transparan/blur (*backdrop-blur-md*), navigasi bahasa (ID/EN) yang terintegrasi rapi, serta footer bergaya majalah korporat multi-kolom.

---

## 5. Implementation Steps for Next Phase
1. Menyesuaikan token warna dan font di `web/app/globals.css`.
2. Merombak struktur komponen Hero dan Section utama sesuai referensi moodboard.
3. Memastikan responsivitas mobile-first dan aksesibilitas terpenuhi.
