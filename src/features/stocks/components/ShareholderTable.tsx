'use client';

import { useShareholders } from '../hooks/useShareholders';
import { ShareholderRow } from '../types';
import DataState from '@/components/ui/DataState';

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className='inline-block text-xs px-2 py-0.5 rounded-md bg-gray-800 text-gray-400'>
      {category}
    </span>
  );
}

function PercentageBar({ value }: { value: number }) {
  return (
    <div className='flex items-center justify-end gap-2'>
      <div className='w-16 h-1.5 rounded-full bg-gray-800 overflow-hidden'>
        <div
          className='h-full bg-emerald-500 rounded-full'
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className='text-white font-medium tabular-nums w-12 text-right'>
        {value}%
      </span>
    </div>
  );
}

export default function ShareholderTable({ ticker }: { ticker: string }) {
  const { data, loading, error } = useShareholders({ ticker });

  if (loading) {
    return (
      <div className='bg-gray-900 border border-gray-800 rounded-xl p-6'>
        <DataState state='loading' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-gray-900 border border-gray-800 rounded-xl p-6'>
        <DataState
          state='error'
          title='Gagal Memuat Data Pemegang Saham'
          message={
            error instanceof Error ? error.message : 'Silakan coba lagi nanti.'
          }
        />
      </div>
    );
  }

  if (!data || data.shareholders.length === 0) {
    return (
      <div className='bg-gray-900 border border-gray-800 rounded-xl p-6'>
        <DataState
          state='empty'
          title='Tidak Ada Data Pemegang Saham'
          message='Belum ada data pemegang saham untuk emiten ini.'
        />
      </div>
    );
  }

  return (
    <div className='bg-gray-900 border border-gray-800 rounded-xl p-6'>
      <h2 className='mb-6 font-semibold text-white'>Pemegang Saham Teratas</h2>

      <div className='overflow-x-auto'>
        <table className='w-full text-sm min-w-[560px]'>
          <thead className='text-gray-500 border-b border-gray-800'>
            <tr>
              <th className='text-left pb-3 font-medium'>Pemegang Saham</th>
              <th className='text-left pb-3 font-medium'>Kategori</th>
              <th className='text-right pb-3 font-medium'>Persentase</th>
              <th className='text-right pb-3 font-medium'>Jumlah Saham</th>
            </tr>
          </thead>

          <tbody>
            {data.shareholders.map((s: ShareholderRow) => (
              <tr
                key={s.uid ?? s.name}
                className='border-b border-gray-800 hover:bg-gray-800/40 transition-colors'
              >
                <td className='py-3 text-gray-200'>{s.name}</td>
                <td className='py-3'>
                  <CategoryBadge category={s.category} />
                </td>
                <td className='py-3'>
                  <PercentageBar value={s.percentage} />
                </td>
                <td className='py-3 text-right text-gray-300 tabular-nums'>
                  {new Intl.NumberFormat('id-ID').format(s.shares_count)}
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot className='text-gray-400'>
            <tr>
              <td
                className='text-left pb-1 pt-4 font-semibold text-white'
                colSpan={2}
              >
                Total
              </td>
              <td className='text-right pt-4 font-semibold text-white'>
                {data.total_percentage}%
              </td>
              <td className='text-right pt-4 font-semibold text-white tabular-nums'>
                {new Intl.NumberFormat('id-ID').format(data.total_shares)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
