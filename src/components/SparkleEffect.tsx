import { useMemo } from 'react';

const EMOJIS = ['✨', '⭐', '🌟', '💫', '🐾', '🌸', '🍃'];

export function SparkleEffect() {
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      x: Math.random() * 200 - 100,
      y: Math.random() * 40 - 20,
      delay: Math.random() * 0.5,
      size: 14 + Math.random() * 12,
    }));
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            left: `calc(50% + ${p.x}px)`,
            top: `calc(50% + ${p.y}px)`,
            fontSize: `${p.size}px`,
            animation: `sparkle-float 1.5s ease-out ${p.delay}s forwards`,
            opacity: 0,
            animationFillMode: 'forwards',
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
