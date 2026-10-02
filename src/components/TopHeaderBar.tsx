import React from 'react';
import { PlayerStats, TetDayProgress } from '../types/game';
import { sound } from '../services/sound';
import { Volume2, VolumeX, Sparkles, Settings as SettingsIcon } from 'lucide-react';

interface TopHeaderBarProps {
  stats: PlayerStats;
  currentDayInfo: TetDayProgress;
  onOpenSettings: () => void;
  musicEnabled: boolean;
  sfxEnabled: boolean;
  onToggleMusic: () => void;
}

export const TopHeaderBar: React.FC<TopHeaderBarProps> = ({
  stats,
  currentDayInfo,
  onOpenSettings,
  musicEnabled,
  sfxEnabled,
  onToggleMusic,
}) => {
  return (
    <header className="h-14 bg-gradient-to-r from-red-700 via-red-600 to-amber-700 text-white px-3 sm:px-5 flex items-center justify-between shadow-md border-b-2 border-amber-400 z-30 select-none">
      {/* Left: Brand & Day info */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-400 text-red-700 flex items-center justify-center font-black text-lg shadow-inner border border-amber-200">
          🧧
        </div>
        <div>
          <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm tracking-wide text-amber-200 leading-tight">
            <span>TẾT SUM VẦY</span>
            <span className="hidden md:inline text-xs text-amber-300/80 font-normal">| {currentDayInfo.dayName}</span>
          </div>
          <div className="text-[11px] font-medium text-amber-100/90 leading-none">
            {currentDayInfo.theme}
          </div>
        </div>
      </div>

      {/* Center: Resources & Currency Stats */}
      <div className="flex items-center gap-2 sm:gap-4 text-xs font-bold">
        {/* Xu Tết (Coins) */}
        <div className="flex items-center gap-1 bg-amber-900/60 border border-amber-400/50 px-2.5 py-1 rounded-full text-amber-200 shadow-sm" title="Xu Tết">
          <span className="text-sm">🪙</span>
          <span className="font-extrabold">{stats.coins}</span>
          <span className="hidden sm:inline text-[10px] text-amber-300/80">xu</span>
        </div>

        {/* Điểm Tết (Tet Spirit) */}
        <div className="flex items-center gap-1 bg-red-900/60 border border-red-300/50 px-2.5 py-1 rounded-full text-rose-100 shadow-sm" title="Điểm Tết">
          <span className="text-sm">🧧</span>
          <span className="font-extrabold">{stats.tetPoints}</span>
          <span className="hidden sm:inline text-[10px] text-rose-200/80">điểm</span>
        </div>

        {/* Cấp độ & EXP (Level) */}
        <div className="flex items-center gap-1.5 bg-yellow-950/60 border border-yellow-400/50 px-2.5 py-1 rounded-full text-yellow-200 shadow-sm" title="Cấp độ">
          <span className="text-xs text-amber-400">⭐</span>
          <span>Cấp {stats.level}</span>
          <div className="w-10 sm:w-14 h-2 bg-stone-700 rounded-full overflow-hidden border border-amber-500/40 hidden sm:block">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300"
              style={{ width: `${Math.min(100, (stats.exp % 100))}%` }}
            />
          </div>
        </div>

        {/* Năng lượng (Energy) */}
        <div className="hidden lg:flex items-center gap-1 bg-emerald-950/60 border border-emerald-400/50 px-2.5 py-1 rounded-full text-emerald-200 shadow-sm">
          <span className="text-xs">❤️</span>
          <span>{stats.energy}/{stats.maxEnergy}</span>
        </div>
      </div>

      {/* Right: Sound & Settings buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => {
            sound.playClick();
            onToggleMusic();
          }}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            musicEnabled
              ? 'bg-amber-500/30 border-amber-300 text-amber-200 hover:bg-amber-500/50'
              : 'bg-stone-800/60 border-stone-600 text-stone-400 hover:bg-stone-700/60'
          }`}
          title={musicEnabled ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
        >
          {musicEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onOpenSettings();
          }}
          className="p-2 rounded-xl bg-amber-500/30 border border-amber-300 text-amber-200 hover:bg-amber-500/50 transition-all cursor-pointer"
          title="Cài đặt trò chơi"
        >
          <SettingsIcon size={16} />
        </button>
      </div>
    </header>
  );
};
