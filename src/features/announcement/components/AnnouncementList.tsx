import type { AnnouncementListItem } from '../types';
import { ImpactBadge, PriceBadge } from './AnnouncementBadges';
import { formatDate } from '@/lib/utils/formatters';

const CATEGORY_LABELS: Record<string, string> = {
  PMTHMETD: 'Penambahan Modal Tanpa HMETD',
  PMHMETD: 'Rights Issue',
  DIVIDEN: 'Dividen',
  MERGER: 'Merger & Akuisisi',
  BUYBACK: 'Buyback',
  LAPKEU: 'Laporan Keuangan',
  RUPS: 'RUPS',
  OTHER: 'Lainnya',
};

interface Props {
  items: AnnouncementListItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function AnnouncementList({
  items,
  selectedId,
  onSelect,
}: Props) {
  if (items.length === 0) {
    return (
      <div className='text-center py-16 text-gray-500'>
        Tidak ada pengumuman ditemukan
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      {items.map((item) => (
        <button
          key={item.announcement_uuid}
          onClick={() => onSelect(item.announcement_uuid)}
          className={`
            w-full text-left p-4 rounded-xl border transition-all
            ${
              selectedId === item.announcement_uuid
                ? 'border-blue-500/50 bg-blue-500/5'
                : 'border-gray-800 bg-gray-900 hover:border-gray-700 hover:bg-gray-800/60'
            }
          `}
        >
          <div className='flex items-start justify-between gap-3'>
            <div className='min-w-0'>
              <div className='flex items-center gap-2 flex-wrap mb-1'>
                <span className='font-bold text-white'>{item.ticker}</span>
                <span className='text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full'>
                  {CATEGORY_LABELS[item.category] ?? item.category}
                </span>
              </div>
              <p className='text-gray-400 text-sm mb-1 truncate'>
                {item.company_name}
              </p>
              <p className='text-sm text-gray-300 line-clamp-2 hover:line-clamp-none transition-all duration-300 cursor-pointer'>
                {item.title}
              </p>
              <p className='text-xs text-gray-600 mt-1'>
                {formatDate(item.announcement_date, 'DD MMM YYYY HH:mm:ss')}
              </p>
            </div>
            <div className='flex flex-col items-end gap-1.5 shrink-0'>
              <ImpactBadge sentiment={item.impact_sentiment} />
              <PriceBadge prediction={item.price_prediction} />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
