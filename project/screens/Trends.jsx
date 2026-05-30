// Trends.jsx — analytics

function TrendsScreen({ go }) {
  const meds = window.Med.MEDICINES;
  const log = window.Med.SYMPTOM_LOG;
  const meta = window.Med.SYMPTOM_META;

  // Top-used by total
  const usage = meds
    .map(m => ({ m, total: m.history.reduce((a,b)=>a+b, 0) }))
    .sort((a,b) => b.total - a.total)
    .slice(0, 6);
  const maxTotal = Math.max(...usage.map(u => u.total));

  // Acetaminophen safety this week (mock)
  const tyl = meds.find(m => m.id === 'tylenol');
  const weekUsage = [1500, 1000, 0, 2000, 500, 1500, 2500]; // mg per day this week
  const safetyMax = tyl.dailyMaxMg;

  // Predicted to run out (days)
  const predictions = meds
    .map(m => {
      const avgPerDay = m.history.reduce((a,b)=>a+b,0) / 28;
      if (avgPerDay <= 0) return null;
      const daysLeft = Math.round(m.stock / avgPerDay);
      return { m, daysLeft };
    })
    .filter(p => p && p.daysLeft < 60)
    .sort((a,b) => a.daysLeft - b.daysLeft)
    .slice(0, 4);

  return (
    <div className="screen" style={{ background: 'var(--bg)' }}>
      <div className="app-statusbar" />
      <div className="navbar">
        <div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 32, letterSpacing: -0.5,
            color: 'var(--ink)', fontWeight: 400, lineHeight: 1,
          }}>Trends</div>
          <div className="nav-sub">Last 28 days</div>
        </div>
        <button className="navbar-action">
          <Icon name="calendar" size={14}/> 28d
        </button>
      </div>

      <div className="app-scroll" style={{ padding: '0 16px 120px' }}>
        {/* Daily-max safety */}
        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h3 className="section-title" style={{ margin: 0 }}>Acetaminophen safety</h3>
            <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>this week</span>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginBottom: 14 }}>
            Daily max <b>{safetyMax} mg</b>. You crossed 80% once.
          </div>
          <SafetyWeek week={weekUsage} max={safetyMax}/>
        </div>

        {/* Usage frequency */}
        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h3 className="section-title" style={{ margin: 0 }}>Most-used</h3>
            <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>doses</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            {usage.map(({m, total}) => (
              <button key={m.id} onClick={() => go('detail', m.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'none', border: 0, padding: 0, textAlign: 'left',
              }}>
                <div style={{ width: 70, fontSize: 13, color: 'var(--ink)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{m.name}</div>
                <div style={{ flex: 1, height: 18, background: 'var(--paper-2)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${(total/maxTotal)*100}%`,
                    height: '100%',
                    background: window.Med.presets[m.preset].body,
                    borderRadius: 4, transition: 'width 0.6s',
                  }}/>
                </div>
                <div style={{ width: 26, textAlign: 'right', fontSize: 13, color: 'var(--ink-soft)', fontVariantNumeric: 'tabular-nums' }}>{total}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Symptom heatmap */}
        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h3 className="section-title" style={{ margin: 0 }}>Symptom patterns</h3>
            <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>4 weeks</span>
          </div>
          <SymptomGrid log={log}/>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
            {Object.entries(meta).map(([k,v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--ink-soft)' }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: v.color }}/>
                {v.label}
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 14, padding: '10px 12px',
            background: 'var(--sage-fade)', borderRadius: 12,
            fontSize: 12.5, color: 'var(--sage-deep)', lineHeight: 1.4,
          }}>
            <Icon name="spark" size={14}/> <b>Pattern:</b> Allergy symptoms cluster around weekends — yard work?
          </div>
        </div>

        {/* Running low */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h3 className="section-title" style={{ margin: 0 }}>Stock predictions</h3>
            <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>at current pace</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
            {predictions.map(({m, daysLeft}) => (
              <button key={m.id} onClick={() => go('detail', m.id)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'none', border: 0, padding: '10px 0',
                borderBottom: '0.5px solid var(--line)', textAlign: 'left',
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: window.Med.presets[m.preset].body,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: window.Med.presets[m.preset].label,
                  fontFamily: 'var(--font-display)', fontSize: 14,
                  flexShrink: 0,
                }}>{m.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: 'var(--ink)' }}>{m.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-mute)' }}>{m.stock} of {m.fullStock} left</div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 22,
                  color: daysLeft < 7 ? 'var(--danger)' : daysLeft < 21 ? 'var(--warn)' : 'var(--ink)',
                  fontVariantNumeric: 'tabular-nums',
                }}>{daysLeft}<span style={{ fontSize: 11, color: 'var(--ink-mute)', marginLeft: 3 }}>d</span></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SafetyWeek({ week, max }) {
  const days = ['M','T','W','T','F','S','S'];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 110 }}>
      {week.map((v, i) => {
        const pct = v / max;
        const isToday = i === 6;
        const danger = pct >= 0.85;
        const warn = pct >= 0.6;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ position: 'relative', width: '100%', height: 86 }}>
              <div style={{ position: 'absolute', inset: 0, background: 'var(--paper-2)', borderRadius: 6 }}/>
              {/* limit line */}
              <div style={{ position: 'absolute', top: '15%', left: -4, right: -4, height: 1, background: 'rgba(185,72,56,0.4)', borderRadius: 1 }}/>
              {v > 0 && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: `${Math.min(100, pct*100)}%`,
                  background: danger ? 'var(--danger)' : warn ? 'var(--warn)' : 'var(--sage)',
                  borderRadius: 6,
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                  paddingTop: 4,
                }}>
                  <span style={{ fontSize: 9, color: '#fff', fontWeight: 600, opacity: pct > 0.18 ? 1 : 0 }}>
                    {v >= 1000 ? `${v/1000}g` : v}
                  </span>
                </div>
              )}
            </div>
            <div style={{
              fontSize: 11, color: isToday ? 'var(--ink)' : 'var(--ink-mute)',
              fontWeight: isToday ? 600 : 400,
            }}>{days[i]}</div>
          </div>
        );
      })}
    </div>
  );
}

function SymptomGrid({ log }) {
  // 4 weeks × 7 days
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 12 }}>
      {[0,1,2,3].map(w => (
        <div key={w} style={{ display: 'flex', gap: 4 }}>
          {[0,1,2,3,4,5,6].map(d => {
            const idx = w*7 + d;
            const day = log[idx] || [];
            return (
              <div key={d} style={{
                flex: 1, aspectRatio: '1',
                background: 'var(--paper-2)',
                borderRadius: 6, position: 'relative',
                overflow: 'hidden',
                display: 'flex', flexWrap: 'wrap',
              }}>
                {day.map((sym, i) => (
                  <div key={i} style={{
                    flex: '1 1 50%',
                    background: window.Med.SYMPTOM_META[sym].color,
                    minHeight: '50%',
                  }}/>
                ))}
              </div>
            );
          })}
        </div>
      ))}
      <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
          <div key={d} style={{ flex: 1, fontSize: 9, color: 'var(--ink-mute)', textAlign: 'center' }}>{d[0]}</div>
        ))}
      </div>
    </div>
  );
}

window.TrendsScreen = TrendsScreen;
