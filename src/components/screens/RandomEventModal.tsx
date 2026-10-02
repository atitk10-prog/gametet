import React from 'react';
import { sound } from '../../services/sound';
import confetti from 'canvas-confetti';
import { Gift, Sparkles, X } from 'lucide-react';

interface RandomEventModalProps {
  title: string;
  description: string;
  rewards: { coins?: number; exp?: number; tetPoints?: number; itemName?: string };
  onClaim: () => void;
  onClose: () => void;
}

export const RandomEventModal: React.FC<RandomEventModalProps> = ({
  title,
  description,
  rewards,
  onClaim,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 w-full max-w-md rounded-3xl border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col text-center p-6 space-y-4">
        {/* Chest Animation Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-200 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-inner animate-bounce">
          🎁
        </div>

        <h3 className="text-lg font-black text-amber-950 uppercase tracking-wide">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
          {description}
        </p>

        {/* Rewards Box */}
        <div className="p-3 bg-white rounded-2xl border-2 border-amber-200 shadow-sm flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-extrabold text-amber-900">
          {rewards.coins && <span>🪙 +{rewards.coins} xu</span>}
          {rewards.exp && <span>⭐ +{rewards.exp} EXP</span>}
          {rewards.tetPoints && <span>🧧 +{rewards.tetPoints} Điểm Tết</span>}
          {rewards.itemName && <span className="text-emerald-700">🎁 +1 {rewards.itemName}</span>}
        </div>

        <button
          onClick={() => {
            sound.playCoin();
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#EF4444', '#F59E0B', '#10B981'],
            });
            onClaim();
          }}
          className="w-full py-3 bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Sparkles size={16} />
          <span>Mở Quà May Mắn Đầu Xuân</span>
        </button>
      </div>
    </div>
  );
};
