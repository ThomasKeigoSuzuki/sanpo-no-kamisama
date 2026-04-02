import { useState, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, isConfigured } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { useHistory } from '../hooks/useHistory';
import { LoginPrompt } from './LoginPrompt';

interface RecordFormProps {
  whereResult: string | null;
  whatResult: string | null;
}

function resizeImage(file: File, maxWidth: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        },
        'image/jpeg',
        0.85
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function RecordForm({ whereResult, whatResult }: RecordFormProps) {
  const { user } = useAuth();
  const { addRecord, uploading } = useHistory(user?.uid);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [memo, setMemo] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!whereResult && !whatResult) return null;

  if (!isConfigured || !user) {
    return <LoginPrompt />;
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (saving || uploading) return;
    setSaving(true);

    try {
      let photoURL: string | null = null;

      if (photo && storage) {
        const resized = await resizeImage(photo, 1200);
        const timestamp = Date.now();
        const storageRef = ref(storage, `sanpo-photos/${user.uid}/${timestamp}.jpg`);
        const snapshot = await uploadBytes(storageRef, resized, {
          contentType: 'image/jpeg',
        });
        photoURL = await getDownloadURL(snapshot.ref);
      }

      await addRecord({
        where: whereResult,
        what: whatResult,
        photoURL,
        memo,
      });

      setPhoto(null);
      setPhotoPreview(null);
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

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        style={{ display: 'none' }}
      />
      <div
        className={`photo-upload-area ${photoPreview ? 'has-photo' : ''}`}
        onClick={() => fileRef.current?.click()}
      >
        {photoPreview ? (
          <img src={photoPreview} alt="Preview" />
        ) : (
          '📷 写真を追加'
        )}
      </div>

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
