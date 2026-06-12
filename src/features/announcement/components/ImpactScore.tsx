interface ImpactScoreProps {
  score: number; // -100 to +100
}

export function ImpactScore({ score }: ImpactScoreProps) {
  const clamped = Math.max(-100, Math.min(100, score));
  // Convert -100..+100 to 0..100% for bar width, centered at 50%
  const isPositive = clamped >= 0;
  const barWidth = Math.abs(clamped);

  const barColor = clamped > 20
    ? 'bg-emerald-500'
    : clamped < -20
    ? 'bg-red-500'
    : 'bg-yellow-500';

  const label = clamped > 0 ? `+${clamped}` : `${clamped}`;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">Impact Score</span>
        <span className={`text-lg font-bold ${
          clamped > 20 ? 'text-emerald-400' : clamped < -20 ? 'text-red-400' : 'text-yellow-400'
        }`}>{label}</span>
      </div>

      {/* Track */}
      <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 w-px h-full bg-gray-600 z-10" />
        {/* Bar */}
        <div
          className={`absolute top-0 h-full ${barColor} rounded-full transition-all duration-700`}
          style={{
            width: `${barWidth / 2}%`,
            left: isPositive ? '50%' : `${50 - barWidth / 2}%`,
          }}
        />
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-xs text-red-400">−100</span>
        <span className="text-xs text-gray-500">0</span>
        <span className="text-xs text-emerald-400">+100</span>
      </div>
    </div>
  );
}
