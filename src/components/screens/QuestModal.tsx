import React, { useState } from 'react';
import { Quest } from '../../types/game';
import { sound } from '../../services/sound';
import { CheckCircle2, Circle, Gift, Sparkles, X, ChevronRight, Lock } from 'lucide-react';

interface QuestModalProps {
  quests: { [id: string]: Quest };
  activeQuestId: string | null;
  onSelectActiveQuest: (questId: string) => void;
  onClaimQuestRewards: (questId: string) => void;
  onClose: () => void;
}

export const QuestModal: React.FC<QuestModalProps> = ({
  quests,
  activeQuestId,
  onSelectActiveQuest,
  onClaimQuestRewards,
  onClose,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'main' | 'side'>('all');
  const [selectedQuestId, setSelectedQuestId] = useState<string>(activeQuestId || 'main_quest_1');

  const questList = Object.values(quests).filter((q) => {
    if (filterType === 'all') return true;
    return q.type === filterType;
  });

  const selectedQuest = quests[selectedQuestId] || questList[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 w-full max-w-3xl rounded-3xl border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-amber-600 to-yellow-600 px-5 py-3 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📜</span>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wide text-amber-100 uppercase">
                Sổ Tay Nhiệm Vụ Ngày Tết
              </h2>
              <p className="text-xs text-amber-200">
                Làm theo chỉ dẫn của Bà Năm và người làng để đón một mùa Tết rực rỡ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex border-b border-amber-200 bg-amber-100/60 p-2 gap-2">
          {[
            { id: 'all', label: 'Tất Cả' },
            { id: 'main', label: '⭐ Nhiệm Vụ Chính (Cốt Truyện)' },
            { id: 'side', label: '🍃 Nhiệm Vụ Làng Quê' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setFilterType(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white/80 text-amber-900 hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content: Left List & Right Detail */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col sm:flex-row gap-4 overflow-y-auto">
          {/* Quest items list */}
          <div className="w-full sm:w-1/2 space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {questList.map((quest) => {
              const isSelected = selectedQuest?.id === quest.id;
              const isCompleted = quest.status === 'completed';
              const isLocked = quest.status === 'locked';

              return (
                <button
                  key={quest.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedQuestId(quest.id);
                  }}
                  className={`w-full p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between shadow-sm ${
                    isSelected
                      ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-400'
                      : isCompleted
                      ? 'bg-emerald-50 border-emerald-300 opacity-90'
                      : isLocked
                      ? 'bg-stone-100 border-stone-300 text-stone-400'
                      : 'bg-white hover:bg-amber-50 border-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 flex-1 pr-2">
                    <span className="text-xl">
                      {isCompleted ? '✅' : isLocked ? '🔒' : quest.type === 'main' ? '🏮' : '🎋'}
                    </span>
                    <div>
                      <div className="font-extrabold text-xs sm:text-sm text-stone-900 leading-snug">
                        {quest.title}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                        {quest.description}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : isLocked
                      ? 'bg-stone-200 text-stone-600'
                      : 'bg-amber-200 text-amber-900'
                  }`}>
                    {isCompleted ? 'Đã xong' : isLocked ? 'Chưa mở' : 'Đang làm'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quest Detail Panel */}
          {selectedQuest ? (
            <div className="w-full sm:w-1/2 bg-white rounded-2xl border-2 border-amber-200 p-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
                    <span>{selectedQuest.type === 'main' ? '🏮 Nhiệm vụ chính' : '🎋 Nhiệm vụ phụ'}</span>
                    <span>•</span>
                    <span>Từ: {selectedQuest.npcId === 'ba_nam' ? 'Bà Năm' : selectedQuest.npcId === 'be_mai' ? 'Bé Mai' : 'Dân làng'}</span>
                  </div>
                  <h3 className="font-extrabold text-base text-stone-900 mt-1 leading-snug">
                    {selectedQuest.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {selectedQuest.description}
                  </p>
                </div>

                {/* Objectives Checklist */}
                <div>
                  <div className="text-xs font-black text-amber-950 uppercase tracking-wider mb-2">
                    Các bước cần hoàn thành:
                  </div>
                  <div className="space-y-1.5">
                    {selectedQuest.objectives.map((obj) => (
                      <div
                        key={obj.id}
                        className={`p-2 rounded-xl text-xs flex items-center gap-2 border font-medium ${
                          obj.completed
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-200 line-through'
                            : 'bg-stone-50 text-stone-800 border-stone-200'
                        }`}
                      >
                        {obj.completed ? (
                          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        ) : (
                          <Circle size={16} className="text-stone-400 shrink-0" />
                        )}
                        <span>{obj.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rewards Preview */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="text-[11px] font-black text-amber-900 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Gift size={14} className="text-amber-600" />
                    <span>Phần thưởng khi hoàn thành:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-extrabold text-amber-800">
                    <span>🪙 +{selectedQuest.rewards.coins} xu</span>
                    <span>⭐ +{selectedQuest.rewards.exp} EXP</span>
                    <span>🧧 +{selectedQuest.rewards.tetPoints} Điểm Tết</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                {selectedQuest.status === 'completed' ? (
                  <div className="w-full py-2 bg-emerald-100 text-emerald-800 font-extrabold text-center rounded-xl text-xs">
                    🎉 Nhiệm vụ đã hoàn tất mỹ mãn!
                  </div>
                ) : selectedQuest.status === 'locked' ? (
                  <div className="w-full py-2 bg-stone-100 text-stone-500 font-bold text-center rounded-xl text-xs flex items-center justify-center gap-1">
                    <Lock size={14} />
                    <span>Hoàn thành nhiệm vụ trước để mở khóa</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      sound.playClick();
                      onSelectActiveQuest(selectedQuest.id);
                      onClose();
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Theo Dõi Nhiệm Vụ Này</span>
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full sm:w-1/2 flex items-center justify-center text-xs text-stone-400">
              Chọn nhiệm vụ để xem chi tiết
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
