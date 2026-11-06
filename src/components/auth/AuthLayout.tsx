import Link from 'next/link';
import type { ReactNode } from 'react';

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

// Dibangun sekali di level modul dengan seed tetap — hasilnya identik di
// server dan client, jadi tidak ada hydration mismatch (beda dari Math.random).
const CANDLES = (() => {
  const rand = seeded(7);
  let price = 100;
  const raw = Array.from({ length: 30 }, () => {
    const open = price;
    const close = open + (rand() - 0.45) * 14;
    const high = Math.max(open, close) + rand() * 5;
    const low = Math.min(open, close) - rand() * 5;
    price = close;
    return { open, close, high, low };
  });
  const min = Math.min(...raw.map((c) => c.low));
  const max = Math.max(...raw.map((c) => c.high));
  const y = (p: number) => 330 - ((p - min) / (max - min)) * 240;

  return raw.map((c, i) => ({
    x: 24 + i * 19,
    up: c.close >= c.open,
    bodyTop: y(Math.max(c.open, c.close)).toFixed(1),
    bodyHeight: Math.max(Math.abs(y(c.open) - y(c.close)), 2).toFixed(1),
    wickTop: y(c.high).toFixed(1),
    wickBottom: y(c.low).toFixed(1),
  }));
})();

function CandlestickBackdrop() {
  return (
    <>
      <svg
        aria-hidden='true'
        viewBox='0 0 600 360'
        preserveAspectRatio='xMidYMax slice'
        className='absolute inset-0 w-full h-full opacity-[0.22]'
      >
        {CANDLES.map((c) => {
          const color = c.up ? '#22c55e' : '#ef4444';
          return (
            <g key={c.x}>
              <line
                x1={c.x}
                x2={c.x}
                y1={c.wickTop}
                y2={c.wickBottom}
                stroke={color}
                strokeWidth='1.5'
              />
              <rect
                x={c.x - 5}
                y={c.bodyTop}
                width='10'
                height={c.bodyHeight}
                fill={color}
                rx='1'
              />
            </g>
          );
        })}
      </svg>
      {/* Pudarkan bagian atas supaya teks di atasnya tetap terbaca */}
      <div className='absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/70 to-transparent' />
    </>
  );
}

function BrandMark() {
  return (
    <Link href='/' className='inline-flex items-center gap-2'>
      <span className='w-2 h-2 rounded-full bg-emerald-400' />
      <span className='font-bold text-xl text-white tracking-tight'>
        Equity<span className='text-emerald-400'>Lens</span>
      </span>
    </Link>
  );
}

const HIGHLIGHTS = [
  'Kepemilikan investor di atas dan di bawah 5%, lengkap dengan riwayat per sekuritas',
  'Candlestick dengan volume dan aliran dana asing harian',
  'Aktivitas insider beserta broker yang dipakai di setiap transaksi',
];

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: Props) {
  return (
    <div className='min-h-screen grid lg:grid-cols-[1.05fr_1fr] bg-gray-950'>
      {/* PANEL BRAND — hanya di layar lebar */}
      <aside className='relative hidden lg:flex flex-col justify-between overflow-hidden border-r border-gray-800 bg-gray-900 p-12'>
        <CandlestickBackdrop />

        <div className='relative'>
          <BrandMark />
        </div>

        <div className='relative max-w-md'>
          <h2 className='text-3xl font-bold text-white leading-tight mb-6'>
            Ketahui siapa yang menguasai pasar
          </h2>
          <ul className='flex flex-col gap-3'>
            {HIGHLIGHTS.map((text) => (
              <li
                key={text}
                className='flex gap-3 text-sm text-gray-400 leading-relaxed'
              >
                <span className='mt-2 w-1 h-1 rounded-full bg-emerald-400 shrink-0' />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className='relative text-xs text-gray-600 max-w-sm'>
          Data hanya untuk tujuan informasi dan bukan rekomendasi investasi.
        </p>
      </aside>

      {/* PANEL FORM */}
      <main className='flex items-center justify-center px-6 py-12'>
        <div className='w-full max-w-sm'>
          <div className='lg:hidden mb-8'>
            <BrandMark />
          </div>

          <h1 className='text-2xl font-bold text-white mb-1.5'>{title}</h1>
          <p className='text-sm text-gray-500 mb-7'>{subtitle}</p>

          {children}

          <div className='mt-7 text-sm text-gray-500 text-center'>{footer}</div>
        </div>
      </main>
    </div>
  );
}
