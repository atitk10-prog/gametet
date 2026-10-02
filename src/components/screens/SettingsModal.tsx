import React from 'react';
import { sound } from '../../services/sound';
import { Volume2, VolumeX, RotateCcw, HelpCircle, X, Check } from 'lucide-react';

interface SettingsModalProps {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  onToggleMusic: () => void;
  onToggleSfx: () => void;
  onResetProgress: () => void;
  onOpenTutorial: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  musicEnabled,
  sfxEnabled,
  onToggleMusic,
  onToggleSfx,
  onResetProgress,
  onOpenTutorial,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 w-full max-w-md rounded-3xl border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-amber-600 to-yellow-600 px-5 py-3 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h2 className="text-base font-black tracking-wide text-amber-100 uppercase">
              Cài Đặt Trò Chơi
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Sound Controls */}
          <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-sm space-y-3">
            <div className="font-extrabold text-xs text-amber-950 uppercase tracking-wider">
              Âm Thanh & Nhạc Nền (Web Audio API)
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-stone-800 flex items-center gap-2">
                <span>🎵 Nhạc nền ngũ cung xuân:</span>
              </span>
              <button
                onClick={onToggleMusic}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                  musicEnabled
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-300 text-stone-600'
                }`}
              >
                {musicEnabled ? 'BẬT' : 'TẮT'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-stone-800 flex items-center gap-2">
                <span>🔔 Hiệu ứng âm thanh (SFX):</span>
              </span>
              <button
                onClick={onToggleSfx}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                  sfxEnabled
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-300 text-stone-600'
                }`}
              >
                {sfxEnabled ? 'BẬT' : 'TẮT'}
              </button>
            </div>
          </div>

          {/* Tutorial Helper */}
          <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-stone-800">Hướng Dẫn Chơi</div>
              <div className="text-[11px] text-stone-500">Xem lại các bước khám phá làng Tết</div>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onOpenTutorial();
              }}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-amber-950 font-extrabold text-xs rounded-xl shadow cursor-pointer"
            >
              Xem ngay
            </button>
          </div>

          {/* Reset Game Button */}
          <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-rose-900">Khôi Phục Tiến Trình</div>
              <div className="text-[11px] text-rose-600">Xóa dữ liệu đã lưu để chơi lại từ đầu</div>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Em có chắc muốn đặt lại toàn bộ tiến trình game không?')) {
                  onResetProgress();
                }
              }}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer flex items-center gap-1"
            >
              <RotateCcw size={13} />
              <span>Đặt Lại</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-amber-100/70 border-t border-amber-200 px-5 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
