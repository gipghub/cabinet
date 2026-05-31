import { Icon } from './Icon';

interface TabProps {
  icon: string;
  label: string;
  active?: boolean;
  onClick: () => void;
  badge?: number;
}

function Tab({ icon, label, active, onClick, badge }: TabProps) {
  return (
    <button className={'tab' + (active ? ' active' : '')} onClick={onClick} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <Icon name={icon} size={22} stroke={active ? 2 : 1.6} />
        {badge ? (
          <div style={{ position: 'absolute', top: -4, right: -8, minWidth: 16, height: 16, borderRadius: 8, background: 'var(--danger)', color: '#fff', fontSize: 9.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', border: '1.5px solid var(--bg)' }}>{badge}</div>
        ) : null}
      </div>
      <span>{label}</span>
      <div className="tab-dot" />
    </button>
  );
}

export interface TabBarProps {
  activeTab: 'home' | 'trends' | 'alerts' | null;
  alertCount: number;
  onScan: () => void;
  onHome: () => void;
  onTrends: () => void;
  onAlerts: () => void;
  onShare: () => void;
}

export function TabBar({ activeTab, alertCount, onScan, onHome, onTrends, onAlerts, onShare }: TabBarProps) {
  return (
    <div className="tabbar">
      <button className="fab-scan" onClick={onScan} aria-label="Scan a medicine">
        <Icon name="scan" size={26} stroke={1.8} />
      </button>
      <Tab icon="home" label="Cabinet" active={activeTab === 'home'} onClick={onHome} />
      <Tab icon="trend" label="Trends" active={activeTab === 'trends'} onClick={onTrends} />
      <div style={{ flex: 1 }} />
      <Tab icon="bell" label="Alerts" active={activeTab === 'alerts'} onClick={onAlerts} badge={alertCount || undefined} />
      <Tab icon="share" label="Share" onClick={onShare} />
    </div>
  );
}
