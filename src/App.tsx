import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PriceState, NominalTier, HistoryRecord, NewsItem, SoundConfig } from './types';
import { Header } from './components/Header';
import { PriceCards } from './components/PriceCards';
import { TierChips } from './components/TierChips';
import { StatusSection } from './components/StatusSection';
import { TradingViewChart } from './components/TradingViewChart';
import { RiwayatSection } from './components/RiwayatSection';
import { MobileNav } from './components/MobileNav';

import { SoundModal } from './components/modals/SoundModal';
import { NewsModal } from './components/modals/NewsModal';
import { CalculatorModal } from './components/modals/CalculatorModal';
import { PromoModal } from './components/modals/PromoModal';
import { IndicatorModal } from './components/modals/IndicatorModal';
import { NominalFilterModal } from './components/modals/NominalFilterModal';

import { playChimeUp, playChimeDown, playCountdownTick, speakPromo, triggerVibration } from './utils/audio';

const PROMO_MODAL_TABLE: Record<number, number> = {
  10000000: 9669043.94815373,
  30000000: 29004232.779941812,
  40000000: 38672311.01764273,
  50000000: 48340388.28876317,
  60000000: 58006500.0,
};

const DEFAULT_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'USD Core CPI m/m',
    impact: 'high',
    timeWib: '19:30',
    dateStr: 'Senin, 26 Okt 2026',
    ts: Date.now() + 15 * 60 * 1000,
    forecast: '0.3%',
    previous: '0.3%',
    actual: '0.2%',
    signal: { label: 'Emas Naik', type: 'up' },
  },
  {
    id: 'n2',
    title: 'USD Unemployment Claims',
    impact: 'high',
    timeWib: '20:30',
    dateStr: 'Senin, 26 Okt 2026',
    ts: Date.now() + 75 * 60 * 1000,
    forecast: '215K',
    previous: '219K',
    signal: { label: 'Emas Naik', type: 'up' },
  },
  {
    id: 'n3',
    title: 'USD Flash Manufacturing PMI',
    impact: 'medium',
    timeWib: '21:00',
    dateStr: 'Senin, 26 Okt 2026',
    ts: Date.now() + 105 * 60 * 1000,
    forecast: '50.2',
    previous: '49.8',
    signal: { label: 'Emas Turun', type: 'down' },
  },
  {
    id: 'n4',
    title: 'USD Crude Oil Inventories',
    impact: 'low',
    timeWib: '22:30',
    dateStr: 'Senin, 26 Okt 2026',
    ts: Date.now() + 195 * 60 * 1000,
    forecast: '-1.2M',
    previous: '1.4M',
    signal: { label: 'Netral', type: 'wait' },
  },
];

export default function App() {
  // Main Price State matching the user screenshot
  const [priceState, setPriceState] = useState<PriceState>(() => {
    return {
      buy: 2559035,
      sell: 2474781,
      buyChange: -616,
      sellChange: -551,
      usdIdr: 17630,
      high: 2568174,
      low: 2539457,
      spread: -3.29,
      titikOn: 2548800,
      promoStatus: 'ON',
      limit: 5,
      markState: 'MARKDOWN',
      markAmount: -14200,
      lastUpdated: new Date().toLocaleTimeString('id-ID'),
    };
  });

  const [priceFlashDir, setPriceFlashDir] = useState<'up' | 'down' | null>(null);
  const prevBuyRef = useRef<number>(priceState.buy);
  const prevPromoRef = useRef<string>(priceState.promoStatus);

  // Sound Config
  const [soundConfig, setSoundConfig] = useState<SoundConfig>(() => {
    const saved = localStorage.getItem('treasury_sound_cfg');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {}
    }
    return {
      priceUp: true,
      highUp: true,
      priceDown: true,
      highDown: true,
      promo: true,
      countdown: true,
      volume: 0.6,
    };
  });

  const updateSoundConfig = (cfg: SoundConfig) => {
    setSoundConfig(cfg);
    localStorage.setItem('treasury_sound_cfg', JSON.stringify(cfg));
  };

  // Selected Chart Indicators
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(() => {
    const saved = localStorage.getItem('treasury_indicators');
    return saved ? JSON.parse(saved) : ['ma', 'bb', 'vwap'];
  });

  const toggleIndicator = (key: string) => {
    setSelectedIndicators((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      localStorage.setItem('treasury_indicators', JSON.stringify(next));
      return next;
    });
  };

  // Visible Nominals Filter
  const [visibleNominals, setVisibleNominals] = useState<number[]>(() => {
    const saved = localStorage.getItem('treasury_visible_nominals');
    return saved ? JSON.parse(saved) : [10000000, 30000000, 40000000, 50000000, 60000000];
  });

  const toggleNominal = (nom: number) => {
    setVisibleNominals((prev) => {
      if (prev.includes(nom) && prev.length === 1) return prev; // Keep at least one
      const next = prev.includes(nom) ? prev.filter((n) => n !== nom) : [...prev, nom].sort((a, b) => a - b);
      localStorage.setItem('treasury_visible_nominals', JSON.stringify(next));
      return next;
    });
  };

  // Price History Log
  const [history, setHistory] = useState<HistoryRecord[]>(() => {
    const saved = localStorage.getItem('treasury_price_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {}
    }
    return [];
  });

  // News items
  const [newsItems, setNewsItems] = useState<NewsItem[]>(DEFAULT_NEWS);
  const [isRefreshingNews, setIsRefreshingNews] = useState(false);
  const [isRefreshingPrices, setIsRefreshingPrices] = useState(false);

  // Modals visibility state
  const [soundModalOpen, setSoundModalOpen] = useState(false);
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [calculatorModalOpen, setCalculatorModalOpen] = useState(false);
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [indicatorModalOpen, setIndicatorModalOpen] = useState(false);
  const [nominalModalOpen, setNominalModalOpen] = useState(false);

  // Calculate tier chips
  const tiers: NominalTier[] = React.useMemo(() => {
    if (priceState.buy <= 0 || priceState.sell <= 0) return [];
    const allNominals = [10000000, 30000000, 40000000, 50000000, 60000000];

    return allNominals
      .filter((n) => visibleNominals.includes(n))
      .map((nominal) => {
        const grams = nominal / priceState.buy;
        const modal = PROMO_MODAL_TABLE[nominal] || nominal * 0.967;
        const titik = (nominal * priceState.sell) / modal;
        const spreadRp = Math.round(grams * (titik - priceState.buy));

        return {
          nominal,
          label: `${nominal / 1000000}jt`,
          grams,
          spreadRp,
        };
      });
  }, [priceState.buy, priceState.sell, visibleNominals]);

  // Handle price update with sound, vibration, and flash animations
  const handlePriceUpdate = useCallback(
    (newBuy: number, newSell: number, newUsd?: number) => {
      const prevBuy = prevBuyRef.current;
      const buyDiff = newBuy - prevBuy;
      const sellDiff = newSell - priceState.sell;

      if (buyDiff !== 0) {
        const isUp = buyDiff > 0;
        const dir = isUp ? 'up' : 'down';
        setPriceFlashDir(dir);

        // Sound trigger
        if (isUp) {
          if (soundConfig.priceUp) {
            playChimeUp(Math.abs(buyDiff) >= 3000 && soundConfig.highUp, soundConfig.volume);
          }
        } else {
          if (soundConfig.priceDown) {
            playChimeDown(Math.abs(buyDiff) >= 3000 && soundConfig.highDown, soundConfig.volume);
          }
        }

        // Tactile vibration
        triggerVibration([50, 40, 50]);

        // Clear flash after 1 second
        setTimeout(() => setPriceFlashDir(null), 1000);
      }

      const spread = (((newSell - newBuy) / newBuy) * 100);
      const nowStr = new Date().toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      // Calculate Titik On
      const defaultModal = PROMO_MODAL_TABLE[10000000];
      const titikOn = Math.round((10000000 * newSell) / defaultModal);

      setPriceState((prev) => ({
        ...prev,
        buy: newBuy,
        sell: newSell,
        buyChange: buyDiff !== 0 ? buyDiff : prev.buyChange,
        sellChange: sellDiff !== 0 ? sellDiff : prev.sellChange,
        usdIdr: newUsd || prev.usdIdr,
        high: Math.max(prev.high, newBuy),
        low: Math.min(prev.low, newBuy),
        spread,
        titikOn,
        lastUpdated: nowStr,
      }));

      // Append to history record
      if (buyDiff !== 0) {
        const record: HistoryRecord = {
          id: `hist_${Date.now()}`,
          time: nowStr,
          timestamp: Date.now(),
          buy: newBuy,
          sell: newSell,
          buyChange: buyDiff,
          sellChange: sellDiff,
          spread,
          usdIdr: newUsd || priceState.usdIdr,
          markState: priceState.markState,
          markAmount: priceState.markAmount,
          tiers: [10000000, 30000000, 50000000].map((n) => {
            const grams = n / newBuy;
            const modal = PROMO_MODAL_TABLE[n];
            const titik = (n * newSell) / modal;
            return {
              nominal: n,
              grams,
              spreadRp: Math.round(grams * (titik - newBuy)),
            };
          }),
        };

        setHistory((prev) => {
          const updated = [record, ...prev.slice(0, 199)];
          localStorage.setItem('treasury_price_history', JSON.stringify(updated));
          return updated;
        });
      }

      prevBuyRef.current = newBuy;
    },
    [priceState.sell, priceState.usdIdr, priceState.markState, priceState.markAmount, soundConfig]
  );

  // Promo status speech check
  useEffect(() => {
    if (prevPromoRef.current !== priceState.promoStatus) {
      if (soundConfig.promo && (priceState.promoStatus === 'ON' || priceState.promoStatus === 'OFF')) {
        speakPromo(priceState.promoStatus);
      }
      prevPromoRef.current = priceState.promoStatus;
    }
  }, [priceState.promoStatus, soundConfig.promo]);

  // Second heartbeat & countdown tick sound at 55..59
  useEffect(() => {
    let lastTickedSecond = -1;
    const interval = setInterval(() => {
      const now = new Date();
      const sec = now.getSeconds();
      if (soundConfig.countdown && sec >= 55 && sec <= 59 && sec !== lastTickedSecond) {
        playCountdownTick(soundConfig.volume);
        lastTickedSecond = sec;
      }
      if (sec < 55) lastTickedSecond = -1;
    }, 200);

    return () => clearInterval(interval);
  }, [soundConfig.countdown, soundConfig.volume]);

  // Fetch from real server endpoints if available
  const fetchLiveData = useCallback(async () => {
    setIsRefreshingPrices(true);
    try {
      const res = await fetch('/api/live?t=' + Date.now(), { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const b = Number(data.buy_price ?? data.buy);
        const s = Number(data.sell_price ?? data.sell);
        const u = Number(data.usdidr ?? data.usd_idr);
        if (Number.isFinite(b) && b > 0 && Number.isFinite(s) && s > 0) {
          handlePriceUpdate(b, s, Number.isFinite(u) ? u : undefined);
        }
      }
    } catch (_) {
      // Fallback: smooth micro simulated tick
      const randomDelta = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 400) + 50);
      const nextBuy = Math.max(2400000, priceState.buy + randomDelta);
      const nextSell = Math.round(nextBuy * 0.967);
      handlePriceUpdate(nextBuy, nextSell, priceState.usdIdr + (Math.random() > 0.5 ? 5 : -5));
    } finally {
      setIsRefreshingPrices(false);
    }
  }, [handlePriceUpdate, priceState.buy, priceState.usdIdr]);

  // Connect SSE if available
  useEffect(() => {
    let es: EventSource | null = null;
    try {
      es = new EventSource('/sse');
      es.onmessage = (event) => {
        try {
          const d = JSON.parse(event.data);
          if (d.type === 'price' && d.buy && d.sell) {
            handlePriceUpdate(Number(d.buy), Number(d.sell), Number(d.usdIdr));
          } else if (d.type === 'promo_status' && d.status) {
            setPriceState((prev) => ({ ...prev, promoStatus: d.status }));
          }
        } catch (_) {}
      };
    } catch (_) {}

    return () => {
      es?.close();
    };
  }, [handlePriceUpdate]);

  // Periodic live refresh interval
  useEffect(() => {
    const timer = setInterval(() => {
      fetchLiveData();
    }, 6000);
    return () => clearInterval(timer);
  }, [fetchLiveData]);

  // Toggle promo status manually or via button
  const handleTogglePromo = () => {
    setPriceState((prev) => {
      const nextStatus = prev.promoStatus === 'ON' ? 'OFF' : 'ON';
      return {
        ...prev,
        promoStatus: nextStatus,
      };
    });
  };

  // Scroll to History section
  const historyRef = useRef<HTMLDivElement>(null);
  const scrollToHistory = () => {
    historyRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#07090d] text-[#f1f3f7] pb-20 sm:pb-12">
      {/* Top Header */}
      <Header
        soundConfig={soundConfig}
        onOpenSoundModal={() => setSoundModalOpen(true)}
        onOpenNewsModal={() => setNewsModalOpen(true)}
        onOpenCalculatorModal={() => setCalculatorModalOpen(true)}
        onOpenPromoModal={() => setPromoModalOpen(true)}
        onOpenIndicatorModal={() => setIndicatorModalOpen(true)}
        onOpenNominalModal={() => setNominalModalOpen(true)}
        unreadNewsCount={newsItems.length}
        onRefreshData={fetchLiveData}
        isRefreshing={isRefreshingPrices}
      />

      {/* Main Container */}
      <main className="max-w-[1720px] mx-auto px-3 sm:px-6 pt-3 sm:pt-5 space-y-3 sm:space-y-4">
        {/* Row 1: The 3 Hero Cards (BELI, JUAL, USD/IDR) */}
        <PriceCards
          priceState={priceState}
          priceFlashDir={priceFlashDir}
          onCardClick={() => setCalculatorModalOpen(true)}
        />

        {/* Row 2: Nominal Tiers Chips (10jt, 30jt, 40jt, 50jt, 60jt) */}
        <TierChips
          tiers={tiers}
          onSelectTier={() => setCalculatorModalOpen(true)}
        />

        {/* Row 3: Status Section (TITIK ON, Clock with 3D Glossy ON Toggle, Metrics) */}
        <StatusSection
          priceState={priceState}
          onTogglePromo={handleTogglePromo}
          onOpenPromoModal={() => setPromoModalOpen(true)}
        />

        {/* Row 4: TradingView Advanced Real-Time Candlestick Chart */}
        <TradingViewChart
          indicators={selectedIndicators}
          height={520}
        />

        {/* Row 5: Riwayat Perubahan Harga Table */}
        <div ref={historyRef}>
          <RiwayatSection
            history={history}
            onClearHistory={() => {
              setHistory([]);
              localStorage.removeItem('treasury_price_history');
            }}
          />
        </div>
      </main>

      {/* Mobile Floating Bottom Nav Bar */}
      <MobileNav
        onOpenSoundModal={() => setSoundModalOpen(true)}
        onOpenNewsModal={() => setNewsModalOpen(true)}
        onOpenCalculatorModal={() => setCalculatorModalOpen(true)}
        onOpenPromoModal={() => setPromoModalOpen(true)}
        onOpenIndicatorModal={() => setIndicatorModalOpen(true)}
        onScrollToHistory={scrollToHistory}
        unreadNewsCount={newsItems.length}
        anySoundActive={
          soundConfig.priceUp ||
          soundConfig.priceDown ||
          soundConfig.highUp ||
          soundConfig.promo
        }
      />

      {/* Modals */}
      <SoundModal
        isOpen={soundModalOpen}
        onClose={() => setSoundModalOpen(false)}
        soundConfig={soundConfig}
        onUpdateConfig={updateSoundConfig}
      />

      <NewsModal
        isOpen={newsModalOpen}
        onClose={() => setNewsModalOpen(false)}
        newsItems={newsItems}
        onRefreshNews={() => {
          setIsRefreshingNews(true);
          setTimeout(() => setIsRefreshingNews(false), 800);
        }}
        isLoading={isRefreshingNews}
      />

      <CalculatorModal
        isOpen={calculatorModalOpen}
        onClose={() => setCalculatorModalOpen(false)}
        buyPrice={priceState.buy}
        sellPrice={priceState.sell}
      />

      <PromoModal
        isOpen={promoModalOpen}
        onClose={() => setPromoModalOpen(false)}
        promoStatus={priceState.promoStatus}
        limit={priceState.limit}
      />

      <IndicatorModal
        isOpen={indicatorModalOpen}
        onClose={() => setIndicatorModalOpen(false)}
        selectedIndicators={selectedIndicators}
        onToggleIndicator={toggleIndicator}
      />

      <NominalFilterModal
        isOpen={nominalModalOpen}
        onClose={() => setNominalModalOpen(false)}
        selectedNominals={visibleNominals}
        onToggleNominal={toggleNominal}
      />
    </div>
  );
}
