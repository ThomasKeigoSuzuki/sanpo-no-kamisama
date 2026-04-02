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

  return (
    <div className="oracle-card">
      <p className="god-speak">{speech}</p>

      <span className="oracle-label where">📍 どこで</span>
      <div className="reveal-box">
        {whereState === 'idle' && <span className="placeholder-text">お告げを待っています…</span>}
        {whereState === 'spinning' && (
          <SpinReveal state={whereState} result={whereResult} spinOptions={WHERE_OPTIONS} placeholder="場所のお告げを待っています..." />
        )}
        {whereState === 'revealed' && <span className="revealed-text" key={whereResult}>{whereResult}</span>}
      </div>

      <div className="paw-trail">🐾🐾🐾🐾🐾</div>

      <span className="oracle-label what">✋ なにをする</span>
      <div className="reveal-box">
        {whatState === 'idle' && <span className="placeholder-text">お告げを待っています…</span>}
        {whatState === 'spinning' && (
          <SpinReveal state={whatState} result={whatResult} spinOptions={WHAT_OPTIONS} placeholder="やることのお告げを待っています..." />
        )}
        {whatState === 'revealed' && <span className="revealed-text" key={whatResult}>{whatResult}</span>}
      </div>

      <div className="oracle-btn-row">
        <button className="oracle-btn where-btn" onClick={spinWhere} disabled={spinning}>📍 どこで？</button>
        <button className="oracle-btn what-btn" onClick={spinWhat} disabled={spinning}>✋ なにする？</button>
        <button className="oracle-btn both-btn" onClick={spinBoth} disabled={spinning}>⛩️ まとめてお告げを聞く！</button>
      </div>
    </div>
  );
}
