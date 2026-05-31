import type {
  Alert,
  BottlePreset,
  Medicine,
  PresetName,
  SymptomKey,
  SymptomMeta,
} from './types';

export const todayISO = (): string => new Date().toISOString().slice(0, 10);
export const daysFromNow = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
export const daysAgo = (n: number): string => daysFromNow(-n);

// Bottle visual presets — cap color, body color, label tone
export const presets: Record<PresetName, BottlePreset> = {
  amber:   { cap: '#2f3a2c', body: '#a96a2e', label: '#f6e9c8', accent: '#7a3a14' },
  white:   { cap: '#5c5c5c', body: '#f0ebde', label: '#ffffff', accent: '#9a3434' },
  navy:    { cap: '#d6cda5', body: '#1f3a5c', label: '#f4ead4', accent: '#1f3a5c' },
  green:   { cap: '#1f1f1f', body: '#2f6b5f', label: '#f4ead4', accent: '#1b3f37' },
  red:     { cap: '#1f1f1f', body: '#b94838', label: '#f6e9c8', accent: '#7a261d' },
  pink:    { cap: '#7a5a8a', body: '#d6a4b3', label: '#f6ecdb', accent: '#7a3a4d' },
  teal:    { cap: '#15302a', body: '#3f8a85', label: '#eaf3e8', accent: '#15302a' },
  slate:   { cap: '#0e0e0e', body: '#4a5560', label: '#e9e5d6', accent: '#0e0e0e' },
  mustard: { cap: '#3b2e15', body: '#c89a3c', label: '#f6ead0', accent: '#3b2e15' },
};

export const MEDICINES: Medicine[] = [
  {
    id: 'tylenol', name: 'Tylenol', sub: 'Extra Strength', active: 'Acetaminophen',
    dose: 500, doseUnit: 'mg', form: 'caplet', perDose: 2, dailyMax: 6, dailyMaxMg: 3000,
    stock: 28, fullStock: 100, expires: daysFromNow(412), shelf: 0, slot: 0, preset: 'red',
    interactions: ['alcohol', 'warfarin'],
    history: [3,2,4,0,2,2,3,2,4,2,3,1,2,3,4,2,2,3,2,2,3,4,2,3,2,2,3,2],
    notes: 'For headache & fever. Liver caution above 3 g/day.',
  },
  {
    id: 'advil', name: 'Advil', sub: 'Ibuprofen', active: 'Ibuprofen',
    dose: 200, doseUnit: 'mg', form: 'tablet', perDose: 2, dailyMax: 6, dailyMaxMg: 1200,
    stock: 64, fullStock: 100, expires: daysFromNow(220), shelf: 0, slot: 1, preset: 'navy',
    interactions: ['warfarin', 'aspirin'],
    history: [0,0,2,2,0,0,2,2,2,0,0,2,2,0,0,2,2,2,0,2,2,0,0,2,2,0,2,0],
    notes: 'For inflammation & soreness. Take with food.',
  },
  {
    id: 'claritin', name: 'Claritin', sub: 'Loratadine 10mg', active: 'Loratadine',
    dose: 10, doseUnit: 'mg', form: 'tablet', perDose: 1, dailyMax: 1, dailyMaxMg: 10,
    stock: 18, fullStock: 30, expires: daysFromNow(78), shelf: 0, slot: 2, preset: 'teal',
    interactions: [],
    history: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    notes: 'Once daily, non-drowsy. Spring allergy season.',
  },
  {
    id: 'benadryl', name: 'Benadryl', sub: 'Diphenhydramine 25mg', active: 'Diphenhydramine',
    dose: 25, doseUnit: 'mg', form: 'softgel', perDose: 1, dailyMax: 6, dailyMaxMg: 150,
    stock: 22, fullStock: 24, expires: daysFromNow(540), shelf: 0, slot: 3, preset: 'pink',
    interactions: ['alcohol', 'sleep-aids'],
    history: [0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0],
    notes: 'Drowsy. Allergies & occasional sleep.',
  },
  {
    id: 'zyrtec', name: 'Zyrtec', sub: 'Cetirizine 10mg', active: 'Cetirizine',
    dose: 10, doseUnit: 'mg', form: 'tablet', perDose: 1, dailyMax: 1, dailyMaxMg: 10,
    stock: 4, fullStock: 45, expires: daysFromNow(800), shelf: 1, slot: 0, preset: 'mustard',
    interactions: [],
    history: [0,1,1,0,0,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0,0,1,1,1,1],
    notes: 'Running low. Allergy seasonal use.', lowStock: true,
  },
  {
    id: 'pepto', name: 'Pepto-Bismol', sub: 'Chewable', active: 'Bismuth subsalicylate',
    dose: 262, doseUnit: 'mg', form: 'chewable', perDose: 2, dailyMax: 16, dailyMaxMg: 4192,
    stock: 12, fullStock: 30, expires: daysFromNow(34), shelf: 1, slot: 1, preset: 'pink',
    interactions: ['aspirin', 'blood-thinners'],
    history: [0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,2,0,0,0,0,0],
    notes: 'Stomach upset. Expires in 34 days.', expiringSoon: true,
  },
  {
    id: 'mucinex', name: 'Mucinex DM', sub: '12-hour', active: 'Guaifenesin + Dextromethorphan',
    dose: 600, doseUnit: 'mg', form: 'tablet', perDose: 1, dailyMax: 4, dailyMaxMg: 2400,
    stock: 8, fullStock: 20, expires: daysFromNow(310), shelf: 1, slot: 2, preset: 'amber',
    interactions: ['MAOIs', 'SSRIs'],
    history: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    notes: 'Cough + chest congestion.',
  },
  {
    id: 'vit-d', name: 'Vitamin D3', sub: '1000 IU', active: 'Cholecalciferol',
    dose: 1000, doseUnit: 'IU', form: 'softgel', perDose: 1, dailyMax: 4, dailyMaxMg: 4000,
    stock: 86, fullStock: 100, expires: daysFromNow(620), shelf: 1, slot: 3, preset: 'mustard',
    interactions: [],
    history: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    notes: 'Daily, with breakfast.',
  },
  {
    id: 'aspirin', name: 'Aspirin', sub: 'Low-dose 81mg', active: 'Acetylsalicylic acid',
    dose: 81, doseUnit: 'mg', form: 'tablet', perDose: 1, dailyMax: 1, dailyMaxMg: 81,
    stock: 60, fullStock: 90, expires: daysFromNow(196), shelf: 2, slot: 0, preset: 'white',
    interactions: ['ibuprofen', 'warfarin'],
    history: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    notes: 'Daily heart preventative.',
  },
  {
    id: 'melatonin', name: 'Melatonin', sub: '3mg dissolve', active: 'Melatonin',
    dose: 3, doseUnit: 'mg', form: 'sublingual', perDose: 1, dailyMax: 2, dailyMaxMg: 6,
    stock: 44, fullStock: 60, expires: daysFromNow(290), shelf: 2, slot: 1, preset: 'navy',
    interactions: ['sedatives'],
    history: [0,1,1,0,1,1,1,0,1,1,1,0,0,1,1,0,0,1,1,1,0,0,1,1,1,1,0,1],
    notes: 'Bedtime. Travel & sleep onset.',
  },
  {
    id: 'tums', name: 'TUMS', sub: 'Smoothies, Berry', active: 'Calcium carbonate',
    dose: 750, doseUnit: 'mg', form: 'chewable', perDose: 2, dailyMax: 15, dailyMaxMg: 11250,
    stock: 32, fullStock: 60, expires: daysFromNow(450), shelf: 2, slot: 2, preset: 'pink',
    interactions: [],
    history: [0,2,0,0,2,0,0,0,0,2,0,0,0,2,2,0,0,0,0,2,0,0,2,0,0,0,2,0],
    notes: 'Heartburn & indigestion.',
  },
];

export const ALERTS: Alert[] = [
  { id: 'a1', severity: 'danger', type: 'safety', title: 'Daily acetaminophen near limit',
    detail: "You've taken 2.5 g today. The 3 g safety threshold is 1 dose away.",
    medicineId: 'tylenol', when: '2 hours ago', icon: 'shield' },
  { id: 'a2', severity: 'danger', type: 'interaction', title: 'Possible interaction: Advil + Aspirin',
    detail: "Taking ibuprofen within 8 hours of low-dose aspirin can reduce aspirin's cardioprotective effect.",
    medicineId: 'advil', when: 'Today, 9:14 AM', icon: 'link' },
  { id: 'a3', severity: 'warn', type: 'refill', title: 'Zyrtec is running low',
    detail: 'About 4 tablets left — roughly 4 days at your current rate.',
    medicineId: 'zyrtec', when: 'Yesterday', icon: 'box' },
  { id: 'a4', severity: 'warn', type: 'expiry', title: 'Pepto-Bismol expires in 34 days',
    detail: 'Use up or replace before end of June.',
    medicineId: 'pepto', when: '2 days ago', icon: 'clock' },
  { id: 'a5', severity: 'info', type: 'schedule', title: 'Vitamin D — morning dose',
    detail: 'You usually take this around 8:00 AM.',
    medicineId: 'vit-d', when: 'Daily', icon: 'sun' },
  { id: 'a6', severity: 'info', type: 'schedule', title: 'Melatonin — bedtime',
    detail: 'Reminder set for 10:30 PM.',
    medicineId: 'melatonin', when: 'Daily', icon: 'moon' },
];

// 28-day symptom log (most recent last)
export const SYMPTOM_LOG: SymptomKey[][] = [
  [],[],['a'],['a'],[],[],['a'],['h'],['p'],[],[],['a','h'],['p'],[],[],
  ['h'],['p'],['a'],[],['p','st'],['st'],['st'],[],['a','p'],['h'],[],['p','c'],['c','h'],
];

export const SYMPTOM_META: Record<SymptomKey, SymptomMeta> = {
  h:  { label: 'Headache',  color: '#b94838' },
  a:  { label: 'Allergies', color: '#c89a3c' },
  p:  { label: 'Pain',      color: '#7a5a8a' },
  s:  { label: 'Sleep',     color: '#1f3a5c' },
  st: { label: 'Stomach',   color: '#d6a4b3' },
  c:  { label: 'Cold',      color: '#3f8a85' },
};
