import React, { useState } from 'react';
import { X, Calculator, ArrowRightLeft } from 'lucide-react';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyPrice: number;
  sellPrice: number;
}

const formatNumber = (num: number) => {
  if (!Number.isFinite(num)) return '0';
  return Math.round(num).toLocaleString('id-ID');
};

export const CalculatorModal: React.FC<CalculatorModalProps> = ({
  isOpen,
  onClose,
  buyPrice,
  sellPrice,
}) => {
  const [mode, setMode] = useState<'moneyToGram' | 'gramToMoney'>('moneyToGram');
  const [inputValue, setInputValue] = useState<string>('10000000');

  if (!isOpen) return null;

  const numericInput = parseFloat(inputValue.replace(/[^0-9.]/g, '')) || 0;

  let calculatedResult = '';
  if (mode === 'moneyToGram') {
    if (buyPrice > 0 && numericInput > 0) {
      const grams = numericInput / buyPrice;
      calculatedResult = `${grams.toFixed(4)} gr`;
    } else {
      calculatedResult = '0.0000 gr';
    }
  } else {
    if (sellPrice > 0 && numericInput > 0) {
      const money = numericInput * sellPrice;
      calculatedResult = `Rp ${formatNumber(money)}`;
    } else {
      calculatedResult = 'Rp 0';
    }
  }

  const presetsMoney = [
    { label: '5 Juta', val: '5000000' },
    { label: '10 Juta', val: '10000000' },
    { label: '30 Juta', val: '30000000' },
    { label: '50 Juta', val: '50000000' },
    { label: '100 Juta', val: '100000000' },
  ];

  const presetsGram = [
    { label: '1 gr', val: '1' },
    { label: '5 gr', val: '5' },
    { label: '10 gr', val: '10' },
    { label: '25 gr', val: '25' },
    { label: '50 gr', val: '50' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e121a] border border-[#232b3b] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2636] bg-[#121622]">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-black text-white font-outfit">
              KALKULATOR EMAS TREASURY
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
        <div className="p-5 space-y-4">
          {/* Rate Preview Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#141924] border border-emerald-500/20 text-center">
              <span className="text-xs text-zinc-400 font-semibold">Harga Beli Sekarang</span>
              <div className="text-base sm:text-lg font-black text-emerald-400 font-mono-num mt-0.5">
                Rp {formatNumber(buyPrice)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#141924] border border-sky-500/20 text-center">
              <span className="text-xs text-zinc-400 font-semibold">Harga Jual Sekarang</span>
              <div className="text-base sm:text-lg font-black text-sky-400 font-mono-num mt-0.5">
                Rp {formatNumber(sellPrice)}
              </div>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#141924] rounded-xl border border-zinc-800">
            <button
              onClick={() => {
                setMode('moneyToGram');
                setInputValue('10000000');
              }}
              className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                mode === 'moneyToGram'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Uang → Gram</span>
            </button>
            <button
              onClick={() => {
                setMode('gramToMoney');
                setInputValue('5');
              }}
              className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                mode === 'gramToMoney'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Gram → Uang</span>
            </button>
          </div>

          {/* Input Field */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              {mode === 'moneyToGram' ? 'Nominal Uang (Rp)' : 'Berat Emas (Gram)'}
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={mode === 'moneyToGram' ? 'Contoh: 10000000' : 'Contoh: 5'}
              className="w-full px-4 py-3 rounded-xl bg-[#121620] border border-[#2a3447] text-white font-mono-num font-bold text-lg focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {(mode === 'moneyToGram' ? presetsMoney : presetsGram).map((p) => (
              <button
                key={p.val}
                onClick={() => setInputValue(p.val)}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/40 transition-all font-mono"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Calculated Result Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-[#18202d] to-amber-500/10 border border-amber-500/30">
            <span className="text-xs font-semibold text-zinc-400 block">
              {mode === 'moneyToGram' ? 'Estimasi Emas Diperoleh:' : 'Estimasi Dana Diterima:'}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono-num mt-1">
              {calculatedResult}
            </div>
            <span className="text-[11px] text-zinc-500 mt-1 block">
              *Perhitungan instan berdasarkan kurs live Treasury tanpa biaya tersembunyi.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#121622] border-t border-[#1f2636] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
