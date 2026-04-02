import { useAuth } from '../hooks/useAuth';
import { useHistory } from '../hooks/useHistory';
import { isConfigured } from '../firebase';
import { HistoryCard } from './HistoryCard';
import { LoginPrompt } from './LoginPrompt';

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '0 0 100px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    padding: '20px',
  },
  empty: {
    textAlign: 'center' as const,
    padding: '60px 20px',
  },
  emptyEmoji: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--brown)',
    marginBottom: '8px',
  },
  emptyDesc: {
    fontSize: '13px',
    color: 'var(--brown)',
    opacity: 0.6,
  },
};

export function HistoryList() {
  const { user } = useAuth();
  const { records, deleteRecord } = useHistory(user?.uid);

  if (!isConfigured || !user) {
    return <LoginPrompt />;
  }

  if (records.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyEmoji}>🐕</div>
        <div style={styles.emptyText}>まだ記録がないワン！</div>
        <div style={styles.emptyDesc}>
          お告げを聞いておさんぽに出かけよう
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.list}>
        {records.map((record) => (
          <HistoryCard
            key={record.id}
            record={record}
            onDelete={deleteRecord}
          />
        ))}
      </div>
    </div>
  );
}
