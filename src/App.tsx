import { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import { TabBar } from './components/TabBar';
import { Splash } from './components/Splash';
import { HomeScreen } from './screens/Home';
import { ScanScreen } from './screens/Scan';
import { DetailScreen } from './screens/Detail';
import { AddScreen } from './screens/Add';
import { TrendsScreen } from './screens/Trends';
import { AlertsScreen } from './screens/Alerts';
import { DoseSheet } from './screens/Dose';
import { ShareSheet } from './screens/Share';
import { ALERTS } from './data/medicines';
import type { Go, ScreenName } from './types/nav';

const SPLASH_KEY = 'cabinet-has-launched';

export function App() {
  const hydrate = useStore((s) => s.hydrate);
  const hydrated = useStore((s) => s.hydrated);
  const dismissedAlerts = useStore((s) => s.dismissedAlerts);

  const [screen, setScreen] = useState<ScreenName>('home');
  const [medicineId, setMedicineId] = useState<string | null>(null);
  const [doseOpen, setDoseOpen] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const [showSplash, setShowSplash] = useState(() => {
    try { return !sessionStorage.getItem(SPLASH_KEY); } catch { return true; }
  });

  useEffect(() => { void hydrate(); }, [hydrate]);
  useEffect(() => {
    try { sessionStorage.setItem(SPLASH_KEY, '1'); } catch { /* ignore */ }
  }, []);

  const go: Go = (s, id) => {
    setScreen(s);
    if (id) setMedicineId(id);
    setDoseOpen(null);
  };

  const activeAlerts = ALERTS.filter((a) => !dismissedAlerts.includes(a.id)).length;
  const hideTabs = screen === 'scan' || screen === 'add';
  const activeTab =
    screen === 'home' ? 'home'
    : screen === 'trends' ? 'trends'
    : screen === 'alerts' ? 'alerts'
    : screen === 'detail' ? 'home'
    : null;

  let body: React.ReactNode;
  switch (screen) {
    case 'scan': body = <ScanScreen go={go} />; break;
    case 'detail': body = <DetailScreen medicineId={medicineId} go={go} openDose={setDoseOpen} />; break;
    case 'add': body = <AddScreen go={go} />; break;
    case 'trends': body = <TrendsScreen go={go} />; break;
    case 'alerts': body = <AlertsScreen go={go} />; break;
    case 'home':
    default: body = <HomeScreen go={go} />; break;
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <div className="app">
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {hydrated ? body : null}
        </div>

        {!hideTabs && (
          <TabBar
            activeTab={activeTab}
            alertCount={activeAlerts}
            onScan={() => go('scan')}
            onHome={() => go('home')}
            onTrends={() => go('trends')}
            onAlerts={() => go('alerts')}
            onShare={() => setShareOpen(true)}
          />
        )}
      </div>

      {doseOpen && <DoseSheet medicineId={doseOpen} onClose={() => setDoseOpen(null)} onLog={() => setDoseOpen(null)} />}
      {shareOpen && <ShareSheet onClose={() => setShareOpen(false)} />}

      {showSplash && <Splash duration={1700} onDone={() => setShowSplash(false)} />}
    </div>
  );
}
