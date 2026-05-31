// App.jsx — top-level app shell, navigation, tab bar, tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#2f6b5f", "#a8dccb", "#eef4f3"],
  "labelStyle": "apothecary",
  "shelfStyle": "wood",
  "showFab": true,
  "splashDuration": 1.7,
  "splashTagline": "Everything in its place, and nothing past its date.",
  "splashFrequency": "every"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = React.useState('home');
  const [medicineId, setMedicineId] = React.useState(null);
  const [doseOpen, setDoseOpen] = React.useState(null); // medicineId or null
  const [shareOpen, setShareOpen] = React.useState(false);

  // Launch splash: show on first mount unless "first launch only" already fired.
  const LAUNCH_KEY = 'cabinet-has-launched';
  const [showSplash, setShowSplash] = React.useState(() => {
    try {
      if (t.splashFrequency === 'once' && localStorage.getItem(LAUNCH_KEY)) return false;
    } catch (e) {}
    return true;
  });
  React.useEffect(() => {
    try { localStorage.setItem(LAUNCH_KEY, '1'); } catch (e) {}
  }, []);
  const replaySplash = () => {
    try { localStorage.removeItem(LAUNCH_KEY); } catch (e) {}
    setShowSplash(false);
    // remount on next tick so the animation replays cleanly
    requestAnimationFrame(() => setShowSplash(true));
  };

  const go = (s, id) => {
    setScreen(s);
    if (id) setMedicineId(id);
    // close any open sheets
    setDoseOpen(null);
  };

  const openDose = (id) => setDoseOpen(id);

  // apply palette tweaks via CSS variables
  React.useEffect(() => {
    const root = document.documentElement;
    const [sage, soft, bg] = t.palette || TWEAK_DEFAULTS.palette;
    root.style.setProperty('--sage', sage);
    root.style.setProperty('--sage-soft', soft);
    root.style.setProperty('--bg', bg);
    // derive a softer bg tint for fade
    root.style.setProperty('--sage-fade', soft + '66');
  }, [t.palette]);

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

  // determine whether to show tab bar (hide on scan/full screens)
  const hideTabs = screen === 'scan' || screen === 'add';
  const activeTab =
    screen === 'home' ? 'home' :
    screen === 'trends' ? 'trends' :
    screen === 'alerts' ? 'alerts' :
    screen === 'detail' ? 'home' : null;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <div className="app">
        {/* screens container */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {body}
        </div>

        {/* tab bar */}
        {!hideTabs && (
          <div className="tabbar">
            {t.showFab && <button className="fab-scan" onClick={() => go('scan')}>
              <Icon name="scan" size={26} stroke={1.8}/>
            </button>}
            <Tab id="home" icon="home" label="Cabinet" active={activeTab === 'home'} onClick={() => go('home')}/>
            <Tab id="trends" icon="trend" label="Trends" active={activeTab === 'trends'} onClick={() => go('trends')}/>
            <div style={{ flex: 1 }}/>
            <Tab id="alerts" icon="bell" label="Alerts" active={activeTab === 'alerts'} onClick={() => go('alerts')} badge={5}/>
            <Tab id="share" icon="share" label="Share" onClick={() => setShareOpen(true)}/>
          </div>
        )}
      </div>

      {/* modals */}
      {doseOpen && <DoseSheet medicineId={doseOpen} onClose={() => setDoseOpen(null)} onLog={() => setDoseOpen(null)}/>}
      {shareOpen && <ShareSheet onClose={() => setShareOpen(false)}/>}

      {/* launch splash */}
      {showSplash && (
        <Splash
          duration={Math.round((t.splashDuration ?? 1.7) * 1000)}
          tagline={t.splashTagline}
          onDone={() => setShowSplash(false)}
        />
      )}

      {/* tweaks */}
      <TweaksPanel title="Cabinet tweaks">
        <TweakSection label="Palette">
          <TweakColor
            label="Theme"
            value={t.palette}
            options={[
              ['#2f6b5f', '#a8dccb', '#eef4f3'],
              ['#1f3a5c', '#bed4ea', '#eef1f4'],
              ['#7a3a14', '#e9d4b0', '#f6efe2'],
              ['#3b2a4a', '#d4c5e1', '#efe9f1'],
              ['#0e0f12', '#74e0a8', '#1a1c1f'],
            ]}
            onChange={v => setTweak('palette', v)}/>
        </TweakSection>
        <TweakSection label="Cabinet">
          <TweakRadio
            label="Shelf style"
            value={t.shelfStyle}
            options={[
              { value: 'wood', label: 'Wood' },
              { value: 'metal', label: 'Metal' },
              { value: 'glass', label: 'Glass' },
            ]}
            onChange={v => {
              setTweak('shelfStyle', v);
              const root = document.documentElement;
              if (v === 'metal') {
                root.style.setProperty('--shelf-bg', 'linear-gradient(180deg, #cfd5d8 0%, #8a949b 60%, #5d666d 100%)');
              } else if (v === 'glass') {
                root.style.setProperty('--shelf-bg', 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(168,220,203,0.4) 60%, rgba(19,50,43,0.2) 100%)');
              } else {
                root.style.setProperty('--shelf-bg', 'linear-gradient(180deg, #d8c194 0%, #b89863 60%, #8b6f3e 100%)');
              }
            }}/>
          <TweakRadio
            label="Labels"
            value={t.labelStyle}
            options={[
              { value: 'apothecary', label: 'Serif' },
              { value: 'modern', label: 'Sans' },
            ]}
            onChange={v => {
              setTweak('labelStyle', v);
              document.documentElement.style.setProperty('--font-display',
                v === 'modern' ? "'Geist', system-ui, sans-serif" : "'Instrument Serif', Georgia, serif");
            }}/>
          <TweakToggle
            label="Scan FAB"
            value={t.showFab}
            onChange={v => setTweak('showFab', v)}/>
        </TweakSection>
        <TweakSection label="Launch splash">
          <TweakSlider
            label="Duration"
            value={t.splashDuration}
            min={0.6} max={4} step={0.1} unit="s"
            onChange={v => setTweak('splashDuration', v)}/>
          <TweakText
            label="Tagline"
            value={t.splashTagline}
            placeholder="A friendly line…"
            onChange={v => setTweak('splashTagline', v)}/>
          <TweakRadio
            label="Show"
            value={t.splashFrequency}
            options={[
              { value: 'every', label: 'Every launch' },
              { value: 'once', label: 'First only' },
            ]}
            onChange={v => setTweak('splashFrequency', v)}/>
          <TweakButton label="Replay splash" onClick={replaySplash}/>
        </TweakSection>
        <TweakSection label="Demo">
          <TweakButton label="Open share-via-email" onClick={() => setShareOpen(true)}/>
          <TweakButton label="Log a Tylenol dose" secondary onClick={() => openDose('tylenol')}/>
        </TweakSection>
      </TweaksPanel>
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
