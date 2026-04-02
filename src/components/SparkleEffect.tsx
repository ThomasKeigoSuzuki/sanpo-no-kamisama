import { useMemo } from 'react';

const EMOJIS = ['✨', '⭐', '🌟', '💫', '🐾', '🌸', '🍃'];

export function SparkleEffect() {
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 14 + Math.random() * 12,
    }));
  }, []);

  return (
    <div className="sparkles">
      {particles.map((p, i) => (
        <span
          key={p.id}
          className="sparkle"
          style={{
            left: p.x + '%',
            top: p.y + '%',
            fontSize: p.size + 'px',
            animationDelay: i * 0.1 + 's',
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
