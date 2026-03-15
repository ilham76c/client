'use client';

import { useShareholders } from '../hooks/useShareholders';
import { ShareholderRow } from '../types';

export default function ShareholderTable({ ticker }: { ticker: string }) {
  const { data, loading, error } = useShareholders({ ticker });

  if (loading) {
    return (
      <div className='animate-pulse text-gray-400'>Loading shareholders...</div>
    );
  }
  if (error) return <div className='text-red-600'>{error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className='bg-gray-900 border border-gray-800 rounded-xl p-6'>
      <h2 className='mb-6 font-semibold'>Top Shareholders</h2>

      <table className='w-full text-sm'>
        <thead className='text-gray-400 border-b border-gray-800'>
          <tr>
            <th className='text-left pb-3'>Shareholder</th>
            <th className='text-left pb-3'>Category</th>
            <th className='text-right pb-3'>Percentage</th>
            <th className='text-right pb-3'>Shares</th>
          </tr>
        </thead>

        <tbody>
          {data.shareholders.map((s: ShareholderRow, i) => (
            <tr key={i} className='border-b border-gray-800'>
              <td className='py-3'>{s.name}</td>
              <td className='py-3'>{s.category}</td>
              <td className='text-right'>{s.percentage}%</td>
              <td className='text-right'>
                {new Intl.NumberFormat('id-ID').format(s.shares_count)}
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot className='text-gray-400 border-b border-gray-800'>
          <tr>
            <td className='text-left pb-3 pt-4 font-bold' colSpan={2}>
              Total
            </td>
            <td className='text-right font-bold'>{data.total_percentage}%</td>
            <td className='text-right font-bold'>
              {new Intl.NumberFormat('id-ID').format(data.total_shares)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
