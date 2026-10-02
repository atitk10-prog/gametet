import React from 'react';
import { sound } from '../../services/sound';
import { Play, Sparkles, BookOpen, Volume2 } from 'lucide-react';

interface SplashScreenProps {
  onStartGame: () => void;
  onOpenTutorial: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onStartGame,
  onOpenTutorial,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-red-900 via-rose-950 to-amber-950 select-none overflow-hidden">
      {/* Decorative background lanterns & floral floating circles */}
      <div className="absolute top-10 left-10 text-5xl opacity-40 animate-pulse">🏮</div>
      <div className="absolute top-12 right-12 text-5xl opacity-40 animate-pulse delay-200">🏮</div>
      <div className="absolute bottom-14 left-16 text-6xl opacity-30 animate-bounce">🌸</div>
      <div className="absolute bottom-16 right-20 text-6xl opacity-30 animate-bounce delay-300">🌼</div>

      <div className="relative bg-gradient-to-b from-amber-50 to-orange-100 max-w-lg w-full rounded-3xl border-4 border-amber-400 p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(245,158,11,0.4)] flex flex-col items-center">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 border border-red-300 text-red-800 text-xs font-black uppercase tracking-wider mb-2">
          <span>🧧</span>
          <span>Game Giáo Dục 2D Khám Phá Văn Hóa Tết</span>
        </div>

        {/* Game Title */}
        <h1 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-red-600 to-amber-600 tracking-tight leading-tight mt-1">
          TẾT SUM VẦY
        </h1>
        <h2 className="text-lg sm:text-2xl font-black text-amber-900 mt-0.5">
          HÀNH TRÌNH GÓI BÁNH
        </h2>

        {/* Central Illustration Badge */}
        <div className="my-5 relative flex items-center justify-center">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-400 p-2 border-4 border-amber-500 shadow-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform">
            <span className="text-6xl filter drop-shadow">🟩</span>
          </div>
          <div className="absolute -top-3 -right-3 text-3xl animate-bounce">
            ✨
          </div>
          <div className="absolute -bottom-2 -left-2 text-3xl">
            🌸
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium max-w-sm mb-6">
          Trở về làng quê yên bình, dạo bước qua chợ xuân nhộn nhịp, giải đố học tập bổ ích, cùng Bà Năm kỳ công gói bánh chưng và trang hoàng tổ ấm ngày Tết!
        </p>

        {/* Buttons */}
        <div className="w-full space-y-3">
          <button
            onClick={() => {
              sound.playClick();
              sound.startMusic();
              onStartGame();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-black text-base sm:text-lg shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-amber-300"
          >
            <Play size={20} className="fill-white" />
            <span>BẮT ĐẦU HÀNH TRÌNH TẾT</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenTutorial();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-amber-50 text-amber-950 font-extrabold text-xs sm:text-sm border-2 border-amber-300 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen size={16} />
            <span>Xem Hướng Dẫn Cách Chơi</span>
          </button>
        </div>

        {/* Credit footer */}
        <div className="mt-5 text-[11px] text-amber-900/80 font-bold flex items-center justify-center gap-2">
          <span>🌾 Phong vị Tết Cổ Truyền Việt Nam</span>
          <span>•</span>
          <span>Học mà Chơi, Chơi mà Học</span>
        </div>
      </div>
    </div>
  );
};
