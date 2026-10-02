import React, { useState } from 'react';
import { QUESTIONS_DATABASE } from '../../data/questions';
import { sound } from '../../services/sound';
import confetti from 'canvas-confetti';
import { Swords, Shield, Heart, Zap, Sparkles, X, RotateCcw } from 'lucide-react';

interface BattleScreenProps {
  playerLevel: number;
  onWinBattle: (rewards: { exp: number; coins: number; tetPoints: number; itemId?: string }) => void;
  onClose: () => void;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({
  playerLevel,
  onWinBattle,
  onClose,
}) => {
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [enemyHp, setEnemyHp] = useState<number>(100);
  const [currentQIdx, setCurrentQIdx] = useState<number>(0);
  const [battleState, setBattleState] = useState<'fighting' | 'won' | 'lost'>('fighting');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('Hãy trả lời đúng để khai triển Tuyệt Kỹ Trí Tuệ Ngày Tết!');

  // Pick 3-4 questions for battle
  const battleQuestions = QUESTIONS_DATABASE.slice(0, 5);
  const currentQ = battleQuestions[currentQIdx % battleQuestions.length];

  const handleAnswer = (optionIdx: number) => {
    if (battleState !== 'fighting') return;

    if (optionIdx === currentQ.correctAnswer) {
      // Player attack
      sound.playCorrect();
      const dmg = 35;
      const nextEnemyHp = Math.max(0, enemyHp - dmg);
      setEnemyHp(nextEnemyHp);
      setFeedbackMsg(`✨ Trả lời chính xác! Tuyệt kỹ "Pháo Hoa Trí Tuệ" gây ${dmg} sát thương lên đối thủ!`);

      if (nextEnemyHp <= 0) {
        setBattleState('won');
        sound.playQuestComplete();
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#EF4444', '#F59E0B', '#10B981'],
        });
      } else {
        setCurrentQIdx((prev) => prev + 1);
      }
    } else {
      // Enemy counterattack
      sound.playWrong();
      const dmg = 25;
      const nextPlayerHp = Math.max(0, playerHp - dmg);
      setPlayerHp(nextPlayerHp);
      setFeedbackMsg(`❌ Chưa đúng rồi! Thần Nghịch Ngợm thả tuyết lạnh làm em mất ${dmg} HP!`);

      if (nextPlayerHp <= 0) {
        setBattleState('lost');
      }
    }
  };

  const handleRestart = () => {
    setPlayerHp(100);
    setEnemyHp(100);
    setCurrentQIdx(0);
    setBattleState('fighting');
    setFeedbackMsg('Hãy trả lời đúng để khai triển Tuyệt Kỹ Trí Tuệ Ngày Tết!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-stone-900 via-indigo-950 to-stone-900 w-full max-w-2xl rounded-3xl border-4 border-amber-500 shadow-2xl overflow-hidden flex flex-col text-white max-h-[92vh]">
        {/* Battle Header */}
        <div className="bg-gradient-to-r from-red-800 via-purple-900 to-indigo-900 px-5 py-3 flex items-center justify-between border-b border-amber-500/50 shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚔️</span>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wide text-amber-300 uppercase">
                Hội Đấu Trí Dân Gian – Bảo Vệ Nồi Bánh Chưng
              </h2>
              <p className="text-xs text-indigo-200">
                Thử thách kiến thức cùng Thần Tuyết Nghịch Ngợm
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Combat Arena Stage */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between overflow-y-auto">
          {/* Opponents Stage Bars */}
          <div className="flex items-center justify-between gap-4">
            {/* Player Side */}
            <div className="flex-1 bg-stone-800/80 p-3 rounded-2xl border border-emerald-500/60 shadow">
              <div className="flex items-center justify-between text-xs font-black text-emerald-300 mb-1">
                <span>👦 Em (Cấp {playerLevel})</span>
                <span>{playerHp}/100 HP</span>
              </div>
              <div className="w-full h-3 bg-stone-700 rounded-full overflow-hidden border border-emerald-400/40">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-300"
                  style={{ width: `${playerHp}%` }}
                />
              </div>
              <div className="text-3xl text-center mt-2 filter drop-shadow">
                🧧
              </div>
            </div>

            {/* VS Badge */}
            <div className="text-xl font-black text-amber-400 bg-amber-950/80 w-10 h-10 rounded-full border border-amber-400 flex items-center justify-center shrink-0 shadow-lg">
              VS
            </div>

            {/* Enemy Side */}
            <div className="flex-1 bg-stone-800/80 p-3 rounded-2xl border border-indigo-500/60 shadow">
              <div className="flex items-center justify-between text-xs font-black text-indigo-300 mb-1">
                <span>❄️ Thần Tuyết Nghịch Ngợm</span>
                <span>{enemyHp}/100 HP</span>
              </div>
              <div className="w-full h-3 bg-stone-700 rounded-full overflow-hidden border border-indigo-400/40">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${enemyHp}%` }}
                />
              </div>
              <div className="text-3xl text-center mt-2 filter drop-shadow">
                👹
              </div>
            </div>
          </div>

          {/* Feedback announcement box */}
          <div className="my-3 p-2.5 rounded-xl bg-black/40 border border-amber-500/40 text-center text-xs font-bold text-amber-200">
            {feedbackMsg}
          </div>

          {/* Question / Battle Interaction Card */}
          {battleState === 'fighting' && (
            <div className="bg-stone-800/90 rounded-2xl p-4 border border-amber-500/50 shadow-inner space-y-3">
              <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                <span>Chủ đề: {currentQ.subject} - {currentQ.topic}</span>
                <span>Câu đố {currentQIdx + 1}</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-stone-100">
                {currentQ.question}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className="p-3 rounded-xl bg-stone-700 hover:bg-amber-600 text-left text-xs sm:text-sm font-bold text-white transition-all cursor-pointer border border-stone-600 active:scale-95 shadow-sm"
                  >
                    <span className="text-amber-300 font-black mr-2">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* VICTORY SCREEN */}
          {battleState === 'won' && (
            <div className="bg-emerald-950/80 border-2 border-emerald-400 p-5 rounded-2xl text-center space-y-3 animate-in zoom-in-95">
              <div className="text-4xl">🏆</div>
              <h3 className="text-lg font-black text-amber-300">
                Chiến Thắng! Thần Tuyết Đã Bị Thuyết Phục Bởi Trí Tuệ!
              </h3>
              <p className="text-xs text-stone-300">
                Nồi bánh chưng của gia đình được bảo vệ an toàn, lửa ấm bập bùng đón Tết sang.
              </p>
              <div className="flex justify-center gap-4 text-xs font-bold text-emerald-200 bg-black/40 p-2.5 rounded-xl border border-emerald-500/40">
                <span>🪙 +80 xu</span>
                <span>⭐ +150 EXP</span>
                <span>🧧 +40 Điểm Tết</span>
                <span>💎 +1 Ngọc Quý</span>
              </div>
              <button
                onClick={() => {
                  sound.playCoin();
                  onWinBattle({ exp: 150, coins: 80, tetPoints: 40, itemId: 'ngoc_quy_tet' });
                  onClose();
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg hover:brightness-110 active:scale-95 cursor-pointer"
              >
                Nhận Phần Thưởng & Trở Về Làng
              </button>
            </div>
          )}

          {/* DEFEAT SCREEN */}
          {battleState === 'lost' && (
            <div className="bg-rose-950/80 border-2 border-rose-500 p-5 rounded-2xl text-center space-y-3 animate-in zoom-in-95">
              <div className="text-4xl">❄️</div>
              <h3 className="text-lg font-black text-rose-300">
                Hết Năng Lượng Rồi!
              </h3>
              <p className="text-xs text-stone-300">
                Đừng nản lòng, em có thể thử lại để rèn luyện trí tuệ bất cứ lúc nào!
              </p>
              <button
                onClick={handleRestart}
                className="px-6 py-2.5 bg-rose-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg hover:bg-rose-500 active:scale-95 cursor-pointer flex items-center gap-1.5 mx-auto"
              >
                <RotateCcw size={15} />
                <span>Thử Thách Lại Ngay</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
