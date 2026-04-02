import { useMemo } from 'react';

const LEAF_EMOJIS = ['🍃', '🌿', '🍂', '🌱', '🐾'];

interface Leaf {
  id: number;
  emoji: string;
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
}

export function FloatingLeaves() {
  const leaves = useMemo<Leaf[]>(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      emoji: LEAF_EMOJIS[Math.floor(Math.random() * LEAF_EMOJIS.length)],
      left: `${Math.random() * 90 + 5}%`,
      top: `${Math.random() * 80 + 10}%`,
      size: 18 + Math.random() * 16,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {leaves.map((leaf) => (
        <span
          key={leaf.id}
          style={{
            position: 'absolute',
            left: leaf.left,
            top: leaf.top,
            fontSize: `${leaf.size}px`,
            opacity: 0.15,
            animation: `float-leaf ${leaf.duration}s ease-in-out ${leaf.delay}s infinite`,
          }}
        >
          {leaf.emoji}
        </span>
      ))}
    </div>
  );
}
