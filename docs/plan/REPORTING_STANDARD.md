# SOP: Standard Multi-Agent Reporting & Execution Workflow

Dokumen ini mendefinisikan standar laporan wajib yang harus dihasilkan setelah setiap penyelesaian tugas (*task completion*) dalam proyek `cms-starter`.

---

## 1. Prinsip Pelaporan (The Report Standard)
Setiap kali sebuah fitur, modul, atau perbaikan selesai dikerjakan melalui kolaborasi agen, laporan akhir wajib disusun dengan struktur berikut:

1. **Ringkasan Eksekusi:** Status akhir (berhasil/gagal) dan modul apa yang dikerjakan.
2. **Rincian Peran & Kontribusi Agen:**
   - **Planner (Claude Code):** Perencanaan arsitektur dan penyusunan plan.
   - **Executor (OpenCode):** Penulisan kode, integrasi pustaka, dan perbaikan implementasi.
   - **Orchestrator (Hermes):** Koordinasi, manajemen task, dan pelaporan akhir.
3. **Hasil Quality Gates (Wajib Dilampirkan):**
   - *Linting* (`npm run lint`)
   - *Format Check* (`npm run format:check`)
   - *Typecheck* (`npm run typecheck`)
   - *Unit Tests* (`npm run test`)
   - *Production Build* (`npm run build`)

---

## 2. Integrasi ke Dokumen Workflow Utama
Aturan pelaporan ini resmi ditambahkan ke dalam protokol operasional harian agar setiap agen selalu memberikan transparansi proses (*audit trail*) yang jelas kepada user.
