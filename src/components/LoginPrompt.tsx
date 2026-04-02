import { useAuth } from '../hooks/useAuth';

const styles: Record<string, React.CSSProperties> = {
  card: {
    margin: '20px',
    padding: '24px',
    borderRadius: 'var(--radius-card)',
    background: 'white',
    boxShadow: '0 4px 20px rgba(90, 74, 58, 0.08)',
    textAlign: 'center' as const,
  },
  emoji: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '8px',
    color: 'var(--text)',
  },
  desc: {
    fontSize: '13px',
    color: 'var(--brown)',
    marginBottom: '20px',
    lineHeight: 1.6,
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    borderRadius: 'var(--radius-btn)',
    background: 'linear-gradient(135deg, #4285F4, #34A853)',
    color: 'white',
    fontSize: '14px',
    fontWeight: 700,
    boxShadow: '0 3px 10px rgba(66, 133, 244, 0.3)',
    transition: 'all 0.2s ease',
  },
};

export function LoginPrompt() {
  const { signIn } = useAuth();

  return (
    <div style={styles.card}>
      <div style={styles.emoji}>🐕</div>
      <div style={styles.title}>ログインしておさんぽを記録しよう！</div>
      <div style={styles.desc}>
        Googleアカウントでログインすると、<br />
        お告げの結果や写真を保存できるよ
      </div>
      <button
        style={styles.btn}
        onClick={signIn}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
        onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.95)'; }}
        onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
      >
        Googleでログイン
      </button>
    </div>
  );
}
