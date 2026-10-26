import React, { useState } from 'react';
import { X, Calendar, Clock, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { NewsItem } from '../../types';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsItems: NewsItem[];
  onRefreshNews?: () => void;
  isLoading?: boolean;
}

export const NewsModal: React.FC<NewsModalProps> = ({
  isOpen,
  onClose,
  newsItems,
  onRefreshNews,
  isLoading,
}) => {
  const [activeFilter, setActiveFilter] = useState<{
    low: boolean;
    medium: boolean;
    high: boolean;
  }>({
    low: true,
    medium: true,
    high: true,
  });

  if (!isOpen) return null;

  const toggleFilter = (impact: 'low' | 'medium' | 'high') => {
    setActiveFilter((prev) => ({
      ...prev,
      [impact]: !prev[impact],
    }));
  };

  const filteredNews = newsItems.filter((item) => activeFilter[item.impact]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0c1017] border border-[#232b3b] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2636] bg-[#10141f]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📰</span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white font-outfit">
                NEWS XAU/USD (FOREX FACTORY)
              </h2>
              <p className="text-[11px] text-zinc-400">Kalender ekonomi global & perkiraan arah emas</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRefreshNews && (
              <button
                onClick={onRefreshNews}
                disabled={isLoading}
                className={`p-1.5 text-zinc-400 hover:text-amber-400 rounded-lg hover:bg-zinc-800 transition-all ${
                  isLoading ? 'animate-spin' : ''
                }`}
                title="Perbarui Berita"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-5 py-3 border-b border-[#171d29] bg-[#0e121b] flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-zinc-400 mr-1">Dampak:</span>

          {/* Low Pill */}
          <button
            onClick={() => toggleFilter('low')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              activeFilter.low
                ? 'bg-amber-950/70 text-amber-300 border border-amber-500/50'
                : 'bg-zinc-900 text-zinc-500 border border-zinc-800 opacity-60'
            }`}
          >
            <span className="flex gap-0.5">
              <span className="w-1 h-3 rounded-sm bg-amber-400" />
              <span className="w-1 h-3 rounded-sm bg-zinc-700" />
              <span className="w-1 h-3 rounded-sm bg-zinc-700" />
            </span>
            <span>Low</span>
          </button>

          {/* Medium Pill */}
          <button
            onClick={() => toggleFilter('medium')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              activeFilter.medium
                ? 'bg-orange-950/70 text-orange-300 border border-orange-500/50'
                : 'bg-zinc-900 text-zinc-500 border border-zinc-800 opacity-60'
            }`}
          >
            <span className="flex gap-0.5">
              <span className="w-1 h-3 rounded-sm bg-orange-400" />
              <span className="w-1 h-3 rounded-sm bg-orange-400" />
              <span className="w-1 h-3 rounded-sm bg-zinc-700" />
            </span>
            <span>Medium</span>
          </button>

          {/* High Pill */}
          <button
            onClick={() => toggleFilter('high')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              activeFilter.high
                ? 'bg-rose-950/70 text-rose-300 border border-rose-500/50'
                : 'bg-zinc-900 text-zinc-500 border border-zinc-800 opacity-60'
            }`}
          >
            <span className="flex gap-0.5">
              <span className="w-1 h-3 rounded-sm bg-rose-500" />
              <span className="w-1 h-3 rounded-sm bg-rose-500" />
              <span className="w-1 h-3 rounded-sm bg-rose-500" />
            </span>
            <span>High Impact</span>
          </button>
        </div>

        {/* Content List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 divide-y divide-[#171d29]/60 flex-1">
          {filteredNews.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-sm">
              Tidak ada berita yang cocok dengan filter.
            </div>
          ) : (
            filteredNews.map((item) => {
              const impactColor =
                item.impact === 'high'
                  ? 'border-rose-500/30 bg-rose-950/20'
                  : item.impact === 'medium'
                  ? 'border-orange-500/30 bg-orange-950/20'
                  : 'border-amber-500/30 bg-amber-950/20';

              return (
                <div
                  key={item.id}
                  className={`pt-3 first:pt-0 p-3.5 rounded-xl border ${impactColor} transition-all hover:bg-zinc-900/40`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {/* 3-bar impact icon */}
                        <span className="flex gap-0.5 items-center">
                          <span
                            className={`w-1 h-3.5 rounded-sm ${
                              item.impact === 'high'
                                ? 'bg-rose-500'
                                : item.impact === 'medium'
                                ? 'bg-orange-400'
                                : 'bg-amber-400'
                            }`}
                          />
                          <span
                            className={`w-1 h-3.5 rounded-sm ${
                              item.impact === 'high'
                                ? 'bg-rose-500'
                                : item.impact === 'medium'
                                ? 'bg-orange-400'
                                : 'bg-zinc-700'
                            }`}
                          />
                          <span
                            className={`w-1 h-3.5 rounded-sm ${
                              item.impact === 'high' ? 'bg-rose-500' : 'bg-zinc-700'
                            }`}
                          />
                        </span>

                        <span className="text-sm sm:text-base font-bold text-white leading-snug">
                          {item.title}
                        </span>
                      </div>

                      {/* Meta: Time & Date */}
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-400">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          {item.timeWib} WIB
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.dateStr}
                        </span>
                      </div>
                    </div>

                    {/* Sinyal Emas */}
                    {item.signal && (
                      <div
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black font-mono-num whitespace-nowrap ${
                          item.signal.type === 'up'
                            ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-600/40'
                            : item.signal.type === 'down'
                            ? 'text-rose-400 bg-rose-950/60 border border-rose-600/40'
                            : 'text-amber-400 bg-amber-950/60 border border-amber-600/40'
                        }`}
                      >
                        {item.signal.type === 'up' ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" />
                        )}
                        <span>{item.signal.label}</span>
                      </div>
                    )}
                  </div>

                  {/* Numbers: Actual / Forecast / Previous */}
                  {(item.actual || item.forecast || item.previous) && (
                    <div className="mt-2.5 flex items-center gap-4 text-xs font-mono pt-2 border-t border-zinc-800/60">
                      {item.actual && (
                        <div>
                          <span className="text-zinc-500">Actual: </span>
                          <span className="text-white font-bold">{item.actual}</span>
                        </div>
                      )}
                      {item.forecast && (
                        <div>
                          <span className="text-zinc-500">Forecast: </span>
                          <span className="text-zinc-300 font-bold">{item.forecast}</span>
                        </div>
                      )}
                      {item.previous && (
                        <div>
                          <span className="text-zinc-500">Prev: </span>
                          <span className="text-zinc-400">{item.previous}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
