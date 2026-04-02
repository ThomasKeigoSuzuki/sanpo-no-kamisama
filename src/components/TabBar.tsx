interface TabBarProps {
  activeTab: 'oracle' | 'history';
  onChangeTab: (tab: 'oracle' | 'history') => void;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    gap: '0',
    margin: '16px 20px 0',
    background: 'var(--green-pale)',
    borderRadius: '16px',
    padding: '4px',
  },
  tab: {
    flex: 1,
    padding: '12px 0',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: 700,
    textAlign: 'center' as const,
    transition: 'all 0.2s ease',
    background: 'transparent',
    color: 'var(--green)',
  },
  activeTab: {
    background: 'white',
    color: 'var(--green)',
    boxShadow: '0 2px 8px rgba(125, 184, 125, 0.2)',
  },
};

export function TabBar({ activeTab, onChangeTab }: TabBarProps) {
  return (
    <div style={styles.container}>
      <button
        style={{
          ...styles.tab,
          ...(activeTab === 'oracle' ? styles.activeTab : {}),
        }}
        onClick={() => onChangeTab('oracle')}
      >
        ⛩️ お告げ
      </button>
      <button
        style={{
          ...styles.tab,
          ...(activeTab === 'history' ? styles.activeTab : {}),
        }}
        onClick={() => onChangeTab('history')}
      >
        📖 おさんぽ日記
      </button>
    </div>
  );
}
