import { useMemo } from 'react';

const LEAF_EMOJIS = ['🍃', '🌿', '🍂', '🌱', '🐾'];

export function FloatingLeaves() {
  const leaves = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      emoji: LEAF_EMOJIS[Math.floor(Math.random() * LEAF_EMOJIS.length)],
      x: Math.random() * 90 + 5,
      y: Math.random() * 80 + 10,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <>
      {leaves.map((leaf) => (
        <span
          key={leaf.id}
          className="floating-leaf"
          style={{
            left: leaf.x + '%',
            top: leaf.y + '%',
            animationDelay: leaf.delay + 's',
            animationDuration: leaf.duration + 's',
          }}
        >
          {leaf.emoji}
        </span>
      ))}
    </>
  );
}
