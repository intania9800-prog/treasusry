import React, { useState } from 'react';
import { X, Sparkles, Copy, Check, Gift, ShieldAlert } from 'lucide-react';

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  promoStatus: 'ON' | 'OFF' | 'UNKNOWN';
  limit: number;
}

export const PromoModal: React.FC<PromoModalProps> = ({
  isOpen,
  onClose,
  promoStatus,
  limit,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e121a] border border-[#232b3b] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2636] bg-[#121622]">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-black text-white font-outfit">
              PROMO TREASURY AKTIF
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
          {/* Status Box */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#141924] border border-[#232c3f]">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                STATUS PROMO LIVE
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    promoStatus === 'ON'
                      ? 'bg-emerald-400 animate-ping'
                      : promoStatus === 'OFF'
                      ? 'bg-rose-500'
                      : 'bg-amber-400'
                  }`}
                />
                <span
                  className={`text-base font-black font-outfit ${
                    promoStatus === 'ON'
                      ? 'text-emerald-400'
                      : promoStatus === 'OFF'
                      ? 'text-rose-400'
                      : 'text-amber-400'
                  }`}
                >
                  {promoStatus}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141924] border border-[#232c3f]">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                LIMIT BULAN INI
              </span>
              <div className="mt-1 text-base font-black text-white font-mono-num">
                {limit > 0 ? `${limit}x Beli/Bulan` : '5x Beli/Bulan'}
              </div>
            </div>
          </div>

          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider pt-2">
            Kode Promo & Voucher Tersedia
          </div>

          {/* Promo Card 1 */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#141a26] to-[#0f131c] border border-amber-500/20 hover:border-amber-500/40 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-sm font-bold text-white block">
                  Promo Pengguna Baru
                </span>
                <span className="text-xs text-zinc-300 mt-0.5 block">
                  Disc. 99%* Khusus Pembelian Pertama Emas Treasury
                </span>
              </div>
              <Gift className="w-5 h-5 text-amber-400 flex-shrink-0" />
            </div>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-zinc-800/80">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-700/40">
                COBANABUNGEMAS
              </span>
              <button
                onClick={() => copyToClipboard('COBANABUNGEMAS')}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all"
              >
                {copiedCode === 'COBANABUNGEMAS' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Kode</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Promo Card 2 */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#141a26] to-[#0f131c] border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-sm font-bold text-white block">
                  #BuatMasaDepan20
                </span>
                <span className="text-xs text-zinc-300 mt-0.5 block">
                  Menangkan 1 Dryer Portable BOLDe! Min. Transaksi Rp 10.000
                </span>
              </div>
              <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            </div>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-zinc-800/80">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-700/40">
                BETTERFUTURE20
              </span>
              <button
                onClick={() => copyToClipboard('BETTERFUTURE20')}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all"
              >
                {copiedCode === 'BETTERFUTURE20' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Kode</span>
                  </>
                )}
              </button>
            </div>
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
