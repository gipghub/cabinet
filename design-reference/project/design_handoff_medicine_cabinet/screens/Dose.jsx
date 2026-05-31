// Dose.jsx — bottom sheet to log a dose

function DoseSheet({ medicineId, onClose, onLog }) {
  const m = window.Med.MEDICINES.find(x => x.id === medicineId) || window.Med.MEDICINES[0];
  const [count, setCount] = React.useState(m.perDose);
  const [when, setWhen] = React.useState('now');
  const [symptoms, setSymptoms] = React.useState([]);
  const [stage, setStage] = React.useState('compose'); // compose | confirmed

  const toggleSymptom = (s) => {
    setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };
  const totalMg = count * m.dose;

  // safety check
  const todayMg = m.id === 'tylenol' ? 2500 : 0;
  const projected = todayMg + totalMg;
  const wouldExceed = projected > m.dailyMaxMg;

  return (
    <div className="sheet-backdrop sheet-backdrop-enter" onClick={onClose}>
      <div className="sheet sheet-enter" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle"/>

        {stage === 'compose' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <Bottle preset={m.preset} name={m.name} dose={`${m.dose}${m.doseUnit}`} width={44}/>
              <div style={{ flex: 1 }}>
                <h2 className="sheet-title">Take {m.name}</h2>
                <p className="sheet-sub" style={{ margin: 0 }}>{m.active} · {m.dose}{m.doseUnit}</p>
              </div>
              <button onClick={onClose} style={{
                width: 32, height: 32, borderRadius: 16, border: 0,
                background: 'rgba(19,50,43,0.08)', color: 'var(--ink-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><Icon name="close" size={16}/></button>
            </div>

            {/* count */}
            <div style={{
              background: 'var(--paper)',
              borderRadius: 18,
              padding: '20px 16px',
              marginBottom: 12,
              border: '0.5px solid var(--line)',
            }}>
              <div className="section-eyebrow" style={{ marginBottom: 12 }}>How many?</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
                <Stepper value={count} setValue={setCount} min={1} max={6}/>
              </div>
              <div style={{ textAlign: 'center', marginTop: 8, fontSize: 13, color: 'var(--ink-mute)' }}>
                = {totalMg} mg {m.active.toLowerCase()}
              </div>
            </div>

            {/* when */}
            <div style={{
              background: 'var(--paper)',
              borderRadius: 18,
              padding: '16px',
              marginBottom: 12,
              border: '0.5px solid var(--line)',
            }}>
              <div className="section-eyebrow" style={{ marginBottom: 10 }}>When?</div>
              <div className="segmented">
                {['now', '15 min ago', '1 hr ago', 'Earlier…'].map(w => (
                  <button key={w} className={when === w ? 'on' : ''} onClick={() => setWhen(w)}>{w}</button>
                ))}
              </div>
            </div>

            {/* why */}
            <div style={{
              background: 'var(--paper)',
              borderRadius: 18,
              padding: '16px',
              marginBottom: 16,
              border: '0.5px solid var(--line)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span className="section-eyebrow">Why? <span style={{ fontWeight: 400, textTransform: 'none' }}>(optional)</span></span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[['h','Headache'],['p','Pain'],['a','Allergies'],['c','Cold'],['st','Stomach'],['s','Sleep']].map(([k,label]) => (
                  <button key={k} onClick={() => toggleSymptom(k)}
                    style={{
                      padding: '7px 12px', borderRadius: 999,
                      border: '0.5px solid ' + (symptoms.includes(k) ? window.Med.SYMPTOM_META[k].color : 'var(--line)'),
                      background: symptoms.includes(k) ? window.Med.SYMPTOM_META[k].color + '22' : 'transparent',
                      color: symptoms.includes(k) ? window.Med.SYMPTOM_META[k].color : 'var(--ink-soft)',
                      fontSize: 12.5, fontWeight: 500,
                    }}>{label}</button>
                ))}
              </div>
            </div>

            {/* safety warning */}
            {wouldExceed && (
              <div style={{
                background: '#f3d8d4', color: '#7a261d',
                borderRadius: 14, padding: '12px 14px',
                marginBottom: 14, display: 'flex', gap: 10, alignItems: 'flex-start',
                fontSize: 13, lineHeight: 1.4,
              }}>
                <Icon name="shield" size={18}/>
                <div>
                  <b>Above daily max.</b> This would put you at {projected} mg today — over the {m.dailyMaxMg} mg limit.
                </div>
              </div>
            )}

            <button className="btn" onClick={() => { setStage('confirmed'); setTimeout(onLog, 1200); }}>
              <Icon name="check" size={18}/> Log {count} {m.form}{count>1?'s':''}
            </button>
          </>
        )}

        {stage === 'confirmed' && (
          <div style={{ padding: '30px 0 24px', textAlign: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--sage-fade)', color: 'var(--sage-deep)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 18px',
              animation: 'pulse 1s ease',
            }}>
              <Icon name="check" size={32} stroke={2.4}/>
            </div>
            <h2 className="sheet-title" style={{ textAlign: 'center', marginBottom: 4 }}>Logged.</h2>
            <p className="sheet-sub" style={{ textAlign: 'center' }}>
              {count} {m.form}{count>1?'s':''} · {totalMg} mg · {when}
            </p>
            {symptoms.length > 0 && (
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 8 }}>
                {symptoms.map(s => (
                  <span key={s} className="chip" style={{
                    background: window.Med.SYMPTOM_META[s].color + '22',
                    color: window.Med.SYMPTOM_META[s].color,
                  }}>{window.Med.SYMPTOM_META[s].label}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Stepper({ value, setValue, min = 1, max = 10 }) {
  return (
    <>
      <button onClick={() => setValue(Math.max(min, value - 1))}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'var(--bg)', border: '0.5px solid var(--line)',
                color: 'var(--ink)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
        <Icon name="minus" size={20}/>
      </button>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 64, lineHeight: 1,
        minWidth: 80, textAlign: 'center', color: 'var(--ink)',
        fontVariantNumeric: 'tabular-nums',
      }}>{value}</div>
      <button onClick={() => setValue(Math.min(max, value + 1))}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'var(--sage-deep)', border: 0,
                color: '#fff', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
        <Icon name="plus" size={20}/>
      </button>
    </>
  );
}

window.DoseSheet = DoseSheet;
