// Alerts.jsx — inbox of alerts

function AlertsScreen({ go }) {
  const [dismissed, setDismissed] = React.useState(new Set());
  const allAlerts = window.Med.ALERTS;
  const alerts = allAlerts.filter(a => !dismissed.has(a.id));

  const grouped = {
    'Action needed': alerts.filter(a => a.severity === 'danger'),
    'Heads up':      alerts.filter(a => a.severity === 'warn'),
    'Reminders':     alerts.filter(a => a.severity === 'info'),
  };

  return (
    <div className="screen" style={{ background: 'var(--bg)' }}>
      <div className="app-statusbar" />
      <div className="navbar">
        <div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 32, letterSpacing: -0.5,
            color: 'var(--ink)', fontWeight: 400, lineHeight: 1,
          }}>Alerts</div>
          <div className="nav-sub">{alerts.length} active</div>
        </div>
        <button className="navbar-action">
          <Icon name="check" size={14}/> Clear all
        </button>
      </div>

      <div className="app-scroll" style={{ padding: '0 16px 120px' }}>
        {Object.entries(grouped).map(([label, list]) => (
          list.length > 0 && (
            <div key={label} style={{ marginBottom: 18 }}>
              <div className="section-eyebrow" style={{ padding: '4px 4px 10px' }}>{label}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {list.map(a => (
                  <AlertCard key={a.id} alert={a}
                             onDismiss={() => setDismissed(prev => new Set([...prev, a.id]))}
                             go={go}/>
                ))}
              </div>
            </div>
          )
        ))}
        {alerts.length === 0 && <EmptyAlerts/>}
      </div>
    </div>
  );
}

function AlertCard({ alert, onDismiss, go }) {
  const colors = {
    danger: { bg: '#fbe6e1', fg: '#7a261d', dot: '#b94838' },
    warn:   { bg: '#f5e4d2', fg: '#7a4d1d', dot: '#c97a3a' },
    info:   { bg: 'var(--paper)', fg: 'var(--ink-soft)', dot: 'var(--sage)' },
  }[alert.severity];

  const med = window.Med.MEDICINES.find(m => m.id === alert.medicineId);

  return (
    <div style={{
      background: colors.bg,
      borderRadius: 16,
      padding: '14px 14px 12px',
      border: alert.severity === 'info' ? '0.5px solid var(--line)' : '0.5px solid rgba(0,0,0,0.04)',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 11,
          background: 'rgba(255,255,255,0.6)', color: colors.dot,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon name={alert.icon} size={18}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: colors.fg, letterSpacing: -0.1 }}>{alert.title}</div>
            <div style={{ fontSize: 10.5, color: colors.fg, opacity: 0.6, flexShrink: 0 }}>{alert.when}</div>
          </div>
          <div style={{ fontSize: 12.5, color: colors.fg, opacity: 0.85, lineHeight: 1.4, marginTop: 4 }}>
            {alert.detail}
          </div>

          {/* actions */}
          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            {alert.type === 'safety' && med && (
              <ActionButton onClick={() => go('detail', med.id)} primary>View dose log</ActionButton>
            )}
            {alert.type === 'interaction' && (
              <ActionButton primary>Why this matters</ActionButton>
            )}
            {alert.type === 'refill' && (
              <ActionButton primary>Add to shopping</ActionButton>
            )}
            {alert.type === 'expiry' && med && (
              <ActionButton primary onClick={() => go('detail', med.id)}>Mark to replace</ActionButton>
            )}
            {alert.type === 'schedule' && med && (
              <ActionButton primary onClick={() => go('detail', med.id)}>Take now</ActionButton>
            )}
            <ActionButton onClick={onDismiss}>Dismiss</ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ children, onClick, primary }) {
  return (
    <button onClick={onClick} style={{
      background: primary ? 'rgba(19,50,43,0.85)' : 'transparent',
      color: primary ? 'var(--paper)' : 'var(--ink-soft)',
      border: primary ? 0 : '0.5px solid rgba(0,0,0,0.15)',
      padding: '7px 12px',
      borderRadius: 999,
      fontSize: 12, fontWeight: 500,
    }}>{children}</button>
  );
}

function EmptyAlerts() {
  return (
    <div style={{
      textAlign: 'center', padding: '60px 30px',
      color: 'var(--ink-mute)',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: 'var(--sage-fade)', color: 'var(--sage-deep)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 14,
      }}><Icon name="check" size={28}/></div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>All clear.</div>
      <div style={{ fontSize: 13, marginTop: 6 }}>No alerts. We&rsquo;ll buzz if something changes.</div>
    </div>
  );
}

window.AlertsScreen = AlertsScreen;
