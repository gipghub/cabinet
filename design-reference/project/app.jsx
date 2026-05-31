// App.jsx — top-level app shell, navigation, tab bar

function App() {
  const [screen, setScreen] = React.useState('home');
  const [medicineId, setMedicineId] = React.useState(null);
  const [doseOpen, setDoseOpen] = React.useState(null); // medicineId or null
  const [shareOpen, setShareOpen] = React.useState(false);

  // Launch splash: show once per session
  const LAUNCH_KEY = 'cabinet-has-launched';
  const [showSplash, setShowSplash] = React.useState(() => {
    try { return !sessionStorage.getItem(LAUNCH_KEY); } catch (e) { return true; }
  });
  React.useEffect(() => {
    try { sessionStorage.setItem(LAUNCH_KEY, '1'); } catch (e) {}
  }, []);

  const go = (s, id) => {
    setScreen(s);
    if (id) setMedicineId(id);
    setDoseOpen(null);
  };

  const openDose = (id) => setDoseOpen(id);

  let body;
  switch (screen) {
    case 'home':    body = <HomeScreen go={go} openDose={openDose}/>; break;
    case 'scan':    body = <ScanScreen go={go}/>; break;
    case 'detail':  body = <DetailScreen medicineId={medicineId} go={go} openDose={openDose}/>; break;
    case 'add':     body = <AddScreen go={go}/>; break;
    case 'trends':  body = <TrendsScreen go={go}/>; break;
    case 'alerts':  body = <AlertsScreen go={go}/>; break;
    default:        body = <HomeScreen go={go} openDose={openDose}/>;
  }

  const hideTabs = screen === 'scan' || screen === 'add';
  const activeTab =
    screen === 'home'   ? 'home'   :
    screen === 'trends' ? 'trends' :
    screen === 'alerts' ? 'alerts' :
    screen === 'detail' ? 'home'   : null;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <div className="app">
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {body}
        </div>

        {!hideTabs && (
          <div className="tabbar">
            <button className="fab-scan" onClick={() => go('scan')}>
              <Icon name="scan" size={26} stroke={1.8}/>
            </button>
            <Tab id="home"   icon="home"  label="Cabinet" active={activeTab === 'home'}   onClick={() => go('home')}/>
            <Tab id="trends" icon="trend" label="Trends"  active={activeTab === 'trends'} onClick={() => go('trends')}/>
            <div style={{ flex: 1 }}/>
            <Tab id="alerts" icon="bell"  label="Alerts"  active={activeTab === 'alerts'} onClick={() => go('alerts')} badge={5}/>
            <Tab id="share"  icon="share" label="Share"   onClick={() => setShareOpen(true)}/>
          </div>
        )}
      </div>

      {doseOpen  && <DoseSheet  medicineId={doseOpen} onClose={() => setDoseOpen(null)} onLog={() => setDoseOpen(null)}/>}
      {shareOpen && <ShareSheet onClose={() => setShareOpen(false)}/>}

      {showSplash && (
        <Splash
          duration={1700}
          tagline="Everything in its place, and nothing past its date."
          onDone={() => setShowSplash(false)}
        />
      )}
    </div>
  );
}

function Tab({ icon, label, active, onClick, badge }) {
  return (
    <button className={'tab' + (active ? ' active' : '')} onClick={onClick} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <Icon name={icon} size={22} stroke={active ? 2 : 1.6}/>
        {badge && (
          <div style={{
            position: 'absolute', top: -4, right: -8,
            minWidth: 16, height: 16, borderRadius: 8,
            background: 'var(--danger)', color: '#fff',
            fontSize: 9.5, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 4px',
            border: '1.5px solid var(--bg)',
          }}>{badge}</div>
        )}
      </div>
      <span>{label}</span>
      <div className="tab-dot"/>
    </button>
  );
}

window.App = App;
