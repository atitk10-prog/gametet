import React, { useState } from 'react';
import { Question } from '../../types/game';
import { sound } from '../../services/sound';
import confetti from 'canvas-confetti';
import { HelpCircle, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface QuestionModalProps {
  question: Question;
  onAnswerCorrect: (stars: number, reward: Question['reward']) => void;
  onClose: () => void;
  contextTitle?: string;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  onAnswerCorrect,
  onClose,
  contextTitle,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const handleSubmit = (optionIdx: number) => {
    if (isCorrect) return;
    setSelectedIdx(optionIdx);
    const correct = optionIdx === question.correctAnswer;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (correct) {
      setIsCorrect(true);
      setIsAnswered(true);
      sound.playCorrect();

      // Confetti burst
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#EF4444', '#10B981'],
      });

      // Calculate star rating
      let stars = 3;
      if (nextAttempts === 2) stars = 2;
      if (nextAttempts >= 3) stars = 1;

      setTimeout(() => {
        onAnswerCorrect(stars, question.reward);
      }, 1600);
    } else {
      setIsCorrect(false);
      setIsAnswered(true);
      sound.playWrong();
      // Auto hint after 1st mistake
      setShowHint(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 w-full max-w-lg rounded-3xl border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 px-5 py-3.5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏮</span>
            <div>
              <div className="text-xs uppercase font-extrabold tracking-wider text-amber-200">
                {contextTitle || 'Thử Thách Trí Tuệ Ngày Tết'}
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{question.subject}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400 text-red-900 font-extrabold">
                  {question.topic}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-amber-200 text-xs font-bold bg-black/25 px-2.5 py-1 rounded-full">
            <span>Độ khó:</span>
            <span>{question.difficulty === 'easy' ? '⭐ Dễ' : question.difficulty === 'medium' ? '⭐⭐ Vừa' : '⭐⭐⭐ Nâng cao'}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto">
          {/* Question Text Card */}
          <div className="bg-white rounded-2xl p-4 border-2 border-amber-200 shadow-sm mb-4">
            <div className="text-stone-800 font-bold text-base sm:text-lg leading-relaxed">
              {question.question}
            </div>
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {question.options.map((opt, idx) => {
              const isSelected = selectedIdx === idx;
              let btnClass = 'bg-white hover:bg-amber-100 text-stone-800 border-amber-200';

              if (isAnswered && isSelected) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-500 text-white border-emerald-600 shadow-lg scale-[1.01]';
                } else {
                  btnClass = 'bg-rose-500 text-white border-rose-600 animate-shake';
                }
              } else if (isCorrect && idx === question.correctAnswer) {
                btnClass = 'bg-emerald-500 text-white border-emerald-600';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSubmit(idx)}
                  disabled={isCorrect}
                  className={`w-full text-left p-3.5 rounded-2xl border-2 font-bold text-sm sm:text-base flex items-center justify-between transition-all duration-150 cursor-pointer shadow-sm ${btnClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center text-xs font-black">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswered && isSelected && (
                    <span>{isCorrect ? '✅' : '❌'}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Gentle Hint Section */}
          {isAnswered && !isCorrect && (
            <div className="mt-4 p-3.5 bg-rose-50 border-2 border-rose-300 rounded-2xl animate-in fade-in">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <AlertCircle size={18} />
                <span>Chưa chính xác rồi! Đừng lo, hãy thử suy nghĩ lại một chút nhé.</span>
              </div>
              {showHint && question.hint && (
                <div className="mt-2 text-xs sm:text-sm text-stone-700 bg-amber-100/80 p-2.5 rounded-xl border border-amber-300">
                  <span className="font-extrabold text-amber-900">💡 Gợi ý cho em: </span>
                  {question.hint}
                </div>
              )}
            </div>
          )}

          {isCorrect && (
            <div className="mt-4 p-3.5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl animate-in zoom-in-95">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-base">
                <CheckCircle2 size={20} />
                <span>Tuyệt vời! Em trả lời hoàn toàn chính xác! 🎉</span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
                {question.explanation}
              </p>
              <div className="mt-2 flex items-center gap-3 text-xs font-bold text-emerald-700">
                <span>🪙 +{question.reward.coins} xu</span>
                <span>⭐ +{question.reward.exp} EXP</span>
                <span>🧧 +{question.reward.tetPoints} Điểm Tết</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-amber-100/70 border-t border-amber-200 px-5 py-3 flex items-center justify-between">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 text-amber-800 hover:text-amber-950 text-xs font-bold cursor-pointer"
          >
            <HelpCircle size={15} />
            <span>{showHint ? 'Ẩn gợi ý' : 'Xem gợi ý (💡)'}</span>
          </button>

          {!isCorrect && (
            <button
              onClick={onClose}
              className="text-stone-500 hover:text-stone-700 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-stone-200 transition-colors cursor-pointer"
            >
              Để lát nữa làm lại
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
