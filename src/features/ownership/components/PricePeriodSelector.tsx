'use client';

import { PRICE_PERIODS, PricePeriod } from '../utils/pricePeriod';

interface Props {
  value: PricePeriod;
  onChange: (period: PricePeriod) => void;
}

export default function PricePeriodSelector({ value, onChange }: Props) {
  return (
    <div className="inline-flex rounded-lg border border-gray-800 bg-gray-900 p-1 gap-1">
      {PRICE_PERIODS.map((p) => {
        const isActive = p.value === value;
        return (
          <button
            key={p.value}
            onClick={() => onChange(p.value)}
            className={`
              px-3 py-1.5 text-sm rounded-md transition-colors
              ${isActive
                ? 'bg-blue-500/15 text-blue-400 font-medium'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}
            `}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}