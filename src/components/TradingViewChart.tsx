import React, { useEffect, useRef } from 'react';

interface TradingViewChartProps {
  indicators: string[]; // e.g. ['ma', 'bb', 'vwap']
  height?: number | string;
}

const studyMap: Record<string, string> = {
  ma: 'MASimple@tv-basicstudies',
  ema: 'MAExp@tv-basicstudies',
  bb: 'BB@tv-basicstudies',
  vwap: 'VWAP@tv-basicstudies',
  rsi: 'RSI@tv-basicstudies',
};

export const TradingViewChart: React.FC<TradingViewChartProps> = ({
  indicators,
  height = 540,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = '';

    const studies = [
      'BB@tv-basicstudies',
      ...indicators.map((k) => studyMap[k]).filter(Boolean),
    ];
    const uniqueStudies = Array.from(new Set(studies));

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';
    widgetContainer.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: 'TVC:GOLD',
      interval: '1',
      timezone: 'Asia/Jakarta',
      theme: 'dark',
      style: '1',
      locale: 'id',
      backgroundColor: 'rgba(10, 14, 20, 1)',
      gridColor: 'rgba(28, 35, 48, 0.6)',
      hide_side_toolbar: false,
      allow_symbol_change: true,
      save_image: true,
      calendar: false,
      studies: uniqueStudies,
      support_host: 'https://www.tradingview.com',
    });

    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [indicators]);

  return (
    <div className="w-full mt-4 sm:mt-6 rounded-2xl overflow-hidden border border-[#1e2636] bg-[#0a0e14] shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e121a] border-b border-[#1f2636]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs sm:text-sm font-bold text-zinc-200 tracking-wider font-outfit uppercase">
            CHART LIVE XAU/USD (TVC:GOLD)
          </span>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">TradingView Real-Time Feed</span>
      </div>

      <div
        ref={containerRef}
        style={{ height }}
        className="w-full min-h-[380px] sm:min-h-[480px]"
      />
    </div>
  );
};
