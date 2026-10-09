import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { useScheduleColumnLabels } from './use-schedule-column-labels.js';

afterEach(() => {
  cleanup();
  document.querySelectorAll('[data-test-schedule-root]').forEach((element) => element.remove());
});

function makeRoot(): { root: HTMLDivElement; ref: ReturnType<typeof createRef<HTMLDivElement>> } {
  const root = document.createElement('div');
  root.dataset.testScheduleRoot = '';
  document.body.append(root);
  const ref = createRef<HTMLDivElement>();
  ref.current = root;
  return { root, ref };
}

function addHandle(root: HTMLDivElement, attributes: Record<string, string> = {}): HTMLButtonElement {
  const header = document.createElement('div');
  header.className = 'wx-header';
  const handle = document.createElement('button');
  handle.className = 'wx-grip';
  handle.setAttribute('aria-label', 'Resize column');
  for (const [name, value] of Object.entries(attributes)) handle.setAttribute(name, value);
  header.append(handle);
  root.append(header);
  return handle;
}

describe('useScheduleColumnLabels', () => {
  it('labels existing header handles without changing their interaction attributes', async () => {
    const { root, ref } = makeRoot();
    const handle = addHandle(root, { role: 'separator', tabindex: '0', 'data-gesture': 'resize' });
    const { root: outsideRoot } = makeRoot();
    const outside = addHandle(outsideRoot);
    renderHook(() => useScheduleColumnLabels(ref, true, 'Resize work period'));

    await waitFor(() => expect(handle).toHaveAttribute('aria-label', 'Resize work period'));
    expect(handle).toHaveAttribute('role', 'separator');
    expect(handle).toHaveAttribute('tabindex', '0');
    expect(handle).toHaveAttribute('data-gesture', 'resize');
    expect(outside).toHaveAttribute('aria-label', 'Resize column');
  });

  it('labels handles added or replaced later and restores the consumer label after a reset', async () => {
    const { root, ref } = makeRoot();
    renderHook(() => useScheduleColumnLabels(ref, true, 'Resize work period'));

    const first = addHandle(root);
    await waitFor(() => expect(first).toHaveAttribute('aria-label', 'Resize work period'));
    first.remove();
    const replacement = addHandle(root);
    await waitFor(() => expect(replacement).toHaveAttribute('aria-label', 'Resize work period'));
    replacement.setAttribute('aria-label', 'Resize column');
    await waitFor(() => expect(replacement).toHaveAttribute('aria-label', 'Resize work period'));
  });

  it('uses the latest consumer label', async () => {
    const { root, ref } = makeRoot();
    const handle = addHandle(root);
    const { rerender } = renderHook(
      ({ label }: { label: string }) => useScheduleColumnLabels(ref, true, label),
      { initialProps: { label: 'Resize work period' } },
    );
    await waitFor(() => expect(handle).toHaveAttribute('aria-label', 'Resize work period'));

    rerender({ label: 'Adjust schedule column' });
    await waitFor(() => expect(handle).toHaveAttribute('aria-label', 'Adjust schedule column'));
  });

  it('does not update handles while disabled or after the root is disconnected', async () => {
    const { root, ref } = makeRoot();
    const handle = addHandle(root);
    const { rerender } = renderHook(
      ({ enabled }: { enabled: boolean }) => useScheduleColumnLabels(ref, enabled, 'Resize work period'),
      { initialProps: { enabled: false } },
    );
    expect(handle).toHaveAttribute('aria-label', 'Resize column');

    rerender({ enabled: true });
    await waitFor(() => expect(handle).toHaveAttribute('aria-label', 'Resize work period'));
    root.remove();
    handle.setAttribute('aria-label', 'Resize column');
    await act(async () => {});
    expect(handle).toHaveAttribute('aria-label', 'Resize column');
  });
});
