import { presets } from '../data/medicines';
import type { PresetName } from '../data/types';

export interface BottleProps {
  preset?: PresetName;
  name?: string;
  sub?: string;
  dose?: string;
  width?: number;
  variant?: 'shelf' | 'hero';
  fillRatio?: number;
}

export function Bottle({
  preset = 'amber',
  name = 'Tylenol',
  sub = 'Extra Strength',
  dose = '500mg',
  width = 64,
  variant = 'shelf',
  fillRatio = 1,
}: BottleProps) {
  const p = presets[preset] ?? presets.amber;
  const h = Math.round(width * 1.5);
  const w = width;
  const id = `b-${preset}-${name.replace(/\W/g, '')}`;

  const capH = h * 0.13;
  const neckH = h * 0.04;
  const bodyY = capH + neckH;
  const bodyH = h - bodyY;
  const bodyW = w * 0.94;
  const bodyX = (w - bodyW) / 2;
  const labelY = bodyY + bodyH * 0.18;
  const labelH = bodyH * 0.62;
  const labelW = bodyW * 0.88;
  const labelX = (w - labelW) / 2;

  const fillH = bodyH * 0.18 * fillRatio;
  const fillY = bodyY + bodyH - fillH - 2;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ display: 'block', filter: 'drop-shadow(0 6px 6px rgba(0,0,0,0.18))' }}
      role="img"
      aria-label={`${name} ${dose}`}
    >
      <defs>
        <linearGradient id={`${id}-body`} x1="0" x2="1">
          <stop offset="0" stopColor={p.body} stopOpacity="0.6" />
          <stop offset="0.18" stopColor={p.body} />
          <stop offset="0.82" stopColor={p.body} />
          <stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id={`${id}-cap`} x1="0" x2="1">
          <stop offset="0" stopColor={p.cap} stopOpacity="0.7" />
          <stop offset="0.5" stopColor={p.cap} />
          <stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id={`${id}-label`} x1="0" x2="1">
          <stop offset="0" stopColor={p.label} stopOpacity="0.85" />
          <stop offset="0.5" stopColor={p.label} />
          <stop offset="1" stopColor={p.label} stopOpacity="0.7" />
        </linearGradient>
        <clipPath id={`${id}-bodyclip`}>
          <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx={w * 0.06} />
        </clipPath>
      </defs>

      <rect x={w * 0.08} y={0} width={w * 0.84} height={capH} rx={w * 0.06} fill={`url(#${id}-cap)`} />
      <rect x={w * 0.08} y={capH * 0.25} width={w * 0.84} height={capH * 0.12} fill="rgba(0,0,0,0.15)" />
      <rect x={w * 0.08} y={capH * 0.55} width={w * 0.84} height={capH * 0.1} fill="rgba(0,0,0,0.12)" />

      <rect x={w * 0.16} y={capH} width={w * 0.68} height={neckH} fill={p.cap} opacity="0.35" />

      <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx={w * 0.06} fill={`url(#${id}-body)`} />

      <g clipPath={`url(#${id}-bodyclip)`}>
        <rect x={bodyX} y={fillY} width={bodyW} height={fillH} fill="rgba(0,0,0,0.18)" />
      </g>

      <rect x={bodyX + bodyW * 0.08} y={bodyY + bodyH * 0.04} width={bodyW * 0.06} height={bodyH * 0.92} rx={2} fill="white" opacity="0.18" />

      <rect x={labelX} y={labelY} width={labelW} height={labelH} fill={`url(#${id}-label)`} rx={1} />
      <line x1={labelX} y1={labelY + 2} x2={labelX + labelW} y2={labelY + 2} stroke={p.accent} strokeWidth="0.6" opacity="0.5" />
      <line x1={labelX} y1={labelY + labelH - 2} x2={labelX + labelW} y2={labelY + labelH - 2} stroke={p.accent} strokeWidth="0.6" opacity="0.5" />

      {variant === 'shelf' && (
        <>
          <text x={w / 2} y={labelY + labelH * 0.34} textAnchor="middle" fontFamily="Instrument Serif, Georgia, serif" fontSize={Math.max(w * 0.16, 9)} fill={p.accent} letterSpacing="0.3">
            {name.length > 9 ? name.slice(0, 8) + '·' : name}
          </text>
          <line x1={labelX + labelW * 0.2} y1={labelY + labelH * 0.46} x2={labelX + labelW * 0.8} y2={labelY + labelH * 0.46} stroke={p.accent} strokeWidth="0.4" opacity="0.4" />
          <text x={w / 2} y={labelY + labelH * 0.7} textAnchor="middle" fontFamily="Geist, system-ui, sans-serif" fontSize={Math.max(w * 0.085, 6)} fill={p.accent} opacity="0.7" letterSpacing="0.6">
            {dose}
          </text>
        </>
      )}
      {variant === 'hero' && (
        <>
          <text x={w / 2} y={labelY + labelH * 0.28} textAnchor="middle" fontFamily="Instrument Serif, Georgia, serif" fontSize={w * 0.13} fill={p.accent}>{name}</text>
          <text x={w / 2} y={labelY + labelH * 0.42} textAnchor="middle" fontFamily="Geist, system-ui, sans-serif" fontSize={w * 0.06} fill={p.accent} opacity="0.7" letterSpacing="2">{(sub || '').toUpperCase()}</text>
          <line x1={labelX + labelW * 0.15} y1={labelY + labelH * 0.5} x2={labelX + labelW * 0.85} y2={labelY + labelH * 0.5} stroke={p.accent} strokeWidth="0.6" opacity="0.4" />
          <text x={w / 2} y={labelY + labelH * 0.66} textAnchor="middle" fontFamily="Instrument Serif, Georgia, serif" fontSize={w * 0.1} fill={p.accent}>{dose}</text>
          <text x={w / 2} y={labelY + labelH * 0.83} textAnchor="middle" fontFamily="Geist, system-ui, sans-serif" fontSize={w * 0.055} fill={p.accent} opacity="0.55" letterSpacing="1.5">OVER-THE-COUNTER</text>
        </>
      )}
    </svg>
  );
}
