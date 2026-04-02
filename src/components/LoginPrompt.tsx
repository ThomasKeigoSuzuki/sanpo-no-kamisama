import { useAuth } from '../hooks/useAuth';

export function LoginPrompt() {
  const { signIn } = useAuth();

  return (
    <div className="login-card">
      <p style={{fontSize: 40, marginBottom: 12}}>🐕</p>
      <p style={{fontWeight: 700, marginBottom: 8}}>ログインして記録を残そう！</p>
      <p style={{fontSize: 13, color: 'var(--text-light)', marginBottom: 16}}>散歩の記録を保存・振り返りできます</p>
      <button className="google-btn" onClick={signIn}>🔑 Googleでログイン</button>
    </div>
  );
}
