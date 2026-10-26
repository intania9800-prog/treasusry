import React from 'react';
import { X, TrendingUp, Check } from 'lucide-react';

interface IndicatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIndicators: string[];
  onToggleIndicator: (key: string) => void;
}

const availableIndicators = [
  {
    key: 'ma',
    name: 'Moving Average (MA)',
    description: 'Simple Moving Average tren jangka menengah',
    recommended: true,
  },
  {
    key: 'ema',
    name: 'Exponential MA (EMA)',
    description: 'Exponential Moving Average responsif terhadap harga terkini',
    recommended: false,
  },
  {
    key: 'bb',
    name: 'Bollinger Bands (BB)',
    description: 'Batas volatilitas harga atas dan bawah',
    recommended: true,
  },
  {
    key: 'vwap',
    name: 'VWAP',
    description: 'Volume Weighted Average Price acuan transaksi pasar',
    recommended: true,
  },
  {
    key: 'rsi',
    name: 'Relative Strength Index (RSI)',
    description: 'Indikator momentum overbought / oversold',
    recommended: false,
  },
];

export const IndicatorModal: React.FC<IndicatorModalProps> = ({
  isOpen,
  onClose,
  selectedIndicators,
  onToggleIndicator,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e121a] border border-[#232b3b] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2636] bg-[#121622]">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-sky-400" />
            <h2 className="text-base sm:text-lg font-black text-white font-outfit">
              PENGATURAN INDIKATOR CHART
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <p className="text-xs text-zinc-400">
            Aktifkan indikator analisis teknikal untuk ditampilkan pada Chart TradingView:
          </p>

          <div className="space-y-2.5 mt-3">
            {availableIndicators.map((ind) => {
              const isChecked = selectedIndicators.includes(ind.key);
              return (
                <div
                  key={ind.key}
                  onClick={() => onToggleIndicator(ind.key)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isChecked
                      ? 'bg-sky-950/20 border-sky-500/40 shadow-[0_0_15px_rgba(56,189,248,0.08)]'
                      : 'bg-[#141924] border-[#222a3a] opacity-75 hover:opacity-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white font-outfit">{ind.name}</span>
                      {ind.recommended && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-600/40 font-mono font-bold">
                          REKOMENDASI
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-400 block mt-0.5">{ind.description}</span>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                      isChecked
                        ? 'bg-sky-500 border-sky-400 text-black shadow-md'
                        : 'border-zinc-700 bg-zinc-800'
                    }`}
                  >
                    {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#121622] border-t border-[#1f2636] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition-all shadow-md"
          >
            Simpan & Perbarui Chart
          </button>
        </div>
      </div>
    </div>
  );
};
