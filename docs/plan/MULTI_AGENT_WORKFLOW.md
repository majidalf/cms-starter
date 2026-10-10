# SOP: Multi-Agent Collaboration Workflow (cms-starter)

Dokumen ini mendefinisikan standar operasional prosedur (SOP) untuk kolaborasi multi-agent dalam ekosistem `cms-starter`, melibatkan **Claude Code** (Planner/Reviewer), **OpenCode** (Executor), dan **Hermes** (Orchestrator).

---

## 1. Matriks Peran & Tanggung Jawab

| Agen / Entitas | Peran Utama | Tugas & Tanggung Jawab | Batasan Wewenang |
|---|---|---|---|
| **Claude Code** | Planner & Reviewer | Menyusun *implementation plan* terstruktur (langkah, file, acceptance criteria) dan mereview hasil kode. | Tidak langsung menulis kode produksi tanpa persetujuan plan. |
| **OpenCode** | Executor | Mengimplementasikan kode atau fitur berdasarkan plan yang disetujui. | Harus beroperasi di dalam direktori `mjd-workspace` dan mengikuti model ladder saat gagal. |
| **Hermes** | Orchestrator | Mengoordinasikan alur kerja, menjembatani instruksi dari user, dan melaporkan hasil. | Tidak mengubah file kode secara mandiri tanpa delegasi. |
| **Majid (User)** | Approver | Memberikan arahan, menyetujui plan sebelum eksekusi, dan melakukan deploy final. | Pengambil keputusan mutlak. |

---

## 2. Alur Siklus Tugas (Task Lifecycle)

1. **Intake & Plan (Claude Code):**
   - Menerima deskripsi tugas, lalu menyusun dokumen plan lengkap dengan langkah-langkah teknis.
2. **Gate Persetujuan (Approval):**
   - Plan disajikan ke user untuk disetujui.
3. **Execution (OpenCode):**
   - Mengeksekusi plan yang disetujui, menulis kode, dan memastikan struktur tetap bersih.
4. **Review & QA Gates (Claude Code / Hermes):**
   - Menjalankan pemeriksaan wajib (*Quality Gates*):
     - **Web:** `npm run lint && npm run format:check && npm run typecheck && npm run test && npm run build`
     - **Studio:** `npm run schema:validate && npm run build`
   - Maksimal 2 kali putaran perbaikan (*fix loop*) jika ditemukan error.
5. **Final Report:**
   - Melaporkan hasil akhir, ringkasan file yang diubah, dan status tes kepada user.

---

## 3. Fallback Model Ladder (Executor)
Jika OpenCode mengalami kendala kuota atau error pada model utamanya (`muse-spark-1.3-contributor-free`), urutan fallback yang digunakan secara otomatis:
1. `opencode/glm-5.3-flash`
2. `opencode/deepseek-v4.1-flash`
3. `opencode/gpt-5-nano`
4. `opencode/gemini-3.5-flash-lite`

---

## 4. Git & Keamanan
- Branch utama (`main`) dilindungi. Segala pengembangan fitur dikerjakan di branch terpisah (`agent/<task_id>`).
- Dilarang melakukan *force push* ke `main`.
- Rahasia (API keys, token Sanity/Cloudflare) tidak boleh dicatat dalam file dokumen publik atau di-commit ke repo.
