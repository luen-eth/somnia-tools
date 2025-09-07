'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
}

export function AnimatedBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Create initial particles
    const initialParticles: Particle[] = [];
    const colors = [
      'rgba(121, 22, 255, 0.6)',
      'rgba(132, 61, 255, 0.6)',
      'rgba(255, 22, 121, 0.6)',
      'rgba(22, 255, 121, 0.6)',
      'rgba(255, 255, 255, 0.4)',
    ];

    for (let i = 0; i < 50; i++) {
      initialParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    setParticles(initialParticles);

    // Animation loop
    const animateParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => ({
          ...particle,
          x: particle.x + particle.speedX,
          y: particle.y + particle.speedY,
          // Wrap around screen
          x: particle.x > window.innerWidth ? 0 : particle.x < 0 ? window.innerWidth : particle.x,
          y: particle.y > window.innerHeight ? 0 : particle.y < 0 ? window.innerHeight : particle.y,
        }))
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Floating Orbs */}
      <div className="floating-orb w-64 h-64 -top-32 -left-32" style={{ animationDelay: '0s' }} />
      <div className="floating-orb w-48 h-48 top-1/4 -right-24" style={{ animationDelay: '2s' }} />
      <div className="floating-orb w-32 h-32 bottom-1/4 left-1/4" style={{ animationDelay: '4s' }} />
      <div className="floating-orb w-40 h-40 -bottom-20 -right-20" style={{ animationDelay: '1s' }} />

      {/* Animated Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            animation: `sparkle 3s linear infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}

      {/* Sparkles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Gradient Mesh */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(121, 22, 255, 0.4) 0%, transparent 70%)',
            top: '10%',
            left: '10%',
            animation: 'float 15s ease-in-out infinite',
            animationDelay: '0s',
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 22, 121, 0.4) 0%, transparent 70%)',
            top: '60%',
            right: '10%',
            animation: 'float 12s ease-in-out infinite reverse',
            animationDelay: '2s',
          }}
        />
        <div
          className="absolute w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(22, 255, 121, 0.4) 0%, transparent 70%)',
            bottom: '20%',
            left: '30%',
            animation: 'float 18s ease-in-out infinite',
            animationDelay: '4s',
          }}
        />
      </div>
    </div>
  );
}
