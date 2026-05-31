import { describe, expect, it } from 'vitest';
import {
  avgPerWeek,
  daysToExpire,
  daysUntilEmpty,
  fillRatio,
  isLowStock,
  isValidEmail,
  refillPredictions,
  safetyFor,
  stockPct,
  totalDoses,
} from './safety';

describe('stockPct', () => {
  it('computes a rounded percentage', () => {
    expect(stockPct({ stock: 28, fullStock: 100 })).toBe(28);
    expect(stockPct({ stock: 1, fullStock: 3 })).toBe(33);
  });
  it('guards against a zero capacity', () => {
    expect(stockPct({ stock: 5, fullStock: 0 })).toBe(0);
  });
});

describe('isLowStock', () => {
  it('flags under 20% remaining', () => {
    expect(isLowStock({ stock: 4, fullStock: 45 })).toBe(true);
    expect(isLowStock({ stock: 28, fullStock: 100 })).toBe(false);
  });
});

describe('daysToExpire', () => {
  it('counts whole days from a reference date', () => {
    const now = new Date('2026-01-01T00:00:00Z');
    expect(daysToExpire('2026-01-31', now)).toBe(30);
  });
  it('goes negative once expired', () => {
    const now = new Date('2026-02-01T00:00:00Z');
    expect(daysToExpire('2026-01-01', now)).toBeLessThan(0);
  });
});

describe('fillRatio', () => {
  it('never drops below a visible sliver', () => {
    expect(fillRatio({ stock: 0, fullStock: 100 })).toBe(0.2);
  });
  it('reflects true ratio above the floor', () => {
    expect(fillRatio({ stock: 50, fullStock: 100 })).toBe(0.5);
  });
});

describe('usage helpers', () => {
  const history = [3, 2, 4, 0, 2, 2, 3]; // total 16
  it('sums total doses', () => {
    expect(totalDoses(history)).toBe(16);
  });
  it('averages per week over a 4-week window', () => {
    expect(avgPerWeek([4, 4, 4, 4])).toBe(4); // 16 / 4
  });
});

describe('safetyFor', () => {
  const tylenol = { dose: 500, dailyMaxMg: 3000 };
  it('projects the additional dose onto today total', () => {
    const s = safetyFor(tylenol, 2, 2500);
    expect(s.projectedMg).toBe(3500);
    expect(s.wouldExceed).toBe(true);
  });
  it('stays within limit when under the max', () => {
    const s = safetyFor(tylenol, 1, 2000);
    expect(s.projectedMg).toBe(2500);
    expect(s.wouldExceed).toBe(false);
    expect(s.pct).toBeCloseTo(2500 / 3000);
  });
});

describe('refill predictions', () => {
  it('skips unused medicines and sorts soonest first', () => {
    const meds = [
      { id: 'unused', stock: 50, history: new Array(28).fill(0) },
      { id: 'fast', stock: 4, history: new Array(28).fill(1) }, // ~4 days
      { id: 'slow', stock: 80, history: new Array(28).fill(1) }, // ~80 days, filtered out
    ];
    const out = refillPredictions(meds, 60);
    expect(out.map((p) => p.medicine.id)).toEqual(['fast']);
  });

  it('returns null days for an entirely unused medicine', () => {
    expect(daysUntilEmpty({ stock: 10, history: new Array(28).fill(0) })).toBeNull();
  });
});

describe('isValidEmail', () => {
  it('accepts well-formed addresses', () => {
    expect(isValidEmail('friend@example.com')).toBe(true);
  });
  it('rejects malformed addresses', () => {
    expect(isValidEmail('nope')).toBe(false);
    expect(isValidEmail('a@b')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});
