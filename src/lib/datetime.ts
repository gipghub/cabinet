const DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];
const MON_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** e.g. "Wednesday · May 27" */
export function longDate(d: Date = new Date()): string {
  return `${DAY_NAMES[d.getDay()]} · ${MON_NAMES[d.getMonth()]} ${d.getDate()}`;
}

/** Time-aware greeting for the home header. */
export function greeting(d: Date = new Date()): string {
  const h = d.getHours();
  if (h < 5) return 'Good night';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/** Warmer, time-aware greeting for the launch splash. */
export function splashGreeting(d: Date = new Date()): string {
  const h = d.getHours();
  if (h < 5) return 'Resting easy';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Winding down';
}
