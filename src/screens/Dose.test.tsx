import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DoseSheet } from './Dose';
import { useStore } from '../store/useStore';

describe('DoseSheet', () => {
  it('warns when the projected dose exceeds the daily max', () => {
    // Tylenol is seeded at 2.5 g today; the default 2-caplet dose (1 g) tips over 3 g.
    render(<DoseSheet medicineId="tylenol" onClose={vi.fn()} onLog={vi.fn()} />);
    expect(screen.getByText(/Above daily max/)).toBeInTheDocument();
  });

  it('logs a dose and decrements stock', async () => {
    const user = userEvent.setup();
    const onLog = vi.fn();
    const before = useStore.getState().medicines.find((m) => m.id === 'vit-d')!.stock;

    render(<DoseSheet medicineId="vit-d" onClose={vi.fn()} onLog={onLog} />);
    await user.click(screen.getByRole('button', { name: /Log 1 softgel/ }));

    const after = useStore.getState().medicines.find((m) => m.id === 'vit-d')!.stock;
    expect(after).toBe(before - 1);
  });
});
