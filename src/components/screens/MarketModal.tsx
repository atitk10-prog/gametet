import React, { useState } from 'react';
import { GAME_ITEMS } from '../../data/items';
import { sound } from '../../services/sound';
import { ShoppingBag, Sparkles, X, Check, HelpCircle } from 'lucide-react';

interface MarketModalProps {
  playerCoins: number;
  inventory: { [itemId: string]: number };
  onBuyItem: (itemId: string, cost: number, requiresQuiz?: boolean) => void;
  onClose: () => void;
}

export const MarketModal: React.FC<MarketModalProps> = ({
  playerCoins,
  inventory,
  onBuyItem,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState<'ingredient' | 'decoration' | 'food'>('ingredient');

  const categories = [
    { id: 'ingredient', label: '🌾 Nguyên Liệu Bánh', icon: '🌾' },
    { id: 'decoration', label: '🌸 Đồ Trang Trí Tết', icon: '🌸' },
    { id: 'food', label: '🍬 Bánh Mứt Đón Xuân', icon: '🍬' },
  ];

  const filteredItems = Object.values(GAME_ITEMS).filter((item) => item.category === activeCategory);

  const handleBuy = (itemId: string, price: number) => {
    if (playerCoins < price) {
      sound.playWrong();
      return;
    }
    // Items that trigger educational shopping quiz: gao_nep, thit_ba_chi, la_dong
    const quizItems = ['gao_nep', 'thit_ba_chi', 'dau_xanh', 'la_dong'];
    const shouldQuiz = quizItems.includes(itemId) && (inventory[itemId] || 0) === 0;

    onBuyItem(itemId, price, shouldQuiz);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/65 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 w-full max-w-3xl rounded-3xl border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-amber-600 to-yellow-600 px-5 py-3.5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🏪</span>
            <div>
              <h2 className="text-lg font-black tracking-wide text-amber-100 uppercase">
                Chợ Tết Làng Quê – Sạp Bác Ba
              </h2>
              <p className="text-xs text-amber-200">
                “Gạo thơm đỗ mẩy lá xanh – Mua hàng khéo léo xuân lành ấm no”
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-amber-950/70 border border-amber-300 px-3 py-1 rounded-full text-amber-300 font-extrabold text-sm flex items-center gap-1.5 shadow-inner">
              <span>🪙</span>
              <span>{playerCoins} xu</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/25 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex border-b border-amber-200 bg-amber-100/60 p-2 gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setActiveCategory(cat.id as any);
              }}
              className={`px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white/80 text-amber-900 hover:bg-white'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredItems.map((item) => {
            const ownedCount = inventory[item.id] || 0;
            const canAfford = playerCoins >= item.price;
            const isQuizItem = ['gao_nep', 'thit_ba_chi', 'dau_xanh', 'la_dong'].includes(item.id) && ownedCount === 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border-2 border-amber-200/90 p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl border border-amber-300/60 shadow-inner">
                      {item.icon}
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-amber-600 flex items-center justify-end gap-1">
                        <span>🪙</span>
                        <span>{item.price} xu</span>
                      </span>
                      {ownedCount > 0 && (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Đã có: {ownedCount}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-extrabold text-stone-900 text-sm sm:text-base mt-2 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                  {isQuizItem && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-md flex items-center gap-1">
                      <span>💡</span>
                      <span>Có câu đố vui</span>
                    </span>
                  )}

                  <button
                    onClick={() => handleBuy(item.id, item.price)}
                    disabled={!canAfford}
                    className={`ml-auto px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white hover:brightness-110 shadow-sm active:scale-95'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag size={14} />
                    <span>Mua</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="bg-amber-100/70 border-t border-amber-200 px-5 py-3 flex items-center justify-between text-xs text-amber-900 font-medium">
          <div className="flex items-center gap-2">
            <span>💡</span>
            <span>Gợi ý: Mua đủ Gạo, Đậu xanh, Thịt và Lá dong để mở màn gói Bánh Chưng tại Bếp lửa!</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
