import { useState, useEffect, useRef } from 'react';
import type { RevealState } from '../types';
import { SparkleEffect } from './SparkleEffect';

interface SpinRevealProps {
  state: RevealState;
  result: string | null;
  spinOptions: string[];
  placeholder: string;
}

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
    <div className="reveal-box">
      {state === 'idle' && (
        <span className="placeholder-text">{placeholder}</span>
      )}
      {state === 'spinning' && (
        <div className="spinning-container">
          <span className="spinning-text">{displayText}</span>
        </div>
      )}
      {state === 'revealed' && (
        <>
          <span className="revealed-text">{result}</span>
          <SparkleEffect />
        </>
      )}
    </div>
  );
}
