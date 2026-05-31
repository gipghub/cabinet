// Share.jsx — modal sheet for sharing the PWA via email

function ShareSheet({ onClose }) {
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [note, setNote] = React.useState('Tracks our meds — thought you might like it.');

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const send = () => {
    if (!valid) return;
    setSent(true);
    setTimeout(onClose, 1700);
  };

  return (
    <div className="sheet-backdrop sheet-backdrop-enter" onClick={onClose}>
      <div className="sheet sheet-enter" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle"/>

        {!sent && (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <h2 className="sheet-title">Share the cabinet</h2>
                <p className="sheet-sub" style={{ margin: '4px 0 0' }}>Send an install link by email — works on iOS &amp; Android.</p>
              </div>
              <button onClick={onClose} style={{
                width: 32, height: 32, borderRadius: 16, border: 0,
                background: 'rgba(19,50,43,0.08)', color: 'var(--ink-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}><Icon name="close" size={16}/></button>
            </div>

            {/* preview card */}
            <div style={{
              background: 'linear-gradient(170deg, #f7f1e0 0%, #e9dcc0 100%)',
              borderRadius: 18,
              padding: '16px 18px',
              marginBottom: 16,
              border: '0.5px solid rgba(178, 151, 100, 0.3)',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 13,
                background: 'var(--sage-deep)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 6px 14px rgba(19,50,43,0.25)',
              }}>
                <Icon name="flask" size={26} color="var(--paper)"/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, lineHeight: 1.1, letterSpacing: -0.2 }}>
                  Cabinet
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 2 }}>
                  cabinet.app/i/sw-4e2k
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  <span className="chip muted" style={{ fontSize: 10 }}>iOS</span>
                  <span className="chip muted" style={{ fontSize: 10 }}>Android</span>
                  <span className="chip muted" style={{ fontSize: 10 }}>PWA</span>
                </div>
              </div>
            </div>

            <div className="field" style={{ marginBottom: 12 }}>
              <div className="field-label">Send to</div>
              <input className="field-input" type="email" autoFocus
                     placeholder="friend@example.com"
                     value={email} onChange={e => setEmail(e.target.value)}/>
            </div>

            <div className="field" style={{ marginBottom: 16 }}>
              <div className="field-label">Note <span style={{ fontWeight: 400, textTransform: 'none', opacity: 0.6 }}>(optional)</span></div>
              <textarea className="field-input"
                value={note} onChange={e => setNote(e.target.value)}
                rows="2"
                style={{ height: 'auto', padding: 12, fontFamily: 'inherit', resize: 'none', lineHeight: 1.4 }}/>
            </div>

            <button className="btn" disabled={!valid} onClick={send}
                    style={{ opacity: valid ? 1 : 0.4, marginBottom: 8 }}>
              <Icon name="send" size={16}/> Send install link
            </button>

            <div style={{
              display: 'flex', gap: 8, marginTop: 8,
            }}>
              <button className="btn ghost" style={{ flex: 1, height: 40, fontSize: 13 }}>
                <Icon name="link" size={14}/> Copy link
              </button>
              <button className="btn ghost" style={{ flex: 1, height: 40, fontSize: 13 }}>
                <Icon name="qr" size={14}/> Show QR
              </button>
            </div>
          </>
        )}

        {sent && (
          <div style={{ padding: '30px 0 24px', textAlign: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--sage-fade)', color: 'var(--sage-deep)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 18px',
              animation: 'pulse 1s ease',
            }}>
              <Icon name="mail" size={28} stroke={2}/>
            </div>
            <h2 className="sheet-title" style={{ textAlign: 'center', marginBottom: 4 }}>Sent.</h2>
            <p className="sheet-sub" style={{ textAlign: 'center' }}>
              Invite on its way to <b style={{ color: 'var(--ink)' }}>{email}</b>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

window.ShareSheet = ShareSheet;
