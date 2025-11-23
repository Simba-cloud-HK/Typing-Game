import React from 'react';
import { Boss, ElementType } from '../types';

interface BossDisplayProps {
  boss: Boss;
  isDamaged: boolean;
  isAttacking: boolean;
  isHealingWord?: boolean;
}

const getElementColor = (element: ElementType) => {
  switch (element) {
    case ElementType.FIRE: return 'text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]';
    case ElementType.WATER: return 'text-blue-600 drop-shadow-[0_0_15px_rgba(37,99,235,0.8)]';
    case ElementType.WOOD: return 'text-green-600 drop-shadow-[0_0_15px_rgba(22,163,74,0.8)]';
    case ElementType.METAL: return 'text-yellow-600 drop-shadow-[0_0_15px_rgba(202,138,4,0.8)]';
    case ElementType.EARTH: return 'text-stone-600 drop-shadow-[0_0_15px_rgba(87,83,78,0.8)]';
    case ElementType.HEALING: return 'text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.9)]';
    default: return 'text-gray-800';
  }
};

const getBossVisual = (element: ElementType) => {
    switch (element) {
        case ElementType.FIRE: return '🔥';
        case ElementType.WATER: return '🌊';
        case ElementType.WOOD: return '🌳';
        case ElementType.METAL: return '⚔️';
        case ElementType.EARTH: return '⛰️';
        case ElementType.HEALING: return '🧚'; // Spirit/Fairy
        default: return '👹';
    }
}

const BossDisplay: React.FC<BossDisplayProps> = ({ boss, isDamaged, isAttacking, isHealingWord }) => {
  // Override visual if it's a healing opportunity
  const displayElement = isHealingWord ? ElementType.HEALING : boss.element;
  const displayColor = getElementColor(displayElement);
  const displayIcon = getBossVisual(displayElement);

  return (
    <div className={`relative transition-transform duration-100 ${isDamaged ? 'scale-90 opacity-80' : 'scale-100'} ${isAttacking ? 'translate-x-[-50px]' : ''}`}>
        
      {/* Aura/Ink Effect */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-20 blur-xl ${boss.color.replace('text-', 'bg-')}`}></div>

      {/* Main Boss Character */}
      <div className={`text-[10rem] md:text-[14rem] leading-none select-none filter ink-blob transition-colors duration-500 ${displayColor}`}>
        {displayIcon}
      </div>

      {/* Health Bar (Hide for healing spirit) */}
      {!isHealingWord && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-4 bg-gray-800 border-2 border-gray-600 rounded overflow-hidden">
          <div 
            className="h-full bg-red-600 transition-all duration-300" 
            style={{ width: `${(boss.currentHealth / boss.maxHealth) * 100}%` }}
          />
        </div>
      )}
      
      {/* Name */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 whitespace-nowrap text-2xl font-ink font-bold text-gray-900 tracking-widest">
        {isHealingWord ? '森之靈' : boss.title} 
        <span className="text-sm block text-center font-serif font-normal text-gray-500">
            {isHealingWord ? 'Healing Spirit' : boss.name}
        </span>
      </div>
      
      {/* Dialogue Bubble */}
      {isAttacking && (
         <div className="absolute -top-10 right-full mr-4 bg-white border-2 border-black p-4 rounded-tl-2xl rounded-br-2xl whitespace-nowrap shadow-lg animate-bounce z-20">
            <p className="font-ink text-xl text-black">{boss.description}</p>
         </div>
      )}
    </div>
  );
};

export default BossDisplay;