// Hero.tsx
import Link from 'next/link';

export default function Hero() {
  return (
    <section className='py-24 text-center bg-gray-950'>
      <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-xs text-gray-400 mb-6'>
        <span className='w-1.5 h-1.5 rounded-full bg-emerald-400' />
        Data pasar saham Indonesia
      </div>

      <h1 className='text-4xl md:text-5xl font-bold mb-6 text-white'>
        Ketahui Siapa yang Menguasai Pasar
      </h1>

      <p className='text-gray-400 mb-10 text-lg max-w-xl mx-auto'>
        EquityLens membantu investor menganalisis kepemilikan institusional dan
        perubahan pemegang saham di emiten Indonesia.
      </p>

      <div className='flex justify-center gap-4 flex-wrap'>
        <Link
          href='/stocks'
          className='bg-emerald-500 hover:bg-emerald-400 transition-colors text-gray-950 font-medium px-6 py-3 rounded-lg'
        >
          Jelajahi Saham
        </Link>

        <Link
          href='/ownership'
          className='border border-gray-700 hover:border-gray-600 transition-colors text-gray-200 px-6 py-3 rounded-lg'
        >
          Lihat Grafik Kepemilikan
        </Link>
      </div>
    </section>
  );
}
