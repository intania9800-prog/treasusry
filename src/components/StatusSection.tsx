import React, { useState, useEffect } from 'react';
import { PriceState } from '../types';

interface StatusSectionProps {
  priceState: PriceState;
  onTogglePromo?: () => void;
  onOpenPromoModal?: () => void;
}

const formatNumber = (num: number) => {
  if (!Number.isFinite(num)) return '--';
  return Math.round(num).toLocaleString('id-ID');
};

export const StatusSection: React.FC<StatusSectionProps> = ({
  priceState,
  onTogglePromo,
  onOpenPromoModal,
}) => {
  const [timeStr, setTimeStr] = useState({ h: '11', m: '09', s: '22' });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // Jakarta WIB timezone
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const parts = formatter.format(now).split(':');
      if (parts.length === 3) {
        setTimeStr({ h: parts[0], m: parts[1], s: parts[2] });
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const isPromoOn = priceState.promoStatus === 'ON';

  return (
    <div className="w-full mt-4 sm:mt-6 bg-[#0c1017] border border-[#1e2533] rounded-2xl p-4 sm:p-6 shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
        {/* LEFT: TITIK ON */}
        <div className="lg:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="text-sm sm:text-base font-black tracking-wider text-zinc-100 font-outfit uppercase">
            TITIK ON
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-bold text-zinc-400 font-outfit">RP.</span>
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono-num">
              {priceState.titikOn > 0 ? formatNumber(priceState.titikOn) : formatNumber(priceState.buy)}
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 mt-0.5">
            Titik balik modal setelah promo Treasury
          </span>
        </div>

        {/* CENTER: CLOCK & 3D GLOSSY SWITCH PILL */}
        <div className="lg:col-span-6 flex items-center justify-center">
          <div className="flex items-center gap-3 sm:gap-5 px-4 sm:px-7 py-2.5 sm:py-3.5 bg-[#121620] border border-[#263142] rounded-2xl sm:rounded-full shadow-inner shadow-black/60">
            {/* Digital Clock */}
            <div className="flex items-baseline font-mono-num font-black text-2xl sm:text-4xl text-white tracking-widest">
              <span>{timeStr.h}</span>
              <span className="text-zinc-500 mx-0.5 animate-pulse">:</span>
              <span>{timeStr.m}</span>
              <span className="text-zinc-500 mx-0.5 animate-pulse">:</span>
              <span className="text-amber-400">{timeStr.s}</span>
            </div>

            {/* 3D Glossy Realistic Toggle Button */}
            <div
              onClick={() => {
                if (onTogglePromo) onTogglePromo();
                else if (onOpenPromoModal) onOpenPromoModal();
              }}
              className={`toggle-switch-pill relative w-16 sm:w-20 h-8 sm:h-9 px-1 transition-all cursor-pointer ${
                isPromoOn ? 'on animate-pulse-green' : 'off'
              }`}
              title="Status Promo Treasury (Klik untuk buka detail promo)"
            >
              {isPromoOn ? (
                <>
                  <span className="pl-2 sm:pl-3 text-[11px] sm:text-xs font-black text-white tracking-wider font-outfit">
                    ON
                  </span>
                  <div className="toggle-knob ml-auto w-6 sm:w-7 h-6 sm:h-7" />
                </>
              ) : (
                <>
                  <div className="toggle-knob mr-auto w-6 sm:w-7 h-6 sm:h-7 opacity-80" />
                  <span className="pr-2 sm:pr-3 text-[11px] sm:text-xs font-bold text-zinc-300 tracking-wider font-outfit">
                    OFF
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: METRICS LIST */}
        <div className="lg:col-span-3 flex justify-center lg:justify-end">
          <div className="w-full max-w-[280px] space-y-1.5 font-outfit text-xs sm:text-sm">
            {/* LIMIT */}
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-1">
              <span className="font-extrabold text-zinc-400 tracking-wider">LIMIT :</span>
              <span className="font-black text-white font-mono-num">
                {priceState.limit > 0 ? `${priceState.limit}x/bln` : '--'}
              </span>
            </div>

            {/* SPREAD */}
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-1">
              <span className="font-extrabold text-zinc-400 tracking-wider">SPREAD :</span>
              <span
                className={`font-black font-mono-num ${
                  priceState.spread < 0 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {priceState.spread !== 0 ? `${priceState.spread.toFixed(2)}%` : '-3.29%'}
              </span>
            </div>

            {/* MARKDOWN / MARKUP */}
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-1">
              <span
                className={`font-black tracking-wider ${
                  priceState.markState === 'MARKDOWN'
                    ? 'text-amber-500'
                    : priceState.markState === 'MARKUP'
                    ? 'text-emerald-400'
                    : 'text-zinc-400'
                }`}
              >
                {priceState.markState || 'MARKDOWN'} :
              </span>
              <span
                className={`font-black font-mono-num ${
                  priceState.markState === 'MARKDOWN'
                    ? 'text-amber-400'
                    : priceState.markState === 'MARKUP'
                    ? 'text-emerald-400'
                    : 'text-zinc-300'
                }`}
              >
                {priceState.markAmount !== 0
                  ? `${priceState.markAmount > 0 ? '+' : ''}${formatNumber(priceState.markAmount)}`
                  : '-14.200'}
              </span>
            </div>

            {/* TERTINGGI */}
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-1">
              <span className="font-extrabold text-emerald-400 tracking-wider">TERTINGGI :</span>
              <span className="font-black text-white font-mono-num">
                {formatNumber(priceState.high || 2568174)}
              </span>
            </div>

            {/* TERENDAH */}
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-rose-400 tracking-wider">TERENDAH :</span>
              <span className="font-black text-white font-mono-num">
                {formatNumber(priceState.low || 2539457)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
