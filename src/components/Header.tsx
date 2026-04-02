import { WHERE_OPTIONS } from '../data/whereOptions';
import { WHAT_OPTIONS } from '../data/whatOptions';

export function Header() {
  return (
    <div className="header">
      <span className="torii">⛩️</span>
      <h1 className="app-title">さんぽの神様</h1>
      <p className="subtitle">神のお告げで街を歩こう</p>
      <p className="combo-count">🐾 {WHERE_OPTIONS.length} × {WHAT_OPTIONS.length} = {WHERE_OPTIONS.length * WHAT_OPTIONS.length}通りのお告げ</p>
    </div>
  );
}
