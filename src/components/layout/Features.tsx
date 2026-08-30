// Features.tsx
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import SwapVertIcon from '@mui/icons-material/SwapVert';

const FEATURES = [
  {
    icon: TrendingUpIcon,
    title: 'Analisis Harga',
    description:
      'Grafik candlestick dengan volume, tertinggi/terendah periode, dan zoom untuk data historis panjang.',
  },
  {
    icon: GroupIcon,
    title: 'Ownership Intelligence',
    description:
      'Telusuri kepemilikan di atas dan di bawah 5%, lengkap dengan distribusi per sekuritas.',
  },
  {
    icon: SwapVertIcon,
    title: 'Insider Activity',
    description:
      'Pantau siapa yang membeli dan menjual saham dari pihak terafiliasi emiten.',
  },
];

export default function Features() {
  return (
    <section className='py-20 bg-gray-950'>
      <div className='max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-6'>
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className='bg-gray-900 p-6 rounded-xl border border-gray-800'
          >
            <div className='w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4'>
              <Icon sx={{ fontSize: 20, color: '#34d399' }} />
            </div>
            <h3 className='font-semibold mb-2 text-white'>{title}</h3>
            <p className='text-gray-400 text-sm'>{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
