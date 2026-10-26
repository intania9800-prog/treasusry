import React from 'react';
import { X, Volume2, Bell, Radio, Check, Play } from 'lucide-react';
import { SoundConfig } from '../../types';
import { playChimeUp, playChimeDown, playCountdownTick, speakPromo } from '../../utils/audio';

interface SoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundConfig: SoundConfig;
  onUpdateConfig: (config: SoundConfig) => void;
}

export const SoundModal: React.FC<SoundModalProps> = ({
  isOpen,
  onClose,
  soundConfig,
  onUpdateConfig,
}) => {
  if (!isOpen) return null;

  const toggle = (key: keyof Omit<SoundConfig, 'volume'>) => {
    onUpdateConfig({
      ...soundConfig,
      [key]: !soundConfig[key],
    });
  };

  const setAll = (val: boolean) => {
    onUpdateConfig({
      ...soundConfig,
      priceUp: val,
      highUp: val,
      priceDown: val,
      highDown: val,
      promo: val,
      countdown: val,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e121a] border border-[#232b3b] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2636] bg-[#121622]">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-black text-white font-outfit">
              PENGATURAN SUARA & NOTIFIKASI
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
        <div className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
          {/* Quick All Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => setAll(true)}
              className="py-2 px-3 text-xs font-bold text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-700/40 rounded-xl transition-all"
            >
              Nyalakan Semua
            </button>
            <button
              onClick={() => setAll(false)}
              className="py-2 px-3 text-xs font-bold text-zinc-400 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-700/40 rounded-xl transition-all"
            >
              Matikan Semua
            </button>
          </div>

          {/* Sound Row: Price Up */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#141924] border border-[#21293a]">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Harga Naik</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700/40 font-mono">
                  +CHIME
                </span>
              </div>
              <div className="text-xs text-zinc-400">Bunyi saat harga beli naik</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => playChimeUp(false, soundConfig.volume)}
                className="p-1.5 text-zinc-400 hover:text-emerald-400 rounded-lg hover:bg-zinc-800 transition-all"
                title="Test Suara"
              >
                <Play className="w-4 h-4" />
              </button>
              <input
                type="checkbox"
                checked={soundConfig.priceUp}
                onChange={() => toggle('priceUp')}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Sound Row: High Up */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#141924] border border-[#21293a]">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Naik Tinggi (&gt; Rp 3.000)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700/40 font-mono">
                  ARPEGGIO
                </span>
              </div>
              <div className="text-xs text-zinc-400">Bunyi arpeggio khusus lonjakan tinggi</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => playChimeUp(true, soundConfig.volume)}
                className="p-1.5 text-zinc-400 hover:text-emerald-400 rounded-lg hover:bg-zinc-800 transition-all"
                title="Test Suara"
              >
                <Play className="w-4 h-4" />
              </button>
              <input
                type="checkbox"
                checked={soundConfig.highUp}
                onChange={() => toggle('highUp')}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Sound Row: Price Down */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#141924] border border-[#21293a]">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Harga Turun</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-700/40 font-mono">
                  -CHIME
                </span>
              </div>
              <div className="text-xs text-zinc-400">Bunyi saat harga beli turun</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => playChimeDown(false, soundConfig.volume)}
                className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-zinc-800 transition-all"
                title="Test Suara"
              >
                <Play className="w-4 h-4" />
              </button>
              <input
                type="checkbox"
                checked={soundConfig.priceDown}
                onChange={() => toggle('priceDown')}
                className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Sound Row: High Down */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#141924] border border-[#21293a]">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Turun Tinggi (&gt; Rp 3.000)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-700/40 font-mono">
                  WARNING
                </span>
              </div>
              <div className="text-xs text-zinc-400">Bunyi khusus penurunan drastis</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => playChimeDown(true, soundConfig.volume)}
                className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-zinc-800 transition-all"
                title="Test Suara"
              >
                <Play className="w-4 h-4" />
              </button>
              <input
                type="checkbox"
                checked={soundConfig.highDown}
                onChange={() => toggle('highDown')}
                className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Sound Row: Promo Status Speech */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#141924] border border-[#21293a]">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Suara Promo ON / OFF</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-700/40 font-mono">
                  VOICE
                </span>
              </div>
              <div className="text-xs text-zinc-400">Pengumuman suara saat promo aktif/berakhir</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => speakPromo('ON')}
                className="p-1.5 text-zinc-400 hover:text-amber-400 rounded-lg hover:bg-zinc-800 transition-all"
                title="Test Suara"
              >
                <Play className="w-4 h-4" />
              </button>
              <input
                type="checkbox"
                checked={soundConfig.promo}
                onChange={() => toggle('promo')}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Sound Row: Countdown Beep */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#141924] border border-[#21293a]">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Detik Hitung Mundur</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-700/40 font-mono">
                  TICK
                </span>
              </div>
              <div className="text-xs text-zinc-400">Detik 55–59 pergantian menit</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => playCountdownTick(soundConfig.volume)}
                className="p-1.5 text-zinc-400 hover:text-blue-400 rounded-lg hover:bg-zinc-800 transition-all"
                title="Test Suara"
              >
                <Play className="w-4 h-4" />
              </button>
              <input
                type="checkbox"
                checked={soundConfig.countdown}
                onChange={() => toggle('countdown')}
                className="w-5 h-5 accent-blue-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Volume Slider */}
          <div className="pt-2">
            <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
              <span>Volume Suara</span>
              <span className="font-mono">{Math.round(soundConfig.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={soundConfig.volume}
              onChange={(e) =>
                onUpdateConfig({ ...soundConfig, volume: parseFloat(e.target.value) })
              }
              className="w-full accent-amber-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#121622] border-t border-[#1f2636] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-xl transition-all shadow-md"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
