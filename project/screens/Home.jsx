// Home.jsx — the medicine cabinet shelf view (marquee screen)

function HomeScreen({ go, openDose }) {
  const meds = window.Med.MEDICINES;
  const shelves = [
    { label: 'Daily',          sub: 'Standing routine',     meds: meds.filter(m => m.shelf === 2) },
    { label: 'Allergy & Cold', sub: 'Seasonal',             meds: meds.filter(m => m.shelf === 1) },
    { label: 'Pain & Fever',   sub: 'As needed',            meds: meds.filter(m => m.shelf === 0) },
  ];

  // quick stats
  const dosesToday = 3;
  const lowStock = meds.filter(m => m.stock / m.fullStock < 0.2).length;
  const expiringSoon = meds.filter(m => m.expiringSoon).length;

  return (
    <div className="screen" style={{ background: 'var(--bg)' }}>
      <div className="app-statusbar" />

      {/* mirror header */}
      <div style={{
        margin: '8px 16px 12px',
        borderRadius: 22,
        padding: '18px 20px 22px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(170deg, #f0f6f4 0%, #c8d8d2 35%, #e2ece7 60%, #b6c8c1 100%)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.7) inset, 0 -1px 0 rgba(19,50,43,0.06) inset, 0 8px 24px rgba(19,50,43,0.08)',
        border: '0.5px solid rgba(255,255,255,0.6)',
      }}>
        {/* mirror reflection streak */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.45) 50%, transparent 62%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-soft)', fontWeight: 600 }}>
            Wednesday · May 27
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 32,
            lineHeight: 1.05,
            letterSpacing: -0.4,
            color: 'var(--ink)',
            marginTop: 6,
            marginBottom: 14,
          }}>
            Good morning,<br/><span style={{ fontStyle: 'italic' }}>Sam.</span>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <Stat n={dosesToday} label="doses today" />
            <Divider />
            <Stat n={lowStock} label="running low" tone={lowStock ? 'warn' : 'mute'} />
            <Divider />
            <Stat n={expiringSoon} label="expiring" tone={expiringSoon ? 'warn' : 'mute'} />
          </div>
        </div>
      </div>

      {/* shelves */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0 120px', scrollbarWidth: 'none' }}>
        {shelves.map((shelf, i) => (
          <Shelf key={shelf.label} shelf={shelf} go={go} openDose={openDose} />
        ))}

        {/* cabinet footer hint */}
        <div style={{
          textAlign: 'center',
          padding: '14px 24px',
          color: 'var(--ink-mute)',
          fontSize: 12,
          letterSpacing: '0.04em',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-soft)' }}>
            11 medicines · 2 shelves with room
          </div>
          <button
            onClick={() => go('add')}
            style={{
              marginTop: 10,
              background: 'transparent',
              border: '0.5px dashed rgba(19,50,43,0.25)',
              borderRadius: 14,
              padding: '10px 18px',
              color: 'var(--ink-soft)',
              fontSize: 13,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Icon name="plus" size={14}/>
            Add a medicine
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ n, label, tone }) {
  const color = tone === 'warn' ? 'var(--warn)' : tone === 'mute' ? 'var(--ink-mute)' : 'var(--ink)';
  return (
    <div style={{ flex: 1 }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1,
        color, fontWeight: 400,
      }}>{n}</div>
      <div style={{ fontSize: 10.5, color: 'var(--ink-soft)', letterSpacing: '0.04em', marginTop: 4 }}>{label}</div>
    </div>
  );
}
function Divider() {
  return <div style={{ width: 0.5, alignSelf: 'stretch', background: 'rgba(19,50,43,0.15)' }} />;
}

function Shelf({ shelf, go, openDose }) {
  const slotCount = 4;
  const slots = Array.from({ length: slotCount });

  return (
    <div style={{ position: 'relative', margin: '6px 0 0', paddingTop: 18 }}>
      {/* label */}
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        padding: '0 22px 8px', gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0, overflow: 'hidden' }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 19,
            color: 'var(--ink)', letterSpacing: -0.2, whiteSpace: 'nowrap',
          }}>{shelf.label}</span>
          <span style={{ fontSize: 11.5, color: 'var(--ink-mute)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{shelf.sub}</span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--ink-mute)', flexShrink: 0 }}>{shelf.meds.length}</span>
      </div>

      {/* bottles standing on the shelf */}
      <div style={{
        position: 'relative',
        height: 118,
        padding: '0 18px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
      }}>
        {slots.map((_, idx) => {
          const m = shelf.meds.find(med => med.slot === idx);
          if (!m) return <EmptySlot key={idx} go={go} />;
          return (
            <button
              key={m.id}
              onClick={() => go('detail', m.id)}
              style={{
                background: 'none', border: 0, padding: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                width: 64, position: 'relative',
              }}
            >
              <Bottle preset={m.preset} name={m.name} dose={`${m.dose}${m.doseUnit}`}
                      width={56} fillRatio={Math.max(0.2, m.stock / m.fullStock)}/>
              {/* alert badge */}
              {(m.lowStock || m.expiringSoon) && (
                <div style={{
                  position: 'absolute', top: -2, right: 2,
                  width: 14, height: 14, borderRadius: '50%',
                  background: m.lowStock ? 'var(--danger)' : 'var(--warn)',
                  border: '2px solid var(--bg)',
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* the wooden shelf */}
      <div style={{
        height: 12,
        margin: '0 6px',
        background: 'linear-gradient(180deg, #d8c194 0%, #b89863 60%, #8b6f3e 100%)',
        borderRadius: 2,
        boxShadow: '0 1px 0 rgba(255,255,255,0.4) inset, 0 6px 14px rgba(0,0,0,0.18), 0 1px 0 rgba(0,0,0,0.15)',
        position: 'relative',
      }}>
        {/* wood grain stripes */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 2,
          background: 'repeating-linear-gradient(90deg, transparent 0, transparent 12px, rgba(120,90,40,0.18) 13px, transparent 14px)',
          opacity: 0.6,
        }}/>
        {/* front edge highlight */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: 1,
          background: 'rgba(255,255,255,0.4)',
        }}/>
      </div>
      {/* shelf shadow on cabinet back */}
      <div style={{ height: 18, background: 'linear-gradient(180deg, rgba(19,50,43,0.10) 0%, transparent 100%)' }}/>
    </div>
  );
}

function EmptySlot({ go }) {
  return (
    <button onClick={() => go('add')} style={{
      width: 56, height: 108,
      background: 'none', border: '1px dashed rgba(19,50,43,0.18)',
      borderRadius: 8,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 4,
      color: 'rgba(19,50,43,0.35)', padding: 0,
    }}>
      <Icon name="plus" size={16}/>
      <span style={{ fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>empty</span>
    </button>
  );
}

window.HomeScreen = HomeScreen;
