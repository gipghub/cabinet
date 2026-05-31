import { describe, expect, it } from 'vitest';
import { greeting, longDate, splashGreeting } from './datetime';

describe('longDate', () => {
  it('formats weekday and month/day', () => {
    expect(longDate(new Date('2026-05-27T10:00:00'))).toBe('Wednesday · May 27');
  });
});

describe('greeting', () => {
  const at = (h: number) => new Date(2026, 4, 27, h, 0, 0);
  it('shifts with the time of day', () => {
    expect(greeting(at(2))).toBe('Good night');
    expect(greeting(at(9))).toBe('Good morning');
    expect(greeting(at(14))).toBe('Good afternoon');
    expect(greeting(at(20))).toBe('Good evening');
  });
});

describe('splashGreeting', () => {
  const at = (h: number) => new Date(2026, 4, 27, h, 0, 0);
  it('uses warmer late-night and dawn copy', () => {
    expect(splashGreeting(at(3))).toBe('Resting easy');
    expect(splashGreeting(at(23))).toBe('Winding down');
    expect(splashGreeting(at(13))).toBe('Good afternoon');
  });
});
