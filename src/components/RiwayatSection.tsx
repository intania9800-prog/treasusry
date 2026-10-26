import React, { useState } from 'react';
import { HistoryRecord } from '../types';
import { History, ChevronDown, ChevronUp, Download, Trash2 } from 'lucide-react';

interface RiwayatSectionProps {
  history: HistoryRecord[];
  onClearHistory?: () => void;
}

const formatNumber = (num: number) => {
  if (!Number.isFinite(num)) return '--';
  return Math.round(num).toLocaleString('id-ID');
};

const formatDelta = (val: number) => {
  if (!Number.isFinite(val) || val === 0) return '—';
  return (val > 0 ? '▲ +' : '▼ ') + Math.abs(Math.round(val)).toLocaleString('id-ID');
};

export const RiwayatSection: React.FC<RiwayatSectionProps> = ({
  history,
  onClearHistory,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const exportCSV = () => {
    if (!history.length) return;
    const headers = ['Waktu', 'Beli', 'Perubahan Beli', 'Jual', 'Perubahan Jual', 'Spread', 'USD/IDR', 'Status'];
    const rows = history.map((item) => [
      item.time,
      item.buy,
      item.buyChange,
      item.sell,
      item.sellChange,
      `${item.spread.toFixed(2)}%`,
      item.usdIdr,
      item.markState,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `riwayat_harga_treasury_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full mt-4 sm:mt-6 rounded-2xl overflow-hidden border border-[#1e2636] bg-[#0c1017] shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#10141f] border-b border-[#1f2636]">
        <div className="flex items-center gap-2.5">
          <History className="w-5 h-5 text-amber-400" />
          <span className="text-sm sm:text-base font-bold text-zinc-100 font-outfit">
            Riwayat Perubahan Harga
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#1a2130] text-amber-400 border border-amber-500/20">
            {history.length} records
          </span>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <>
              <button
                onClick={exportCSV}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800/60 hover:bg-zinc-700/60 rounded-lg transition-all"
                title="Download Riwayat CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              {onClearHistory && (
                <button
                  onClick={onClearHistory}
                  className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg transition-all"
                  title="Hapus Riwayat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-zinc-400 hover:text-white rounded-lg transition-all"
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Table Container */}
      {isOpen && (
        <div className="overflow-x-auto max-h-[380px] sm:max-h-[480px]">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="sticky top-0 bg-[#0e121a] text-zinc-400 font-mono text-[11px] uppercase tracking-wider border-b border-[#1f2636] z-10">
              <tr>
                <th className="py-2.5 px-3 sm:px-4">WAKTU</th>
                <th className="py-2.5 px-3 sm:px-4">BELI</th>
                <th className="py-2.5 px-3 sm:px-4">JUAL</th>
                <th className="py-2.5 px-3 sm:px-4">SPREAD</th>
                <th className="py-2.5 px-3 sm:px-4">USD/IDR</th>
                <th className="py-2.5 px-3 sm:px-4">STATUS</th>
                <th className="py-2.5 px-3 sm:px-4">10JT</th>
                <th className="py-2.5 px-3 sm:px-4">30JT</th>
                <th className="py-2.5 px-3 sm:px-4">50JT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171d29] font-mono-num">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-zinc-400">
                    Belum ada rekaman perubahan harga. Data akan dicatat otomatis setiap harga bergerak.
                  </td>
                </tr>
              ) : (
                history.map((row) => {
                  const isBuyUp = row.buyChange > 0;
                  const isBuyDown = row.buyChange < 0;
                  const tier10 = row.tiers.find((t) => t.nominal === 10000000);
                  const tier30 = row.tiers.find((t) => t.nominal === 30000000);
                  const tier50 = row.tiers.find((t) => t.nominal === 50000000);

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-[#121722]/80 transition-colors"
                    >
                      <td className="py-2.5 px-3 sm:px-4 text-zinc-300 font-medium whitespace-nowrap">
                        {row.time}
                      </td>
                      <td className="py-2.5 px-3 sm:px-4">
                        <div className="font-bold text-white">Rp {formatNumber(row.buy)}</div>
                        <div
                          className={`text-[11px] font-bold ${
                            isBuyUp
                              ? 'text-emerald-400'
                              : isBuyDown
                              ? 'text-rose-400'
                              : 'text-zinc-500'
                          }`}
                        >
                          {formatDelta(row.buyChange)}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 sm:px-4">
                        <div className="font-bold text-white">Rp {formatNumber(row.sell)}</div>
                        <div
                          className={`text-[11px] font-bold ${
                            row.sellChange > 0
                              ? 'text-emerald-400'
                              : row.sellChange < 0
                              ? 'text-rose-400'
                              : 'text-zinc-500'
                          }`}
                        >
                          {formatDelta(row.sellChange)}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 sm:px-4 font-bold text-zinc-300">
                        {row.spread ? `${row.spread.toFixed(2)}%` : '--'}
                      </td>
                      <td className="py-2.5 px-3 sm:px-4 text-sky-400 font-medium">
                        Rp {formatNumber(row.usdIdr)}
                      </td>
                      <td className="py-2.5 px-3 sm:px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            row.markState === 'MARKDOWN'
                              ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                              : row.markState === 'MARKUP'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                              : 'bg-zinc-800 text-zinc-300'
                          }`}
                        >
                          {row.markState}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 sm:px-4 text-[11px]">
                        {tier10 ? (
                          <div className={tier10.spreadRp >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            {tier10.spreadRp >= 0 ? '+' : '-'}Rp {formatNumber(Math.abs(tier10.spreadRp))}
                          </div>
                        ) : (
                          '--'
                        )}
                      </td>
                      <td className="py-2.5 px-3 sm:px-4 text-[11px]">
                        {tier30 ? (
                          <div className={tier30.spreadRp >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            {tier30.spreadRp >= 0 ? '+' : '-'}Rp {formatNumber(Math.abs(tier30.spreadRp))}
                          </div>
                        ) : (
                          '--'
                        )}
                      </td>
                      <td className="py-2.5 px-3 sm:px-4 text-[11px]">
                        {tier50 ? (
                          <div className={tier50.spreadRp >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            {tier50.spreadRp >= 0 ? '+' : '-'}Rp {formatNumber(Math.abs(tier50.spreadRp))}
                          </div>
                        ) : (
                          '--'
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
