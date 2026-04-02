import { useState, useCallback, useRef } from 'react';
import type { RevealState } from '../types';
import { WHERE_OPTIONS } from '../data/whereOptions';
import { WHAT_OPTIONS } from '../data/whatOptions';
import { SpinReveal } from './SpinReveal';

interface OracleCardProps {
  whereResult: string | null;
  whatResult: string | null;
  onReveal: (where: string | null, what: string | null) => void;
}

const SPEECH_IDLE = ['さんぽの神のお告げじゃ！', 'ボタンを押すのじゃ...'];
const SPEECH_SPINNING = ['むむむ...見えてきたぞ...', 'お告げが降りてくるぞ...'];
const SPEECH_DONE = ['これが今日のお告げじゃ！', 'いってらっしゃい！🐕'];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    margin: '20px',
    borderRadius: 'var(--radius-card)',
    background: 'white',
    boxShadow: '0 4px 20px rgba(90, 74, 58, 0.08)',
    overflow: 'hidden',
    position: 'relative',
  },
  rainbow: {
    height: '5px',
    background: 'var(--rainbow)',
  },
  content: {
    padding: '24px 20px',
  },
  mascot: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '20px',
  },
  mascotFace: {
    fontSize: '40px',
    flexShrink: 0,
  },
  speechBubble: {
    background: 'var(--green-pale)',
    borderRadius: '16px',
    borderTopLeftRadius: '4px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--green)',
    position: 'relative' as const,
  },
  slots: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    marginBottom: '20px',
  },
  slotLabel: {
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--brown)',
    marginBottom: '4px',
    opacity: 0.7,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  btnRow: {
    display: 'flex',
    gap: '10px',
  },
  btnSmall: {
    flex: 1,
    padding: '12px 8px',
    borderRadius: 'var(--radius-btn)',
    fontSize: '14px',
    fontWeight: 700,
    color: 'white',
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
  },
  btnWhere: {
    background: 'linear-gradient(135deg, var(--green), var(--green-light))',
  },
  btnWhat: {
    background: 'linear-gradient(135deg, var(--orange), #f7c693)',
  },
  btnBig: {
    padding: '16px',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: 900,
    color: 'white',
    background: 'linear-gradient(135deg, var(--pink), var(--pink-pale), var(--orange))',
    boxShadow: '0 4px 15px rgba(245, 160, 177, 0.3)',
    transition: 'all 0.2s ease',
  },
};

export function OracleCard({ whereResult, whatResult, onReveal }: OracleCardProps) {
  const [whereState, setWhereState] = useState<RevealState>('idle');
  const [whatState, setWhatState] = useState<RevealState>('idle');
  const [speech, setSpeech] = useState(pickRandom(SPEECH_IDLE));
  const [spinning, setSpinning] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const spinWhere = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setSpeech(pickRandom(SPEECH_SPINNING));
    setWhereState('spinning');
    const result = pickRandom(WHERE_OPTIONS);

    timeoutRef.current = setTimeout(() => {
      setWhereState('revealed');
      setSpeech(pickRandom(SPEECH_DONE));
      onReveal(result, whatResult);
      setSpinning(false);
    }, 1800);
  }, [spinning, whatResult, onReveal]);

  const spinWhat = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setSpeech(pickRandom(SPEECH_SPINNING));
    setWhatState('spinning');
    const result = pickRandom(WHAT_OPTIONS);

    timeoutRef.current = setTimeout(() => {
      setWhatState('revealed');
      setSpeech(pickRandom(SPEECH_DONE));
      onReveal(whereResult, result);
      setSpinning(false);
    }, 1800);
  }, [spinning, whereResult, onReveal]);

  const spinBoth = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    clearTimeouts();
    setSpeech(pickRandom(SPEECH_SPINNING));
    setWhereState('spinning');
    setWhatState('idle');
    const wResult = pickRandom(WHERE_OPTIONS);
    const tResult = pickRandom(WHAT_OPTIONS);

    timeoutRef.current = setTimeout(() => {
      setWhereState('revealed');
      setWhatState('spinning');

      timeoutRef.current = setTimeout(() => {
        setWhatState('revealed');
        setSpeech(pickRandom(SPEECH_DONE));
        onReveal(wResult, tResult);
        setSpinning(false);
      }, 1800);
    }, 2200);
  }, [spinning, onReveal, clearTimeouts]);

  const hoverIn = (e: React.MouseEvent) => {
    if (!spinning) (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
  };
  const hoverOut = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
  };
  const pressIn = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.transform = 'scale(0.95)';
  };
  const pressOut = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
  };

  return (
    <div style={styles.card}>
      <div style={styles.rainbow} />
      <div style={styles.content}>
        <div style={styles.mascot}>
          <span style={styles.mascotFace}>🐕</span>
          <div style={styles.speechBubble}>{speech}</div>
        </div>

        <div style={styles.slots}>
          <div>
            <div style={styles.slotLabel}>📍 どこで？</div>
            <SpinReveal
              state={whereState}
              result={whereResult}
              spinOptions={WHERE_OPTIONS}
              placeholder="場所のお告げを待っています..."
            />
          </div>
          <div>
            <div style={styles.slotLabel}>✋ なにする？</div>
            <SpinReveal
              state={whatState}
              result={whatResult}
              spinOptions={WHAT_OPTIONS}
              placeholder="やることのお告げを待っています..."
            />
          </div>
        </div>

        <div style={styles.buttons}>
          <div style={styles.btnRow}>
            <button
              style={{ ...styles.btnSmall, ...styles.btnWhere, opacity: spinning ? 0.6 : 1 }}
              onClick={spinWhere}
              disabled={spinning}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
              onMouseDown={pressIn}
              onMouseUp={pressOut}
            >
              📍 どこで？
            </button>
            <button
              style={{ ...styles.btnSmall, ...styles.btnWhat, opacity: spinning ? 0.6 : 1 }}
              onClick={spinWhat}
              disabled={spinning}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
              onMouseDown={pressIn}
              onMouseUp={pressOut}
            >
              ✋ なにする？
            </button>
          </div>
          <button
            style={{ ...styles.btnBig, opacity: spinning ? 0.6 : 1 }}
            onClick={spinBoth}
            disabled={spinning}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
            onMouseDown={pressIn}
            onMouseUp={pressOut}
          >
            ⛩️ まとめてお告げを聞く！
          </button>
        </div>
      </div>
    </div>
  );
}
