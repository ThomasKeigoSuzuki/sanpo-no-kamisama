import { useState } from 'react';
import { isConfigured } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { useHistory } from '../hooks/useHistory';
import { LoginPrompt } from './LoginPrompt';

interface RecordFormProps {
  whereResult: string | null;
  whatResult: string | null;
}

export function RecordForm({ whereResult, whatResult }: RecordFormProps) {
  const { user } = useAuth();
  const { addRecord, uploading } = useHistory(user?.uid);
  const [memo, setMemo] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!whereResult && !whatResult) return null;

  if (!isConfigured || !user) {
    return <LoginPrompt />;
  }

  const handleSave = async () => {
    if (saving || uploading) return;
    setSaving(true);

    try {
      await addRecord({
        where: whereResult,
        what: whatResult,
        memo,
      });

      setMemo('');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="record-card">
      <div className="record-title">📝 おさんぽを記録する</div>

      <textarea
        className="memo-input"
        placeholder="今日のおさんぽメモ..."
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        rows={3}
      />

      <button
        className="save-btn"
        onClick={handleSave}
        disabled={saving}
      >
        {saved ? '✅ 保存しました！' : saving ? '保存中...' : '🐾 記録を保存'}
      </button>
    </div>
  );
}
