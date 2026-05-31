// Detail.jsx — single medicine view

function DetailScreen({ medicineId, go, openDose }) {
  const m = window.Med.MEDICINES.find(x => x.id === medicineId) || window.Med.MEDICINES[0];
  const stockPct = Math.round((m.stock / m.fullStock) * 100);
  const expiresDate = new Date(m.expires);
  const daysToExpire = Math.round((expiresDate - new Date()) / 86400000);
  const totalDoses28d = m.history.reduce((a,b)=>a+b, 0);
  const avgPerWeek = (totalDoses28d / 4).toFixed(1);

  // todays usage simulation
  const todayMg = m.id === 'tylenol' ? 2500 : 0;
  const safetyPct = todayMg / m.dailyMaxMg;

  return (
    <div className="screen" style={{ background: 'var(--bg)' }}>
      <div className="app-statusbar" />
      <div className="navbar">
        <button className="navbar-back" onClick={() => go('home')}>
          <Icon name="back" size={18}/>
        </button>
        <button className="navbar-action">
          <Icon name="edit" size={14}/> Edit
        </button>
      </div>

      <div className="app-scroll" style={{ padding: '0 16px 120px' }}>
        {/* hero */}
        <div style={{
          background: 'linear-gradient(170deg, #f7f1e0 0%, #e9dcc0 100%)',
          borderRadius: 22,
          padding: '22px 18px 18px',
          display: 'flex',
          gap: 16,
          alignItems: 'flex-end',
          border: '0.5px solid rgba(178, 151, 100, 0.3)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset',
          marginBottom: 16,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-mute)', fontWeight: 600 }}>
              {m.active}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 34, letterSpacing: -0.6, lineHeight: 1.05,
              marginTop: 6, marginBottom: 4,
            }}>{m.name}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 16, color: 'var(--ink-soft)' }}>
              {m.sub} · {m.dose}{m.doseUnit}
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
              <span className="chip">{m.form}</span>
              <span className="chip muted">{m.stock} left</span>
              {m.expiringSoon && <span className="chip warn">expires {daysToExpire}d</span>}
              {m.lowStock && <span className="chip danger">low stock</span>}
            </div>
          </div>
          <Bottle preset={m.preset} name={m.name} sub={m.sub} dose={`${m.dose}${m.doseUnit}`}
                  width={86} variant="hero" fillRatio={Math.max(0.2, m.stock / m.fullStock)}/>
        </div>

        {/* today */}
        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <h3 className="section-title" style={{ margin: 0 }}>Today</h3>
            <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>
              {todayMg > 0 ? `${todayMg} mg / ${m.dailyMaxMg} mg max` : 'No doses yet'}
            </span>
          </div>
          {todayMg > 0 ? (
            <SafetyMeter pct={safetyPct} />
          ) : (
            <div style={{
              padding: '20px 12px', textAlign: 'center', color: 'var(--ink-mute)',
              border: '0.5px dashed var(--line)', borderRadius: 12, fontSize: 13,
            }}>
              Tap below when you take a dose.
            </div>
          )}
          <button className="btn" onClick={() => openDose(m.id)} style={{ marginTop: 14 }}>
            <Icon name="pill" size={18}/> Log a dose
          </button>
        </div>

        {/* usage */}
        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <h3 className="section-title" style={{ margin: 0 }}>Usage · last 28 days</h3>
            <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{avgPerWeek}/wk avg</span>
          </div>
          <UsageBars history={m.history}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10.5, color: 'var(--ink-mute)' }}>
            <span>4 weeks ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* meta */}
        <div className="card" style={{ marginBottom: 14, padding: 0 }}>
          <Row icon="box" label="Stock" value={
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 80, height: 6, borderRadius: 3, background: 'var(--paper-2)', overflow: 'hidden' }}>
                <div style={{ width: `${stockPct}%`, height: '100%', background: stockPct < 20 ? 'var(--danger)' : stockPct < 40 ? 'var(--warn)' : 'var(--sage)' }}/>
              </div>
              <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>{m.stock}/{m.fullStock}</span>
            </div>
          }/>
          <Row icon="calendar" label="Expires"
               value={<span style={{ fontVariantNumeric: 'tabular-nums', color: daysToExpire < 90 ? 'var(--warn)' : 'var(--ink)' }}>
                  {expiresDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>}/>
          <Row icon="pill" label="Per dose" value={`${m.perDose} ${m.form}${m.perDose>1?'s':''}`}/>
          <Row icon="shield" label="Daily max" value={`${m.dailyMax} ${m.form}s · ${m.dailyMaxMg} mg`} last/>
        </div>

        {/* interactions */}
        {m.interactions.length > 0 && (
          <div className="card" style={{ marginBottom: 14 }}>
            <h3 className="section-title" style={{ margin: '0 0 4px' }}>Watch out</h3>
            <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginBottom: 12 }}>Known interactions</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {m.interactions.map(i => (
                <div key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 10px', borderRadius: 10,
                  background: '#f3d8d4', color: '#7a261d', fontSize: 12, fontWeight: 500,
                }}>
                  <Icon name="link" size={12}/> {i}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* notes */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="section-eyebrow">Notes</span>
            <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>Tap to edit</span>
          </div>
          <div style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            {m.notes}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, value, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', padding: '14px 16px',
      borderBottom: last ? 'none' : '0.5px solid var(--line)',
      gap: 12,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: 'var(--sage-fade)', color: 'var(--sage-deep)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={15}/>
      </div>
      <div style={{ flex: 1, fontSize: 14, color: 'var(--ink-soft)' }}>{label}</div>
      <div style={{ fontSize: 14, color: 'var(--ink)' }}>{value}</div>
    </div>
  );
}

function SafetyMeter({ pct }) {
  const danger = pct >= 0.85;
  const warn = pct >= 0.6;
  const color = danger ? 'var(--danger)' : warn ? 'var(--warn)' : 'var(--good)';
  return (
    <div>
      <div style={{ height: 10, borderRadius: 5, background: 'var(--paper-2)', overflow: 'hidden', position: 'relative' }}>
        <div style={{ height: '100%', width: `${Math.min(100, pct*100)}%`, background: color, borderRadius: 5, transition: 'width 0.6s' }}/>
        <div style={{ position: 'absolute', top: -2, bottom: -2, left: 'calc(85% - 1px)', width: 2, background: 'rgba(19,50,43,0.4)' }}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--ink-mute)' }}>
        <span>0 mg</span>
        <span style={{ color }}>{(pct*100).toFixed(0)}% of safe limit</span>
        <span>limit</span>
      </div>
    </div>
  );
}

function UsageBars({ history }) {
  const max = Math.max(2, ...history);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 80 }}>
      {history.map((v, i) => (
        <div key={i} style={{
          flex: 1,
          height: `${(v/max)*100}%`,
          minHeight: v === 0 ? 2 : 4,
          background: v === 0 ? 'var(--paper-2)' : v > max*0.7 ? 'var(--sage-deep)' : 'var(--sage)',
          borderRadius: 2,
          opacity: v === 0 ? 0.5 : 1,
        }}/>
      ))}
    </div>
  );
}

window.DetailScreen = DetailScreen;
