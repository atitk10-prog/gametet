import React, { useState } from 'react';
import { PlayerAvatar } from '../../types/game';
import { sound } from '../../services/sound';
import { Check, User, Sparkles, X } from 'lucide-react';

interface CharacterModalProps {
  avatar: PlayerAvatar;
  onSaveAvatar: (newAvatar: PlayerAvatar) => void;
  onClose: () => void;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({
  avatar,
  onSaveAvatar,
  onClose,
}) => {
  const [localAvatar, setLocalAvatar] = useState<PlayerAvatar>({ ...avatar });

  const outfits = [
    { id: 'ao_dai_red', name: 'Áo Dài Đỏ Thắm', color: 'bg-red-600' },
    { id: 'ao_dai_gold', name: 'Áo Dài Hoàng Kim', color: 'bg-amber-500' },
    { id: 'ao_dai_blue', name: 'Áo Dài Xanh Lam', color: 'bg-blue-600' },
    { id: 'ao_ba_ba', name: 'Áo Bà Ba Thân Thương', color: 'bg-stone-600' },
  ];

  const hats = [
    { id: 'khan_dong', name: 'Khăn Đóng Truyền Thống' },
    { id: 'non_la', name: 'Nón Lá Nghiêng Che' },
    { id: 'none', name: 'Không Đội Mũ' },
  ];

  const accessories = [
    { id: 'canh_mai', name: 'Cành Mai Vàng May Mắn', icon: '🌼' },
    { id: 'canh_dao', name: 'Cành Đào Bích Đón Xuân', icon: '🌸' },
    { id: 'phong_bao', name: 'Phong Bao Lì Xì Đỏ', icon: '🧧' },
    { id: 'none', name: 'Không Cầm Gì', icon: '✋' },
  ];

  const handleSave = () => {
    sound.playClick();
    onSaveAvatar(localAvatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 w-full max-w-xl rounded-3xl border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-amber-600 to-yellow-600 px-5 py-3 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👤</span>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wide text-amber-100 uppercase">
                Tủ Đồ Diện Tết Của Em
              </h2>
              <p className="text-xs text-amber-200">
                Mặc áo dài đẹp xúng xính đi chúc Tết ông bà
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

        {/* Content */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col sm:flex-row gap-5 overflow-y-auto">
          {/* Character Live Preview Stage */}
          <div className="w-full sm:w-44 bg-gradient-to-b from-amber-100 to-amber-200 rounded-2xl border-2 border-amber-300 p-4 flex flex-col items-center justify-center shadow-inner">
            <div className="relative w-28 h-36 flex flex-col items-center justify-center">
              {/* Hat */}
              {localAvatar.hat === 'khan_dong' && (
                <div className="w-14 h-4 bg-red-700 border border-amber-400 rounded-md z-20 -mb-2 shadow-sm" />
              )}
              {localAvatar.hat === 'non_la' && (
                <div className="w-0 h-0 border-l-[28px] border-l-transparent border-r-[28px] border-r-transparent border-b-[18px] border-b-amber-300 z-20 -mb-2 filter drop-shadow" />
              )}

              {/* Head */}
              <div className="w-12 h-12 rounded-full bg-amber-100 border-2 border-amber-300 relative flex items-center justify-center shadow">
                {/* Hair */}
                <div className="absolute top-0 inset-x-0 h-4 bg-stone-900 rounded-t-full" />
                {/* Eyes & Smile */}
                <div className="flex gap-2.5 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-800" />
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-800" />
                </div>
              </div>

              {/* Outfit Body */}
              <div
                className={`w-16 h-20 rounded-xl mt-1 border-2 border-black/20 shadow-md flex items-center justify-center ${
                  localAvatar.outfit === 'ao_dai_red'
                    ? 'bg-red-600'
                    : localAvatar.outfit === 'ao_dai_gold'
                    ? 'bg-amber-500'
                    : localAvatar.outfit === 'ao_dai_blue'
                    ? 'bg-blue-600'
                    : 'bg-stone-600'
                }`}
              >
                <div className="w-1 h-14 bg-amber-300/60 rounded" />
              </div>

              {/* Accessory icon preview */}
              {localAvatar.accessory !== 'none' && (
                <div className="absolute right-0 bottom-4 text-2xl filter drop-shadow">
                  {localAvatar.accessory === 'canh_mai' ? '🌼' : localAvatar.accessory === 'canh_dao' ? '🌸' : '🧧'}
                </div>
              )}
            </div>

            <div className="mt-3 font-extrabold text-xs text-amber-950 text-center">
              Nhân vật: Bé Ngoan Ngày Tết
            </div>
          </div>

          {/* Customization Options */}
          <div className="flex-1 space-y-4">
            {/* Gender Switch */}
            <div>
              <div className="text-xs font-black text-amber-950 uppercase tracking-wider mb-1.5">
                Giới Tính:
              </div>
              <div className="flex gap-2">
                {[
                  { id: 'boy', label: '👦 Bé Trai' },
                  { id: 'girl', label: '👧 Bé Gái' },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      sound.playClick();
                      setLocalAvatar({ ...localAvatar, gender: g.id as any });
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                      localAvatar.gender === g.id
                        ? 'bg-red-600 text-white border-red-700 shadow-sm'
                        : 'bg-white hover:bg-amber-50 border-amber-200 text-stone-700'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Outfits */}
            <div>
              <div className="text-xs font-black text-amber-950 uppercase tracking-wider mb-1.5">
                Trang Phục Áo Dài:
              </div>
              <div className="grid grid-cols-2 gap-2">
                {outfits.map((outfit) => (
                  <button
                    key={outfit.id}
                    onClick={() => {
                      sound.playClick();
                      setLocalAvatar({ ...localAvatar, outfit: outfit.id as any });
                    }}
                    className={`p-2 rounded-xl border-2 text-left text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      localAvatar.outfit === outfit.id
                        ? 'bg-amber-100 border-amber-500 shadow-sm ring-1 ring-amber-400'
                        : 'bg-white hover:bg-amber-50 border-amber-200 text-stone-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${outfit.color} border border-black/20`} />
                    <span className="truncate">{outfit.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hats */}
            <div>
              <div className="text-xs font-black text-amber-950 uppercase tracking-wider mb-1.5">
                Nón / Mũ Đội Đầu:
              </div>
              <div className="flex gap-2">
                {hats.map((hat) => (
                  <button
                    key={hat.id}
                    onClick={() => {
                      sound.playClick();
                      setLocalAvatar({ ...localAvatar, hat: hat.id as any });
                    }}
                    className={`flex-1 py-1.5 px-2 rounded-xl border-2 text-[11px] font-bold transition-all cursor-pointer ${
                      localAvatar.hat === hat.id
                        ? 'bg-red-600 text-white border-red-700 shadow-sm'
                        : 'bg-white hover:bg-amber-50 border-amber-200 text-stone-700'
                    }`}
                  >
                    {hat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessory in Hand */}
            <div>
              <div className="text-xs font-black text-amber-950 uppercase tracking-wider mb-1.5">
                Phụ Kiện Cầm Tay:
              </div>
              <div className="grid grid-cols-2 gap-2">
                {accessories.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      sound.playClick();
                      setLocalAvatar({ ...localAvatar, accessory: acc.id as any });
                    }}
                    className={`p-2 rounded-xl border-2 text-left text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      localAvatar.accessory === acc.id
                        ? 'bg-amber-100 border-amber-500 shadow-sm ring-1 ring-amber-400'
                        : 'bg-white hover:bg-amber-50 border-amber-200 text-stone-700'
                    }`}
                  >
                    <span>{acc.icon}</span>
                    <span className="truncate">{acc.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-amber-100/70 border-t border-amber-200 px-5 py-3 flex items-center justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Check size={16} />
            <span>Lưu Diện Mạo Mới</span>
          </button>
        </div>
      </div>
    </div>
  );
};
