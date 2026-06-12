import type { AnnouncementListItem, AnnouncementAnalysis } from '../types';

// ---------------------------------------------------------------------------
// List items (lightweight — shown in sidebar)
// ---------------------------------------------------------------------------
export const DUMMY_ANNOUNCEMENTS: AnnouncementListItem[] = [
  {
    id: '1',
    ticker: 'KPIG',
    company_name: 'MNC Tourism Indonesia Tbk',
    announcement_date: '2026-06-11',
    category: 'PMTHMETD',
    title: 'Penambahan Modal Tanpa HMETD – Penerbitan 7,45 Miliar Saham Baru',
    impact_sentiment: 'NEGATIVE',
    impact_score: -55,
    price_prediction: 'BEARISH',
  },
  {
    id: '2',
    ticker: 'BBRI',
    company_name: 'Bank Rakyat Indonesia (Persero) Tbk',
    announcement_date: '2026-06-10',
    category: 'DIVIDEN',
    title: 'Pengumuman Dividen Tunai Interim Tahun Buku 2026',
    impact_sentiment: 'POSITIVE',
    impact_score: 72,
    price_prediction: 'BULLISH',
  },
  {
    id: '3',
    ticker: 'TLKM',
    company_name: 'Telkom Indonesia (Persero) Tbk',
    announcement_date: '2026-06-09',
    category: 'LAPKEU',
    title: 'Laporan Keuangan Kuartal I 2026 – Laba Bersih Tumbuh 8,3%',
    impact_sentiment: 'POSITIVE',
    impact_score: 45,
    price_prediction: 'BULLISH',
  },
  {
    id: '4',
    ticker: 'GOTO',
    company_name: 'GoTo Gojek Tokopedia Tbk',
    announcement_date: '2026-06-08',
    category: 'RUPS',
    title: 'Hasil RUPST 2026 – Persetujuan Perubahan Susunan Direksi',
    impact_sentiment: 'NEUTRAL',
    impact_score: 5,
    price_prediction: 'SIDEWAYS',
  },
  {
    id: '5',
    ticker: 'ANTM',
    company_name: 'Aneka Tambang Tbk',
    announcement_date: '2026-06-07',
    category: 'MERGER',
    title: 'Rencana Akuisisi 60% Saham PT Nusa Halmahera Minerals',
    impact_sentiment: 'POSITIVE',
    impact_score: 63,
    price_prediction: 'BULLISH',
  },
  {
    id: '6',
    ticker: 'MNCN',
    company_name: 'Media Nusantara Citra Tbk',
    announcement_date: '2026-06-06',
    category: 'BUYBACK',
    title: 'Program Buyback Saham Senilai Rp 500 Miliar',
    impact_sentiment: 'POSITIVE',
    impact_score: 38,
    price_prediction: 'BULLISH',
  },
  {
    id: '7',
    ticker: 'WSKT',
    company_name: 'Waskita Karya (Persero) Tbk',
    announcement_date: '2026-06-05',
    category: 'PMHMETD',
    title: 'Rights Issue – Penawaran Umum Terbatas V',
    impact_sentiment: 'NEGATIVE',
    impact_score: -40,
    price_prediction: 'BEARISH',
  },
];

// ---------------------------------------------------------------------------
// Full analysis detail per id
// ---------------------------------------------------------------------------
export const DUMMY_DETAILS: Record<string, AnnouncementAnalysis> = {
  '1': {
    id: '1',
    ticker: 'KPIG',
    company_name: 'MNC Tourism Indonesia Tbk',
    announcement_date: '2026-06-11',
    category: 'PMTHMETD',
    title: 'Penambahan Modal Tanpa HMETD – Penerbitan 7,45 Miliar Saham Baru',
    impact_sentiment: 'NEGATIVE',
    impact_score: -55,
    price_prediction: 'BEARISH',
    summary:
      'MNC Tourism Indonesia (KPIG) menerbitkan 7.455.282.926 saham baru tanpa hak memesan efek terlebih dahulu (PMTHMETD) pada harga pelaksanaan Rp 100 per saham. Pelaksanaan dijadwalkan 19 Juni 2026, meningkatkan total saham beredar dari 99,86 miliar menjadi 107,31 miliar lembar.',
    key_facts: [
      'Jumlah saham baru: 7.455.282.926 lembar (7,46% dari total saham setelah penerbitan)',
      'Harga pelaksanaan: Rp 100 per saham (setara nilai nominal)',
      'Total dana yang dihimpun: Rp 745,5 miliar',
      'Tanggal pelaksanaan: 19 Juni 2026',
      'Dasar hukum: POJK No. 14/POJK.04/2019, disetujui RUPSLB 30 Juni 2025',
      'Saham setelah penambahan: 107.312.842.189 lembar',
    ],
    impact_reasons: [
      'Dilusi kepemilikan pemegang saham lama sebesar ~7,5% tanpa hak memesan terlebih dahulu',
      'Harga pelaksanaan Rp 100 jauh di bawah harga pasar, berpotensi menekan harga saham',
      'Penerbitan saham tanpa HMETD tidak memberikan kesempatan pemegang saham lama mempertahankan proporsi kepemilikan',
      'Volume saham beredar meningkat signifikan dapat menekan likuiditas dan valuasi per lembar',
    ],
    prediction_rationale:
      'Penerbitan saham baru tanpa HMETD sebesar 7,46% dari total saham beredar pada harga di bawah harga pasar berpotensi menciptakan tekanan jual. Pasar cenderung merespons negatif aksi korporasi yang bersifat dilutif tanpa premium harga.',
    short_term_outlook:
      'Tekanan jual diperkirakan terjadi dalam 1–3 hari setelah pengumuman. Harga berpotensi turun 5–10% mendekati harga pelaksanaan Rp 100.',
    medium_term_outlook:
      'Jika dana hasil penerbitan digunakan untuk ekspansi bisnis yang menghasilkan pendapatan, harga dapat pulih dalam 2–4 minggu. Pantau penggunaan dana dan guidance manajemen.',
    raw_data: {
      'Nomor Surat': '036/CS/MNCTOURISM/VI/2026',
      'Tanggal Keterbukaan': '25 Juni 2025',
      'Tanggal RUPS': '30 Juni 2025',
      'Saham Sebelum': '99.857.559.263',
      'Jumlah Saham Baru': '7.455.282.926',
      'Harga Pelaksanaan': 'Rp 100',
      'Saham Setelah': '107.312.842.189',
      'Tanggal Pelaksanaan': '19 Juni 2026',
      'Total Dilaksanakan': '2.300.430.000',
    },
  },

  '2': {
    id: '2',
    ticker: 'BBRI',
    company_name: 'Bank Rakyat Indonesia (Persero) Tbk',
    announcement_date: '2026-06-10',
    category: 'DIVIDEN',
    title: 'Pengumuman Dividen Tunai Interim Tahun Buku 2026',
    impact_sentiment: 'POSITIVE',
    impact_score: 72,
    price_prediction: 'BULLISH',
    summary:
      'BRI mengumumkan pembagian dividen tunai interim tahun buku 2026 sebesar Rp 168 per saham, mencerminkan dividend yield sekitar 4,2% berdasarkan harga pasar saat ini. Cum date ditetapkan 25 Juni 2026 dengan pembayaran pada 10 Juli 2026.',
    key_facts: [
      'Dividen per saham: Rp 168',
      'Cum date: 25 Juni 2026',
      'Ex date: 26 Juni 2026',
      'Tanggal pembayaran: 10 Juli 2026',
      'Dividend yield estimasi: ~4,2%',
      'Total dividen yang dibayarkan: Rp 20,1 triliun',
    ],
    impact_reasons: [
      'Dividen interim mencerminkan kinerja keuangan kuartal I 2026 yang solid',
      'Yield 4,2% menarik dibanding rata-rata industri perbankan',
      'Sinyal positif manajemen terhadap profitabilitas sepanjang tahun',
      'Potensi window dressing menjelang cum date mendorong permintaan saham',
    ],
    prediction_rationale:
      'Pengumuman dividen interim dengan yield menarik biasanya mendorong kenaikan harga menjelang cum date. Investor institusi cenderung masuk untuk menangkap dividen.',
    short_term_outlook:
      'Harga berpotensi naik 3–6% dalam 5 hari ke depan menjelang cum date 25 Juni 2026.',
    medium_term_outlook:
      'Setelah ex date harga biasanya terkoreksi sebesar nilai dividen. Dalam 2–3 minggu harga cenderung kembali ke level sebelum cum date jika fundamental tetap kuat.',
    raw_data: {
      'Dividen per Saham': 'Rp 168',
      'Cum Date': '25 Juni 2026',
      'Ex Date': '26 Juni 2026',
      'Recording Date': '27 Juni 2026',
      'Tanggal Pembayaran': '10 Juli 2026',
      'Sumber Dana': 'Laba Bersih Kuartal I 2026',
    },
  },

  '3': {
    id: '3',
    ticker: 'TLKM',
    company_name: 'Telkom Indonesia (Persero) Tbk',
    announcement_date: '2026-06-09',
    category: 'LAPKEU',
    title: 'Laporan Keuangan Kuartal I 2026 – Laba Bersih Tumbuh 8,3%',
    impact_sentiment: 'POSITIVE',
    impact_score: 45,
    price_prediction: 'BULLISH',
    summary:
      'Telkom Indonesia membukukan laba bersih Rp 6,8 triliun pada Q1 2026, tumbuh 8,3% YoY didorong segmen IndiHome dan enterprise digital. Pendapatan konsolidasi naik 6,1% menjadi Rp 38,2 triliun dengan EBITDA margin 49,2%.',
    key_facts: [
      'Laba bersih Q1 2026: Rp 6,8 triliun (+8,3% YoY)',
      'Pendapatan konsolidasi: Rp 38,2 triliun (+6,1% YoY)',
      'EBITDA: Rp 18,8 triliun, margin 49,2%',
      'Pelanggan IndiHome: 9,4 juta (+12% YoY)',
      'Segmen enterprise digital tumbuh 22% YoY',
      'Capex Q1: Rp 5,1 triliun, fokus ekspansi fiber',
    ],
    impact_reasons: [
      'Pertumbuhan laba 8,3% melampaui konsensus analis 6,5%',
      'Margin EBITDA 49,2% mencerminkan efisiensi operasional yang solid',
      'Pertumbuhan enterprise digital 22% menunjukkan diversifikasi revenue yang berhasil',
      'Guidance manajemen untuk FY2026 dipertahankan positif',
    ],
    prediction_rationale:
      'Laporan keuangan yang melampaui ekspektasi dengan pertumbuhan laba double digit dan margin yang solid menjadi katalis positif untuk kenaikan harga saham.',
    short_term_outlook:
      'Potensi kenaikan 4–7% dalam 3–5 hari setelah rilis laporan keuangan, didorong pembelian investor institusi.',
    medium_term_outlook:
      'Dengan fundamental yang kuat, harga berpotensi menuju target analis Rp 3.800–4.000 dalam 2–4 minggu ke depan.',
    raw_data: {
      'Laba Bersih Q1 2026': 'Rp 6,8 triliun',
      'Pertumbuhan YoY': '+8,3%',
      'Pendapatan': 'Rp 38,2 triliun',
      'EBITDA Margin': '49,2%',
      'Pelanggan IndiHome': '9,4 juta',
      'Capex': 'Rp 5,1 triliun',
    },
  },

  '4': {
    id: '4',
    ticker: 'GOTO',
    company_name: 'GoTo Gojek Tokopedia Tbk',
    announcement_date: '2026-06-08',
    category: 'RUPS',
    title: 'Hasil RUPST 2026 – Persetujuan Perubahan Susunan Direksi',
    impact_sentiment: 'NEUTRAL',
    impact_score: 5,
    price_prediction: 'SIDEWAYS',
    summary:
      'RUPST GoTo menyetujui perubahan susunan Direksi dan Dewan Komisaris, termasuk pengangkatan CEO baru. Rapat juga menyetujui laporan tahunan 2025 tanpa pembagian dividen mengingat perusahaan masih dalam fase pertumbuhan.',
    key_facts: [
      'CEO baru diangkat menggantikan posisi sebelumnya',
      'Tidak ada pembagian dividen untuk tahun buku 2025',
      'Laporan tahunan 2025 disetujui dalam RUPST',
      'Perubahan 3 posisi Direksi dan 1 Komisaris Independen',
      'Strategi fokus profitabilitas dipertahankan untuk 2026',
    ],
    impact_reasons: [
      'Pergantian CEO menciptakan ketidakpastian jangka pendek terhadap arah strategi',
      'Tidak ada dividen sesuai ekspektasi pasar, dampak netral',
      'Kesinambungan strategi profitabilitas menjaga sentimen stabil',
    ],
    prediction_rationale:
      'Pergantian manajemen biasanya menciptakan volatilitas jangka pendek namun tanpa katalis signifikan harga cenderung bergerak sideways menunggu kejelasan strategi CEO baru.',
    short_term_outlook:
      'Pergerakan sideways dengan volatilitas moderat. Pasar menunggu guidance strategi dari CEO baru.',
    medium_term_outlook:
      'Jika CEO baru memberikan sinyal strategi yang jelas dan terukur dalam 2–4 minggu, harga berpotensi breakout ke atas.',
    raw_data: {
      'Tanggal RUPST': '8 Juni 2026',
      'Dividen': 'Tidak ada',
      'Perubahan Direksi': '3 posisi',
      'Perubahan Komisaris': '1 posisi',
      'Kuorum': '68,4%',
    },
  },

  '5': {
    id: '5',
    ticker: 'ANTM',
    company_name: 'Aneka Tambang Tbk',
    announcement_date: '2026-06-07',
    category: 'MERGER',
    title: 'Rencana Akuisisi 60% Saham PT Nusa Halmahera Minerals',
    impact_sentiment: 'POSITIVE',
    impact_score: 63,
    price_prediction: 'BULLISH',
    summary:
      'Antam mengumumkan rencana akuisisi 60% saham PT Nusa Halmahera Minerals senilai Rp 2,4 triliun. Perusahaan target memiliki cadangan emas terbukti 1,2 juta troy ounce di Maluku Utara, berpotensi meningkatkan produksi emas Antam 35% dalam 3 tahun.',
    key_facts: [
      'Target akuisisi: 60% saham PT Nusa Halmahera Minerals',
      'Nilai transaksi: Rp 2,4 triliun',
      'Cadangan emas terbukti: 1,2 juta troy ounce',
      'Potensi peningkatan produksi emas: +35% dalam 3 tahun',
      'Sumber pendanaan: 60% kas internal, 40% pinjaman bank',
      'Target closing: Q3 2026 (menunggu persetujuan regulator)',
    ],
    impact_reasons: [
      'Penambahan cadangan emas 1,2 juta troy ounce memperkuat pipeline produksi jangka panjang',
      'Valuasi akuisisi dinilai wajar oleh konsensus analis',
      'Sinergi dengan operasi tambang Antam yang sudah berjalan di Maluku Utara',
      'Ekspansi aset produktif mendukung pertumbuhan revenue jangka menengah',
    ],
    prediction_rationale:
      'Akuisisi aset tambang dengan cadangan terbukti yang signifikan pada harga wajar merupakan katalis positif. Investor tambang menghargai pertumbuhan cadangan sebagai indikator nilai jangka panjang.',
    short_term_outlook:
      'Potensi kenaikan 6–10% dalam 5 hari ke depan seiring antusiasme pasar terhadap ekspansi cadangan.',
    medium_term_outlook:
      'Jika persetujuan regulator berjalan lancar, harga berpotensi naik 15–20% dalam 4 minggu. Pantau perkembangan proses due diligence dan approval OJK.',
    raw_data: {
      'Target': 'PT Nusa Halmahera Minerals',
      'Porsi Akuisisi': '60%',
      'Nilai Transaksi': 'Rp 2,4 triliun',
      'Cadangan Emas': '1,2 juta troy ounce',
      'Sumber Dana': '60% kas, 40% pinjaman',
      'Target Closing': 'Q3 2026',
    },
  },

  '6': {
    id: '6',
    ticker: 'MNCN',
    company_name: 'Media Nusantara Citra Tbk',
    announcement_date: '2026-06-06',
    category: 'BUYBACK',
    title: 'Program Buyback Saham Senilai Rp 500 Miliar',
    impact_sentiment: 'POSITIVE',
    impact_score: 38,
    price_prediction: 'BULLISH',
    summary:
      'MNCN mengumumkan program pembelian kembali saham (buyback) senilai maksimal Rp 500 miliar selama 12 bulan ke depan. Program ini mencerminkan keyakinan manajemen bahwa harga saham saat ini undervalued.',
    key_facts: [
      'Nilai maksimal buyback: Rp 500 miliar',
      'Periode pelaksanaan: 12 bulan',
      'Harga maksimal pembelian: Rp 1.200 per saham',
      'Saham yang dibeli akan disimpan sebagai treasury stock',
      'Dasar hukum: POJK No. 29/POJK.04/2023',
      'Sumber dana: kas internal',
    ],
    impact_reasons: [
      'Buyback mengurangi jumlah saham beredar sehingga meningkatkan EPS per lembar',
      'Sinyal manajemen bahwa saham dinilai undervalued pada harga saat ini',
      'Permintaan berkelanjutan dari perusahaan selama 12 bulan memberikan support harga',
    ],
    prediction_rationale:
      'Program buyback menciptakan floor price dan mengurangi tekanan jual di pasar. Kombinasi EPS accretion dan sinyal positif manajemen mendorong sentimen bullish.',
    short_term_outlook:
      'Kenaikan moderat 3–5% dalam 3–5 hari, dengan support kuat di harga pelaksanaan buyback Rp 1.200.',
    medium_term_outlook:
      'Dengan dukungan buyback aktif, harga berpotensi bergerak menuju Rp 1.300–1.400 dalam 3–4 minggu.',
    raw_data: {
      'Nilai Buyback': 'Rp 500 miliar',
      'Periode': '12 bulan',
      'Harga Maksimal': 'Rp 1.200',
      'Perlakuan Saham': 'Treasury Stock',
      'Sumber Dana': 'Kas Internal',
    },
  },

  '7': {
    id: '7',
    ticker: 'WSKT',
    company_name: 'Waskita Karya (Persero) Tbk',
    announcement_date: '2026-06-05',
    category: 'PMHMETD',
    title: 'Rights Issue – Penawaran Umum Terbatas V',
    impact_sentiment: 'NEGATIVE',
    impact_score: -40,
    price_prediction: 'BEARISH',
    summary:
      'Waskita Karya melaksanakan Penawaran Umum Terbatas V (rights issue) dengan menerbitkan 18,6 miliar saham baru pada harga pelaksanaan Rp 168 per saham, di bawah harga pasar. Total dana yang dihimpun mencapai Rp 3,1 triliun untuk kebutuhan restrukturisasi utang.',
    key_facts: [
      'Jumlah saham baru: 18.600.000.000 lembar',
      'Harga pelaksanaan: Rp 168 per saham',
      'Total dana dihimpun: Rp 3,1 triliun',
      'Rasio rights: 3 saham baru per 5 saham lama',
      'Tujuan penggunaan dana: restrukturisasi utang 80%, modal kerja 20%',
      'Cum date rights: 20 Juni 2026',
    ],
    impact_reasons: [
      'Dilusi kepemilikan signifikan dengan rasio 3:5 memberatkan pemegang saham lama',
      'Penggunaan dana mayoritas untuk restrukturisasi utang (bukan ekspansi) menunjukkan tekanan keuangan',
      'Harga pelaksanaan diskon terhadap harga pasar menciptakan tekanan jual',
      'Investor yang tidak mengambil rights akan terdilusi secara signifikan',
    ],
    prediction_rationale:
      'Rights issue untuk keperluan restrukturisasi utang merupakan sinyal negatif kondisi keuangan. Dilusi besar dengan diskon harga berpotensi menekan harga saham secara berkelanjutan.',
    short_term_outlook:
      'Tekanan jual signifikan menjelang cum date. Harga berpotensi turun 8–12% mendekati harga pelaksanaan rights Rp 168.',
    medium_term_outlook:
      'Jika restrukturisasi berjalan lancar dan mengurangi beban bunga secara signifikan, harga dapat stabilisasi dalam 3–4 minggu. Namun recovery membutuhkan waktu lebih panjang.',
    raw_data: {
      'Jenis Aksi': 'Penawaran Umum Terbatas V',
      'Saham Baru': '18.600.000.000',
      'Harga Pelaksanaan': 'Rp 168',
      'Rasio': '3 baru : 5 lama',
      'Total Dana': 'Rp 3,1 triliun',
      'Penggunaan Dana': '80% restrukturisasi, 20% modal kerja',
      'Cum Date': '20 Juni 2026',
    },
  },
};
