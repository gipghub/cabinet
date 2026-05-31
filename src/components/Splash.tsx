import { useEffect, useState } from 'react';
import { splashGreeting } from '../lib/datetime';

export interface SplashProps {
  onDone?: () => void;
  duration?: number;
  tagline?: string;
}

/** Warm, time-aware launch splash that fades into the cabinet. */
export function Splash({
  onDone,
  duration = 1700,
  tagline = 'Everything in its place, and nothing past its date.',
}: SplashProps) {
  const [phase, setPhase] = useState<'in' | 'out' | 'gone'>('in');
  const [greeting] = useState(() => splashGreeting());

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('out'), duration);
    const t2 = setTimeout(() => {
      setPhase('gone');
      onDone?.();
    }, duration + 520);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [duration, onDone]);

  if (phase === 'gone') return null;

  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 8000,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(130% 90% at 50% 18%, #faf7ef 0%, #eef4f3 52%, #d8ebe2 100%)',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        opacity: phase === 'out' ? 0 : 1,
        transform: phase === 'out' ? 'scale(1.04)' : 'scale(1)',
        transition: 'opacity .5s ease, transform .55s cubic-bezier(.4,0,.2,1)',
        overflow: 'hidden',
      }}
    >
      <svg
        viewBox="0 0 400 400"
        aria-hidden="true"
        style={{ position: 'absolute', width: 520, height: 520, opacity: 0.5, color: 'var(--sage-soft)' }}
      >
        <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        <circle cx="200" cy="200" r="118" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
        <circle cx="200" cy="200" r="186" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'splashRise .7s cubic-bezier(.2,.7,.2,1) both' }}>
        <SplashMark />
        <div style={{ marginTop: 30, fontFamily: 'var(--font-mono)', fontSize: 11.5, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--sage)', opacity: 0.85 }}>
          {greeting}
        </div>
        <div style={{ marginTop: 7, fontFamily: 'var(--font-display)', fontSize: 46, lineHeight: 1, color: 'var(--ink)' }}>
          Cabinet
        </div>
        <div style={{ marginTop: 12, fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--ink-mute)', maxWidth: 230, textAlign: 'center', lineHeight: 1.45 }}>
          {tagline}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 'calc(46px + env(safe-area-inset-bottom))', width: 64, height: 2.5, borderRadius: 2, background: 'var(--sage-fade)', overflow: 'hidden' }}>
        <div style={{ width: '40%', height: '100%', borderRadius: 2, background: 'var(--sage)', animation: 'splashSlide 1.4s ease-in-out infinite' }} />
      </div>
    </div>
  );
}

function SplashMark() {
  return (
    <div style={{ position: 'relative', filter: 'drop-shadow(0 14px 22px rgba(19,50,43,0.22))' }}>
      <svg width="96" height="132" viewBox="0 0 96 132" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="sm-body" x1="0" x2="1">
            <stop offset="0" stopColor="#2f6b5f" stopOpacity="0.65" />
            <stop offset="0.2" stopColor="#2f6b5f" />
            <stop offset="0.82" stopColor="#1b3f37" />
            <stop offset="1" stopColor="#000" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="sm-cap" x1="0" x2="1">
            <stop offset="0" stopColor="#cdb98e" stopOpacity="0.8" />
            <stop offset="0.5" stopColor="#cdb98e" />
            <stop offset="1" stopColor="#8d7a55" />
          </linearGradient>
        </defs>
        <g style={{ animation: 'splashCork .6s .25s cubic-bezier(.3,1.3,.5,1) both', transformOrigin: 'center' }}>
          <rect x="26" y="2" width="44" height="17" rx="5" fill="url(#sm-cap)" />
          <rect x="26" y="7" width="44" height="2.4" fill="rgba(0,0,0,0.13)" />
        </g>
        <rect x="33" y="18" width="30" height="6" fill="#8d7a55" opacity="0.5" />
        <rect x="16" y="24" width="64" height="104" rx="9" fill="url(#sm-body)" />
        <rect x="22" y="30" width="5" height="92" rx="2.5" fill="white" opacity="0.16" />
        <rect x="24" y="50" width="48" height="58" rx="2" fill="var(--label-cream)" />
        <line x1="24" y1="53" x2="72" y2="53" stroke="var(--label-line)" strokeWidth="0.8" opacity="0.6" />
        <line x1="24" y1="105" x2="72" y2="105" stroke="var(--label-line)" strokeWidth="0.8" opacity="0.6" />
        <g stroke="#1b3f37" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
          <path d="M40 70 L56 62" />
          <path d="M37 76 h22 a11 11 0 0 1 -22 0 Z" fill="#1b3f37" stroke="none" opacity="0.92" />
          <path d="M37 76 h22" />
        </g>
        <text x="48" y="98" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="6.5" letterSpacing="1.5" fill="#7a3a14" opacity="0.75">O · T · C</text>
      </svg>
    </div>
  );
}
