import { create } from 'zustand';
import { get as idbGet, set as idbSet } from 'idb-keyval';
import { MEDICINES, todayISO } from '../data/medicines';
import { requestPersistentStorage } from '../lib/storage';
import type { Medicine, SymptomKey } from '../data/types';

export interface DoseEntry {
  id: string;
  medicineId: string;
  count: number;
  mg: number;
  at: string; // ISO date-time
  symptoms: SymptomKey[];
}

interface PersistShape {
  medicines: Medicine[];
  doseLog: DoseEntry[];
  dismissedAlerts: string[];
}

interface CabinetState extends PersistShape {
  hydrated: boolean;
  hydrate: () => Promise<void>;
  logDose: (entry: Omit<DoseEntry, 'id' | 'at'> & { at?: string }) => void;
  addMedicine: (m: Medicine) => void;
  dismissAlert: (id: string) => void;
  clearAlerts: (ids: string[]) => void;
  /** mg of a medicine's active ingredient taken today. */
  todayMg: (medicineId: string) => number;
}

const IDB_KEY = 'cabinet-state-v1';

// Seed: a couple of Tylenol doses already taken today (2.5 g) so the
// safety meter and dose-projection demonstrate the near-limit state.
function seedDoseLog(): DoseEntry[] {
  const today = todayISO();
  return [
    { id: 'seed-1', medicineId: 'tylenol', count: 2, mg: 1000, at: `${today}T08:10:00`, symptoms: ['h'] },
    { id: 'seed-2', medicineId: 'tylenol', count: 1, mg: 500, at: `${today}T12:30:00`, symptoms: [] },
    { id: 'seed-3', medicineId: 'tylenol', count: 2, mg: 1000, at: `${today}T16:05:00`, symptoms: ['h'] },
  ];
}

function initialState(): PersistShape {
  return {
    medicines: MEDICINES,
    doseLog: seedDoseLog(),
    dismissedAlerts: [],
  };
}

async function persist(state: PersistShape): Promise<void> {
  try {
    await idbSet(IDB_KEY, state);
  } catch {
    /* storage unavailable — stay in-memory */
  }
}

export const useStore = create<CabinetState>((set, get) => ({
  ...initialState(),
  hydrated: false,

  hydrate: async () => {
    // Ask the browser to keep our IndexedDB data durable (not evicted under
    // storage pressure / inactivity). Best-effort; never blocks hydration.
    void requestPersistentStorage();

    let saved: PersistShape | undefined;
    try {
      saved = await idbGet<PersistShape>(IDB_KEY);
    } catch {
      saved = undefined;
    }
    if (saved) {
      set({ ...saved, hydrated: true });
    } else {
      const fresh = initialState();
      await persist(fresh);
      set({ ...fresh, hydrated: true });
    }
  },

  logDose: (entry) => {
    const doseLog: DoseEntry[] = [
      ...get().doseLog,
      {
        ...entry,
        id: `dose-${Date.now()}`,
        at: entry.at ?? new Date().toISOString(),
      },
    ];
    // Decrement stock for the dosed medicine.
    const medicines = get().medicines.map((m) =>
      m.id === entry.medicineId
        ? { ...m, stock: Math.max(0, m.stock - entry.count) }
        : m,
    );
    set({ doseLog, medicines });
    void persist({ medicines, doseLog, dismissedAlerts: get().dismissedAlerts });
  },

  addMedicine: (m) => {
    const medicines = [...get().medicines, m];
    set({ medicines });
    void persist({ medicines, doseLog: get().doseLog, dismissedAlerts: get().dismissedAlerts });
  },

  dismissAlert: (id) => {
    const dismissedAlerts = [...get().dismissedAlerts, id];
    set({ dismissedAlerts });
    void persist({ medicines: get().medicines, doseLog: get().doseLog, dismissedAlerts });
  },

  clearAlerts: (ids) => {
    const dismissedAlerts = Array.from(new Set([...get().dismissedAlerts, ...ids]));
    set({ dismissedAlerts });
    void persist({ medicines: get().medicines, doseLog: get().doseLog, dismissedAlerts });
  },

  todayMg: (medicineId) => {
    const today = todayISO();
    return get()
      .doseLog.filter((d) => d.medicineId === medicineId && d.at.slice(0, 10) === today)
      .reduce((sum, d) => sum + d.mg, 0);
  },
}));
