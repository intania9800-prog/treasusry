import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Bell, Settings, Menu, Calculator, TrendingUp, Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { SoundConfig } from '../types';

interface HeaderProps {
  soundConfig: SoundConfig;
  onOpenSoundModal: () => void;
  onOpenNewsModal: () => void;
  onOpenCalculatorModal: () => void;
  onOpenPromoModal: () => void;
  onOpenIndicatorModal: () => void;
  onOpenNominalModal: () => void;
  unreadNewsCount: number;
  onRefreshData: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  soundConfig,
  onOpenSoundModal,
  onOpenNewsModal,
  onOpenCalculatorModal,
  onOpenPromoModal,
  onOpenIndicatorModal,
  onOpenNominalModal,
  unreadNewsCount,
  onRefreshData,
  isRefreshing,
}) => {
  const [currentDateStr, setCurrentDateStr] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      // Format like: "Sen, 26 OKT 2026"
      const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
      
      const day = dayNames[now.getDay()];
      const date = now.getDate();
      const month = monthNames[now.getMonth()];
      const year = now.getFullYear();

      setCurrentDateStr(`${day}, ${date} ${month} ${year}`);
    };

    updateDate();
    const timer = setInterval(updateDate, 60000);
    return () => clearInterval(timer);
  }, []);

  const anySoundActive = soundConfig.priceUp || soundConfig.priceDown || soundConfig.highUp || soundConfig.promo;

  return (
    <header className="relative w-full bg-gradient-to-r from-[#07090d] via-[#0d1117] to-[#07090d] border-b border-[#1f2633] px-3 sm:px-6 py-2.5 sm:py-3.5 z-40">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between">
        {/* Left: Brand Logo & Date */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group" onClick={onRefreshData}>
            {/* Logo image with fallback styling */}
            <div className="relative w-9 h-9 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 via-zinc-900 to-black border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)] group-hover:border-amber-400/50 transition-all">
              <img
                src="/assets/aistudio/image_167a5393.png"
                alt="REINmonitor Logo"
                className="w-full h-full object-contain p-0.5 filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]"
                onError={(e) => {
                  // Fallback if image path has issue
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="absolute text-amber-400 font-extrabold text-sm sm:text-lg tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                R↗
              </span>
            </div>

            {/* Brand typography */}
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-[17px] sm:text-[23px] font-black tracking-tight text-white font-outfit uppercase">
                  REIN<span className="text-zinc-300 font-medium lowercase">monitor</span>
                </span>
              </div>
              <span className="text-[9px] sm:text-[11px] font-bold tracking-[0.25em] text-amber-400/90 -mt-1 font-mono">
                TREASURY
              </span>
            </div>
          </div>

          {/* Date Stamp matching reference: "Sen, 26 OKT 2026" */}
          <div className="hidden md:flex items-center pl-4 border-l border-zinc-800/80">
            <span className="text-sm sm:text-base font-bold text-zinc-100 tracking-wide font-outfit">
              {currentDateStr || 'Sen, 26 OKT 2026'}
            </span>
          </div>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-4">
          {/* Suara Button */}
          <button
            onClick={onOpenSoundModal}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all ${
              anySoundActive
                ? 'text-[#f97316] hover:bg-[#f97316]/10 hover:shadow-[0_0_12px_rgba(249,115,22,0.2)]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
            title="Pengaturan Suara & Notifikasi"
          >
            {anySoundActive ? (
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#f97316]" />
            ) : (
              <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
            <span className="text-xs sm:text-sm font-semibold tracking-wide">Suara</span>
          </button>

          {/* News Button */}
          <button
            onClick={onOpenNewsModal}
            className="relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-xl transition-all"
            title="Berita XAU/USD Forex Factory"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-200" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide">News</span>
            {unreadNewsCount > 0 && (
              <span className="absolute top-1 right-1 sm:right-1.5 w-4 h-4 bg-rose-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-pulse">
                {unreadNewsCount > 9 ? '9+' : unreadNewsCount}
              </span>
            )}
          </button>

          {/* Quick Refresh Icon */}
          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            className={`p-2 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800/50 rounded-xl transition-all ${
              isRefreshing ? 'animate-spin text-amber-400' : ''
            }`}
            title="Refresh Data Pasar"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Lainnya (Dropdown Menu) */}
          <div className="relative">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-xl transition-all"
              title="Menu Tambahan"
            >
              <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide">Lainnya</span>
            </button>

            {/* Menu Popover */}
            {mobileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 sm:w-64 bg-[#0d1117] border border-zinc-800 rounded-2xl shadow-2xl p-2 z-40 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-zinc-400 uppercase border-b border-zinc-800/80 mb-1">
                    Fitur & Alat
                  </div>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenCalculatorModal();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-200 hover:text-amber-300 hover:bg-amber-500/10 rounded-xl transition-all"
                  >
                    <Calculator className="w-4 h-4 text-amber-400" />
                    <span className="font-medium">Kalkulator Emas</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenPromoModal();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-200 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-xl transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="font-medium">Promo Treasury</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenIndicatorModal();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-200 hover:text-sky-300 hover:bg-sky-500/10 rounded-xl transition-all"
                  >
                    <TrendingUp className="w-4 h-4 text-sky-400" />
                    <span className="font-medium">Indikator Chart (MA/BB)</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenNominalModal();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-200 hover:text-purple-300 hover:bg-purple-500/10 rounded-xl transition-all"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-purple-400" />
                    <span className="font-medium">Filter Nominal Investasi</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
