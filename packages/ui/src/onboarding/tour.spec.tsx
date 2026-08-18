import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tour, type TourStep } from './tour.js';
import type { SeenStore } from './seen-store.js';

const STEPS: TourStep[] = [
  { target: '#one', title: 'Step one', content: 'First thing' },
  { target: '#two', title: 'Step two', content: 'Second thing' },
];

function Targets() {
  return (
    <>
      <button id="one">One</button>
      <button id="two">Two</button>
    </>
  );
}

describe('Tour', () => {
  it('walks the steps and finishes on the last one', async () => {
    const onFinish = vi.fn();
    render(
      <>
        <Targets />
        <Tour id="demo" steps={STEPS} open onFinish={onFinish} />
      </>,
    );

    expect(await screen.findByText('Step one')).toBeInTheDocument();
    expect(screen.getByText('1 of 2')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(await screen.findByText('Step two')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledOnce());
    expect(screen.queryByText('Step two')).toBeNull();
  });

  it('offers Skip on the first step and Back afterwards', async () => {
    render(
      <>
        <Targets />
        <Tour id="demo" steps={STEPS} open />
      </>,
    );

    expect(await screen.findByRole('button', { name: 'Skip' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(await screen.findByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Skip' })).toBeNull();
  });

  it('does not run for someone the Seen Store already knows about', async () => {
    const store: SeenStore = { has: () => true, mark: vi.fn() };
    render(
      <>
        <Targets />
        <Tour id="demo" steps={STEPS} open seenStore={store} />
      </>,
    );

    await waitFor(() => expect(screen.queryByText('Step one')).toBeNull());
    expect(store.mark).not.toHaveBeenCalled();
  });

  it('waits for an async Seen Store before showing anything', async () => {
    const store: SeenStore = { has: async () => false, mark: vi.fn() };
    render(
      <>
        <Targets />
        <Tour id="demo" steps={STEPS} open seenStore={store} />
      </>,
    );

    expect(await screen.findByText('Step one')).toBeInTheDocument();
  });

  it('marks the store once when skipped, not only when completed', async () => {
    const mark = vi.fn();
    const onSkip = vi.fn();
    const store: SeenStore = { has: () => false, mark };
    render(
      <>
        <Targets />
        <Tour id="demo" steps={STEPS} open seenStore={store} onSkip={onSkip} />
      </>,
    );

    await userEvent.click(await screen.findByRole('button', { name: 'Skip' }));
    await waitFor(() => expect(mark).toHaveBeenCalledOnce());
    expect(mark).toHaveBeenCalledWith('demo');
    expect(onSkip).toHaveBeenCalledOnce();
  });

  it('shows nothing at all when it is not open', () => {
    render(
      <>
        <Targets />
        <Tour id="demo" steps={STEPS} />
      </>,
    );
    expect(screen.queryByText('Step one')).toBeNull();
  });
});
