import React from 'react';
import { sound } from '../services/sound';

export type ScreenTab = 'map' | 'inventory' | 'quests' | 'cooking' | 'house' | 'character' | 'battle';

interface BottomNavBarProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  activeQuestCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
  activeQuestCount,
}) => {
  const tabs: { id: ScreenTab; label: string; icon: string; badge?: number }[] = [
    { id: 'map', label: 'Bản Đồ', icon: '🗺️' },
    { id: 'inventory', label: 'Túi Đồ', icon: '🎒' },
    { id: 'quests', label: 'Nhiệm Vụ', icon: '📜', badge: activeQuestCount },
    { id: 'cooking', label: 'Nấu Bánh', icon: '🍲' },
    { id: 'house', label: 'Nhà Tết', icon: '🏠' },
    { id: 'character', label: 'Nhân Vật', icon: '👤' },
    { id: 'battle', label: 'Đấu Trí', icon: '⚔️' },
  ];

  return (
    <nav className="h-16 bg-gradient-to-t from-stone-900 via-stone-900/95 to-stone-800/95 border-t border-amber-500/40 px-2 sm:px-6 flex items-center justify-around z-30 select-none shadow-2xl backdrop-blur-md">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              onSelectTab(tab.id);
            }}
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 sm:px-4 rounded-xl transition-all duration-200 cursor-pointer ${
              isActive
                ? 'text-amber-300 font-extrabold -translate-y-1'
                : 'text-stone-300 hover:text-amber-200 font-medium'
            }`}
          >
            {/* Active Pill Indicator */}
            {isActive && (
              <div className="absolute -top-1 w-8 h-1 bg-gradient-to-r from-amber-400 to-red-500 rounded-full shadow-[0_0_8px_#f59e0b]" />
            )}

            <span className={`text-xl sm:text-2xl transition-transform ${isActive ? 'scale-110' : ''}`}>
              {tab.icon}
            </span>
            <span className="text-[11px] sm:text-xs mt-0.5 tracking-tight whitespace-nowrap">
              {tab.label}
            </span>

            {/* Notification Badge if any */}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="absolute -top-0.5 right-1 w-4 h-4 bg-red-600 border border-white text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
