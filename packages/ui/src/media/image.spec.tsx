import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LABELS, LabelsProvider, type Labels } from '../lib/labels.js';
import { Image } from './image.js';

const localizedLabels = {
  close: 'Tutup',
  imagePrevious: 'Gambar sebelumnya',
  imageNext: 'Gambar berikutnya',
  imageFlipHorizontal: 'Balik horizontal',
  imageFlipVertical: 'Balik vertikal',
  imageRotateLeft: 'Putar kiri',
  imageRotateRight: 'Putar kanan',
  imageZoomOut: 'Perkecil',
  imageZoomIn: 'Perbesar',
};

async function previewRoot(): Promise<HTMLElement> {
  return waitFor(() => {
    const root = document.querySelector<HTMLElement>('.ant-image-preview[role="dialog"]');
    if (!root) throw new Error('Image preview root did not render');
    return root;
  });
}

describe('Image preview labels', () => {
  it('keeps older complete Labels objects assignable and falls back to English image names', async () => {
    type ImageLabelKey =
      | 'imagePrevious'
      | 'imageNext'
      | 'imageFlipHorizontal'
      | 'imageFlipVertical'
      | 'imageRotateLeft'
      | 'imageRotateRight'
      | 'imageZoomOut'
      | 'imageZoomIn';
    const legacyLabels: Omit<Labels, ImageLabelKey> = DEFAULT_LABELS;
    render(
      <LabelsProvider labels={legacyLabels}>
        <Image alt="A landscape" src="/landscape.jpg" preview={{ open: true }} />
      </LabelsProvider>,
    );

    const controls = within(await previewRoot());
    expect(controls.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(controls.getByRole('button', { name: 'Zoom in' })).toBeInTheDocument();
  });

  it('localizes single-image preview controls and preserves the close callback', async () => {
    const afterOpenChange = vi.fn();
    const { container } = render(
      <LabelsProvider labels={localizedLabels}>
        <Image
          alt="A landscape"
          src="/landscape.jpg"
          preview={{ afterOpenChange }}
        />
      </LabelsProvider>,
    );

    const trigger = screen.getByRole('button', { name: 'A landscape' });
    trigger.focus();
    fireEvent.click(trigger);
    const controls = within(await previewRoot());
    for (const name of [
      localizedLabels.close,
      localizedLabels.imageFlipHorizontal,
      localizedLabels.imageFlipVertical,
      localizedLabels.imageRotateLeft,
      localizedLabels.imageRotateRight,
      localizedLabels.imageZoomOut,
      localizedLabels.imageZoomIn,
    ]) {
      expect(controls.getByRole('button', { name })).toBeInTheDocument();
    }
    await waitFor(() => expect(afterOpenChange).toHaveBeenCalledWith(true));

    const zoomIn = controls.getByRole('button', { name: 'Perbesar' });
    zoomIn.setAttribute('aria-label', 'zoomIn');
    await waitFor(() => expect(controls.getByRole('button', { name: 'Perbesar' })).toBe(zoomIn));

    fireEvent.click(controls.getByRole('button', { name: 'Tutup' }));
    await waitFor(() => expect(afterOpenChange).toHaveBeenCalledWith(false));
    expect(document.activeElement).toBe(trigger);
    expect(container.querySelector('.ant-image')).toBeInTheDocument();
  });

  it('localizes grouped navigation and leaves group changes wired', async () => {
    const onChange = vi.fn();
    render(
      <LabelsProvider labels={localizedLabels}>
        <Image.PreviewGroup preview={{ open: true, onChange }}>
          <Image alt="First landscape" src="/first.jpg" />
          <Image alt="Second landscape" src="/second.jpg" />
        </Image.PreviewGroup>
      </LabelsProvider>,
    );

    const controls = within(await previewRoot());
    expect(controls.getByRole('button', { name: 'Gambar sebelumnya' })).toBeDisabled();
    fireEvent.click(controls.getByRole('button', { name: 'Gambar berikutnya' }));
    expect(onChange).toHaveBeenCalledWith(1, 0);
    fireEvent.keyDown(window, { key: 'ArrowLeft', keyCode: 37 });
    expect(onChange).toHaveBeenCalledWith(0, 1);
  });

  it('updates names from LabelsProvider while a preview is open', async () => {
    const { rerender } = render(
      <LabelsProvider labels={localizedLabels}>
        <Image alt="A landscape" src="/landscape.jpg" preview={{ open: true }} />
      </LabelsProvider>,
    );

    const controls = within(await previewRoot());
    expect(controls.getByRole('button', { name: 'Perbesar' })).toBeInTheDocument();

    rerender(
      <LabelsProvider labels={{ ...localizedLabels, imageZoomIn: 'Besarkan' }}>
        <Image alt="A landscape" src="/landscape.jpg" preview={{ open: true }} />
      </LabelsProvider>,
    );
    expect(controls.getByRole('button', { name: 'Besarkan' })).toBeInTheDocument();
    expect(controls.queryByRole('button', { name: 'Perbesar' })).toBeNull();
  });

  it('localizes a preview opened by a controlled prop update', async () => {
    const { rerender } = render(
      <LabelsProvider labels={localizedLabels}>
        <Image alt="A landscape" src="/landscape.jpg" preview={{ open: false }} />
      </LabelsProvider>,
    );

    rerender(
      <LabelsProvider labels={localizedLabels}>
        <Image alt="A landscape" src="/landscape.jpg" preview={{ open: true }} />
      </LabelsProvider>,
    );

    const controls = within(await previewRoot());
    await waitFor(() => expect(controls.getByRole('button', { name: 'Perbesar' })).toBeInTheDocument());
  });

  it('keeps simultaneous previews scoped to their own labels', async () => {
    render(
      <>
        <LabelsProvider labels={{ ...localizedLabels, imageZoomIn: 'Perbesar kiri' }}>
          <Image alt="First landscape" src="/first.jpg" preview={{ open: true }} />
        </LabelsProvider>
        <LabelsProvider labels={{ ...localizedLabels, imageZoomIn: 'Perbesar kanan' }}>
          <Image alt="Second landscape" src="/second.jpg" preview={{ open: true }} />
        </LabelsProvider>
      </>,
    );

    await waitFor(() => expect(document.querySelectorAll('.ant-image-preview[role="dialog"]')).toHaveLength(2));
    const previews = [...document.querySelectorAll<HTMLElement>('.ant-image-preview[role="dialog"]')];
    expect(within(previews[0] ?? document.body).getByRole('button', { name: 'Perbesar kiri' })).toBeInTheDocument();
    expect(within(previews[1] ?? document.body).getByRole('button', { name: 'Perbesar kanan' })).toBeInTheDocument();
  });

  it('merges the owned portal class with consumer classNames callbacks', async () => {
    render(
      <LabelsProvider labels={localizedLabels}>
        <Image
          alt="A landscape"
          className="consumer-image"
          src="/landscape.jpg"
          classNames={({ props }) => ({ popup: { root: props.className } })}
          preview={{ open: true }}
        />
      </LabelsProvider>,
    );

    const preview = await previewRoot();
    expect(preview).toHaveClass('consumer-image');
    expect(preview.className.split(' ').some((name) => name.startsWith('cb-image-preview-'))).toBe(true);
    expect(within(preview).getByRole('button', { name: 'Perbesar' })).toBeInTheDocument();
  });

  it('disconnects only its popup observer after the close transition', async () => {
    const observe = vi.spyOn(MutationObserver.prototype, 'observe');
    const disconnect = vi.spyOn(MutationObserver.prototype, 'disconnect');
    try {
      render(
        <LabelsProvider labels={localizedLabels}>
          <Image alt="A landscape" src="/landscape.jpg" />
        </LabelsProvider>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'A landscape' }));
      const ownerIndex = await waitFor(() => {
        const index = observe.mock.calls.findIndex(([target, options]) =>
          target instanceof HTMLElement &&
          [...target.classList].some((name) => name.startsWith('cb-image-preview-')) &&
          options?.attributeFilter?.includes('aria-label') === true,
        );
        if (index < 0) throw new Error('Owned preview observer was not attached');
        return index;
      });
      const owner = observe.mock.contexts[ownerIndex];
      if (!owner) throw new Error('Owned preview observer was not captured');

      fireEvent.click(within(await previewRoot()).getByRole('button', { name: 'Tutup' }));
      await waitFor(() => expect(disconnect.mock.contexts).toContain(owner));
    } finally {
      observe.mockRestore();
      disconnect.mockRestore();
    }
  });

  it('disconnects its popup observer when the owner unmounts', async () => {
    const observe = vi.spyOn(MutationObserver.prototype, 'observe');
    const disconnect = vi.spyOn(MutationObserver.prototype, 'disconnect');
    try {
      const { unmount } = render(
        <LabelsProvider labels={localizedLabels}>
          <Image alt="A landscape" src="/landscape.jpg" preview={{ open: true }} />
        </LabelsProvider>,
      );

      const ownerIndex = await waitFor(() => {
        const index = observe.mock.calls.findIndex(([target, options]) =>
          target instanceof HTMLElement &&
          [...target.classList].some((name) => name.startsWith('cb-image-preview-')) &&
          options?.attributeFilter?.includes('aria-label') === true,
        );
        if (index < 0) throw new Error('Owned preview observer was not attached');
        return index;
      });
      const owner = observe.mock.contexts[ownerIndex];
      if (!owner) throw new Error('Owned preview observer was not captured');

      unmount();
      await waitFor(() => expect(disconnect.mock.contexts).toContain(owner));
    } finally {
      observe.mockRestore();
      disconnect.mockRestore();
    }
  });
});
