import type { ImpactSentiment, PricePrediction } from '../types';

interface ImpactBadgeProps {
  sentiment: ImpactSentiment;
}

export function ImpactBadge({ sentiment }: ImpactBadgeProps) {
  const config = {
    POSITIVE: { label: 'Positif', className: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
    NEGATIVE: { label: 'Negatif', className: 'bg-red-500/15 text-red-400 border border-red-500/30' },
    NEUTRAL:  { label: 'Netral',  className: 'bg-gray-500/15 text-gray-400 border border-gray-500/30' },
  };
  const { label, className } = config[sentiment];
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${className}`}>
      {sentiment === 'POSITIVE' ? '↑' : sentiment === 'NEGATIVE' ? '↓' : '→'} {label}
    </span>
  );
}

interface PriceBadgeProps {
  prediction: PricePrediction;
}

export function PriceBadge({ prediction }: PriceBadgeProps) {
  const config = {
    BULLISH:  { label: 'Bullish',  icon: '▲', className: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
    BEARISH:  { label: 'Bearish',  icon: '▼', className: 'bg-red-500/15 text-red-400 border border-red-500/30' },
    SIDEWAYS: { label: 'Sideways', icon: '◆', className: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' },
  };
  const { label, icon, className } = config[prediction];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${className}`}>
      {icon} {label}
    </span>
  );
}
