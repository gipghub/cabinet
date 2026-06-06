import { beforeEach, describe, expect, it } from 'vitest';
import { clear, get as idbGet } from 'idb-keyval';
import { useStore } from './useStore';
import type { Medicine } from '../data/types';
import { MEDICINES } from '../data/medicines';

const IDB_KEY = 'cabinet-state-v1';

interface Persisted {
  medicines: Medicine[];
  doseLog: { medicineId: string; count: number; mg: number }[];
  dismissedAlerts: string[];
}

const read = () => idbGet<Persisted>(IDB_KEY);

// Reset both the IndexedDB store and the in-memory Zustand state between tests.
beforeEach(async () => {
  await clear();
  useStore.setState({
    medicines: MEDICINES,
    doseLog: [],
    dismissedAlerts: [],
    hydrated: false,
  });
});

describe('persistence to IndexedDB', () => {
  it('writes seeded state to IndexedDB on first hydrate', async () => {
    expect(await read()).toBeUndefined(); // nothing stored yet

    await useStore.getState().hydrate();

    const saved = await read();
    expect(saved).toBeDefined();
    expect(saved!.medicines).toHaveLength(MEDICINES.length);
    expect(useStore.getState().hydrated).toBe(true);
  });

  it('persists a logged dose AND the stock decrement', async () => {
    await useStore.getState().hydrate();
    const before = useStore.getState().medicines.find((m) => m.id === 'vit-d')!.stock;

    useStore.getState().logDose({ medicineId: 'vit-d', count: 1, mg: 1000, symptoms: [] });

    // idb-keyval writes are async (fire-and-forget); let the microtask flush.
    await new Promise((r) => setTimeout(r, 20));

    const saved = await read();
    expect(saved!.doseLog.at(-1)).toMatchObject({ medicineId: 'vit-d', count: 1, mg: 1000 });
    expect(saved!.medicines.find((m) => m.id === 'vit-d')!.stock).toBe(before - 1);
  });

  it('survives a simulated reload: a fresh store hydrates the saved data', async () => {
    // Session 1: log a dose, then drop all in-memory state.
    await useStore.getState().hydrate();
    useStore.getState().logDose({ medicineId: 'advil', count: 2, mg: 400, symptoms: ['h'] });
    await new Promise((r) => setTimeout(r, 20));

    // Simulate a page reload — wipe in-memory state back to defaults.
    useStore.setState({ medicines: MEDICINES, doseLog: [], dismissedAlerts: [], hydrated: false });
    expect(useStore.getState().doseLog).toHaveLength(0);

    // Session 2: hydrate should pull the dose back out of IndexedDB.
    await useStore.getState().hydrate();
    const log = useStore.getState().doseLog;
    expect(log.at(-1)).toMatchObject({ medicineId: 'advil', count: 2, mg: 400 });
    expect(log.at(-1)!.symptoms).toEqual(['h']);
  });

  it('persists a dismissed alert across a reload', async () => {
    await useStore.getState().hydrate();
    useStore.getState().dismissAlert('a3');
    await new Promise((r) => setTimeout(r, 20));

    useStore.setState({ medicines: MEDICINES, doseLog: [], dismissedAlerts: [], hydrated: false });
    await useStore.getState().hydrate();

    expect(useStore.getState().dismissedAlerts).toContain('a3');
  });

  it('persists an added medicine across a reload', async () => {
    await useStore.getState().hydrate();
    const newMed = { ...MEDICINES[0], id: 'custom-x', name: 'My Vitamin' };
    useStore.getState().addMedicine(newMed);
    await new Promise((r) => setTimeout(r, 20));

    useStore.setState({ medicines: MEDICINES, doseLog: [], dismissedAlerts: [], hydrated: false });
    await useStore.getState().hydrate();

    expect(useStore.getState().medicines.find((m) => m.id === 'custom-x')?.name).toBe('My Vitamin');
  });

  it('computes todayMg from the persisted dose log', async () => {
    await useStore.getState().hydrate();
    const baseline = useStore.getState().todayMg('tylenol'); // seeded doses for today
    useStore.getState().logDose({ medicineId: 'tylenol', count: 2, mg: 1000, symptoms: [] });
    useStore.getState().logDose({ medicineId: 'tylenol', count: 1, mg: 500, symptoms: [] });
    await new Promise((r) => setTimeout(r, 20));

    expect(useStore.getState().todayMg('tylenol')).toBe(baseline + 1500);
  });
});
