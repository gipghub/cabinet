import type { Medicine } from '../data/types';

/** Percentage of stock remaining, 0–100, rounded. */
export function stockPct(m: Pick<Medicine, 'stock' | 'fullStock'>): number {
  if (m.fullStock <= 0) return 0;
  return Math.round((m.stock / m.fullStock) * 100);
}

/** True when under 20% of full stock remains. */
export function isLowStock(m: Pick<Medicine, 'stock' | 'fullStock'>): boolean {
  if (m.fullStock <= 0) return false;
  return m.stock / m.fullStock < 0.2;
}

/** Whole days from `now` until the medicine's expiry date. */
export function daysToExpire(
  expiresISO: string,
  now: Date = new Date(),
): number {
  const expires = new Date(expiresISO);
  return Math.round((expires.getTime() - now.getTime()) / 86_400_000);
}

/** Fill ratio for the bottle illustration — never fully empty so a sliver shows. */
export function fillRatio(m: Pick<Medicine, 'stock' | 'fullStock'>): number {
  if (m.fullStock <= 0) return 0.2;
  return Math.max(0.2, m.stock / m.fullStock);
}

/** Total doses taken across the 28-day history. */
export function totalDoses(history: number[]): number {
  return history.reduce((a, b) => a + b, 0);
}

/** Average doses per week over the 28-day (4-week) window. */
export function avgPerWeek(history: number[]): number {
  return totalDoses(history) / 4;
}

export interface SafetyState {
  /** mg taken so far today. */
  todayMg: number;
  /** Projected mg if `count` more units are taken. */
  projectedMg: number;
  /** Fraction of the daily-max limit the projection represents. */
  pct: number;
  /** True when the projection exceeds the daily max. */
  wouldExceed: boolean;
}

/**
 * Compute the daily-max safety state for taking `count` units now,
 * given `todayMg` already taken.
 */
export function safetyFor(
  m: Pick<Medicine, 'dose' | 'dailyMaxMg'>,
  count: number,
  todayMg: number,
): SafetyState {
  const addedMg = count * m.dose;
  const projectedMg = todayMg + addedMg;
  const pct = m.dailyMaxMg > 0 ? projectedMg / m.dailyMaxMg : 0;
  return {
    todayMg,
    projectedMg,
    pct,
    wouldExceed: projectedMg > m.dailyMaxMg,
  };
}

/** Days until stock runs out at the historical average pace, or null if unused. */
export function daysUntilEmpty(
  m: Pick<Medicine, 'stock' | 'history'>,
): number | null {
  const avgPerDay = totalDoses(m.history) / m.history.length;
  if (avgPerDay <= 0) return null;
  return Math.round(m.stock / avgPerDay);
}

/** Medicines predicted to run out within `withinDays`, soonest first. */
export function refillPredictions<T extends Pick<Medicine, 'stock' | 'history'>>(
  meds: T[],
  withinDays = 60,
): Array<{ medicine: T; daysLeft: number }> {
  return meds
    .map((medicine) => {
      const daysLeft = daysUntilEmpty(medicine);
      return daysLeft === null ? null : { medicine, daysLeft };
    })
    .filter(
      (p): p is { medicine: T; daysLeft: number } =>
        p !== null && p.daysLeft < withinDays,
    )
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Basic email shape validation for the share flow. */
export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}
