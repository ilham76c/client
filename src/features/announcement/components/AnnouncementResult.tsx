import type { AnnouncementAnalysis } from '../types';
import { ImpactBadge, PriceBadge } from './AnnouncementBadges';
import { ImpactScore } from './ImpactScore';
import { formatDate } from '@/lib/utils/formatters';

const CATEGORY_LABELS: Record<string, string> = {
  PMTHMETD: 'Penambahan Modal Tanpa HMETD',
  PMHMETD:  'Rights Issue (HMETD)',
  DIVIDEN:  'Dividen',
  MERGER:   'Merger & Akuisisi',
  BUYBACK:  'Buyback Saham',
  LAPKEU:   'Laporan Keuangan',
  RUPS:     'RUPS',
  OTHER:    'Lainnya',
};

interface Props {
  analysis: AnnouncementAnalysis;
  onReset: () => void;
}

export default function AnnouncementResult({ analysis, onReset }: Props) {
  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <span className="text-2xl font-bold text-white">{analysis.ticker}</span>
            <span className="text-sm bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-full">
              {CATEGORY_LABELS[analysis.category] ?? analysis.category}
            </span>
          </div>
          <p className="text-gray-400 text-sm">{analysis.company_name}</p>
          <p className="text-gray-500 text-xs mt-1">
            {formatDate(analysis.announcement_date, 'DD MMMM YYYY HH:mm:ss')}
          </p>
        </div>

        <button
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-gray-300 border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition-colors"
        >
          ← Analisis baru
        </button>
      </div>

      {/* Summary */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ringkasan</h2>
        <p className="text-white leading-relaxed">{analysis.summary}</p>
      </div>

      {/* Key Facts */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Fakta Utama</h2>
        <ul className="space-y-2">
          {analysis.key_facts.map((fact, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-300">
              <span className="text-blue-500 mt-0.5 shrink-0">•</span>
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Impact + Score side by side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Impact */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dampak</h2>
            <ImpactBadge sentiment={analysis.impact_sentiment} />
          </div>
          <ImpactScore score={analysis.impact_score} />
          <ul className="space-y-2 pt-1">
            {analysis.impact_reasons.map((reason, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-300">
                <span className={`shrink-0 mt-0.5 ${
                  analysis.impact_sentiment === 'POSITIVE' ? 'text-emerald-500' :
                  analysis.impact_sentiment === 'NEGATIVE' ? 'text-red-500' : 'text-yellow-500'
                }`}>›</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Price Prediction */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Prediksi Harga</h2>
            <PriceBadge prediction={analysis.price_prediction} />
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{analysis.prediction_rationale}</p>

          <div className="space-y-3 pt-1">
            <div className="bg-gray-800/60 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Jangka Pendek (1–5 hari)</p>
              <p className="text-sm text-white">{analysis.short_term_outlook}</p>
            </div>
            <div className="bg-gray-800/60 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Jangka Menengah (1–4 minggu)</p>
              <p className="text-sm text-white">{analysis.medium_term_outlook}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Raw Data (if any) */}
      {analysis.raw_data && Object.keys(analysis.raw_data).length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Data Terstruktur</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            {Object.entries(analysis.raw_data).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm border-b border-gray-800 py-1.5">
                <span className="text-gray-500">{key}</span>
                <span className="text-white font-medium text-right ml-4">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
