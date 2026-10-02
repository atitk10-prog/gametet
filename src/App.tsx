import React, { useState, useEffect, useCallback } from 'react';
import {
  GameSaveData,
  PlayerStats,
  PlayerAvatar,
  PlayerPosition,
  Quest,
  Question,
  InteractivePoint,
  HouseLayout,
} from './types/game';
import { StorageService, DEFAULT_SAVE_DATA } from './services/storage';
import { sound } from './services/sound';
import { TET_TIMELINE } from './data/timeline';
import { QUESTIONS_DATABASE } from './data/questions';
import { NPCS_DATA } from './data/npcs';
import { GAME_ITEMS } from './data/items';

// Components
import { TopHeaderBar } from './components/TopHeaderBar';
import { BottomNavBar, ScreenTab } from './components/BottomNavBar';
import { VillageMapCanvas } from './game/VillageMapCanvas';
import { SplashScreen } from './components/screens/SplashScreen';
import { TutorialModal } from './components/screens/TutorialModal';
import { SettingsModal } from './components/screens/SettingsModal';
import { NpcDialogModal } from './components/screens/NpcDialogModal';
import { MarketModal } from './components/screens/MarketModal';
import { QuestionModal } from './components/screens/QuestionModal';
import { GoiBanhMiniGame } from './components/screens/GoiBanhMiniGame';
import { HouseDecorationScreen } from './components/screens/HouseDecorationScreen';
import { InventoryModal } from './components/screens/InventoryModal';
import { QuestModal } from './components/screens/QuestModal';
import { CharacterModal } from './components/screens/CharacterModal';
import { BattleScreen } from './components/screens/BattleScreen';
import { RandomEventModal } from './components/screens/RandomEventModal';

export default function App() {
  // Load saved state
  const [saveData, setSaveData] = useState<GameSaveData>(() => StorageService.load());

  // Screen & Navigation States
  const [currentTab, setCurrentTab] = useState<ScreenTab>('map');
  const [showSplash, setShowSplash] = useState<boolean>(!saveData.tutorialFinished);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Active Interactive Overlays
  const [activeNpcId, setActiveNpcId] = useState<string | null>(null);
  const [showMarket, setShowMarket] = useState<boolean>(false);
  const [activeQuiz, setActiveQuiz] = useState<{ question: Question; contextTitle?: string; onCorrect?: () => void } | null>(null);
  const [showGoiBanh, setShowGoiBanh] = useState<boolean>(false);
  const [showHouse, setShowHouse] = useState<boolean>(false);
  const [showInventory, setShowInventory] = useState<boolean>(false);
  const [showQuests, setShowQuests] = useState<boolean>(false);
  const [showCharacter, setShowCharacter] = useState<boolean>(false);
  const [showBattle, setShowBattle] = useState<boolean>(false);
  const [activeEvent, setActiveEvent] = useState<{ title: string; desc: string; rewards: any } | null>(null);

  // Music & SFX settings
  const [musicEnabled, setMusicEnabled] = useState<boolean>(saveData.settings.music);
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(saveData.settings.sfx);

  // Auto save whenever relevant game state updates
  useEffect(() => {
    StorageService.save(saveData);
  }, [saveData]);

  // Sync audio service settings
  useEffect(() => {
    sound.musicEnabled = musicEnabled;
    sound.sfxEnabled = sfxEnabled;
  }, [musicEnabled, sfxEnabled]);

  // Handle Tab Navigation Click
  const handleSelectTab = (tab: ScreenTab) => {
    setCurrentTab(tab);
    if (tab === 'map') {
      setShowMarket(false);
      setShowGoiBanh(false);
      setShowHouse(false);
      setShowInventory(false);
      setShowQuests(false);
      setShowCharacter(false);
      setShowBattle(false);
    } else if (tab === 'inventory') {
      setShowInventory(true);
    } else if (tab === 'quests') {
      setShowQuests(true);
    } else if (tab === 'cooking') {
      setShowGoiBanh(true);
    } else if (tab === 'house') {
      setShowHouse(true);
    } else if (tab === 'character') {
      setShowCharacter(true);
    } else if (tab === 'battle') {
      setShowBattle(true);
    }
  };

  // Level Up Check helper
  const addExpAndCheckLevel = (currentStats: PlayerStats, expGained: number): PlayerStats => {
    const totalExp = currentStats.exp + expGained;
    const requiredForNextLevel = currentStats.level * 100;
    if (totalExp >= requiredForNextLevel) {
      const nextLevel = currentStats.level + 1;
      sound.playQuestComplete();
      return {
        ...currentStats,
        exp: totalExp,
        level: nextLevel,
        coins: currentStats.coins + 30, // Level up bonus coins
        maxEnergy: currentStats.maxEnergy + 10,
        energy: currentStats.maxEnergy + 10,
      };
    }
    return {
      ...currentStats,
      exp: totalExp,
    };
  };

  // Objective progress helper
  const updateQuestObjective = (
    questId: string,
    objType: 'talk' | 'buy' | 'cook' | 'decorate' | 'answer' | 'explore',
    targetId?: string
  ) => {
    setSaveData((prev) => {
      const quests = { ...prev.quests };
      const q = quests[questId];
      if (!q || q.status === 'completed' || q.status === 'locked') return prev;

      let anyUpdated = false;
      const nextObjectives = q.objectives.map((obj) => {
        if (!obj.completed && obj.type === objType && (!targetId || obj.targetId === targetId)) {
          const nextCount = obj.current + 1;
          const isDone = nextCount >= obj.required;
          anyUpdated = true;
          return {
            ...obj,
            current: nextCount,
            completed: isDone,
          };
        }
        return obj;
      });

      if (!anyUpdated) return prev;

      // Check if all objectives in this quest are completed
      const allCompleted = nextObjectives.every((obj) => obj.completed);
      let updatedQuestStatus: Quest['status'] = q.status;
      let nextStats = prev.stats;
      let nextInv = { ...prev.inventory };

      if (allCompleted) {
        updatedQuestStatus = 'completed';
        sound.playQuestComplete();

        // Award quest rewards
        nextStats = {
          ...nextStats,
          coins: nextStats.coins + q.rewards.coins,
          tetPoints: nextStats.tetPoints + q.rewards.tetPoints,
        };
        nextStats = addExpAndCheckLevel(nextStats, q.rewards.exp);

        // Award reward items
        if (q.rewards.items) {
          q.rewards.items.forEach((rw) => {
            nextInv[rw.itemId] = (nextInv[rw.itemId] || 0) + rw.count;
          });
        }

        // Unlock next Main Quest if applicable
        if (questId === 'main_quest_1' && quests['main_quest_2']) {
          quests['main_quest_2'] = { ...quests['main_quest_2'], status: 'available' };
        }
        if (questId === 'main_quest_2' && quests['main_quest_3']) {
          quests['main_quest_3'] = { ...quests['main_quest_3'], status: 'available' };
        }
      }

      quests[questId] = {
        ...q,
        objectives: nextObjectives,
        status: updatedQuestStatus,
      };

      return {
        ...prev,
        stats: nextStats,
        inventory: nextInv,
        quests,
      };
    });
  };

  // --- Handlers for User Interactions ---

  // 1. NPC Interaction
  const handleInteractNpc = (npcId: string) => {
    setActiveNpcId(npcId);

    // Update quest if this NPC was an objective target
    if (saveData.activeQuestId) {
      updateQuestObjective(saveData.activeQuestId, 'talk', npcId);
    }
  };

  // 2. Zone Interaction
  const handleInteractZone = (zoneId: string) => {
    if (zoneId === 'home_zone') {
      setShowHouse(true);
      if (saveData.activeQuestId) updateQuestObjective(saveData.activeQuestId, 'explore', 'home_zone');
    } else if (zoneId === 'kitchen_zone') {
      setShowGoiBanh(true);
      if (saveData.activeQuestId) updateQuestObjective(saveData.activeQuestId, 'explore', 'kitchen_zone');
    } else if (zoneId === 'market_zone') {
      setShowMarket(true);
    }
  };

  // 3. Interactive World Point (Question point or chest)
  const handleInteractPoint = (point: InteractivePoint) => {
    if (point.type === 'question') {
      // Pick a random question that isn't answered yet or from database
      const randomQ = QUESTIONS_DATABASE[Math.floor(Math.random() * QUESTIONS_DATABASE.length)];
      setActiveQuiz({
        question: randomQ,
        contextTitle: point.label,
        onCorrect: () => {
          setSaveData((prev) => ({
            ...prev,
            collectedPoints: [...prev.collectedPoints, point.id],
          }));
        },
      });
    } else if (point.type === 'chest') {
      // Secret lucky chest
      setActiveEvent({
        title: point.label,
        desc: 'Em vừa mở được một rương quà may mắn đầu xuân do bà con làng quê chuẩn bị!',
        rewards: { coins: 35, exp: 50, tetPoints: 15, itemName: 'Bao Lì Xì Đỏ' },
      });
      setSaveData((prev) => ({
        ...prev,
        collectedPoints: [...prev.collectedPoints, point.id],
        inventory: {
          ...prev.inventory,
          phong_bao_li_xi: (prev.inventory['phong_bao_li_xi'] || 0) + 1,
        },
      }));
      // Check quest if Bé Mai's chest
      if (point.id === 'chest_garden') {
        updateQuestObjective('side_quest_lixi', 'explore', 'chest_garden');
      }
    } else if (point.type === 'challenge') {
      setShowBattle(true);
    }
  };

  // 4. Market Buy Item
  const handleBuyItem = (itemId: string, price: number, requiresQuiz?: boolean) => {
    const executePurchase = () => {
      sound.playCoin();
      setSaveData((prev) => {
        const nextCoins = prev.stats.coins - price;
        const nextInv = {
          ...prev.inventory,
          [itemId]: (prev.inventory[itemId] || 0) + 1,
        };
        return {
          ...prev,
          stats: { ...prev.stats, coins: nextCoins },
          inventory: nextInv,
        };
      });

      // Update active quest if item matches an objective
      if (saveData.activeQuestId) {
        updateQuestObjective(saveData.activeQuestId, 'buy', itemId);
      }
    };

    if (requiresQuiz) {
      // Contextual quiz on buying important goods
      const shoppingQ = QUESTIONS_DATABASE.find((q) => q.id === 'math_market_rice') || QUESTIONS_DATABASE[0];
      setActiveQuiz({
        question: shoppingQ,
        contextTitle: `Bác Ba Đố Vui Khi Mua: ${GAME_ITEMS[itemId]?.name}`,
        onCorrect: () => {
          executePurchase();
        },
      });
    } else {
      executePurchase();
    }
  };

  // 5. Cooking Mini-game Completion
  const handleCompleteCooking = (result: { stars: number; exp: number; coins: number; tetPoints: number }) => {
    setSaveData((prev) => {
      let nextStats = {
        ...prev.stats,
        coins: prev.stats.coins + result.coins,
        tetPoints: prev.stats.tetPoints + result.tetPoints,
      };
      nextStats = addExpAndCheckLevel(nextStats, result.exp);

      // Add fresh Bánh Chưng to inventory
      const nextInv = {
        ...prev.inventory,
        banh_chung: (prev.inventory['banh_chung'] || 0) + 1,
      };

      return {
        ...prev,
        stats: nextStats,
        inventory: nextInv,
      };
    });

    // Update quest 2 objectives
    if (saveData.quests['main_quest_2']) {
      updateQuestObjective('main_quest_2', 'cook');
      updateQuestObjective('main_quest_2', 'cook');
      updateQuestObjective('main_quest_2', 'cook');
      updateQuestObjective('main_quest_2', 'cook');
    }

    setShowGoiBanh(false);
  };

  // 6. House Layout Update
  const handleSaveHouse = (newLayout: HouseLayout, updatedInventory: { [itemId: string]: number }) => {
    setSaveData((prev) => ({
      ...prev,
      house: newLayout,
      inventory: updatedInventory,
    }));

    // Update quest 3 if active
    if (saveData.activeQuestId === 'main_quest_3') {
      updateQuestObjective('main_quest_3', 'decorate');
    }
  };

  // Active quest info for map corner tracker
  const activeQuest = saveData.activeQuestId ? saveData.quests[saveData.activeQuestId] : null;
  const activeObjective = activeQuest?.objectives.find((obj) => !obj.completed);
  const activeQuestCount = Object.values(saveData.quests).filter((q) => q.status === 'active' || q.status === 'available').length;

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-stone-900 font-['Be_Vietnam_Pro',sans-serif]">
      {/* 1. Top Resource Stats Bar */}
      <TopHeaderBar
        stats={saveData.stats}
        currentDayInfo={TET_TIMELINE[saveData.currentDay] || TET_TIMELINE[26]}
        onOpenSettings={() => setShowSettings(true)}
        musicEnabled={musicEnabled}
        sfxEnabled={sfxEnabled}
        onToggleMusic={() => {
          const next = sound.toggleMusic();
          setMusicEnabled(next);
        }}
      />

      {/* 2. Main 2D Living Game World (Always active in background, fully responsive) */}
      <main className="flex-1 relative overflow-hidden">
        <VillageMapCanvas
          avatar={saveData.avatar}
          playerPosition={saveData.position}
          onUpdatePosition={(pos) => {
            saveData.position = pos;
          }}
          onInteractNpc={handleInteractNpc}
          onInteractZone={handleInteractZone}
          onInteractPoint={handleInteractPoint}
          collectedPoints={saveData.collectedPoints}
          unlockedAreas={saveData.unlockedAreas}
          onOpenGoiBanh={() => setShowGoiBanh(true)}
          onOpenMarket={() => setShowMarket(true)}
          onOpenHouse={() => setShowHouse(true)}
          activeQuestTitle={activeQuest?.title}
          activeObjectiveText={activeObjective?.description}
        />
      </main>

      {/* 3. Bottom Feature Navigation */}
      <BottomNavBar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        activeQuestCount={activeQuestCount}
      />

      {/* 4. MODALS & SCREENS OVERLAYS */}

      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen
          onStartGame={() => setShowSplash(false)}
          onOpenTutorial={() => {
            setShowSplash(false);
            setShowTutorial(true);
          }}
        />
      )}

      {/* Tutorial Modal */}
      {showTutorial && (
        <TutorialModal
          onComplete={() => {
            setShowTutorial(false);
            setSaveData((prev) => ({ ...prev, tutorialFinished: true }));
          }}
          onClose={() => setShowTutorial(false)}
        />
      )}

      {/* NPC Dialogue Modal */}
      {activeNpcId && (
        <NpcDialogModal
          npc={NPCS_DATA[activeNpcId]}
          activeQuest={activeQuest || undefined}
          onAcceptQuest={(questId) => {
            setSaveData((prev) => ({
              ...prev,
              activeQuestId: questId,
              quests: {
                ...prev.quests,
                [questId]: { ...prev.quests[questId], status: 'active' },
              },
            }));
          }}
          onStartQuizFromNpc={() => {
            const q = QUESTIONS_DATABASE.find((item) => item.subject === 'Văn Hóa Tết') || QUESTIONS_DATABASE[0];
            setActiveQuiz({
              question: q,
              contextTitle: `Câu Đố Cùng ${NPCS_DATA[activeNpcId].name}`,
            });
            setActiveNpcId(null);
          }}
          onClose={() => setActiveNpcId(null)}
        />
      )}

      {/* Market Shopping Modal */}
      {showMarket && (
        <MarketModal
          playerCoins={saveData.stats.coins}
          inventory={saveData.inventory}
          onBuyItem={handleBuyItem}
          onClose={() => {
            setShowMarket(false);
            setCurrentTab('map');
          }}
        />
      )}

      {/* Question Engine Modal */}
      {activeQuiz && (
        <QuestionModal
          question={activeQuiz.question}
          contextTitle={activeQuiz.contextTitle}
          onAnswerCorrect={(stars, reward) => {
            setSaveData((prev) => {
              let nextStats = {
                ...prev.stats,
                coins: prev.stats.coins + reward.coins,
                tetPoints: prev.stats.tetPoints + reward.tetPoints,
              };
              nextStats = addExpAndCheckLevel(nextStats, reward.exp);
              return {
                ...prev,
                stats: nextStats,
                completedQuestions: [...prev.completedQuestions, activeQuiz.question.id],
              };
            });

            if (activeQuiz.onCorrect) {
              activeQuiz.onCorrect();
            }

            // Update quest objective if answering is a quest requirement
            if (saveData.activeQuestId) {
              updateQuestObjective(saveData.activeQuestId, 'answer');
            }

            setActiveQuiz(null);
          }}
          onClose={() => setActiveQuiz(null)}
        />
      )}

      {/* Mini-Game Gói Bánh Chưng */}
      {showGoiBanh && (
        <GoiBanhMiniGame
          inventory={saveData.inventory}
          onCompleteCooking={handleCompleteCooking}
          onClose={() => {
            setShowGoiBanh(false);
            setCurrentTab('map');
          }}
        />
      )}

      {/* House Decoration Screen */}
      {showHouse && (
        <HouseDecorationScreen
          house={saveData.house}
          inventory={saveData.inventory}
          onSaveHouse={handleSaveHouse}
          onClose={() => {
            setShowHouse(false);
            setCurrentTab('map');
          }}
        />
      )}

      {/* Backpack Inventory Modal */}
      {showInventory && (
        <InventoryModal
          inventory={saveData.inventory}
          onSelectDecoration={() => {
            setShowInventory(false);
            setShowHouse(true);
          }}
          onClose={() => {
            setShowInventory(false);
            setCurrentTab('map');
          }}
        />
      )}

      {/* Quests Manager Modal */}
      {showQuests && (
        <QuestModal
          quests={saveData.quests}
          activeQuestId={saveData.activeQuestId}
          onSelectActiveQuest={(questId) => {
            setSaveData((prev) => ({ ...prev, activeQuestId: questId }));
          }}
          onClaimQuestRewards={(questId) => {
            // Handled automatically upon completing all objectives
          }}
          onClose={() => {
            setShowQuests(false);
            setCurrentTab('map');
          }}
        />
      )}

      {/* Avatar Customization Modal */}
      {showCharacter && (
        <CharacterModal
          avatar={saveData.avatar}
          onSaveAvatar={(newAvatar) => {
            setSaveData((prev) => ({ ...prev, avatar: newAvatar }));
          }}
          onClose={() => {
            setShowCharacter(false);
            setCurrentTab('map');
          }}
        />
      )}

      {/* Educational Battle Arena */}
      {showBattle && (
        <BattleScreen
          playerLevel={saveData.stats.level}
          onWinBattle={(rewards) => {
            setSaveData((prev) => {
              let nextStats = {
                ...prev.stats,
                coins: prev.stats.coins + rewards.coins,
                tetPoints: prev.stats.tetPoints + rewards.tetPoints,
              };
              nextStats = addExpAndCheckLevel(nextStats, rewards.exp);
              const nextInv = { ...prev.inventory };
              if (rewards.itemId) {
                nextInv[rewards.itemId] = (nextInv[rewards.itemId] || 0) + 1;
              }
              return {
                ...prev,
                stats: nextStats,
                inventory: nextInv,
              };
            });
          }}
          onClose={() => {
            setShowBattle(false);
            setCurrentTab('map');
          }}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          musicEnabled={musicEnabled}
          sfxEnabled={sfxEnabled}
          onToggleMusic={() => {
            const next = sound.toggleMusic();
            setMusicEnabled(next);
            setSaveData((prev) => ({
              ...prev,
              settings: { ...prev.settings, music: next },
            }));
          }}
          onToggleSfx={() => {
            const next = sound.toggleSfx();
            setSfxEnabled(next);
            setSaveData((prev) => ({
              ...prev,
              settings: { ...prev.settings, sfx: next },
            }));
          }}
          onResetProgress={() => {
            const fresh = StorageService.reset();
            setSaveData(fresh);
            setShowSettings(false);
            setShowSplash(true);
          }}
          onOpenTutorial={() => {
            setShowSettings(false);
            setShowTutorial(true);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Random Event / Lucky Chest Modal */}
      {activeEvent && (
        <RandomEventModal
          title={activeEvent.title}
          description={activeEvent.desc}
          rewards={activeEvent.rewards}
          onClaim={() => {
            setSaveData((prev) => {
              let nextStats = {
                ...prev.stats,
                coins: prev.stats.coins + (activeEvent.rewards.coins || 0),
                tetPoints: prev.stats.tetPoints + (activeEvent.rewards.tetPoints || 0),
              };
              nextStats = addExpAndCheckLevel(nextStats, activeEvent.rewards.exp || 0);
              return {
                ...prev,
                stats: nextStats,
              };
            });
            setActiveEvent(null);
          }}
          onClose={() => setActiveEvent(null)}
        />
      )}
    </div>
  );
}
