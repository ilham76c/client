'use client';

import { useState } from 'react';
import { DailyMarketRaw } from '../types';
import DailyMarketTable from './DailyMarketTable';
import DailyMarketForeignChart from './DailyMarketForeignChart';

type ViewMode = 'table' | 'chart';

export default function DailyMarketSection({
  data,
}: {
  data: DailyMarketRaw[];
}) {
  const [view, setView] = useState<ViewMode>('table');

  return (
    <div className='bg-gray-900 border border-gray-800 rounded-xl p-6'>
      <div className='flex items-center justify-between mb-4 flex-wrap gap-3'>
        <h2 className='font-semibold text-white'>Data Perdagangan Harian</h2>

        <div className='flex gap-1.5'>
          <button
            onClick={() => setView('table')}
            className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
              view === 'table'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                : 'border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-300'
            }`}
          >
            Tabel
          </button>
          <button
            onClick={() => setView('chart')}
            className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
              view === 'chart'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                : 'border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-300'
            }`}
          >
            Foreign Flow
          </button>
        </div>
      </div>

      {view === 'table' ? (
        <DailyMarketTable data={data} embedded />
      ) : (
        <DailyMarketForeignChart data={data} />
      )}
    </div>
  );
}
