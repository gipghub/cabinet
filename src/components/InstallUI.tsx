import { useEffect, useState, type ReactNode } from 'react';
import { detectPWA, hasInstallPrompt, promptInstall } from '../lib/pwa';

const pwa = detectPWA();

function ShareGlyph({ size = 20, color = '#0a84ff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3v12M12 3L8.5 6.5M12 3l3.5 3.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 10H5.5A1.5 1.5 0 004 11.5V19a1.5 1.5 0 001.5 1.5h13A1.5 1.5 0 0020 19v-7.5A1.5 1.5 0 0018.5 10H17" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PlusBox({ size = 20, color = '#13322b' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke={color} strokeWidth="1.7" />
      <path d="M12 8.5v7M8.5 12h7" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function Step({ n, children, last }: { n: string; children: ReactNode; last?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 14, paddingBottom: last ? 0 : 16 }}>
      <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: 'var(--sage-fade)', color: 'var(--sage-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{n}</div>
      <div style={{ flex: 1, fontSize: 15, lineHeight: 1.5, color: 'var(--ink-soft)', paddingTop: 3 }}>{children}</div>
    </div>
  );
}

function InstallSheet({ mode, onClose }: { mode: 'ios' | 'generic'; onClose: () => void }) {
  const ios = mode === 'ios';
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(19,50,43,0.42)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', animation: 'fadeIn .2s ease' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 460, background: 'var(--bg)', borderRadius: '28px 28px 0 0', padding: '16px 22px calc(28px + env(safe-area-inset-bottom))', boxShadow: '0 -12px 50px rgba(19,50,43,0.25)' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(19,50,43,0.18)', margin: '0 auto 18px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <img src="icon-192.png" alt="" width={52} height={52} style={{ borderRadius: 13, boxShadow: '0 4px 14px rgba(19,50,43,0.22)' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, lineHeight: 1.05, color: 'var(--ink)' }}>Install Cabinet</div>
            <div style={{ fontSize: 13, color: 'var(--ink-mute)', marginTop: 2 }}>
              {ios ? 'Two taps in Safari — runs full-screen & offline.' : 'Open on your phone to install — full-screen & offline.'}
            </div>
          </div>
        </div>

        {ios ? (
          <>
            <Step n="1">Tap the <strong>Share</strong> button <span style={{ display: 'inline-flex', verticalAlign: 'middle', margin: '0 4px', transform: 'translateY(-1px)' }}><ShareGlyph /></span> in Safari's toolbar.</Step>
            <Step n="2">Scroll down and choose <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, verticalAlign: 'middle', margin: '0 5px', padding: '3px 9px', borderRadius: 9, background: 'var(--paper)', border: '0.5px solid var(--line)' }}><strong style={{ fontWeight: 600 }}>Add to Home Screen</strong><PlusBox size={16} /></span></Step>
            <Step n="3" last>Tap <strong>Add</strong> — Cabinet lands on your Home Screen like any app.</Step>
          </>
        ) : (
          <>
            <Step n="1">On <strong>Android</strong>, open this page in Chrome and tap the <strong> ⋮ </strong> menu → <strong>Install app</strong> (or "Add to Home screen").</Step>
            <Step n="2">On <strong>iPhone / iPad</strong>, open it in Safari, tap <span style={{ display: 'inline-flex', verticalAlign: 'middle', margin: '0 4px', transform: 'translateY(-1px)' }}><ShareGlyph /></span> then <strong>Add to Home Screen</strong>.</Step>
            <Step n="3" last>On <strong>desktop Chrome / Edge</strong>, use the install <span style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle', margin: '0 5px' }}><PlusBox size={16} /></span> icon in the address bar.</Step>
          </>
        )}

        <button onClick={onClose} style={{ marginTop: 20, width: '100%', height: 50, borderRadius: 15, border: 0, background: 'var(--sage-deep)', color: 'var(--paper)', fontSize: 15, fontWeight: 500 }}>Got it</button>
      </div>
    </div>
  );
}

const DISMISS_KEY = 'cabinet-install-dismissed';

export function InstallUI() {
  const [installable, setInstallable] = useState(hasInstallPrompt());
  const [sheet, setSheet] = useState<'ios' | 'generic' | null>(null);
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem(DISMISS_KEY) === '1'; } catch { return false; }
  });
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onInstallable = () => setInstallable(true);
    const onInstalled = () => { setInstalled(true); setInstallable(false); };
    window.addEventListener('pwa-installable', onInstallable);
    window.addEventListener('pwa-installed', onInstalled);
    return () => {
      window.removeEventListener('pwa-installable', onInstallable);
      window.removeEventListener('pwa-installed', onInstalled);
    };
  }, []);

  if (pwa.isStandalone || installed) return null;

  const close = () => {
    setDismissed(true);
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
  };

  const doInstall = async () => {
    const result = await promptInstall();
    if (result === 'unavailable') {
      setSheet(pwa.isIOS ? 'ios' : 'generic');
    } else {
      setInstallable(false);
    }
  };

  const ctaLabel = installable ? 'Install' : pwa.isIOS ? 'How' : 'Install';

  return (
    <>
      {!dismissed && (
        <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 9000, display: 'flex', justifyContent: 'center', padding: '0 14px calc(14px + env(safe-area-inset-bottom))', pointerEvents: 'none' }}>
          <div style={{ pointerEvents: 'auto', width: '100%', maxWidth: 440, display: 'flex', alignItems: 'center', gap: 13, background: 'var(--paper)', border: '0.5px solid var(--line)', borderRadius: 20, padding: '11px 12px 11px 14px', boxShadow: '0 12px 40px rgba(19,50,43,0.20), 0 2px 8px rgba(19,50,43,0.08)' }}>
            <img src="icon-192.png" alt="" width={44} height={44} style={{ borderRadius: 11, flexShrink: 0, boxShadow: '0 3px 10px rgba(19,50,43,0.18)' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, lineHeight: 1.1, color: 'var(--ink)' }}>Install Cabinet</div>
              <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 2, lineHeight: 1.3 }}>Full-screen · works offline · no app store</div>
            </div>
            <button onClick={doInstall} style={{ flexShrink: 0, height: 40, padding: '0 18px', borderRadius: 13, border: 0, background: 'var(--sage-deep)', color: 'var(--paper)', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}>{ctaLabel}</button>
            <button onClick={close} aria-label="Dismiss" style={{ flexShrink: 0, width: 30, height: 40, border: 0, background: 'none', color: 'var(--ink-mute)', fontSize: 20, lineHeight: 1 }}>×</button>
          </div>
        </div>
      )}
      {sheet && <InstallSheet mode={sheet} onClose={() => setSheet(null)} />}
    </>
  );
}
