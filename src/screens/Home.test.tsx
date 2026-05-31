import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomeScreen } from './Home';

describe('HomeScreen', () => {
  it('renders the shelves and the medicine count', () => {
    render(<HomeScreen go={vi.fn()} />);
    expect(screen.getByText('Daily')).toBeInTheDocument();
    expect(screen.getByText('Allergy & Cold')).toBeInTheDocument();
    expect(screen.getByText('Pain & Fever')).toBeInTheDocument();
    expect(screen.getByText(/11 medicines · 3 shelves/)).toBeInTheDocument();
  });

  it('navigates to a medicine on tap', async () => {
    const go = vi.fn();
    const { default: userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    render(<HomeScreen go={go} />);
    // Aspirin sits on the Daily shelf; its bottle has an accessible label.
    await user.click(screen.getByLabelText(/Aspirin 81mg/));
    expect(go).toHaveBeenCalledWith('detail', 'aspirin');
  });
});
