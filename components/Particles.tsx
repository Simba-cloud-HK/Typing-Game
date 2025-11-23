import React, { useEffect, useState } from 'react';
import { Particle } from '../types';

interface ParticlesProps {
  activeParticles: Particle[];
}

const Particles: React.FC<ParticlesProps> = ({ activeParticles }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {activeParticles.map((p) => (
        <div
          key={p.id}
          className="absolute font-bold text-xl"
          style={{
            left: p.x,
            top: p.y,
            color: p.color,
            transform: `translate(-50%, -50%)`,
            textShadow: '0 0 5px rgba(255,255,255,0.8)'
          }}
        >
          {p.text || '✦'}
        </div>
      ))}
    </div>
  );
};

export default Particles;
