import React from 'react';
import { NominalTier } from '../types';

interface TierChipsProps {
  tiers: NominalTier[];
  onSelectTier?: (tier: NominalTier) => void;
}

const formatRupiah = (val: number) => {
  const sign = val > 0 ? '+' : val < 0 ? '-' : '';
  return `${sign}Rp${Math.abs(Math.round(val)).toLocaleString('id-ID')}`;
};

const formatGrams = (g: number) => {
  if (!Number.isFinite(g) || g <= 0) return '0, 000g';
  // Formats like "4, 183g" or "12, 549g" matching the screenshot
  const whole = Math.floor(g);
  const frac = Math.round((g - whole) * 1000);
  return `${whole}, ${frac.toString().padStart(3, '0')}g`;
};

export const TierChips: React.FC<TierChipsProps> = ({ tiers, onSelectTier }) => {
  if (!tiers.length) return null;

  return (
    <div className="w-full mt-3 sm:mt-4">
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {tiers.map((tier) => {
          const isPositive = tier.spreadRp >= 0;
          return (
            <div
              key={tier.nominal}
              onClick={() => onSelectTier?.(tier)}
              className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#12161f] border border-[#232b3b] shadow-sm hover:border-amber-500/40 hover:bg-[#161c28] transition-all cursor-pointer group"
              title={`Klik untuk simulasi investasi ${tier.label}`}
            >
              {/* Nominal Label (Gold / Amber) */}
              <span className="text-sm sm:text-base font-black text-amber-400 font-outfit">
                {tier.label}
              </span>

              {/* Profit / Plus Spread Badge (Green or Red) */}
              <span
                className={`text-xs sm:text-sm font-bold font-mono-num px-1.5 py-0.5 rounded-md ${
                  isPositive
                    ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-600/30'
                    : 'text-rose-400 bg-rose-950/60 border border-rose-600/30'
                }`}
              >
                {formatRupiah(tier.spreadRp)}
              </span>

              {/* Weight in Grams (Muted Silver) */}
              <span className="text-xs sm:text-sm font-semibold text-zinc-300 font-mono-num">
                {formatGrams(tier.grams)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
