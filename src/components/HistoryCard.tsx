import { useState } from 'react';
import type { SanpoRecord } from '../types';

interface HistoryCardProps {
  record: SanpoRecord;
  onDelete: (id: string, photoURL: string | null) => void;
}

export function HistoryCard({ record, onDelete }: HistoryCardProps) {
  const [confirming, setConfirming] = useState(false);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="history-card">
      <div style={{fontSize: 12, color: 'var(--text-light)', marginBottom: 10}}>{formatDate(record.createdAt)}</div>

      <div style={{display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12}}>
        {record.where && <span className="history-tag where">📍 {record.where}</span>}
        {record.what && <span className="history-tag what">✋ {record.what}</span>}
      </div>

      {record.photoURL && (
        <img src={record.photoURL} alt="おさんぽの写真" className="history-photo" />
      )}

      {record.memo && <div className="history-memo">{record.memo}</div>}

      {confirming ? (
        <div style={{padding: 16, background: 'rgba(253,221,230,0.3)', borderRadius: 12, textAlign: 'center', marginTop: 8}}>
          <div style={{fontSize: 13, fontWeight: 700, marginBottom: 12}}>この記録を削除しますか？</div>
          <div style={{display: 'flex', gap: 8, justifyContent: 'center'}}>
            <button
              style={{padding: '8px 20px', borderRadius: 10, background: 'var(--pink1)', color: 'white', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer'}}
              onClick={() => {
                onDelete(record.id, record.photoURL);
                setConfirming(false);
              }}
            >
              削除する
            </button>
            <button
              style={{padding: '8px 20px', borderRadius: 10, background: 'var(--green3)', color: 'var(--green1)', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer'}}
              onClick={() => setConfirming(false)}
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 8}}>
          <button
            style={{padding: '6px 14px', borderRadius: 10, background: 'rgba(245,160,177,0.15)', color: 'var(--pink1)', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer'}}
            onClick={() => setConfirming(true)}
          >
            🗑 削除
          </button>
        </div>
      )}
    </div>
  );
}
