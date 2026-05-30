// pwa.jsx — install flow: Android one-tap prompt + iOS "Add to Home Screen" guide.
// Exposes <InstallUI/> (renders the banner + iOS sheet) and helpers on window.

const PWA = (() => {
  const ua = navigator.userAgent || '';
  const isIOS =
    /iphone|ipad|ipod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/i.test(ua);
  // A genuinely-installed PWA runs as a top-level window. The design-tool
  // preview runs inside an iframe (and reports display-mode: standalone),
  // so treat "embedded" as NOT installed → show the framed preview + banner.
  let embedded = false;
  try { embedded = window.self !== window.top; } catch (e) { embedded = true; }
  const displayStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.navigator.standalone === true;
  const isStandalone = displayStandalone && !embedded;
  return { isIOS, isAndroid, isStandalone, embedded };
})();
window.PWA = PWA;

// Capture the Android/Chrome install prompt as early as possible.
window.__deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.__deferredPrompt = e;
  window.dispatchEvent(new Event('pwa-installable'));
});
window.addEventListener('appinstalled', () => {
  window.__deferredPrompt = null;
  window.dispatchEvent(new Event('pwa-installed'));
});

// ── Small inline marks ───────────────────────────────────────
function ShareGlyph({ size = 20, color = '#0a84ff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3v12M12 3L8.5 6.5M12 3l3.5 3.5" stroke={color} strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 10H5.5A1.5 1.5 0 004 11.5V19a1.5 1.5 0 001.5 1.5h13A1.5 1.5 0 0020 19v-7.5A1.5 1.5 0 0018.5 10H17"
            stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function PlusBox({ size = 20, color = '#13322b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke={color} strokeWidth="1.7"/>
      <path d="M12 8.5v7M8.5 12h7" stroke={color} strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  );
}

// ── Guided sheet (iOS Safari, or generic fallback) ───────────
function InstallSheet({ mode, onClose }) {
  const ios = mode === 'ios';
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(19,50,43,0.42)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      animation: 'fadeIn .2s ease',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: 460,
        background: 'var(--bg, #eef4f3)',
        borderRadius: '28px 28px 0 0',
        padding: '16px 22px calc(28px + env(safe-area-inset-bottom))',
        boxShadow: '0 -12px 50px rgba(19,50,43,0.25)',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(19,50,43,0.18)', margin: '0 auto 18px' }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <img src="icon-192.png" alt="" width={52} height={52}
               style={{ borderRadius: 13, boxShadow: '0 4px 14px rgba(19,50,43,0.22)' }}/>
          <div>
            <div style={{ fontFamily: 'var(--font-display, Georgia, serif)', fontSize: 26, lineHeight: 1.05, color: 'var(--ink, #13322b)' }}>
              Install Cabinet
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-mute, #87a098)', marginTop: 2 }}>
              {ios ? 'Two taps in Safari — runs full-screen & offline.'
                   : 'Open on your phone to install — full-screen & offline.'}
            </div>
          </div>
        </div>

        {ios ? (
          <React.Fragment>
            <Step n="1">
              Tap the <strong>Share</strong> button
              <span style={{ display: 'inline-flex', verticalAlign: 'middle', margin: '0 4px', transform: 'translateY(-1px)' }}>
                <ShareGlyph/>
              </span>
              in Safari's toolbar.
            </Step>
            <Step n="2">
              Scroll down and choose
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, verticalAlign: 'middle', margin: '0 5px',
                             padding: '3px 9px', borderRadius: 9, background: 'var(--paper, #faf7ef)', border: '0.5px solid var(--line, rgba(19,50,43,0.1))' }}>
                <strong style={{ fontWeight: 600 }}>Add to Home Screen</strong><PlusBox size={16}/>
              </span>
            </Step>
            <Step n="3" last>
              Tap <strong>Add</strong> — Cabinet lands on your Home Screen like any app.
            </Step>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Step n="1">
              On <strong>Android</strong>, open this page in Chrome and tap the
              <strong> ⋮ </strong> menu → <strong>Install app</strong> (or “Add to Home screen”).
            </Step>
            <Step n="2">
              On <strong>iPhone / iPad</strong>, open it in Safari, tap
              <span style={{ display: 'inline-flex', verticalAlign: 'middle', margin: '0 4px', transform: 'translateY(-1px)' }}>
                <ShareGlyph/>
              </span>
              then <strong>Add to Home Screen</strong>.
            </Step>
            <Step n="3" last>
              On <strong>desktop Chrome / Edge</strong>, use the install
              <span style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle', margin: '0 5px' }}>
                <PlusBox size={16}/>
              </span>
              icon in the address bar.
            </Step>
          </React.Fragment>
        )}

        <button onClick={onClose} style={{
          marginTop: 20, width: '100%', height: 50, borderRadius: 15, border: 0,
          background: 'var(--sage-deep, #1b3f37)', color: 'var(--paper, #faf7ef)',
          fontSize: 15, fontWeight: 500, fontFamily: 'inherit',
        }}>Got it</button>
      </div>
    </div>
  );
}

function Step({ n, children, last }) {
  return (
    <div style={{ display: 'flex', gap: 14, paddingBottom: last ? 0 : 16 }}>
      <div style={{
        flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
        background: 'var(--sage-fade, #d8ebe2)', color: 'var(--sage-deep, #1b3f37)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-mono, monospace)',
      }}>{n}</div>
      <div style={{ flex: 1, fontSize: 15, lineHeight: 1.5, color: 'var(--ink-soft, #4b6760)', paddingTop: 3 }}>
        {children}
      </div>
    </div>
  );
}

// ── Bottom install banner (non-standalone only) ──────────────
function InstallUI() {
  const [installable, setInstallable] = React.useState(!!window.__deferredPrompt);
  const [sheet, setSheet] = React.useState(null); // 'ios' | 'generic' | null
  const [dismissed, setDismissed] = React.useState(
    () => sessionStorage.getItem('cabinet-install-dismissed') === '1'
  );
  const [installed, setInstalled] = React.useState(false);

  React.useEffect(() => {
    const onInstallable = () => setInstallable(true);
    const onInstalled = () => { setInstalled(true); setInstallable(false); };
    window.addEventListener('pwa-installable', onInstallable);
    window.addEventListener('pwa-installed', onInstalled);
    return () => {
      window.removeEventListener('pwa-installable', onInstallable);
      window.removeEventListener('pwa-installed', onInstalled);
    };
  }, []);

  if (PWA.isStandalone || installed) return null;

  const close = () => {
    setDismissed(true);
    sessionStorage.setItem('cabinet-install-dismissed', '1');
  };

  const doInstall = async () => {
    if (window.__deferredPrompt) {
      window.__deferredPrompt.prompt();
      try { await window.__deferredPrompt.userChoice; } catch (e) {}
      window.__deferredPrompt = null;
      setInstallable(false);
    } else {
      setSheet(PWA.isIOS ? 'ios' : 'generic');
    }
  };

  // One-tap native prompt when the browser offers it (Android / desktop Chrome).
  const canPrompt = installable;
  const ctaLabel = canPrompt ? 'Install' : (PWA.isIOS ? 'How' : 'Install');
  const showBanner = !dismissed;

  return (
    <React.Fragment>
      {showBanner && (
        <div style={{
          position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 9000,
          display: 'flex', justifyContent: 'center',
          padding: '0 14px calc(14px + env(safe-area-inset-bottom))',
          pointerEvents: 'none',
        }}>
          <div style={{
            pointerEvents: 'auto',
            width: '100%', maxWidth: 440,
            display: 'flex', alignItems: 'center', gap: 13,
            background: 'var(--paper, #faf7ef)',
            border: '0.5px solid var(--line, rgba(19,50,43,0.1))',
            borderRadius: 20, padding: '11px 12px 11px 14px',
            boxShadow: '0 12px 40px rgba(19,50,43,0.20), 0 2px 8px rgba(19,50,43,0.08)',
            fontFamily: 'var(--font-body, system-ui, sans-serif)',
          }}>
            <img src="icon-192.png" alt="" width={44} height={44}
                 style={{ borderRadius: 11, flexShrink: 0, boxShadow: '0 3px 10px rgba(19,50,43,0.18)' }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-display, Georgia, serif)', fontSize: 18, lineHeight: 1.1, color: 'var(--ink, #13322b)' }}>
                Install Cabinet
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-mute, #87a098)', marginTop: 2, lineHeight: 1.3 }}>
                Full-screen · works offline · no app store
              </div>
            </div>
            <button onClick={doInstall} style={{
              flexShrink: 0, height: 40, padding: '0 18px', borderRadius: 13, border: 0,
              background: 'var(--sage-deep, #1b3f37)', color: 'var(--paper, #faf7ef)',
              fontSize: 14, fontWeight: 600, fontFamily: 'inherit', whiteSpace: 'nowrap',
            }}>
              {ctaLabel}
            </button>
            <button onClick={close} aria-label="Dismiss" style={{
              flexShrink: 0, width: 30, height: 40, border: 0, background: 'none',
              color: 'var(--ink-mute, #87a098)', fontSize: 20, lineHeight: 1, cursor: 'pointer',
            }}>×</button>
          </div>
        </div>
      )}
      {sheet && <InstallSheet mode={sheet} onClose={() => setSheet(null)} />}
    </React.Fragment>
  );
}

window.InstallUI = InstallUI;

// ── Launch splash ────────────────────────────────────────────
// Warm, time-aware welcome shown on app launch, then fades into the cabinet.
function Splash({ onDone, duration = 1700, tagline = 'Everything in its place, and nothing past its date.' }) {
  const [phase, setPhase] = React.useState('in'); // 'in' → 'out' → 'gone'

  const greeting = React.useMemo(() => {
    const h = new Date().getHours();
    if (h < 5)  return 'Resting easy';
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    if (h < 21) return 'Good evening';
    return 'Winding down';
  }, []);

  React.useEffect(() => {
    const t1 = setTimeout(() => setPhase('out'), duration);
    const t2 = setTimeout(() => { setPhase('gone'); onDone && onDone(); }, duration + 520);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [duration, onDone]);

  if (phase === 'gone') return null;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 8000,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background:
        'radial-gradient(130% 90% at 50% 18%, #faf7ef 0%, #eef4f3 52%, #d8ebe2 100%)',
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      opacity: phase === 'out' ? 0 : 1,
      transform: phase === 'out' ? 'scale(1.04)' : 'scale(1)',
      transition: 'opacity .5s ease, transform .55s cubic-bezier(.4,0,.2,1)',
      overflow: 'hidden',
    }}>
      {/* soft botanical rings */}
      <svg viewBox="0 0 400 400" aria-hidden="true" style={{
        position: 'absolute', width: 520, height: 520, opacity: 0.5,
        color: 'var(--sage-soft, #a8dccb)',
      }}>
        <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
        <circle cx="200" cy="200" r="118" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.35"/>
        <circle cx="200" cy="200" r="186" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3"/>
      </svg>

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        animation: 'splashRise .7s cubic-bezier(.2,.7,.2,1) both',
      }}>
        <SplashMark/>

        <div style={{
          marginTop: 30, fontFamily: 'var(--font-mono, monospace)',
          fontSize: 11.5, letterSpacing: '2.5px', textTransform: 'uppercase',
          color: 'var(--sage, #2f6b5f)', opacity: 0.85,
        }}>{greeting}</div>

        <div style={{
          marginTop: 7, fontFamily: 'var(--font-display, Georgia, serif)',
          fontSize: 46, lineHeight: 1, color: 'var(--ink, #13322b)',
        }}>Cabinet</div>

        <div style={{
          marginTop: 12, fontFamily: 'var(--font-body, system-ui)',
          fontSize: 13.5, color: 'var(--ink-mute, #87a098)',
          maxWidth: 230, textAlign: 'center', lineHeight: 1.45,
        }}>{tagline}</div>
      </div>

      {/* settling progress hairline */}
      <div style={{
        position: 'absolute', bottom: 'calc(46px + env(safe-area-inset-bottom))',
        width: 64, height: 2.5, borderRadius: 2,
        background: 'var(--sage-fade, #d8ebe2)', overflow: 'hidden',
      }}>
        <div style={{
          width: '40%', height: '100%', borderRadius: 2,
          background: 'var(--sage, #2f6b5f)',
          animation: 'splashSlide 1.4s ease-in-out infinite',
        }}/>
      </div>

      <style>{`
        @keyframes splashRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @keyframes splashSlide { 0% { transform: translateX(-120%); } 100% { transform: translateX(380%); } }
        @keyframes splashCork { 0% { transform: translateY(-7px); opacity: 0; } 60% { transform: translateY(1px); } 100% { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}

// A small apothecary bottle mark drawn to match the in-app bottles.
function SplashMark() {
  return (
    <div style={{ position: 'relative', filter: 'drop-shadow(0 14px 22px rgba(19,50,43,0.22))' }}>
      <svg width="96" height="132" viewBox="0 0 96 132" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="sm-body" x1="0" x2="1">
            <stop offset="0" stopColor="#2f6b5f" stopOpacity="0.65"/>
            <stop offset="0.2" stopColor="#2f6b5f"/>
            <stop offset="0.82" stopColor="#1b3f37"/>
            <stop offset="1" stopColor="#000" stopOpacity="0.45"/>
          </linearGradient>
          <linearGradient id="sm-cap" x1="0" x2="1">
            <stop offset="0" stopColor="#cdb98e" stopOpacity="0.8"/>
            <stop offset="0.5" stopColor="#cdb98e"/>
            <stop offset="1" stopColor="#8d7a55"/>
          </linearGradient>
        </defs>
        {/* cap — gently "corks" in */}
        <g style={{ animation: 'splashCork .6s .25s cubic-bezier(.3,1.3,.5,1) both', transformOrigin: 'center' }}>
          <rect x="26" y="2" width="44" height="17" rx="5" fill="url(#sm-cap)"/>
          <rect x="26" y="7" width="44" height="2.4" fill="rgba(0,0,0,0.13)"/>
        </g>
        {/* neck */}
        <rect x="33" y="18" width="30" height="6" fill="#8d7a55" opacity="0.5"/>
        {/* body */}
        <rect x="16" y="24" width="64" height="104" rx="9" fill="url(#sm-body)"/>
        <rect x="22" y="30" width="5" height="92" rx="2.5" fill="white" opacity="0.16"/>
        {/* label */}
        <rect x="24" y="50" width="48" height="58" rx="2" fill="var(--label-cream, #f4ead4)"/>
        <line x1="24" y1="53" x2="72" y2="53" stroke="var(--label-line, #b29764)" strokeWidth="0.8" opacity="0.6"/>
        <line x1="24" y1="105" x2="72" y2="105" stroke="var(--label-line, #b29764)" strokeWidth="0.8" opacity="0.6"/>
        {/* mortar & pestle glyph on the label */}
        <g stroke="#1b3f37" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
          <path d="M40 70 L56 62"/>
          <path d="M37 76 h22 a11 11 0 0 1 -22 0 Z" fill="#1b3f37" stroke="none" opacity="0.92"/>
          <path d="M37 76 h22" />
        </g>
        <text x="48" y="98" textAnchor="middle" fontFamily="Geist Mono, monospace"
              fontSize="6.5" letterSpacing="1.5" fill="#7a3a14" opacity="0.75">O · T · C</text>
      </svg>
    </div>
  );
}

window.Splash = Splash;
