import { useState, useCallback } from 'react';
import { AuthProvider } from './contexts/AuthContext';
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

  const handleReveal = useCallback((where: string | null, what: string | null) => {
    setWhereResult(where);
    setWhatResult(what);
  }, []);

  return (
    <>
      <FloatingLeaves />
      <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
        <Header />
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
      </div>
      <MascotDog />
    </>
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
