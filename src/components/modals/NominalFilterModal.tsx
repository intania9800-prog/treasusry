import React from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';

interface NominalFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNominals: number[];
  onToggleNominal: (nom: number) => void;
}

const nominalList = [
  { value: 10000000, label: '10 Juta', disc: 'Disc 3.31%' },
  { value: 30000000, label: '30 Juta', disc: 'Disc 3.32%' },
  { value: 40000000, label: '40 Juta', disc: 'Disc 3.32%' },
  { value: 50000000, label: '50 Juta', disc: 'Disc 3.32%' },
  { value: 60000000, label: '60 Juta', disc: 'Disc 3.32%' },
];

export const NominalFilterModal: React.FC<NominalFilterModalProps> = ({
  isOpen,
  onClose,
  selectedNominals,
  onToggleNominal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0e121a] border border-[#232b3b] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2636] bg-[#121622]">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-5 h-5 text-purple-400" />
            <h2 className="text-base sm:text-lg font-black text-white font-outfit">
              PILIH NOMINAL INVESTASI
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
            Pilih nominal yang ingin ditampilkan pada baris chip nominal di dashboard:
          </p>

          <div className="space-y-2 mt-2">
            {nominalList.map((nom) => {
              const isChecked = selectedNominals.includes(nom.value);
              return (
                <div
                  key={nom.value}
                  onClick={() => onToggleNominal(nom.value)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isChecked
                      ? 'bg-purple-950/20 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.08)]'
                      : 'bg-[#141924] border-[#222a3a] opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-amber-400 font-outfit">
                      {nom.label}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">{nom.disc}</span>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                      isChecked
                        ? 'bg-purple-500 border-purple-400 text-white shadow-md'
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
            className="px-5 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-md"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
