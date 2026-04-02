import { useState, useEffect, useCallback } from 'react';

const DOG_QUOTES = [
  'わんわん！今日もいい散歩日和じゃな！',
  'ご主人、あっちに面白い匂いがするぞ！',
  'たまには知らない道を歩くのじゃ！',
  'いい風じゃな...散歩の神様も喜んでおるぞ',
  'わしについてくるのじゃ！冒険の始まりじゃ！',
];

export function MascotDog() {
  const [toast, setToast] = useState<string | null>(null);
  const [toastOut, setToastOut] = useState(false);

  const handleClick = useCallback(() => {
    const quote = DOG_QUOTES[Math.floor(Math.random() * DOG_QUOTES.length)];
    setToast(quote);
    setToastOut(false);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const hideTimer = setTimeout(() => {
      setToastOut(true);
    }, 2500);
    const removeTimer = setTimeout(() => {
      setToast(null);
      setToastOut(false);
    }, 2800);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [toast]);

  return (
    <>
      <div className="mascot-dog" onClick={handleClick}>🐕</div>
      {toast && <div className={`toast ${toastOut ? 'out' : ''}`}>{toast}</div>}
    </>
  );
}
