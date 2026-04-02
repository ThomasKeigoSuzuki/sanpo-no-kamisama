import { useState, useEffect, useCallback } from 'react';

const DOG_QUOTES = [
  'わんわん！今日もいい散歩日和じゃな！',
  'ご主人、あっちに面白い匂いがするぞ！',
  'たまには知らない道を歩くのじゃ！',
  'いい風じゃな...散歩の神様も喜んでおるぞ',
  'わしについてくるのじゃ！冒険の始まりじゃ！',
];

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 50,
  },
  dog: {
    fontSize: '40px',
    cursor: 'pointer',
    animation: 'bounce 2s ease-in-out infinite',
    userSelect: 'none' as const,
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
  },
  toast: {
    position: 'absolute' as const,
    bottom: '55px',
    right: '0',
    background: 'white',
    padding: '10px 14px',
    borderRadius: '14px',
    borderBottomRightRadius: '4px',
    boxShadow: '0 4px 15px rgba(90, 74, 58, 0.12)',
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--text)',
    whiteSpace: 'nowrap' as const,
    animation: 'toast-in 0.3s ease-out',
    maxWidth: '220px',
  },
  toastHiding: {
    animation: 'toast-out 0.3s ease-in forwards',
  },
};

export function MascotDog() {
  const [toast, setToast] = useState<string | null>(null);
  const [hiding, setHiding] = useState(false);

  const handleClick = useCallback(() => {
    const quote = DOG_QUOTES[Math.floor(Math.random() * DOG_QUOTES.length)];
    setToast(quote);
    setHiding(false);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const hideTimer = setTimeout(() => {
      setHiding(true);
    }, 2500);
    const removeTimer = setTimeout(() => {
      setToast(null);
      setHiding(false);
    }, 2800);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [toast]);

  return (
    <div style={styles.container}>
      {toast && (
        <div style={{ ...styles.toast, ...(hiding ? styles.toastHiding : {}) }}>
          {toast}
        </div>
      )}
      <div style={styles.dog} onClick={handleClick}>
        🐕
      </div>
    </div>
  );
}
