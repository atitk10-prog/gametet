import React, { useState } from 'react';
import { GAME_ITEMS } from '../../data/items';
import { sound } from '../../services/sound';
import { X, Sparkles, Package } from 'lucide-react';

interface InventoryModalProps {
  inventory: { [itemId: string]: number };
  onClose: () => void;
  onSelectDecoration?: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  inventory,
  onClose,
  onSelectDecoration,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'ingredient' | 'food' | 'decoration' | 'special'>('all');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const tabs = [
    { id: 'all', label: 'Tất Cả' },
    { id: 'ingredient', label: '🌾 Nguyên Liệu' },
    { id: 'food', label: '🍲 Thực Phẩm' },
    { id: 'decoration', label: '🌸 Trang Trí' },
    { id: 'special', label: '🧧 Đặc Biệt' },
  ];

  // Items currently owned in inventory
  const ownedItems = Object.entries(inventory)
    .filter(([_, count]) => count > 0)
    .map(([id, count]) => ({
      ...GAME_ITEMS[id],
      count,
    }))
    .filter((item) => activeTab === 'all' || item.category === activeTab);

  const selectedItem = selectedItemId ? GAME_ITEMS[selectedItemId] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 w-full max-w-2xl rounded-3xl border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-amber-600 to-yellow-600 px-5 py-3 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎒</span>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wide text-amber-100 uppercase">
                Túi Đồ Ngày Tết Của Em
              </h2>
              <p className="text-xs text-amber-200">
                Lưu giữ nguyên liệu, bánh trái thơm lộc và đồ trang trí sum vầy
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
        <div className="flex border-b border-amber-200 bg-amber-100/60 p-2 gap-1.5 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white/80 text-amber-900 hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col sm:flex-row gap-4 overflow-y-auto">
          {/* Grid of items */}
          <div className="flex-1 min-h-[220px]">
            {ownedItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center text-stone-500">
                <Package size={42} className="text-amber-300 mb-2" />
                <div className="font-bold text-sm text-stone-700">Túi đồ hiện đang trống mục này</div>
                <div className="text-xs text-stone-500 mt-1">
                  Hãy ghé Chợ Tết sắm sửa hoặc hoàn thành nhiệm vụ để nhận thêm vật phẩm nhé!
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[350px] overflow-y-auto pr-1">
                {ownedItems.map((item) => {
                  const isSelected = selectedItemId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedItemId(item.id);
                      }}
                      className={`relative p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-400 shadow-md scale-105'
                          : 'bg-white hover:bg-amber-50 border-amber-200 shadow-sm'
                      }`}
                    >
                      <span className="text-3xl sm:text-4xl mb-1">{item.icon}</span>
                      <span className="text-[11px] font-bold text-stone-800 text-center line-clamp-1">
                        {item.name}
                      </span>
                      <span className="absolute top-1 right-1.5 bg-amber-400 text-amber-950 font-black text-[10px] px-1.5 py-0.5 rounded-full shadow-inner">
                        x{item.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Item Details Card */}
          <div className="w-full sm:w-64 bg-white rounded-2xl border-2 border-amber-200 p-4 flex flex-col justify-between shadow-sm">
            {selectedItem ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl border border-amber-300">
                    {selectedItem.icon}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-stone-900 leading-tight">
                      {selectedItem.name}
                    </h4>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      {selectedItem.category}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-stone-600 leading-relaxed bg-amber-50/70 p-3 rounded-xl border border-amber-200 font-medium">
                  {selectedItem.description}
                </div>

                <div className="text-xs text-amber-900 font-extrabold flex items-center gap-1">
                  <span>Giá trị tham khảo:</span>
                  <span>🪙 {selectedItem.price} xu</span>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-xs text-stone-400 p-4">
                Chạm vào một vật phẩm bất kỳ để xem chi tiết
              </div>
            )}

            {selectedItem?.category === 'decoration' && onSelectDecoration && (
              <button
                onClick={() => {
                  sound.playClick();
                  onSelectDecoration();
                }}
                className="mt-3 w-full py-2 bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                <span>🏠 Đi Trang Trí Nhà Ngay</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
