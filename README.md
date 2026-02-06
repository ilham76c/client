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
```
src/
├─ app/
│  ├─ layout.tsx                # Root layout (SSR)
│  ├─ page.tsx                  # Landing page
│  ├─ providers.tsx             # QueryClientProvider, theme, etc
│  │
│  ├─ emiten/
│  │  └─ [code]/
│  │     ├─ layout.tsx          # Layout per emiten (SSR)
│  │     ├─ page.tsx            # Overview emiten (SSR)
│  │     ├─ ownership/
│  │     │  └─ page.tsx         # Ownership page (Hybrid)
│  │     └─ financials/
│  │        └─ page.tsx         # Financial reports (SSR/ISR)
│  │
│  └─ api/                      # Optional (BFF / proxy)
│     └─ emiten/
│        ├─ ownership/route.ts
│        └─ financials/route.ts
│
├─ features/
│  ├─ ownership/
│  │  ├─ components/
│  │  │  ├─ OwnershipChart.tsx  # CSR (ECharts)
│  │  │  └─ OwnershipTable.tsx
│  │  ├─ hooks/
│  │  │  └─ useOwnership.ts
│  │  ├─ api.ts
│  │  └─ types.ts
│  │
│  ├─ financials/
│  │  ├─ components/
│  │  │  ├─ FinancialTable.tsx
│  │  │  └─ FinancialChart.tsx
│  │  ├─ api.ts
│  │  └─ types.ts
│
├─ components/
│  ├─ layout/
│  │  ├─ Header.tsx
│  │  └─ Sidebar.tsx
│  ├─ ui/                       # reusable UI (button, badge)
│  └─ charts/
│     └─ BaseChart.tsx
│
├─ lib/
│  ├─ api-client.ts             # fetch wrapper
│  ├─ query-client.ts           # TanStack Query config
│  ├─ format.ts                 # number/date formatter
│  └─ constants.ts
│
├─ styles/
│  └─ globals.css
│
├─ types/
│  └─ index.ts
│
└─ middleware.ts                # optional auth / logging
```
