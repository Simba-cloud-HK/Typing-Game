import React, { useState, useEffect, useRef } from 'react';
import { GameStatus, Boss, Particle, ElementType, GameDifficulty } from './types';
import { MAX_LEVEL, PLAYER_MAX_HEALTH, LEVEL_CONFIGS, STATIC_WORDS, BOSS_DIALOGUE_STATIC, DIFFICULTY_SETTINGS } from './constants';
import { generateLevelContent } from './services/geminiService';
import { audio } from './services/audioService';
import Particles from './components/Particles';
import BossDisplay from './components/BossDisplay';
import HeroDisplay from './components/HeroDisplay';
import { Sword, Volume2, VolumeX, Heart, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const App: React.FC = () => {
  // Game State
  const [status, setStatus] = useState<GameStatus>(GameStatus.MENU);
  const [difficulty, setDifficulty] = useState<GameDifficulty>(GameDifficulty.NORMAL);
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [playerHealth, setPlayerHealth] = useState<number>(PLAYER_MAX_HEALTH);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // Level Data
  const [currentWord, setCurrentWord] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [wordList, setWordList] = useState<string[]>([]);
  const [boss, setBoss] = useState<Boss | null>(null);
  const [isHealingWord, setIsHealingWord] = useState<boolean>(false);
  const [currentStory, setCurrentStory] = useState<string>("");
  
  // Visual States
  const [particles, setParticles] = useState<Particle[]>([]);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [bossDamaged, setBossDamaged] = useState<boolean>(false);
  const [bossAttacking, setBossAttacking] = useState<boolean>(false);
  const [heroAttacking, setHeroAttacking] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>("Loading...");

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const bossTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gameLoopRef = useRef<number | null>(null);

  // --- Initialization ---

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setPlayerHealth(PLAYER_MAX_HEALTH);
    setLevel(1);
    prepareLevel(1);
  };

  const prepareLevel = (lvlIdx: number) => {
    const config = LEVEL_CONFIGS[lvlIdx - 1];
    setCurrentStory(config.storyText);
    setStatus(GameStatus.STORY);
  };

  const startLevel = async () => {
    setStatus(GameStatus.LOADING);
    setLoadingText(`召喚第 ${level} 層守護者...`);
    const config = LEVEL_CONFIGS[level - 1];
    
    // Fetch dynamic content or use static
    const content = await generateLevelContent(config.element, config.difficulty);
    
    // Apply difficulty modifiers
    const diffSettings = DIFFICULTY_SETTINGS[difficulty];
    
    // Setup Boss
    const newBoss: Boss = {
      name: config.bossName,
      title: `${config.element}之魔`,
      element: config.element,
      maxHealth: (100 + (level * 50)) * diffSettings.damageMultiplier, // More HP on Hard generally, but using damageMult for balancing
      currentHealth: (100 + (level * 50)) * diffSettings.damageMultiplier,
      attackInterval: Math.max(1500, (5000 - (level * 500)) * diffSettings.speedMultiplier), 
      damage: (10 + (level * 2)) * diffSettings.damageMultiplier,
      description: content.intro,
      color: `text-${getColorByElement(config.element)}`
    };

    setBoss(newBoss);
    setWordList(content.words);
    pickNewWord(content.words, false);
    setStatus(GameStatus.PLAYING);
  };

  const getColorByElement = (el: ElementType) => {
    switch (el) {
        case ElementType.FIRE: return 'red-600';
        case ElementType.WATER: return 'blue-600';
        case ElementType.WOOD: return 'green-600';
        case ElementType.METAL: return 'yellow-600';
        case ElementType.EARTH: return 'stone-600';
        default: return 'gray-600';
    }
  }

  const pickNewWord = (list: string[], allowHeal: boolean = true) => {
    if (list.length === 0) return;
    
    // 15% chance to be a healing word if allowed
    const isHeal = allowHeal && Math.random() < 0.15;
    setIsHealingWord(isHeal);

    let nextWord = "";
    if (isHeal) {
         const healWords = STATIC_WORDS[ElementType.HEALING];
         nextWord = healWords[Math.floor(Math.random() * healWords.length)];
    } else {
         nextWord = list[Math.floor(Math.random() * list.length)];
    }
    
    setCurrentWord(nextWord);
    setInputValue(""); // Clear input
  };

  // --- Game Loop & Logic ---

  useEffect(() => {
    if (status === GameStatus.PLAYING && boss) {
      // Focus input
      inputRef.current?.focus();

      // Boss Attack Timer (Paused if it's a healing moment)
      if (!isHealingWord) {
        bossTimerRef.current = setInterval(() => {
            triggerBossAttack();
        }, boss.attackInterval);
      }
    } else {
      if (bossTimerRef.current) clearInterval(bossTimerRef.current);
    }

    return () => {
      if (bossTimerRef.current) clearInterval(bossTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, boss?.attackInterval, isHealingWord]);

  // Particle System Loop
  useEffect(() => {
    let lastTime = 0;
    const animate = (time: number) => {
      if (lastTime !== 0) {
        setParticles(prev => prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.02,
            vy: p.vy + 0.5 // Gravity
          }))
          .filter(p => p.life > 0)
        );
      }
      lastTime = time;
      gameLoopRef.current = requestAnimationFrame(animate);
    };
    gameLoopRef.current = requestAnimationFrame(animate);
    return () => {
        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    }
  }, []);

  const triggerBossAttack = () => {
    setBossAttacking(true);
    setTimeout(() => setBossAttacking(false), 500);
    
    // Logic
    audio.playDamageSound();
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 300);
    setCombo(0); // Reset combo on hit

    setPlayerHealth(prev => {
      const newHealth = prev - (boss ? boss.damage : 10);
      if (newHealth <= 0) {
        handleGameOver();
        return 0;
      }
      return newHealth;
    });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status !== GameStatus.PLAYING) return;
    
    const val = e.target.value;
    setInputValue(val);

    if (val === currentWord) {
      // Instant Clear
      setInputValue("");
      handleWordComplete();
    }
  };

  const handleWordComplete = () => {
    if (isHealingWord) {
        handleHealing();
    } else {
        handleAttack();
    }
  };

  const handleHealing = () => {
    audio.playVictorySound(); // Pleasant chime
    setPlayerHealth(prev => Math.min(prev + 15, PLAYER_MAX_HEALTH));
    
    // Heal particles
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const newParticles: Particle[] = Array.from({ length: 8 }).map((_, i) => ({
        id: Date.now() + i,
        x: centerX + (Math.random() - 0.5) * 100,
        y: centerY,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 1) * 10,
        color: '#34D399', // Emerald
        life: 1.2,
        text: '+'
    }));
    setParticles(prev => [...prev, ...newParticles]);

    pickNewWord(wordList, false); // Don't get two heals in a row usually
  };

  const handleAttack = () => {
    if (!boss) return;

    // SFX & Visuals
    audio.playAttackSound();
    setBossDamaged(true);
    setHeroAttacking(true);
    
    setTimeout(() => setBossDamaged(false), 200);
    setTimeout(() => setHeroAttacking(false), 300);
    
    // Particles
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const newParticles: Particle[] = Array.from({ length: 5 }).map((_, i) => ({
      id: Date.now() + i,
      x: centerX + (Math.random() - 0.5) * 100,
      y: centerY,
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 1) * 15,
      color: '#FFD700', // Gold
      life: 1.0,
      text: ['✦', '⚔️', '💥'][Math.floor(Math.random() * 3)]
    }));
    setParticles(prev => [...prev, ...newParticles]);

    // Logic
    const damage = 20 + (combo * 2); // Combo scales damage
    const newBossHealth = boss.currentHealth - damage;
    const newCombo = combo + 1;
    setCombo(newCombo);
    if (newCombo > maxCombo) setMaxCombo(newCombo);
    setScore(prev => prev + (damage * 10));

    if (newBossHealth <= 0) {
      handleLevelComplete();
    } else {
      setBoss({ ...boss, currentHealth: newBossHealth });
      pickNewWord(wordList, true);
    }
  };

  const handleLevelComplete = () => {
    audio.playVictorySound();
    if (level >= MAX_LEVEL) {
      setStatus(GameStatus.VICTORY);
    } else {
      setStatus(GameStatus.LEVEL_COMPLETE);
      setTimeout(() => {
        setLevel(prev => prev + 1);
        prepareLevel(level + 1);
      }, 3000);
    }
  };

  const handleGameOver = () => {
    setStatus(GameStatus.GAME_OVER);
  };

  // --- Rendering ---

  return (
    <div className={`relative w-full h-screen flex flex-col items-center justify-between overflow-hidden bg-stone-100 ${screenShake ? 'shake-anim' : ''}`}>
      
      {/* Background Ink Textures */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')]"></div>
      
      {/* Particles Layer */}
      <Particles activeParticles={particles} />

      {/* --- HUD --- */}
      {status === GameStatus.PLAYING && (
      <header className="w-full p-4 flex justify-between items-start z-10 font-serif">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
             <div className="w-12 h-12 bg-black rounded-full text-white flex items-center justify-center font-ink text-2xl border-2 border-gray-600">
                {level}
             </div>
             <div className="flex flex-col">
                <span className="text-gray-800 font-bold text-lg">凌風 <span className="text-xs font-normal text-gray-500">Lv.{level}</span></span>
                <div className="w-48 h-4 bg-gray-300 rounded overflow-hidden border border-gray-500 relative">
                    <div className="h-full bg-green-600 transition-all duration-300" style={{ width: `${(playerHealth / PLAYER_MAX_HEALTH) * 100}%` }}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold shadow-black drop-shadow-md">{playerHealth}/{PLAYER_MAX_HEALTH}</div>
                </div>
             </div>
          </div>
          <div className="text-stone-600 font-bold">
            <span className="mr-4">分數: {score}</span>
            <span className={`${combo > 2 ? 'text-red-600 scale-110' : 'text-stone-400'} transition-all inline-block`}>
                {combo > 1 ? `${combo} 連擊!` : ''}
            </span>
          </div>
        </div>

        <button onClick={() => {
            const m = !isMuted;
            setIsMuted(m);
            audio.setMute(m);
        }} className="p-2 bg-white/50 rounded-full hover:bg-white transition">
            {isMuted ? <VolumeX /> : <Volume2 />}
        </button>
      </header>
      )}


      {/* --- Main Game Area --- */}
      <main className="flex-1 w-full flex flex-col items-center justify-center relative z-10">
        
        {/* Menu */}
        {status === GameStatus.MENU && (
          <div className="text-center space-y-6 bg-white/90 p-12 rounded-lg shadow-2xl backdrop-blur-sm border-4 border-double border-stone-800 max-w-2xl">
            <h1 className="text-6xl md:text-8xl font-ink text-black mb-4">鍵靈勇者傳</h1>
            <p className="text-xl text-stone-600 font-serif mb-8">Traditional Chinese Typing Roguelike</p>
            
            <div className="flex flex-col items-center gap-4 mb-8">
                <p className="font-serif text-stone-500">選擇難度</p>
                <div className="flex gap-4">
                    {(Object.values(GameDifficulty) as GameDifficulty[]).map((d) => (
                        <button
                            key={d}
                            onClick={() => setDifficulty(d)}
                            className={`px-6 py-2 rounded font-serif border-2 transition-all ${difficulty === d ? 'bg-stone-800 text-white border-stone-800 scale-110' : 'bg-white text-stone-600 border-stone-300 hover:border-stone-600'}`}
                        >
                            {d === 'EASY' ? '初出茅廬' : d === 'NORMAL' ? '身經百戰' : '一代宗師'}
                        </button>
                    ))}
                </div>
            </div>

            <button 
              onClick={startGame}
              className="px-16 py-5 text-3xl bg-red-800 text-white font-ink rounded hover:bg-red-900 hover:scale-105 transition-all shadow-lg border-2 border-red-950"
            >
              拔劍出征
            </button>
            <div className="text-sm text-gray-500 mt-4">
               (推薦使用實體鍵盤以獲得最佳體驗)
            </div>
          </div>
        )}

        {/* Story Modal */}
        {status === GameStatus.STORY && (
            <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-8">
                <div className="bg-[#f5f5dc] p-8 md:p-12 rounded shadow-2xl max-w-3xl w-full border-t-8 border-b-8 border-stone-800 flex flex-col items-center">
                    <h2 className="text-4xl font-ink mb-6 text-stone-900">第 {level} 章</h2>
                    <p className="text-xl md:text-2xl font-serif leading-relaxed text-stone-800 mb-10 text-center">
                        {currentStory}
                    </p>
                    <button 
                        onClick={startLevel} 
                        className="flex items-center gap-2 px-8 py-3 bg-stone-800 text-[#f5f5dc] text-xl font-ink rounded hover:bg-stone-700 transition"
                    >
                        <BookOpen size={20} /> 繼續旅程
                    </button>
                </div>
            </div>
        )}

        {status === GameStatus.LOADING && (
           <div className="text-center animate-pulse">
              <div className="text-6xl mb-4 font-ink">🌀</div>
              <h2 className="text-3xl font-ink text-stone-800">{loadingText}</h2>
           </div>
        )}

        {status === GameStatus.PLAYING && boss && (
          <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between px-4 md:px-12 h-full gap-8">
            
            {/* Left: Hero */}
            <div className="flex-1 flex justify-center md:justify-start order-2 md:order-1">
                <HeroDisplay isAttacking={heroAttacking} isDamaged={bossAttacking} />
            </div>

            {/* Center: Interaction (Mobile: Top) */}
            <div className="order-3 md:order-2 w-full md:w-1/3 flex flex-col items-center justify-end pb-12">
               {/* Target Word */}
               <div className={`relative mb-6 transition-transform ${isHealingWord ? 'scale-110' : ''}`}>
                 <div className={`text-6xl md:text-7xl font-bold font-serif tracking-widest drop-shadow-md ${isHealingWord ? 'text-green-600' : 'text-stone-800'}`}>
                    {currentWord}
                 </div>
                 {isHealingWord && <div className="absolute -top-6 w-full text-center text-green-600 font-ink text-xl animate-bounce">靈力湧現!</div>}
               </div>

               {/* Input Field */}
               <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Sword className={`h-5 w-5 ${isHealingWord ? 'text-green-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInput}
                    autoFocus
                    placeholder={isHealingWord ? "輸入以治癒..." : "輸入以攻擊..."}
                    className={`block w-full pl-10 pr-3 py-4 border-b-4 bg-white/50 text-center text-3xl font-serif focus:outline-none transition-colors placeholder-stone-400 text-stone-900 shadow-sm rounded-t-lg
                        ${isHealingWord ? 'border-green-500 focus:border-green-700' : 'border-stone-800 focus:border-red-600'}`}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                  />
               </div>
            </div>

            {/* Right: Boss */}
            <div className="flex-1 flex justify-center md:justify-end order-1 md:order-3">
               <BossDisplay 
                  boss={boss} 
                  isDamaged={bossDamaged} 
                  isAttacking={bossAttacking} 
                  isHealingWord={isHealingWord} 
               />
            </div>
          </div>
        )}

        {status === GameStatus.LEVEL_COMPLETE && (
            <div className="text-center">
                 <h2 className="text-8xl font-ink text-green-800 mb-4 animate-bounce drop-shadow-lg">封印成功</h2>
                 <p className="text-3xl font-serif text-stone-700">邪氣消散，準備前往下一層...</p>
            </div>
        )}

        {(status === GameStatus.GAME_OVER || status === GameStatus.VICTORY) && (
            <div className="bg-white/95 p-8 rounded-xl shadow-2xl border-4 border-double border-stone-800 max-w-2xl w-full mx-4 z-50">
                <h2 className={`text-6xl font-ink text-center mb-8 ${status === GameStatus.VICTORY ? 'text-yellow-600' : 'text-stone-800'}`}>
                    {status === GameStatus.VICTORY ? '玄華界・救贖' : '勝敗乃兵家常事'}
                </h2>
                
                <div className="grid grid-cols-2 gap-4 mb-8 text-xl font-serif">
                   <div className="bg-stone-100 p-4 rounded text-center">
                      <div className="text-sm text-gray-500">最終得分</div>
                      <div className="text-3xl font-bold">{score}</div>
                   </div>
                   <div className="bg-stone-100 p-4 rounded text-center">
                      <div className="text-sm text-gray-500">最高連擊</div>
                      <div className="text-3xl font-bold">{maxCombo}</div>
                   </div>
                </div>

                {/* Simple Stats Chart */}
                <div className="h-48 w-full mb-8">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            { name: '進度', val: (score / (level * 1000)) * 100 },
                            { name: '連擊', val: maxCombo * 10 }, 
                            { name: '總分', val: Math.min(score / 10, 100) }
                        ]}>
                            <XAxis dataKey="name" fontFamily="'Noto Serif TC', serif" />
                            <YAxis hide />
                            <Tooltip />
                            <Bar dataKey="val" fill="#4a4a4a" radius={[4, 4, 0, 0]} />
                        </BarChart>
                     </ResponsiveContainer>
                </div>

                <div className="flex justify-center gap-4">
                     <button 
                        onClick={() => setStatus(GameStatus.MENU)}
                        className="px-6 py-3 border-2 border-stone-800 text-stone-800 text-xl rounded hover:bg-stone-100 transition font-serif"
                    >
                        返回主選單
                    </button>
                    <button 
                        onClick={startGame}
                        className="px-8 py-3 bg-stone-900 text-white text-xl rounded hover:bg-red-700 transition font-serif shadow-lg"
                    >
                        重頭再來
                    </button>
                </div>
            </div>
        )}

      </main>

      {/* Footer / Controls */}
      <footer className="w-full p-2 text-center text-stone-400 text-xs z-10 pointer-events-none font-serif">
        鍵靈勇者傳 v1.1 - Powered by Gemini AI
      </footer>

    </div>
  );
};

export default App;