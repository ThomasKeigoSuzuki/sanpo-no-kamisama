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

const styles: Record<string, React.CSSProperties> = {
  card: {
    margin: '0 20px 20px',
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
    padding: '20px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '16px',
    color: 'var(--text)',
  },
  photoArea: {
    marginBottom: '16px',
  },
  photoLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '20px',
    borderRadius: '16px',
    border: '2px dashed var(--green-light)',
    color: 'var(--green)',
    fontWeight: 500,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  preview: {
    width: '100%',
    borderRadius: '16px',
    marginTop: '10px',
    maxHeight: '200px',
    objectFit: 'cover' as const,
  },
  textarea: {
    width: '100%',
    minHeight: '80px',
    padding: '14px',
    borderRadius: '14px',
    border: '2px solid var(--green-pale)',
    fontSize: '14px',
    resize: 'vertical' as const,
    marginBottom: '16px',
    outline: 'none',
    color: 'var(--text)',
    background: 'rgba(212, 237, 218, 0.2)',
  },
  saveBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: 'var(--radius-btn)',
    background: 'linear-gradient(135deg, var(--green), var(--green-light))',
    color: 'white',
    fontSize: '15px',
    fontWeight: 700,
    boxShadow: '0 3px 12px rgba(125, 184, 125, 0.3)',
    transition: 'all 0.2s ease',
  },
};

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
    <div style={styles.card}>
      <div style={styles.rainbow} />
      <div style={styles.content}>
        <div style={styles.title}>📝 おさんぽを記録する</div>

        <div style={styles.photoArea}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />
          <div
            style={styles.photoLabel}
            onClick={() => fileRef.current?.click()}
          >
            📷 写真を追加
          </div>
          {photoPreview && (
            <img src={photoPreview} alt="Preview" style={styles.preview} />
          )}
        </div>

        <textarea
          style={styles.textarea}
          placeholder="今日のおさんぽメモ..."
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />

        <button
          style={{
            ...styles.saveBtn,
            opacity: saving ? 0.6 : 1,
          }}
          onClick={handleSave}
          disabled={saving}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.95)'; }}
          onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
        >
          {saved ? '✅ 保存しました！' : saving ? '保存中...' : '🐾 記録を保存'}
        </button>
      </div>
    </div>
  );
}
