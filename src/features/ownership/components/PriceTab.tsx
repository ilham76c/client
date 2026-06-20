'use client';

import { Skeleton } from '@mui/material';
import { useEmitenPrices } from '../hooks/useEmiten';
import PriceChart from './PriceChart';

interface Props {
  ticker: string;
}

export default function PriceTab({ ticker }: Props) {
  const { data, isLoading, error } = useEmitenPrices(ticker, { limit: 90 });
  const prices = data?.data.prices ?? [];

  const last = prices[prices.length - 1];
  const first = prices[0];
  const change = last && first ? last.close - first.close : 0;
  const changePct = first && first.close !== 0 ? (change / first.close) * 100 : 0;
  const isUp = change >= 0;

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton variant="rounded" height={80} sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
        <Skeleton variant="rounded" height={360} sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
        Gagal memuat data harga.
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {last && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-6 flex-wrap">
          <div>
            <div className="text-xs text-gray-500 mb-1">Last Close</div>
            <div className="text-2xl font-bold text-white">
              {last.close.toLocaleString('id-ID')}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Periode Ini</div>
            <div className={`text-lg font-semibold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
              {isUp ? '+' : ''}{change.toLocaleString('id-ID')} ({changePct.toFixed(2)}%)
            </div>
          </div>

          <div className="ml-auto text-xs text-gray-500">
            {first?.date} – {last.date}
          </div>
        </div>
      )}

      <PriceChart data={prices} />
    </div>
  );
}