# EquityLens

**EquityLens** adalah platform analitik saham yang dirancang untuk memantau **perubahan kepemilikan saham (ownership)** dan **laporan keuangan emiten** secara terstruktur, akurat, dan mudah dianalisis.

Aplikasi ini ditujukan untuk:
- analis pasar modal
- tim riset internal
- investor yang membutuhkan insight berbasis data

---

## 🎯 Tujuan

EquityLens dibangun untuk menjawab kebutuhan utama dalam analisis saham:

- 🔍 Melacak **perubahan kepemilikan saham** dari waktu ke waktu
- 📊 Menyajikan **laporan keuangan emiten** (quarterly & full year)
- 📈 Membantu analisis tren, konsentrasi kepemilikan, dan fundamental emiten
- ⚙️ Menyediakan arsitektur yang scalable untuk data finansial

---

## ✨ Fitur Utama

### Ownership Analysis
- Riwayat perubahan kepemilikan saham
- Deteksi perubahan signifikan antar periode
- Visualisasi time-series & distribusi ownership

### Financial Reports
- Laporan keuangan (Quarterly / Full Year)
- Perbandingan YoY & QoQ
- Tabel finansial yang dapat di-sort & difilter

### Data Visualization
- Chart interaktif untuk data ownership & keuangan
- Fokus pada data-heavy & analytical use case

---

## 🧱 Arsitektur Singkat

### Backend
- Python (Async)
- SQLAlchemy ORM
- PostgreSQL
- APScheduler untuk job terjadwal (ETL & sync data)

### Frontend
- **Next.js (React + TypeScript)**
- Hybrid Rendering (SSR + CSR)
- TanStack Query & Table
- Apache ECharts
- Tailwind CSS

Pendekatan ini memungkinkan:
- performa tinggi
- SEO-friendly untuk halaman emiten
- interaksi kompleks untuk chart & analisis

---

## 🧩 Struktur Frontend (Ringkas)

