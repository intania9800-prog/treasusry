import React from 'react';
import { PriceState } from '../types';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface PriceCardsProps {
  priceState: PriceState;
  priceFlashDir: 'up' | 'down' | null;
  onCardClick?: (cardType: 'buy' | 'sell' | 'usd') => void;
}

const formatNumber = (num: number) => {
  if (!Number.isFinite(num)) return '--';
  return Math.round(num).toLocaleString('id-ID');
};

const formatDelta = (val: number) => {
  if (!Number.isFinite(val) || val === 0) return '0';
  return (val > 0 ? '+' : '') + Math.round(val).toLocaleString('id-ID');
};

export const PriceCards: React.FC<PriceCardsProps> = ({
  priceState,
  priceFlashDir,
  onCardClick,
}) => {
  const isUp = priceState.buyChange > 0;
  const isDown = priceState.buyChange < 0;

  const flashClass =
    priceFlashDir === 'up'
      ? 'card-flash-up'
      : priceFlashDir === 'down'
      ? 'card-flash-down'
      : '';

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
        {/* BELI CARD */}
        <div
          onClick={() => onCardClick?.('buy')}
          className={`relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#181d26] to-[#0f131a] border border-[#273040]/80 p-3.5 sm:p-5 shadow-lg transition-all duration-200 hover:border-zinc-500/50 cursor-pointer group ${flashClass}`}
        >
          {/* Subtle top accent gradient */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/40 via-emerald-400 to-emerald-500/40" />

          <div className="flex items-start justify-between">
            <span className="text-base sm:text-xl font-black tracking-wider text-zinc-100 font-outfit uppercase">
              BELI
            </span>
            {priceState.buyChange !== 0 && (
              <div
                className={`flex items-center gap-0.5 px-2 py-0.5 rounded-md text-xs sm:text-sm font-bold font-mono-num ${
                  isUp
                    ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-700/40'
                    : 'text-rose-400 bg-rose-950/60 border border-rose-700/40'
                }`}
              >
                {isUp ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                <span>{formatDelta(priceState.buyChange)}</span>
              </div>
            )}
          </div>

          <div className="mt-2 sm:mt-3 flex items-baseline gap-1.5">
            <span className="text-sm sm:text-lg font-bold text-zinc-400 font-outfit">RP.</span>
            <span className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-white font-mono-num leading-none">
              {formatNumber(priceState.buy)}
            </span>
          </div>

          <div className="mt-1 text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Harga Beli Treasury</span>
            <span className="text-zinc-400 text-[10px]">Per gram emas</span>
          </div>
        </div>

        {/* JUAL CARD */}
        <div
          onClick={() => onCardClick?.('sell')}
          className={`relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#181d26] to-[#0f131a] border border-[#273040]/80 p-3.5 sm:p-5 shadow-lg transition-all duration-200 hover:border-zinc-500/50 cursor-pointer group ${flashClass}`}
        >
          {/* Subtle top accent gradient */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sky-500/40 via-sky-400 to-sky-500/40" />

          <div className="flex items-start justify-between">
            <span className="text-base sm:text-xl font-black tracking-wider text-zinc-100 font-outfit uppercase">
              JUAL
            </span>
            {priceState.sellChange !== 0 && (
              <div
                className={`flex items-center gap-0.5 px-2 py-0.5 rounded-md text-xs sm:text-sm font-bold font-mono-num ${
                  priceState.sellChange > 0
                    ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-700/40'
                    : 'text-rose-400 bg-rose-950/60 border border-rose-700/40'
                }`}
              >
                {priceState.sellChange > 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                <span>{formatDelta(priceState.sellChange)}</span>
              </div>
            )}
          </div>

          <div className="mt-2 sm:mt-3 flex items-baseline gap-1.5">
            <span className="text-sm sm:text-lg font-bold text-zinc-400 font-outfit">RP.</span>
            <span className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-white font-mono-num leading-none">
              {formatNumber(priceState.sell)}
            </span>
          </div>

          <div className="mt-1 text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Harga Jual Treasury</span>
            <span className="text-zinc-400 text-[10px]">Per gram emas</span>
          </div>
        </div>

        {/* USD/IDR CARD */}
        <div
          onClick={() => onCardClick?.('usd')}
          className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#181d26] to-[#0f131a] border border-[#273040]/80 p-3.5 sm:p-5 shadow-lg transition-all duration-200 hover:border-zinc-500/50 cursor-pointer group"
        >
          {/* Subtle top accent gradient */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/40 via-cyan-400 to-blue-500/40" />

          <div className="flex items-start justify-between">
            <span className="text-base sm:text-xl font-black tracking-wider text-zinc-100 font-outfit uppercase">
              USD/<span className="text-[#38bdf8] font-black">IDR</span>
            </span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold text-sky-400 bg-sky-950/50 border border-sky-800/40 font-mono">
              KURS LIVE
            </span>
          </div>

          <div className="mt-2 sm:mt-3 flex items-baseline gap-1.5">
            <span className="text-sm sm:text-lg font-bold text-zinc-400 font-outfit">Rp.</span>
            <span className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-[#38bdf8] font-mono-num leading-none">
              {formatNumber(priceState.usdIdr)}
            </span>
          </div>

          <div className="mt-1 text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Bank Indonesia / Market</span>
            <span className="text-zinc-400 text-[10px]">Realtime rate</span>
          </div>
        </div>
      </div>
    </div>
  );
};
