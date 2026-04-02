import { useState } from 'react';
import type { SanpoRecord } from '../types';

interface HistoryCardProps {
  record: SanpoRecord;
  onDelete: (id: string, photoURL: string | null) => void;
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    borderRadius: 'var(--radius-card)',
    background: 'white',
    boxShadow: '0 4px 20px rgba(90, 74, 58, 0.08)',
    overflow: 'hidden',
  },
  rainbow: {
    height: '5px',
    background: 'var(--rainbow)',
  },
  content: {
    padding: '16px',
  },
  date: {
    fontSize: '12px',
    color: 'var(--brown)',
    opacity: 0.6,
    marginBottom: '10px',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    marginBottom: '12px',
  },
  tagWhere: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: 'var(--radius-tag)',
    background: 'var(--green-pale)',
    color: 'var(--green)',
    fontSize: '13px',
    fontWeight: 700,
  },
  tagWhat: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: 'var(--radius-tag)',
    background: '#FEF0E6',
    color: 'var(--orange)',
    fontSize: '13px',
    fontWeight: 700,
  },
  photo: {
    width: '100%',
    borderRadius: '12px',
    marginBottom: '12px',
    maxHeight: '200px',
    objectFit: 'cover' as const,
  },
  memo: {
    fontSize: '14px',
    lineHeight: 1.7,
    color: 'var(--text)',
    marginBottom: '12px',
    whiteSpace: 'pre-wrap' as const,
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  deleteBtn: {
    padding: '6px 14px',
    borderRadius: '10px',
    background: 'rgba(245, 160, 177, 0.15)',
    color: 'var(--pink)',
    fontSize: '12px',
    fontWeight: 700,
    transition: 'all 0.2s',
  },
  confirmOverlay: {
    padding: '16px',
    background: 'rgba(253, 221, 230, 0.3)',
    borderRadius: '12px',
    textAlign: 'center' as const,
    marginBottom: '8px',
  },
  confirmText: {
    fontSize: '13px',
    fontWeight: 700,
    marginBottom: '12px',
    color: 'var(--text)',
  },
  confirmBtns: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
  },
  confirmYes: {
    padding: '8px 20px',
    borderRadius: '10px',
    background: 'var(--pink)',
    color: 'white',
    fontSize: '13px',
    fontWeight: 700,
  },
  confirmNo: {
    padding: '8px 20px',
    borderRadius: '10px',
    background: 'var(--green-pale)',
    color: 'var(--green)',
    fontSize: '13px',
    fontWeight: 700,
  },
};

export function HistoryCard({ record, onDelete }: HistoryCardProps) {
  const [confirming, setConfirming] = useState(false);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div style={styles.card}>
      <div style={styles.rainbow} />
      <div style={styles.content}>
        <div style={styles.date}>{formatDate(record.createdAt)}</div>

        <div style={styles.tags}>
          {record.where && <span style={styles.tagWhere}>📍 {record.where}</span>}
          {record.what && <span style={styles.tagWhat}>✋ {record.what}</span>}
        </div>

        {record.photoURL && (
          <img src={record.photoURL} alt="おさんぽの写真" style={styles.photo} />
        )}

        {record.memo && <div style={styles.memo}>{record.memo}</div>}

        {confirming ? (
          <div style={styles.confirmOverlay}>
            <div style={styles.confirmText}>この記録を削除しますか？</div>
            <div style={styles.confirmBtns}>
              <button
                style={styles.confirmYes}
                onClick={() => {
                  onDelete(record.id, record.photoURL);
                  setConfirming(false);
                }}
              >
                削除する
              </button>
              <button style={styles.confirmNo} onClick={() => setConfirming(false)}>
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.footer}>
            <button style={styles.deleteBtn} onClick={() => setConfirming(true)}>
              🗑 削除
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
