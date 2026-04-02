interface TabBarProps {
  activeTab: 'oracle' | 'history';
  onChangeTab: (tab: 'oracle' | 'history') => void;
}

export function TabBar({ activeTab, onChangeTab }: TabBarProps) {
  return (
    <div className="tab-bar">
      <button
        className={`tab-btn ${activeTab === 'oracle' ? 'active' : ''}`}
        onClick={() => onChangeTab('oracle')}
      >
        ⛩️ お告げ
      </button>
      <button
        className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
        onClick={() => onChangeTab('history')}
      >
        📖 おさんぽ日記
      </button>
    </div>
  );
}
