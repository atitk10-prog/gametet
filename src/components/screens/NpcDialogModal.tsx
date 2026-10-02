import React, { useState } from 'react';
import { NPC, Quest } from '../../types/game';
import { sound } from '../../services/sound';
import { MessageCircle, ArrowRight, CheckCircle, Sparkles, X } from 'lucide-react';

interface NpcDialogModalProps {
  npc: NPC;
  activeQuest?: Quest;
  onAcceptQuest?: (questId: string) => void;
  onCompleteQuestStep?: (stepId: string) => void;
  onStartQuizFromNpc?: () => void;
  onClose: () => void;
}

export const NpcDialogModal: React.FC<NpcDialogModalProps> = ({
  npc,
  activeQuest,
  onAcceptQuest,
  onCompleteQuestStep,
  onStartQuizFromNpc,
  onClose,
}) => {
  const [dialogueIdx, setDialogueIdx] = useState<number>(0);

  // Determine lines: if quest related, show quest line
  let lines: string[] = npc.dialogue.greeting;
  if (activeQuest && npc.dialogue.questRelated && npc.dialogue.questRelated[activeQuest.id]) {
    lines = [npc.dialogue.questRelated[activeQuest.id], ...npc.dialogue.idle];
  } else {
    lines = [...npc.dialogue.greeting, ...npc.dialogue.idle];
  }

  const currentLine = lines[dialogueIdx % lines.length];

  const handleNextLine = () => {
    sound.playClick();
    if (dialogueIdx + 1 < lines.length) {
      setDialogueIdx(dialogueIdx + 1);
    } else {
      // Finished lines, close or trigger action
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm select-none animate-in fade-in duration-150">
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 w-full max-w-xl rounded-3xl border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div
          className="px-5 py-3 text-white flex items-center justify-between shadow-md"
          style={{ backgroundColor: npc.color || '#E11D48' }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-3xl filter drop-shadow">{npc.avatarIcon}</span>
            <div>
              <h3 className="font-black text-base sm:text-lg text-white leading-tight">
                {npc.name}
              </h3>
              <p className="text-xs text-amber-200 font-semibold">{npc.title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dialogue Speech Card */}
        <div className="p-5 space-y-4">
          <div className="bg-white rounded-2xl p-4 border-2 border-amber-200 shadow-sm min-h-[90px] flex items-center">
            <p className="text-stone-800 font-bold text-sm sm:text-base leading-relaxed">
              “{currentLine}”
            </p>
          </div>

          {/* Action options if NPC offers quest or quiz */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            {npc.questOfferId && onAcceptQuest && (
              <button
                onClick={() => {
                  sound.playQuestComplete();
                  onAcceptQuest(npc.questOfferId!);
                  onClose();
                }}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles size={16} />
                <span>Nhận Nhiệm Vụ Từ {npc.name}</span>
              </button>
            )}

            {onStartQuizFromNpc && (
              <button
                onClick={() => {
                  sound.playClick();
                  onStartQuizFromNpc();
                }}
                className="py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-amber-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>💡 Trả Lời Câu Đố</span>
              </button>
            )}

            <button
              onClick={handleNextLine}
              className="py-2.5 px-4 bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{dialogueIdx + 1 < lines.length ? 'Nghe tiếp...' : 'Chào tạm biệt'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
