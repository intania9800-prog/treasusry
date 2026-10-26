import React from 'react';
import { Volume2, Bell, Calculator, Sparkles, TrendingUp, History } from 'lucide-react';

interface MobileNavProps {
  onOpenSoundModal: () => void;
  onOpenNewsModal: () => void;
  onOpenCalculatorModal: () => void;
  onOpenPromoModal: () => void;
  onOpenIndicatorModal: () => void;
  onScrollToHistory: () => void;
  unreadNewsCount: number;
  anySoundActive: boolean;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  onOpenSoundModal,
  onOpenNewsModal,
  onOpenCalculatorModal,
  onOpenPromoModal,
  onOpenIndicatorModal,
  onScrollToHistory,
  unreadNewsCount,
  anySoundActive,
}) => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0e14]/95 backdrop-blur-lg border-t border-[#1e2533] px-3 py-2 flex items-center justify-around shadow-[0_-8px_25px_rgba(0,0,0,0.6)]">
      {/* Sound */}
      <button
        onClick={onOpenSoundModal}
        className="flex flex-col items-center justify-center text-center p-1"
      >
        <Volume2
          className={`w-5 h-5 ${anySoundActive ? 'text-[#f97316]' : 'text-zinc-400'}`}
        />
        <span
          className={`text-[10px] font-bold mt-0.5 ${
            anySoundActive ? 'text-[#f97316]' : 'text-zinc-400'
          }`}
        >
          Suara
        </span>
      </button>

      {/* News */}
      <button
        onClick={onOpenNewsModal}
        className="relative flex flex-col items-center justify-center text-center p-1"
      >
        <Bell className="w-5 h-5 text-zinc-300" />
        <span className="text-[10px] font-bold text-zinc-400 mt-0.5">News</span>
        {unreadNewsCount > 0 && (
          <span className="absolute top-0 right-2 w-3.5 h-3.5 bg-rose-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center">
            {unreadNewsCount}
          </span>
        )}
      </button>

      {/* Calculator (Elevated center button) */}
      <button
        onClick={onOpenCalculatorModal}
        className="flex flex-col items-center justify-center -mt-4"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-black shadow-[0_0_15px_rgba(245,158,11,0.5)] border-2 border-[#0a0e14] active:scale-95 transition-transform">
          <Calculator className="w-6 h-6 stroke-[2.5]" />
        </div>
        <span className="text-[10px] font-black text-amber-400 mt-0.5">Kalkulator</span>
      </button>

      {/* Promo */}
      <button
        onClick={onOpenPromoModal}
        className="flex flex-col items-center justify-center text-center p-1"
      >
        <Sparkles className="w-5 h-5 text-emerald-400" />
        <span className="text-[10px] font-bold text-emerald-400 mt-0.5">Promo</span>
      </button>

      {/* History */}
      <button
        onClick={onScrollToHistory}
        className="flex flex-col items-center justify-center text-center p-1"
      >
        <History className="w-5 h-5 text-zinc-300" />
        <span className="text-[10px] font-bold text-zinc-400 mt-0.5">Riwayat</span>
      </button>
    </div>
  );
};
