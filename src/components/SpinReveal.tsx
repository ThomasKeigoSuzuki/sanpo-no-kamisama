import { useState, useEffect, useRef } from 'react';
import type { RevealState } from '../types';
import { SparkleEffect } from './SparkleEffect';

interface SpinRevealProps {
  state: RevealState;
  result: string | null;
  spinOptions: string[];
  placeholder: string;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    minHeight: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.6)',
    border: '1px solid rgba(125, 184, 125, 0.2)',
    overflow: 'visible',
  },
  placeholder: {
    fontSize: '15px',
    color: 'var(--brown)',
    opacity: 0.5,
    fontWeight: 500,
  },
  spinning: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--green)',
    animation: 'spin-slot 0.15s ease-in-out infinite',
  },
  revealed: {
    fontSize: '18px',
    fontWeight: 900,
    color: 'var(--text)',
    animation: 'spring-reveal 0.5s ease-out forwards',
    textAlign: 'center' as const,
  },
};

export function SpinReveal({ state, result, spinOptions, placeholder }: SpinRevealProps) {
  const [displayText, setDisplayText] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state === 'spinning') {
      intervalRef.current = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * spinOptions.length);
        setDisplayText(spinOptions[randomIndex]);
      }, 80);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state, spinOptions]);

  return (
    <div style={styles.container}>
      {state === 'idle' && (
        <span style={styles.placeholder}>{placeholder}</span>
      )}
      {state === 'spinning' && (
        <span style={styles.spinning}>{displayText}</span>
      )}
      {state === 'revealed' && (
        <>
          <span style={styles.revealed}>{result}</span>
          <SparkleEffect />
        </>
      )}
    </div>
  );
}
