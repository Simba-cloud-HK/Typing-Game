import React from 'react';

interface HeroDisplayProps {
  isAttacking: boolean;
  isDamaged: boolean;
}

const HeroDisplay: React.FC<HeroDisplayProps> = ({ isAttacking, isDamaged }) => {
  return (
    // Added scale-60 (custom via style) and origin-left to shrink the hero significantly
    <div 
        className={`relative w-64 h-64 transition-all duration-200 ${isAttacking ? 'hero-lunge' : ''} ${isDamaged ? 'opacity-50 translate-x-[-20px]' : ''}`}
        style={{ transform: 'scale(0.6)', transformOrigin: 'center left' }}
    >
      
      {/* --- Character Container --- */}
      <div className="relative w-full h-full">
        
        {/* Cape (Behind) */}
        <div className="absolute top-20 left-4 w-32 h-40 bg-teal-600 rounded-2xl transform -rotate-12 animate-breeze origin-top-right z-0"></div>

        {/* --- Body --- */}
        <div className="absolute top-24 left-16 w-24 h-28 z-10">
            {/* Tunic/Armor Main */}
            <div className="absolute inset-0 bg-white rounded-2xl shadow-inner border-2 border-gray-100"></div>
            {/* Teal Chest Piece */}
            <div className="absolute top-0 left-0 w-full h-16 bg-teal-500 rounded-t-2xl clip-path-armor"></div>
            {/* Gold Medallion */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full border-2 border-yellow-500 shadow-sm"></div>
            {/* Skirt details */}
            <div className="absolute bottom-0 w-full h-6 flex justify-between px-2">
                <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-yellow-400"></div>
                <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-yellow-400"></div>
                <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-yellow-400"></div>
            </div>
        </div>

        {/* Legs */}
        <div className="absolute top-48 left-20 w-6 h-12 bg-white rounded-b-full z-0 border-l-2 border-gray-200"></div>
        <div className="absolute top-48 left-32 w-6 h-12 bg-white rounded-b-full z-0 border-r-2 border-gray-200"></div>

        {/* --- Head --- */}
        <div className="absolute top-4 left-12 w-32 h-28 z-20 animate-breeze origin-bottom">
            {/* Hair Back */}
            <div className="absolute -top-4 -left-4 w-40 h-32 bg-orange-400 rounded-full z-0"></div>
            <div className="absolute -top-8 left-0 w-12 h-12 bg-orange-400 transform rotate-45"></div>
            <div className="absolute -top-6 left-8 w-12 h-12 bg-orange-400 transform rotate-12"></div>
            <div className="absolute -top-2 left-24 w-12 h-12 bg-orange-400 transform -rotate-12"></div>

            {/* Face */}
            <div className="absolute top-4 left-4 w-24 h-20 bg-rose-100 rounded-2xl z-10 shadow-sm"></div>

            {/* Headband */}
            <div className="absolute top-4 left-3 w-26 h-4 bg-yellow-400 z-20 rounded-sm w-[104px]">
                <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-3 h-5 bg-teal-400 rounded-full border border-teal-600"></div>
            </div>

            {/* Eyes */}
            <div className="absolute top-10 left-6 w-5 h-8 bg-slate-700 rounded-full z-20 border-2 border-slate-800">
                <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div className="absolute top-10 right-6 w-5 h-8 bg-slate-700 rounded-full z-20 border-2 border-slate-800">
                 <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
            </div>

            {/* Mouth */}
            <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-3 h-2 bg-rose-300 rounded-full transition-all ${isAttacking ? 'h-4 w-4 rounded-full bg-rose-500' : ''}`}></div>

            {/* Hair Front/Sideburns */}
            <div className="absolute top-6 -left-2 w-6 h-16 bg-orange-400 rounded-b-full z-20 transform rotate-12"></div>
            <div className="absolute top-6 -right-2 w-6 h-16 bg-orange-400 rounded-b-full z-20 transform -rotate-12"></div>
        </div>

        {/* --- Sword Hand --- */}
        <div className={`absolute top-32 left-36 z-30 origin-left transition-transform duration-100 ${isAttacking ? 'rotate-[-20deg] translate-x-8' : 'rotate-[0deg]'}`}>
             {/* Arm */}
             <div className="absolute top-2 -left-4 w-10 h-6 bg-teal-600 rounded-full"></div>
             <div className="absolute top-2 -left-4 w-4 h-6 bg-rose-100 rounded-l-full"></div>

             {/* Hilt */}
             <div className="absolute -top-2 left-4 w-8 h-14 bg-slate-800 rounded-md border-2 border-yellow-500 transform rotate-45"></div>
             <div className="absolute -top-4 left-8 w-12 h-4 bg-teal-400 rounded-full transform rotate-45 border-2 border-yellow-400"></div>
             
             {/* Blade (Giant Glowing) */}
             <div className="absolute -top-24 left-10 w-48 h-12 bg-cyan-100 rounded-r-full transform -rotate-45 border-2 border-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.8)] overflow-hidden">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-cyan-300 -translate-y-1/2 opacity-50"></div>
             </div>
        </div>

      </div>

      {/* Slash Effect Overlay */}
      {isAttacking && <div className="slash-effect animate-slash"></div>}
    </div>
  );
};

export default HeroDisplay;