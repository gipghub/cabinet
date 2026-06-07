import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddScreen } from './Add';
import { useStore } from '../store/useStore';
import { MEDICINES } from '../data/medicines';

beforeEach(() => {
  useStore.setState({ medicines: MEDICINES, doseLog: [], dismissedAlerts: [], hydrated: true });
});

describe('AddScreen', () => {
  it('keeps the save button disabled until a name is entered', async () => {
    render(<AddScreen go={vi.fn()} />);
    const save = screen.getByRole('button', { name: /Add to cabinet/ });
    expect(save).toBeDisabled();
  });

  it('persists a new medicine to the store and navigates to its detail', async () => {
    const user = userEvent.setup();
    const go = vi.fn();
    const before = useStore.getState().medicines.length;

    render(<AddScreen go={go} />);
    await user.type(screen.getByPlaceholderText('e.g. Tylenol'), 'Fish Oil');
    await user.type(screen.getByPlaceholderText('e.g. Acetaminophen'), 'Omega-3');
    await user.click(screen.getByRole('button', { name: /Add to cabinet/ }));

    const meds = useStore.getState().medicines;
    expect(meds).toHaveLength(before + 1);
    const added = meds.find((m) => m.name === 'Fish Oil');
    expect(added).toBeDefined();
    expect(added!.active).toBe('Omega-3');
    // navigates to the new medicine's detail view
    expect(go).toHaveBeenCalledWith('detail', added!.id);
  });

  it('assigns a free shelf slot and a complete 28-day history', async () => {
    const user = userEvent.setup();
    render(<AddScreen go={vi.fn()} />);
    await user.type(screen.getByPlaceholderText('e.g. Tylenol'), 'Magnesium');
    await user.click(screen.getByRole('button', { name: /Add to cabinet/ }));

    const added = useStore.getState().medicines.find((m) => m.name === 'Magnesium')!;
    expect(added.history).toHaveLength(28);
    expect(added.slot).toBeGreaterThanOrEqual(0);
    expect(added.slot).toBeLessThan(4);
    expect(added.fullStock).toBeGreaterThan(0); // never divide-by-zero in stock %
  });
});
