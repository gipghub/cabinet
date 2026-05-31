export type PresetName =
  | 'amber' | 'white' | 'navy' | 'green' | 'red'
  | 'pink' | 'teal' | 'slate' | 'mustard';

export interface BottlePreset {
  cap: string;
  body: string;
  label: string;
  accent: string;
}

export interface Medicine {
  id: string;
  name: string;
  sub: string;
  active: string;
  dose: number;
  doseUnit: string;
  form: string;
  perDose: number;
  dailyMax: number;
  dailyMaxMg: number;
  stock: number;
  fullStock: number;
  expires: string; // ISO yyyy-mm-dd
  shelf: number;
  slot: number;
  preset: PresetName;
  interactions: string[];
  history: number[]; // 28 entries, most recent last
  notes: string;
  lowStock?: boolean;
  expiringSoon?: boolean;
}

export type AlertSeverity = 'danger' | 'warn' | 'info';
export type AlertType = 'safety' | 'interaction' | 'refill' | 'expiry' | 'schedule';

export interface Alert {
  id: string;
  severity: AlertSeverity;
  type: AlertType;
  title: string;
  detail: string;
  medicineId: string;
  when: string;
  icon: string;
}

export type SymptomKey = 'h' | 'a' | 'p' | 's' | 'st' | 'c';

export interface SymptomMeta {
  label: string;
  color: string;
}
