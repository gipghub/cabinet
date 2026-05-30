// Add.jsx — manual entry form

function AddScreen({ go }) {
  const [name, setName] = React.useState('');
  const [active, setActive] = React.useState('');
  const [strength, setStrength] = React.useState('');
  const [unit, setUnit] = React.useState('mg');
  const [form, setForm] = React.useState('tablet');
  const [stock, setStock] = React.useState('');
  const [expires, setExpires] = React.useState('');
  const [shelf, setShelf] = React.useState('Daily');

  const valid = name.length > 1;

  return (
    <div className="screen" style={{ background: 'var(--bg)' }}>
      <div className="app-statusbar" />
      <div className="navbar">
        <button className="navbar-back" onClick={() => go('home')}>
          <Icon name="back" size={18}/>
        </button>
        <button className="navbar-action" onClick={() => go('scan')}>
          <Icon name="scan" size={14}/> Scan instead
        </button>
      </div>

      <div className="app-scroll" style={{ padding: '0 16px 120px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 32, letterSpacing: -0.5,
          margin: '0 0 6px', fontWeight: 400,
        }}>Add a medicine</h1>
        <p style={{ color: 'var(--ink-mute)', fontSize: 14, margin: '0 0 22px' }}>
          We&rsquo;ll keep an eye on stock, expiry, and daily limits for you.
        </p>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 14 }}>
          <Field label="Brand / common name" placeholder="e.g. Tylenol"
                 value={name} onChange={setName} autoFocus/>
          <Field label="Active ingredient" placeholder="e.g. Acetaminophen"
                 value={active} onChange={setActive}/>
          <div className="field-row">
            <Field label="Strength" placeholder="500" value={strength} onChange={setStrength} type="number" wide={false}/>
            <div className="field" style={{ flex: '0 0 90px' }}>
              <div className="field-label">Unit</div>
              <select className="field-input" value={unit} onChange={e=>setUnit(e.target.value)}>
                <option>mg</option><option>mcg</option><option>IU</option><option>ml</option>
              </select>
            </div>
          </div>
          <div className="field">
            <div className="field-label">Form</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['tablet', 'caplet', 'softgel', 'chewable', 'liquid', 'powder'].map(f => (
                <button key={f}
                  onClick={() => setForm(f)}
                  style={{
                    padding: '7px 12px', borderRadius: 999,
                    border: '0.5px solid ' + (form === f ? 'var(--sage)' : 'var(--line)'),
                    background: form === f ? 'var(--sage-fade)' : 'transparent',
                    color: form === f ? 'var(--sage-deep)' : 'var(--ink-soft)',
                    fontSize: 12.5, fontWeight: 500,
                  }}>{f}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 14 }}>
          <div className="field-row">
            <Field label="Stock / count" placeholder="48" value={stock} onChange={setStock} type="number"/>
            <Field label="Expires" placeholder="2026-08" value={expires} onChange={setExpires}/>
          </div>
          <div className="field">
            <div className="field-label">Shelf</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['Daily', 'Allergy & Cold', 'Pain & Fever'].map(s => (
                <button key={s}
                  onClick={() => setShelf(s)}
                  style={{
                    flex: 1, padding: '10px 6px',
                    borderRadius: 12,
                    border: '0.5px solid ' + (shelf === s ? 'var(--sage)' : 'var(--line)'),
                    background: shelf === s ? 'var(--sage-fade)' : 'var(--paper)',
                    color: shelf === s ? 'var(--sage-deep)' : 'var(--ink-soft)',
                    fontSize: 12, fontWeight: 500,
                  }}>{s}</button>
              ))}
            </div>
          </div>
        </div>

        {/* preview bottle */}
        {name && (
          <div className="card" style={{
            display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14,
            background: 'linear-gradient(170deg, #f7f1e0 0%, #e9dcc0 100%)',
          }}>
            <Bottle preset="amber" name={name || 'Name'} dose={strength ? `${strength}${unit}` : '—'} width={56}/>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>Preview</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: -0.3 }}>{name}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{active || 'active ingredient'} · {strength || '—'}{unit}</div>
            </div>
          </div>
        )}

        <button className="btn" disabled={!valid} onClick={() => go('home')} style={{
          opacity: valid ? 1 : 0.4,
        }}>
          <Icon name="check" size={18}/> Add to cabinet
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', autoFocus }) {
  return (
    <div className="field" style={{ flex: 1 }}>
      <div className="field-label">{label}</div>
      <input className="field-input" type={type} value={value}
             autoFocus={autoFocus}
             onChange={e => onChange(e.target.value)}
             placeholder={placeholder}/>
    </div>
  );
}

window.AddScreen = AddScreen;
