import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MotionProvider } from '../../motion/motion-provider.js';
import { StickerGroup } from './sticker-group.js';

describe('StickerGroup', () => {
  it('dismisses the controlled item through one named button', () => {
    const onDismiss = vi.fn();
    render(
      <StickerGroup
        items={[{ id: 'jakarta', label: 'Jakarta', hue: 'rose' }]}
        onDismiss={onDismiss}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Remove Jakarta' }));
    expect(onDismiss).toHaveBeenCalledWith('jakarta');
  });

  it('uses the injected accessible label for rich content', () => {
    render(
      <StickerGroup
        items={[{ id: 'saved', label: <strong>Saved</strong>, ariaLabel: 'saved places' }]}
        getDismissLabel={(item) => `Clear ${item.ariaLabel}`}
        onDismiss={() => undefined}
      />,
    );

    expect(screen.getByRole('button', { name: 'Clear saved places' })).toBeInTheDocument();
  });

  it('keeps the final state visible when motion is disabled', () => {
    const { container } = render(
      <MotionProvider enabled={false}>
        <StickerGroup items={[{ id: 'one', label: 'One' }]} onDismiss={() => undefined} />
      </MotionProvider>,
    );

    expect(container.querySelector('.cb-sticker-group__item')).toHaveStyle({ opacity: '1' });
  });

  it('ships a named loading state', () => {
    render(<StickerGroup.Skeleton count={2} label="Loading selected places" />);
    expect(screen.getByRole('status', { name: 'Loading selected places' }).children).toHaveLength(2);
  });
  it('keeps each sticker at its own angle when another one leaves', () => {
    const items = [
      { id: 'jakarta', label: 'Jakarta' },
      { id: 'bandung', label: 'Bandung' },
      { id: 'bogor', label: 'Bogor' },
    ];
    /* The exiting sticker is still mounted while its exit plays, so the angle is read from the
       sticker itself rather than from where it sits in the list. */
    const angleOf = (name: string) => screen
      .getByRole('button', { name: `Remove ${name}` })
      .closest('.cb-sticker-group__item')
      ?.getAttribute('data-tilt');

    const { rerender } = render(<StickerGroup items={items} onDismiss={() => undefined} />);
    const before = angleOf('Bogor');

    rerender(<StickerGroup items={items.slice(1)} onDismiss={() => undefined} />);

    expect(angleOf('Bogor')).toBe(before);
  });
});
