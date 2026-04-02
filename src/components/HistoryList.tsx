import { useAuth } from '../hooks/useAuth';
import { useHistory } from '../hooks/useHistory';
import { isConfigured } from '../firebase';
import { HistoryCard } from './HistoryCard';
import { LoginPrompt } from './LoginPrompt';

export function HistoryList() {
  const { user } = useAuth();
  const { records, deleteRecord } = useHistory(user?.uid);

  if (!isConfigured || !user) {
    return <LoginPrompt />;
  }

  if (records.length === 0) {
    return (
      <div className="history-empty">
        <p style={{fontSize: 64, marginBottom: 16}}>🐕</p>
        <p style={{fontWeight: 700, marginBottom: 8}}>まだ記録がないワン！</p>
        <p style={{fontSize: 13}}>お告げを聞いておさんぽに出かけよう</p>
      </div>
    );
  }

  return (
    <div style={{paddingBottom: 100}}>
      {records.map((record) => (
        <HistoryCard
          key={record.id}
          record={record}
          onDelete={deleteRecord}
        />
      ))}
    </div>
  );
}
