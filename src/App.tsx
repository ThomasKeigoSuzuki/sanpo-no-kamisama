import { useState, useCallback } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { isConfigured } from './firebase';
import { Header } from './components/Header';
import { TabBar } from './components/TabBar';
import { OracleCard } from './components/OracleCard';
import { RecordForm } from './components/RecordForm';
import { HistoryList } from './components/HistoryList';
import { MascotDog } from './components/MascotDog';
import { FloatingLeaves } from './components/FloatingLeaves';

function AppContent() {
  const [activeTab, setActiveTab] = useState<'oracle' | 'history'>('oracle');
  const [whereResult, setWhereResult] = useState<string | null>(null);
  const [whatResult, setWhatResult] = useState<string | null>(null);
  const { user, signOut } = useAuth();

  const handleReveal = useCallback((where: string | null, what: string | null) => {
    setWhereResult(where);
    setWhatResult(what);
  }, []);

  return (
    <div className="app-bg">
      <FloatingLeaves />
      <Header />
      {isConfigured && user && (
        <div className="user-bar">
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div className="user-avatar">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} style={{width:'100%',height:'100%',borderRadius:'50%'}} />
              ) : '🐾'}
            </div>
            <span style={{fontSize:13,fontWeight:600}}>{user.displayName}</span>
          </div>
          <button className="logout-btn" onClick={signOut}>ログアウト</button>
        </div>
      )}
      <TabBar activeTab={activeTab} onChangeTab={setActiveTab} />
      {activeTab === 'oracle' ? (
        <>
          <OracleCard
            whereResult={whereResult}
            whatResult={whatResult}
            onReveal={handleReveal}
          />
          <RecordForm whereResult={whereResult} whatResult={whatResult} />
        </>
      ) : (
        <HistoryList />
      )}
      <MascotDog />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
