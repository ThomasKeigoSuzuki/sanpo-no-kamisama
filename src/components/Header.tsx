import { WHERE_OPTIONS } from '../data/whereOptions';
import { WHAT_OPTIONS } from '../data/whatOptions';
import { useAuth } from '../hooks/useAuth';
import { isConfigured } from '../firebase';

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(125, 184, 125, 0.2)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 900,
    color: 'var(--green)',
  },
  count: {
    fontSize: '11px',
    color: 'var(--brown)',
    opacity: 0.7,
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '2px solid var(--green-light)',
    cursor: 'pointer',
  },
  loginBtn: {
    padding: '8px 16px',
    borderRadius: 'var(--radius-btn)',
    background: 'linear-gradient(135deg, var(--green), var(--green-light))',
    color: 'white',
    fontWeight: 700,
    fontSize: '13px',
    boxShadow: '0 2px 8px rgba(125, 184, 125, 0.3)',
    transition: 'transform 0.2s',
  },
};

export function Header() {
  const { user, signIn, signOut } = useAuth();
  const total = WHERE_OPTIONS.length * WHAT_OPTIONS.length;

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <span style={{ fontSize: '28px' }}>⛩️</span>
        <div>
          <div style={styles.title}>さんぽの神様</div>
          <div style={styles.count}>
            {WHERE_OPTIONS.length} × {WHAT_OPTIONS.length} = {total.toLocaleString()}通り
          </div>
        </div>
      </div>
      <div>
        {!isConfigured ? null : user ? (
          <img
            src={user.photoURL || undefined}
            alt={user.displayName || 'User'}
            style={styles.avatar}
            onClick={signOut}
            title="ログアウト"
          />
        ) : (
          <button
            style={styles.loginBtn}
            onClick={signIn}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = 'translateY(0)'; }}
            onMouseDown={(e) => { (e.target as HTMLElement).style.transform = 'scale(0.95)'; }}
            onMouseUp={(e) => { (e.target as HTMLElement).style.transform = 'translateY(-2px)'; }}
          >
            ログイン
          </button>
        )}
      </div>
    </header>
  );
}
