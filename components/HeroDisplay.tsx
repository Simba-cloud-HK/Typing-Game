import React from 'react';

interface HeroDisplayProps {
  isAttacking: boolean;
  isDamaged: boolean;
}

const HeroDisplay: React.FC<HeroDisplayProps> = ({ isAttacking, isDamaged }) => {
  return (
    <div className={`relative transition-all duration-200 ${isAttacking ? 'hero-lunge' : ''} ${isDamaged ? 'opacity-50 translate-x-[-20px]' : ''}`}>
      
      {/* Hero Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-stone-800 opacity-10 blur-2xl"></div>

      {/* Hero Silhouette (Ink Style) */}
      <div className="relative w-48 h-48 filter ink-blob">
        {/* Body / Cape */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-32 bg-stone-900 rounded-t-3xl transform skew-x-6"></div>
        {/* Head */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-stone-900 rounded-full"></div>
        {/* Scarf/Cape blowing */}
        <div className="absolute top-12 left-16 w-24 h-8 bg-stone-800 rounded-full transform rotate-12 animate-pulse"></div>
        
        {/* Sword Hand */}
        <div className={`absolute top-20 right-4 w-32 h-4 bg-gray-800 origin-left transition-transform duration-100 ${isAttacking ? 'rotate-[-20deg]' : 'rotate-[45deg]'}`}>
           {/* Sword Blade */}
           <div className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-2 bg-gray-400 border border-gray-600"></div>
           {/* Hilt */}
           <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-4 bg-yellow-700"></div>
        </div>
      </div>

      {/* Name Plate */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
         <span className="font-ink text-2xl text-stone-900">勇者 凌風</span>
      </div>

      {/* Slash Effect Overlay */}
      {isAttacking && <div className="slash-effect animate-slash"></div>}
    </div>
  );
};

export default HeroDisplay;