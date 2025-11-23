import { ElementType, LevelConfig, GameDifficulty } from './types';

export const MAX_LEVEL = 5;
export const PLAYER_MAX_HEALTH = 100;

export const DIFFICULTY_SETTINGS = {
  [GameDifficulty.EASY]: { speedMultiplier: 1.5, damageMultiplier: 0.5, wordLen: '短' },
  [GameDifficulty.NORMAL]: { speedMultiplier: 1.0, damageMultiplier: 1.0, wordLen: '中' },
  [GameDifficulty.HARD]: { speedMultiplier: 0.7, damageMultiplier: 1.5, wordLen: '長' },
};

export const LEVEL_CONFIGS: LevelConfig[] = [
  { 
    levelNumber: 1, 
    element: ElementType.FIRE, 
    bossName: '烈焰魔君', 
    difficulty: 1,
    storyText: "玄華界邊境，赤地千里。烈焰魔君守在此處，誓要燒盡一切希望。勇者凌風拔劍出鞘，唯有以「水」之流暢鍵法，方能破此劫難。" 
  },
  { 
    levelNumber: 2, 
    element: ElementType.WATER, 
    bossName: '深淵漩渦', 
    difficulty: 2,
    storyText: "越過火海，眼前是一片死寂的黑水。深淵中傳來低語，試圖淹沒勇者的意志。需心如止水，鍵指如飛。" 
  },
  { 
    levelNumber: 3, 
    element: ElementType.WOOD, 
    bossName: '腐朽樹妖', 
    difficulty: 3,
    storyText: "枯木林中迷霧重重，腐朽樹妖操縱藤蔓遮天蔽日。勇者需斬斷迷惘，尋找生機之源。" 
  },
  { 
    levelNumber: 4, 
    element: ElementType.METAL, 
    bossName: '千刃兵主', 
    difficulty: 4,
    storyText: "劍塚荒原，金屬撞擊聲不絕於耳。千刃兵主以無數殘劍為甲，唯有比鋼鐵更堅定的信念能擊穿它。" 
  },
  { 
    levelNumber: 5, 
    element: ElementType.EARTH, 
    bossName: '泰山巨像', 
    difficulty: 5,
    storyText: "最終之地，泰山壓頂。巨像守護著最後的魔元。這是最後的試煉，為了玄華界的未來，揮出你的最後一劍！" 
  },
];

export const STATIC_WORDS: Record<ElementType, string[]> = {
  [ElementType.FIRE]: ['燃燒', '火焰', '星火燎原', '烈火烹油', '浴火重生', '烽火連天', '熱血沸騰'],
  [ElementType.WATER]: ['流水', '波濤', '細水長流', '海納百川', '波瀾壯闊', '滴水穿石', '鏡花水月'],
  [ElementType.WOOD]: ['森林', '生機', '枯木逢春', '葉落歸根', '盤根錯節', '草木皆兵', '蒼松翠柏'],
  [ElementType.METAL]: ['鋒利', '鋼鐵', '金戈鐵馬', '固若金湯', '切金斷玉', '銅牆鐵壁', '點石成金'],
  [ElementType.EARTH]: ['山嶽', '大地', '堅如磐石', '重若泰山', '捲土重來', '地動山搖', '塵埃落定'],
  [ElementType.HEALING]: ['治癒', '回春', '休息', '平靜', '呼吸', '安神', '靈丹', '妙藥', '生機'],
};

export const BOSS_DIALOGUE_STATIC: Record<ElementType, string> = {
  [ElementType.FIRE]: '凡人！在我的烈焰中化為灰燼吧！',
  [ElementType.WATER]: '你的掙扎就像水中的泡沫，毫無意義。',
  [ElementType.WOOD]: '感受自然的憤怒，成為我的養分！',
  [ElementType.METAL]: '我的利刃將切斷你所有的希望。',
  [ElementType.EARTH]: '我就是這座山，你無法撼動我分毫！',
  [ElementType.HEALING]: '勇者，且慢行，吾賜汝靈力...',
};