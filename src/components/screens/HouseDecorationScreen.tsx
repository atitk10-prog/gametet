import React, { useState } from 'react';
import { HouseLayout, PlacedDecoration } from '../../types/game';
import { GAME_ITEMS } from '../../data/items';
import { DECORATION_CATALOG } from '../../data/decorations';
import { sound } from '../../services/sound';
import { Trash2, Sparkles, X, Plus, Move, Check } from 'lucide-react';

interface HouseDecorationScreenProps {
  house: HouseLayout;
  inventory: { [itemId: string]: number };
  onSaveHouse: (layout: HouseLayout, updatedInventory: { [itemId: string]: number }) => void;
  onClose: () => void;
}

export const HouseDecorationScreen: React.FC<HouseDecorationScreenProps> = ({
  house,
  inventory,
  onSaveHouse,
  onClose,
}) => {
  const [placedItems, setPlacedItems] = useState<PlacedDecoration[]>([...house.items]);
  const [localInventory, setLocalInventory] = useState<{ [itemId: string]: number }>({ ...inventory });
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<string | null>(null);
  const [selectedPlacedId, setSelectedPlacedId] = useState<string | null>(null);

  // Available decorations in inventory (count > 0 and is decoration category)
  const availableDecoItems = Object.entries(localInventory)
    .filter(([id, count]) => count > 0 && GAME_ITEMS[id]?.category === 'decoration')
    .map(([id]) => GAME_ITEMS[id]);

  // Click on the room floor / wall to place the selected item
  const handleRoomClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedInventoryItem) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(30, Math.min(rect.width - 30, e.clientX - rect.left));
    const y = Math.max(30, Math.min(rect.height - 30, e.clientY - rect.top));

    const newPlaced: PlacedDecoration = {
      id: `deco_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      itemId: selectedInventoryItem,
      x: Math.round(x),
      y: Math.round(y),
      placedAt: Date.now(),
    };

    const nextPlaced = [...placedItems, newPlaced];
    const nextInv = {
      ...localInventory,
      [selectedInventoryItem]: (localInventory[selectedInventoryItem] || 1) - 1,
    };

    sound.playCoin();
    setPlacedItems(nextPlaced);
    setLocalInventory(nextInv);
    onSaveHouse({ ...house, items: nextPlaced }, nextInv);

    // If no more count, unselect
    if (nextInv[selectedInventoryItem] <= 0) {
      setSelectedInventoryItem(null);
    }
  };

  // Remove placed item and return to inventory
  const handleRemovePlaced = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = placedItems.find((p) => p.id === id);
    if (!target) return;

    sound.playClick();
    const nextPlaced = placedItems.filter((p) => p.id !== id);
    const nextInv = {
      ...localInventory,
      [target.itemId]: (localInventory[target.itemId] || 0) + 1,
    };

    setPlacedItems(nextPlaced);
    setLocalInventory(nextInv);
    if (selectedPlacedId === id) setSelectedPlacedId(null);
    onSaveHouse({ ...house, items: nextPlaced }, nextInv);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 w-full max-w-4xl rounded-3xl border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-amber-600 to-yellow-600 px-5 py-3 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wide text-amber-100 uppercase">
                Trang Hoàng Tổ Ấm Đón Tết Sum Vầy
              </h2>
              <p className="text-xs text-amber-200">
                Chạm để đặt đồ trang trí, dọn dẹp và làm đẹp ngôi nhà của em!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-amber-950/60 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold text-amber-200">
              Đã bày: {placedItems.length} món
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Room Interactive Canvas / Container */}
        <div className="p-4 flex-1 flex flex-col lg:flex-row gap-4 overflow-y-auto">
          {/* Main Living Room View */}
          <div
            onClick={handleRoomClick}
            className={`relative flex-1 min-h-[350px] sm:min-h-[420px] rounded-3xl border-4 border-amber-800/60 overflow-hidden shadow-2xl transition-all cursor-${
              selectedInventoryItem ? 'crosshair' : 'default'
            }`}
            style={{
              background: 'linear-gradient(to bottom, #FEF3C7 0%, #FDE68A 55%, #D97706 55%, #92400E 100%)',
            }}
          >
            {/* Wall Window with Spring Landscape */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-48 h-32 bg-sky-200 rounded-2xl border-4 border-amber-900 shadow-inner overflow-hidden flex items-end justify-center pointer-events-none">
              <div className="w-full h-12 bg-emerald-400 rounded-t-full" />
              <div className="absolute top-2 right-4 text-2xl">☀️</div>
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 border-2 border-amber-900/60" />
            </div>

            {/* Traditional Wooden Altar & Tea Table */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-56 h-24 bg-amber-950 rounded-2xl border-4 border-amber-900 shadow-2xl flex flex-col items-center justify-start p-2 pointer-events-none">
              <div className="w-48 h-3 bg-amber-800 rounded-full mb-1 shadow" />
              <div className="flex gap-4 items-center mt-2 text-2xl">
                <span title="Ấm trà sen">🍵</span>
                <span title="Khay mứt Tết">🍬</span>
                <span title="Bình lay ơn">💐</span>
              </div>
              <div className="text-[10px] text-amber-300 font-extrabold mt-1">BÀN TRÀ TẾT</div>
            </div>

            {/* Instruction Prompt if item selected */}
            {selectedInventoryItem && (
              <div className="absolute top-3 left-3 bg-red-600/90 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-lg border border-amber-300 animate-pulse pointer-events-none">
                👉 Chạm vào bất kỳ vị trí nào trong phòng để đặt: {GAME_ITEMS[selectedInventoryItem]?.name}
              </div>
            )}

            {/* Render Placed Decorations */}
            {placedItems.map((placed) => {
              const item = GAME_ITEMS[placed.itemId];
              const isSelected = selectedPlacedId === placed.id;

              return (
                <div
                  key={placed.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    setSelectedPlacedId(isSelected ? null : placed.id);
                  }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 cursor-pointer ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-20'
                  }`}
                  style={{ left: `${placed.x}px`, top: `${placed.y}px` }}
                >
                  {/* Visual Render for specific items */}
                  <div className="relative group">
                    <div className="text-4xl sm:text-5xl filter drop-shadow-lg select-none">
                      {item?.icon || '🌸'}
                    </div>

                    {/* Selection ring & remove button */}
                    {isSelected && (
                      <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-stone-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-amber-400 whitespace-nowrap">
                        <span>{item?.name}</span>
                        <button
                          onClick={(e) => handleRemovePlaced(placed.id, e)}
                          className="p-1 hover:text-red-400 cursor-pointer"
                          title="Cất vào túi"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar: Available Decoration Inventory */}
          <div className="w-full lg:w-72 bg-white rounded-3xl border-2 border-amber-200 p-4 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-100">
                <span className="font-extrabold text-sm text-stone-800 flex items-center gap-1.5">
                  <Sparkles size={16} className="text-amber-500" />
                  <span>Kho Đồ Trang Trí ({availableDecoItems.length})</span>
                </span>
                <span className="text-xs text-stone-500">Chạm để chọn</span>
              </div>

              {availableDecoItems.length === 0 ? (
                <div className="p-4 text-center text-xs text-stone-500 bg-amber-50/60 rounded-2xl border border-dashed border-amber-300">
                  <div className="text-2xl mb-1">🏮</div>
                  <div className="font-bold text-stone-700">Túi chưa có đồ trang trí mới</div>
                  <div className="mt-1">Hãy ghé Chợ Tết gặp Bác Ba mua thêm Mai, Đào, Đèn lồng, Câu đối nhé!</div>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {availableDecoItems.map((item) => {
                    const count = localInventory[item.id] || 0;
                    const isPicked = selectedInventoryItem === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          sound.playClick();
                          setSelectedInventoryItem(isPicked ? null : item.id);
                        }}
                        className={`w-full p-2.5 rounded-2xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                          isPicked
                            ? 'bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-400'
                            : 'bg-white hover:bg-amber-50 border-amber-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <div className="font-bold text-xs text-stone-900">{item.name}</div>
                            <div className="text-[10px] text-stone-500">{item.description.slice(0, 30)}...</div>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-xs font-black rounded-full">
                          x{count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick tips & close */}
            <div className="mt-4 pt-3 border-t border-amber-100 space-y-2">
              <div className="text-[11px] text-stone-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                💡 <span className="font-bold text-amber-950">Mẹo nhỏ: </span>
                Bày hoa mai vàng, câu đối đỏ và đĩa bánh chưng sẽ giúp hoàn thành Nhiệm vụ 3 ngày Tết!
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check size={16} />
                <span>Hoàn Tất & Lưu Bố Cục Nhà</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
