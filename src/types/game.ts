export type ResourceType = 'coins' | 'exp' | 'tetPoints' | 'energy';

export interface PlayerStats {
  coins: number;
  exp: number;
  level: number;
  tetPoints: number;
  energy: number;
  maxEnergy: number;
}

export interface PlayerAvatar {
  gender: 'boy' | 'girl';
  outfit: 'ao_dai_red' | 'ao_dai_gold' | 'ao_dai_blue' | 'ao_ba_ba';
  hairStyle: 'classic' | 'bun' | 'short' | 'band';
  hat: 'none' | 'non_la' | 'khan_dong' | 'flower_clip';
  accessory: 'none' | 'canh_mai' | 'canh_dao' | 'phong_bao';
}

export interface PlayerPosition {
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
}

export interface Item {
  id: string;
  name: string;
  category: 'ingredient' | 'food' | 'decoration' | 'special';
  description: string;
  price: number;
  icon: string;
  count?: number;
  rarity?: 'common' | 'rare' | 'legendary';
}

export interface Question {
  id: string;
  subject: 'Toán' | 'Tiếng Việt' | 'Khoa Học' | 'Văn Hóa Tết';
  grade: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  hint: string;
  explanation: string;
  reward: {
    coins: number;
    exp: number;
    tetPoints: number;
    itemId?: string;
  };
}

export interface QuestObjective {
  id: string;
  description: string;
  current: number;
  required: number;
  completed: boolean;
  type: 'talk' | 'buy' | 'cook' | 'decorate' | 'answer' | 'explore';
  targetId?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'side' | 'daily' | 'event';
  npcId: string;
  status: 'locked' | 'available' | 'active' | 'completed';
  objectives: QuestObjective[];
  rewards: {
    coins: number;
    exp: number;
    tetPoints: number;
    items?: { itemId: string; count: number }[];
  };
  unlockCondition?: {
    minLevel?: number;
    requiredQuestId?: string;
    dayRequirement?: number;
  };
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  title: string;
  x: number;
  y: number;
  avatarIcon: string;
  color: string;
  dialogue: {
    greeting: string[];
    idle: string[];
    questRelated?: { [questId: string]: string };
  };
  questOfferId?: string;
}

export interface PlacedDecoration {
  id: string; // unique placement id
  itemId: string;
  x: number;
  y: number;
  rotation?: number;
  placedAt: number;
}

export interface HouseLayout {
  items: PlacedDecoration[];
  theme: 'traditional' | 'modern' | 'village';
  cleanliness: number; // 0 to 100
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  npcName: string;
  choiceA: { text: string; action: () => void; reward?: string };
  choiceB: { text: string; action: () => void; reward?: string };
}

export interface TetDayProgress {
  currentDay: number; // 25, 26, 27, 28, 29, 30, 1
  dayName: string;
  theme: string;
  taskSummary: string;
}

export interface InteractivePoint {
  id: string;
  type: 'question' | 'chest' | 'challenge' | 'event';
  x: number;
  y: number;
  label: string;
  icon: string;
  collected?: boolean;
}

export interface GameSaveData {
  version: number;
  stats: PlayerStats;
  avatar: PlayerAvatar;
  position: PlayerPosition;
  inventory: { [itemId: string]: number };
  quests: { [questId: string]: Quest };
  activeQuestId: string | null;
  house: HouseLayout;
  unlockedAreas: string[];
  currentDay: number;
  completedQuestions: string[];
  collectedPoints: string[];
  tutorialFinished: boolean;
  settings: {
    music: boolean;
    sfx: boolean;
    joystick: boolean;
  };
}
