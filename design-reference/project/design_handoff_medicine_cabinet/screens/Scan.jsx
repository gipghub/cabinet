// Scan.jsx — barcode + photo scanner with picker

function ScanScreen({ go, onScanned }) {
  const [mode, setMode] = React.useState('barcode');
  const [phase, setPhase] = React.useState('scanning'); // 'scanning' | 'found' | 'photo-review'

  // simulate finding a barcode after 2.4s
  React.useEffect(() => {
    if (mode === 'barcode' && phase === 'scanning') {
      const t = setTimeout(() => setPhase('found'), 2400);
      return () => clearTimeout(t);
    }
  }, [mode, phase]);

  React.useEffect(() => { setPhase('scanning'); }, [mode]);

  return (
    <div className="screen" style={{ background: '#0c1814', color: '#eef4f3' }}>
      <div className="app-statusbar" />

      {/* top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '4px 14px 14px',
      }}>
        <button onClick={() => go('home')} style={{
          width: 36, height: 36, borderRadius: 18,
          background: 'rgba(255,255,255,0.12)', border: 0,
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="close" size={18}/>
        </button>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, whiteSpace: 'nowrap' }}>
          {mode === 'barcode' ? 'Scan a box' : 'Photograph it'}
        </div>
        <button style={{
          width: 36, height: 36, borderRadius: 18,
          background: 'rgba(255,255,255,0.12)', border: 0,
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="flame" size={18}/>
        </button>
      </div>

      {/* viewfinder */}
      <div style={{
        flex: 1,
        position: 'relative',
        margin: '0 14px',
        borderRadius: 24,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #14241f 0%, #060d0b 100%)',
      }}>
        {/* faux camera scene */}
        <FauxScene mode={mode} phase={phase}/>

        {/* dim overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }}/>

        {/* crosshair window */}
        {mode === 'barcode' ? <BarcodeFrame phase={phase}/> : <PhotoFrame/>}

        {/* footer hint */}
        <div style={{
          position: 'absolute', bottom: 24, left: 0, right: 0,
          textAlign: 'center', color: 'rgba(255,255,255,0.85)',
          fontSize: 13, letterSpacing: '0.02em',
        }}>
          {mode === 'barcode'
            ? (phase === 'scanning' ? 'Align the barcode in the frame' : 'Got it')
            : 'Point at the entire box — front label visible'}
        </div>
      </div>

      {/* mode picker + capture */}
      <div style={{ padding: '18px 14px 28px' }}>
        <div className="segmented" style={{
          background: 'rgba(255,255,255,0.10)',
          maxWidth: 260, margin: '0 auto 18px',
        }}>
          <button className={mode==='barcode' ? 'on' : ''} onClick={() => setMode('barcode')}
                  style={{ color: mode==='barcode' ? '#0c1814' : 'rgba(255,255,255,0.7)', background: mode==='barcode' ? '#eef4f3' : 'transparent' }}>
            <Icon name="qr" size={14}/> <span style={{ marginLeft: 6 }}>Barcode</span>
          </button>
          <button className={mode==='photo' ? 'on' : ''} onClick={() => setMode('photo')}
                  style={{ color: mode==='photo' ? '#0c1814' : 'rgba(255,255,255,0.7)', background: mode==='photo' ? '#eef4f3' : 'transparent' }}>
            <Icon name="camera" size={14}/> <span style={{ marginLeft: 6 }}>Photo</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          <button onClick={() => go('add')} style={{
            background: 'none', border: 0, color: 'rgba(255,255,255,0.7)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}>
            <Icon name="edit" size={20}/>
            <span style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Manual</span>
          </button>
          <button onClick={() => mode==='photo' && setPhase('found')} style={{
            width: 76, height: 76, borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)',
            border: '4px solid rgba(255,255,255,0.25)',
            color: '#0c1814',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {mode === 'barcode'
              ? <Icon name="qr" size={28} stroke={1.8}/>
              : <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#0c1814' }}/>}
          </button>
          <button style={{
            background: 'none', border: 0, color: 'rgba(255,255,255,0.7)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}>
            <Icon name="image" size={20}/>
            <span style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Library</span>
          </button>
        </div>
      </div>

      {/* found sheet */}
      {phase === 'found' && <FoundSheet go={go}/>}
    </div>
  );
}

function BarcodeFrame({ phase }) {
  return (
    <div style={{
      position: 'absolute', top: '32%', left: 0, right: 0, height: 160,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'relative',
        width: 280, height: 160,
        borderRadius: 18,
        background: 'rgba(0,0,0,0.0)',
      }}>
        {/* corners */}
        {[['tl', 0, 0], ['tr', 'auto', 0], ['bl', 0, 'auto'], ['br', 'auto', 'auto']].map(([k, l, t]) => (
          <Corner key={k} pos={k}/>
        ))}
        {/* shimmer scan line */}
        {phase === 'scanning' && (
          <div style={{
            position: 'absolute', left: 12, right: 12, height: 2,
            background: 'linear-gradient(90deg, transparent, #a8dccb 50%, transparent)',
            top: 0,
            animation: 'scanShimmer 1.8s linear infinite',
            boxShadow: '0 0 14px rgba(168,220,203,0.8)',
          }}/>
        )}
        {/* barcode hint */}
        <div style={{
          position: 'absolute', inset: '40% 40px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: phase === 'scanning' ? 0.35 : 1,
          transition: 'opacity 0.3s',
        }}>
          <BarcodeGlyph found={phase === 'found'}/>
        </div>
      </div>
    </div>
  );
}

function Corner({ pos }) {
  const css = { tl: { top: 0, left: 0 }, tr: { top: 0, right: 0 }, bl: { bottom: 0, left: 0 }, br: { bottom: 0, right: 0 } }[pos];
  const borders = {
    tl: { borderTop: '3px solid #a8dccb', borderLeft: '3px solid #a8dccb', borderTopLeftRadius: 14 },
    tr: { borderTop: '3px solid #a8dccb', borderRight: '3px solid #a8dccb', borderTopRightRadius: 14 },
    bl: { borderBottom: '3px solid #a8dccb', borderLeft: '3px solid #a8dccb', borderBottomLeftRadius: 14 },
    br: { borderBottom: '3px solid #a8dccb', borderRight: '3px solid #a8dccb', borderBottomRightRadius: 14 },
  }[pos];
  return <div style={{ position: 'absolute', width: 28, height: 28, ...css, ...borders }}/>;
}

function BarcodeGlyph({ found }) {
  const widths = [2,1,3,1,2,1,4,1,2,3,1,2,1,3,2,1,1,3,2,2,1,3,1,2,3,1,2,1,2,3];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
      {widths.map((w, i) => (
        <div key={i} style={{
          width: w, height: 56,
          background: found ? '#a8dccb' : '#eef4f3',
          opacity: i % 5 === 0 ? 0.5 : 1,
          borderRadius: 0.5,
        }}/>
      ))}
    </div>
  );
}

function PhotoFrame() {
  return (
    <div style={{
      position: 'absolute', top: '22%', left: 32, right: 32, bottom: '24%',
      border: '2px dashed rgba(168,220,203,0.6)',
      borderRadius: 18,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        textAlign: 'center', color: 'rgba(255,255,255,0.7)',
      }}>
        <Icon name="image" size={36} color="rgba(168,220,203,0.7)"/>
        <div style={{ fontSize: 12, marginTop: 8, letterSpacing: '0.04em' }}>Whole box · front label up</div>
      </div>
    </div>
  );
}

function FauxScene({ mode, phase }) {
  // Subtle suggestion of a counter / hand holding a box
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background:
        'radial-gradient(60% 80% at 50% 60%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.0) 70%),' +
        'radial-gradient(40% 30% at 50% 50%, rgba(168,220,203,0.06) 0%, rgba(0,0,0,0.0) 70%),' +
        'linear-gradient(180deg, #14241f 0%, #060d0b 100%)',
    }}>
      {/* fake red pill box suggestion */}
      <div style={{
        position: 'absolute',
        top: '38%', left: '20%', width: '60%', height: '20%',
        background: 'linear-gradient(180deg, #7a2a22 0%, #4a1812 100%)',
        opacity: 0.55,
        borderRadius: 6,
        transform: 'perspective(400px) rotateX(8deg)',
      }}/>
    </div>
  );
}

function FoundSheet({ go }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      background: 'var(--bg)',
      borderRadius: '24px 24px 0 0',
      padding: '14px 18px 28px',
      animation: 'sheetIn 0.32s cubic-bezier(0.2, 0.85, 0.3, 1)',
      color: 'var(--ink)',
    }}>
      <div className="sheet-handle"/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
        <Bottle preset="red" name="Tylenol" dose="500mg" width={52}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: -0.2 }}>Tylenol Extra Strength</div>
          <div style={{ fontSize: 13, color: 'var(--ink-mute)' }}>Acetaminophen · 500 mg · 100 caplets</div>
        </div>
        <div className="chip">Match</div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn ghost" style={{ flex: 1 }} onClick={() => go('home')}>Not this</button>
        <button className="btn" style={{ flex: 2 }} onClick={() => go('detail', 'tylenol')}>Add to cabinet</button>
      </div>
    </div>
  );
}

window.ScanScreen = ScanScreen;
