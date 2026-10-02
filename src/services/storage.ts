import { GameSaveData } from '../types/game';
import { INITIAL_QUESTS } from '../data/quests';

const STORAGE_KEY = 'tet_sum_vay_game_save_v1';

export const DEFAULT_SAVE_DATA: GameSaveData = {
  version: 1,
  stats: {
    coins: 70, // Start with enough to buy a few ingredients or items, and earn more via quests/quizzes
    exp: 0,
    level: 1,
    tetPoints: 10,
    energy: 100,
    maxEnergy: 100,
  },
  avatar: {
    gender: 'boy',
    outfit: 'ao_dai_red',
    hairStyle: 'classic',
    hat: 'khan_dong',
    accessory: 'canh_mai',
  },
  position: {
    x: 480,
    y: 360,
    direction: 'down',
    isMoving: false,
  },
  inventory: {
    gao_nep: 0,
    dau_xanh: 0,
    thit_ba_chi: 0,
    la_dong: 0,
    lat_giang: 1,
    cui_lua: 1,
    banh_chung: 0,
    hoa_mai: 1, // Start with 1 flower pot to decorate immediately!
    den_long: 1, // Start with 1 lantern
  },
  quests: { ...INITIAL_QUESTS },
  activeQuestId: 'main_quest_1',
  house: {
    theme: 'traditional',
    cleanliness: 70,
    items: [
      { id: 'init_lantern_1', itemId: 'den_long', x: 220, y: 110, placedAt: Date.now() },
      { id: 'init_flower_1', itemId: 'hoa_mai', x: 180, y: 280, placedAt: Date.now() },
    ],
  },
  unlockedAreas: ['home_area', 'market_area', 'kitchen_area', 'grandma_house', 'flower_garden', 'village_gate', 'communal_hall'],
  currentDay: 26,
  completedQuestions: [],
  collectedPoints: [],
  tutorialFinished: false,
  settings: {
    music: true,
    sfx: true,
    joystick: true,
  },
};

export class StorageService {
  public static load(): GameSaveData {
    try {
      const dataStr = localStorage.getItem(STORAGE_KEY);
      if (dataStr) {
        const parsed = JSON.parse(dataStr);
        // Ensure required fields exist in case of schema update
        return {
          ...DEFAULT_SAVE_DATA,
          ...parsed,
          stats: { ...DEFAULT_SAVE_DATA.stats, ...(parsed.stats || {}) },
          avatar: { ...DEFAULT_SAVE_DATA.avatar, ...(parsed.avatar || {}) },
          inventory: { ...DEFAULT_SAVE_DATA.inventory, ...(parsed.inventory || {}) },
          quests: { ...DEFAULT_SAVE_DATA.quests, ...(parsed.quests || {}) },
          house: { ...DEFAULT_SAVE_DATA.house, ...(parsed.house || {}) },
        };
      }
    } catch (e) {
      console.warn('Could not load game save, using default', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
  }

  public static save(data: GameSaveData): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Failed to save game state', e);
      return false;
    }
  }

  public static reset(): GameSaveData {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
  }
}
