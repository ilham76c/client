import { useEffect, useState } from 'react';
import {
  useAnnouncements,
  useAnnouncementAnalysis,
} from '../../announcement/hooks/useAnnouncement';
import type {
  AnnouncementAnalysis,
  AnnouncementListItem,
  ImpactSentiment,
  PricePrediction,
} from '../../announcement/types';
import { LoadingSpinner } from '@/components/ui';

import { formatDate } from '@/lib/utils/formatters';
import DataState from '@/components/ui/DataState';

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

interface ImpactBadgeProps {
  sentiment: ImpactSentiment;
}

export function ImpactBadge({ sentiment }: ImpactBadgeProps) {
  const config = {
    POSITIVE: {
      label: 'Positif',
      className:
        'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    },
    NEGATIVE: {
      label: 'Negatif',
      className: 'bg-red-500/15 text-red-400 border border-red-500/30',
    },
    NEUTRAL: {
      label: 'Netral',
      className: 'bg-gray-500/15 text-gray-400 border border-gray-500/30',
    },
  };
  const { label, className } = config[sentiment];
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${className}`}
    >
      {sentiment === 'POSITIVE' ? '↑' : sentiment === 'NEGATIVE' ? '↓' : '→'}{' '}
      {label}
    </span>
  );
}

interface PriceBadgeProps {
  prediction: PricePrediction;
}

export function PriceBadge({ prediction }: PriceBadgeProps) {
  const config = {
    BULLISH: {
      label: 'Bullish',
      icon: '▲',
      className:
        'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    },
    BEARISH: {
      label: 'Bearish',
      icon: '▼',
      className: 'bg-red-500/15 text-red-400 border border-red-500/30',
    },
    SIDEWAYS: {
      label: 'Sideways',
      icon: '◆',
      className: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
    },
  };
  const { label, icon, className } = config[prediction];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${className}`}
    >
      {icon} {label}
    </span>
  );
}

interface ImpactScoreProps {
  score: number; // -100 to +100
}

function ImpactScore({ score }: ImpactScoreProps) {
  const clamped = Math.max(-100, Math.min(100, score));
  // Convert -100..+100 to 0..100% for bar width, centered at 50%
  const isPositive = clamped >= 0;
  const barWidth = Math.abs(clamped);

  const barColor =
    clamped > 20
      ? 'bg-emerald-500'
      : clamped < -20
        ? 'bg-red-500'
        : 'bg-yellow-500';

  const label = clamped > 0 ? `+${clamped}` : `${clamped}`;

  return (
    <div>
      <div className='flex justify-between items-center mb-2'>
        <span className='text-sm text-gray-400'>Impact Score</span>
        <span
          className={`text-lg font-bold ${
            clamped > 20
              ? 'text-emerald-400'
              : clamped < -20
                ? 'text-red-400'
                : 'text-yellow-400'
          }`}
        >
          {label}
        </span>
      </div>

      {/* Track */}
      <div className='relative h-3 bg-gray-800 rounded-full overflow-hidden'>
        {/* Center line */}
        <div className='absolute left-1/2 top-0 w-px h-full bg-gray-600 z-10' />
        {/* Bar */}
        <div
          className={`absolute top-0 h-full ${barColor} rounded-full transition-all duration-700`}
          style={{
            width: `${barWidth / 2}%`,
            left: isPositive ? '50%' : `${50 - barWidth / 2}%`,
          }}
        />
      </div>

      <div className='flex justify-between mt-1'>
        <span className='text-xs text-red-400'>−100</span>
        <span className='text-xs text-gray-500'>0</span>
        <span className='text-xs text-emerald-400'>+100</span>
      </div>
    </div>
  );
}

interface AnnouncementResultProps {
  analysis: AnnouncementAnalysis;
  onReset: () => void;
}

function AnnouncementResult({ analysis, onReset }: AnnouncementResultProps) {
  return (
    <div className='space-y-5'>
      {/* Header */}
      <div className='flex items-start justify-between gap-4 flex-wrap'>
        <div>
          <div className='flex items-center gap-3 mb-1 flex-wrap'>
            <span className='text-2xl font-bold text-white'>
              {analysis.ticker}
            </span>
            <span className='text-sm bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-full'>
              {CATEGORY_LABELS[analysis.category] ?? analysis.category}
            </span>
          </div>
          <p className='text-gray-400 text-sm'>{analysis.company_name}</p>
          <p className='text-gray-500 text-xs mt-1'>
            {formatDate(analysis.announcement_date, 'DD MMMM YYYY')}
          </p>
        </div>

        <button
          onClick={onReset}
          className='text-sm text-gray-500 hover:text-gray-300 border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition-colors'
        >
          ← Analisis baru
        </button>
      </div>

      {/* Summary */}
      <div className='bg-gray-900 border border-gray-800 rounded-xl p-5'>
        <h2 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>
          Ringkasan
        </h2>
        <p className='text-white leading-relaxed'>{analysis.summary}</p>
      </div>

      {/* Key Facts */}
      <div className='bg-gray-900 border border-gray-800 rounded-xl p-5'>
        <h2 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3'>
          Fakta Utama
        </h2>
        <ul className='space-y-2'>
          {analysis.key_facts.map((fact, i) => (
            <li key={i} className='flex gap-3 text-sm text-gray-300'>
              <span className='text-blue-500 mt-0.5 shrink-0'>•</span>
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Impact + Score side by side on desktop */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        {/* Impact */}
        <div className='bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
              Dampak
            </h2>
            <ImpactBadge sentiment={analysis.impact_sentiment} />
          </div>
          <ImpactScore score={analysis.impact_score} />
          <ul className='space-y-2 pt-1'>
            {analysis.impact_reasons.map((reason, i) => (
              <li key={i} className='flex gap-2 text-sm text-gray-300'>
                <span
                  className={`shrink-0 mt-0.5 ${
                    analysis.impact_sentiment === 'POSITIVE'
                      ? 'text-emerald-500'
                      : analysis.impact_sentiment === 'NEGATIVE'
                        ? 'text-red-500'
                        : 'text-yellow-500'
                  }`}
                >
                  ›
                </span>
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Price Prediction */}
        <div className='bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
              Prediksi Harga
            </h2>
            <PriceBadge prediction={analysis.price_prediction} />
          </div>
          <p className='text-sm text-gray-300 leading-relaxed'>
            {analysis.prediction_rationale}
          </p>

          <div className='space-y-3 pt-1'>
            <div className='bg-gray-800/60 rounded-lg p-3'>
              <p className='text-xs text-gray-500 mb-1'>
                Jangka Pendek (1–5 hari)
              </p>
              <p className='text-sm text-white'>
                {analysis.short_term_outlook}
              </p>
            </div>
            <div className='bg-gray-800/60 rounded-lg p-3'>
              <p className='text-xs text-gray-500 mb-1'>
                Jangka Menengah (1–4 minggu)
              </p>
              <p className='text-sm text-white'>
                {analysis.medium_term_outlook}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Data (if any) */}
      {analysis.raw_data && Object.keys(analysis.raw_data).length > 0 && (
        <div className='bg-gray-900 border border-gray-800 rounded-xl p-5'>
          <h2 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3'>
            Data Terstruktur
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2'>
            {Object.entries(analysis.raw_data).map(([key, value]) => (
              <div
                key={key}
                className='flex justify-between text-sm border-b border-gray-800 py-1.5'
              >
                <span className='text-gray-500'>{key}</span>
                <span className='text-white font-medium text-right ml-4'>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface AnnouncementListProps {
  items: AnnouncementListItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function AnnouncementList({
  items,
  selectedId,
  onSelect,
}: AnnouncementListProps) {
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
              <p className='text-sm text-gray-300 truncate'>{item.title}</p>
              <p className='text-xs text-gray-600 mt-1'>
                {formatDate(item.announcement_date, 'DD MMM YYYY')}
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

export default function AnnouncementTab({ ticker }: { ticker: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedId(null);
  }, [ticker]);

  const {
    data: listData,
    isLoading: listLoading,
    error: listError,
  } = useAnnouncements(ticker);
  const { data: analysis, isLoading: detailLoading } =
    useAnnouncementAnalysis(selectedId);

  const items = listData?.announcements ?? [];

  return (
    <div className='grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start'>
      {/* LEFT — list panel */}
      <div className='space-y-4'>
        {listError && (
          <DataState
            state='error'
            title='Unable to Load Announcements Data'
            message='Please try again later.'
          />
        )}

        {!listLoading && (
          <AnnouncementList
            items={items}
            selectedId={selectedId}
            onSelect={(announcement_uuid) => {
              setSelectedId(announcement_uuid);
            }}
          />
        )}
      </div>

      {/* RIGHT — detail panel */}
      <div>
        {!selectedId && (
          <div className='hidden lg:flex items-center justify-center h-64 rounded-2xl border border-dashed border-gray-800 text-gray-600 text-sm'>
            Pilih pengumuman untuk melihat detail analisis
          </div>
        )}

        {detailLoading && <LoadingSpinner />}

        {selectedId && analysis && !detailLoading && (
          <AnnouncementResult
            analysis={analysis}
            onReset={() => setSelectedId(null)}
          />
        )}
      </div>
    </div>
  );
}
