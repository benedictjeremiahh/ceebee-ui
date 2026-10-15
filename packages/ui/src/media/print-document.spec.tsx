import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PrintDocument } from './print-document.js';

function print(): void {
  fireEvent(window, new Event('beforeprint'));
}

function finishPrint(): void {
  fireEvent(window, new Event('afterprint'));
}

describe('PrintDocument', () => {
  it('prints a clone of only its document and removes the snapshot after printing', () => {
    render(
      <>
        <main data-testid="outside">App content</main>
        <PrintDocument>
          <article id="report" data-testid="report">
            <h1>Report title</h1>
            <img alt="Chart" src="/chart.png" />
          </article>
        </PrintDocument>
      </>,
    );
    const original = screen.getByTestId('report');
    const outside = screen.getByTestId('outside');
    const originalFocusTarget = document.createElement('input');
    original.append(originalFocusTarget);
    originalFocusTarget.value = 'draft';
    originalFocusTarget.focus();

    print();

    const snapshot = document.body.querySelector<HTMLElement>('.cb-print-document-snapshot');
    expect(snapshot).not.toBeNull();
    expect(snapshot?.querySelector('h1')?.textContent).toBe('Report title');
    expect(snapshot?.querySelector('img')?.getAttribute('src')).toBe('/chart.png');
    expect(snapshot?.querySelector('[data-testid="outside"]')).toBeNull();
    const originalIds = new Set([...original.querySelectorAll<HTMLElement>('[id]')].map((element) => element.id));
    expect([...snapshot?.querySelectorAll<HTMLElement>('[id]') ?? []].every((element) => !originalIds.has(element.id))).toBe(true);
    expect(snapshot?.getAttribute('aria-hidden')).toBe('true');
    expect(original.isConnected).toBe(true);
    expect(originalFocusTarget.value).toBe('draft');
    expect(document.activeElement).toBe(originalFocusTarget);

    finishPrint();
    expect(document.body.querySelector('.cb-print-document-snapshot')).toBeNull();
  });

  it('remaps SVG and label references to unique snapshot IDs without changing the live document', () => {
    render(
      <PrintDocument>
        <svg aria-labelledby="chart-title">
          <title id="chart-title">Chart title</title>
          <defs>
            <linearGradient id="chart-gradient"><stop offset="0" /></linearGradient>
            <clipPath id="chart-clip"><circle r="10" /></clipPath>
          </defs>
          <rect fill="url(#chart-gradient)" clipPath="url(#chart-clip)" />
          <a href="#chart-title">Chart link</a>
        </svg>
        <label htmlFor="chart-value">Value</label>
        <input id="chart-value" />
      </PrintDocument>,
    );
    const originalTitle = document.getElementById('chart-title');
    const originalGradient = document.getElementById('chart-gradient');
    const originalRect = document.querySelector('rect');

    print();

    const snapshot = document.querySelector<HTMLElement>('.cb-print-document-snapshot');
    const snapshotTitle = snapshot?.querySelector('title');
    const snapshotGradient = snapshot?.querySelector('linearGradient');
    const snapshotSvg = snapshot?.querySelector('svg');
    const snapshotRect = snapshot?.querySelector('rect');
    const snapshotLink = snapshot?.querySelector('a');
    const snapshotLabel = snapshot?.querySelector('label');
    const snapshotInput = snapshot?.querySelector('input');
    expect(snapshotTitle?.id).not.toBe('chart-title');
    expect(snapshotGradient?.id).not.toBe('chart-gradient');
    expect(snapshotSvg?.getAttribute('aria-labelledby')).toBe(snapshotTitle?.id);
    expect(snapshotRect?.getAttribute('fill')).toBe(`url(#${snapshotGradient?.id})`);
    expect(snapshotRect?.getAttribute('clip-path')).toBe(`url(#${snapshot?.querySelector('clipPath')?.id})`);
    expect(snapshotLink?.getAttribute('href')).toBe(`#${snapshotTitle?.id}`);
    expect(snapshotLabel?.htmlFor).toBe(snapshotInput?.id);
    expect(originalTitle?.id).toBe('chart-title');
    expect(originalGradient?.id).toBe('chart-gradient');
    expect(originalRect?.getAttribute('fill')).toBe('url(#chart-gradient)');
    const documentIds = [...document.querySelectorAll<HTMLElement>('[id]')].map((element) => element.id);
    expect(new Set(documentIds).size).toBe(documentIds.length);
    finishPrint();
  });

  it('cleans up an earlier snapshot when beforeprint repeats', () => {
    render(<PrintDocument><p>Repeated</p></PrintDocument>);
    print();
    const firstSnapshot = document.querySelector('.cb-print-document-snapshot');
    print();
    const snapshots = document.querySelectorAll('.cb-print-document-snapshot');
    expect(snapshots).toHaveLength(1);
    expect(snapshots.item(0)).not.toBe(firstSnapshot);
  });

  it('does not snapshot when inactive', () => {
    const addListener = vi.spyOn(window, 'addEventListener');
    render(<PrintDocument active={false}><p>Inactive</p></PrintDocument>);
    expect(addListener.mock.calls.some(([type]) => type === 'beforeprint')).toBe(false);
    print();
    expect(document.querySelector('.cb-print-document-snapshot')).toBeNull();
    addListener.mockRestore();
  });

  it('lets the last active document in DOM order own printing', () => {
    render(
      <>
        <PrintDocument><p>First document</p></PrintDocument>
        <PrintDocument><p>Last document</p></PrintDocument>
      </>,
    );
    print();
    const snapshot = document.querySelector('.cb-print-document-snapshot');
    expect(snapshot?.textContent).toContain('Last document');
    expect(snapshot?.textContent).not.toContain('First document');
  });

  it('restores theme and marker attributes exactly after printing', () => {
    const root = document.documentElement;
    root.setAttribute('data-theme', 'dark');
    root.setAttribute('data-cb-theme-mode', 'dimmed');
    root.setAttribute('data-cb-printing-document', 'prior');
    render(<PrintDocument colorMode="light"><p>Light print</p></PrintDocument>);

    print();

    expect(root.getAttribute('data-theme')).toBe('light');
    expect(root.getAttribute('data-cb-theme-mode')).toBe('light');
    expect(root.getAttribute('data-cb-printing-document')).toBe('active');
    finishPrint();
    expect(root.getAttribute('data-theme')).toBe('dark');
    expect(root.getAttribute('data-cb-theme-mode')).toBe('dimmed');
    expect(root.getAttribute('data-cb-printing-document')).toBe('prior');
  });

  it('preserves the current theme while printing and makes cleanup idempotent', () => {
    const root = document.documentElement;
    root.setAttribute('data-theme', 'dark');
    root.setAttribute('data-cb-theme-mode', 'dark');
    render(<PrintDocument colorMode="current"><p>Current theme</p></PrintDocument>);
    print();

    expect(root.getAttribute('data-theme')).toBe('dark');
    expect(root.getAttribute('data-cb-theme-mode')).toBe('dark');
    const snapshot = document.querySelector('.cb-print-document-snapshot');
    finishPrint();
    finishPrint();
    expect(document.querySelector('.cb-print-document-snapshot')).toBeNull();
    expect(snapshot?.isConnected).toBe(false);
    expect(root.getAttribute('data-theme')).toBe('dark');
    expect(root.getAttribute('data-cb-theme-mode')).toBe('dark');
  });

  it('restores absent theme and marker attributes and cleans up on unmount', () => {
    const root = document.documentElement;
    root.removeAttribute('data-theme');
    root.removeAttribute('data-cb-theme-mode');
    root.removeAttribute('data-cb-printing-document');
    const view = render(<PrintDocument><p>Unmount</p></PrintDocument>);
    print();
    expect(root.getAttribute('data-theme')).toBe('light');
    view.unmount();
    expect(document.querySelector('.cb-print-document-snapshot')).toBeNull();
    expect(root.hasAttribute('data-theme')).toBe(false);
    expect(root.hasAttribute('data-cb-theme-mode')).toBe(false);
    expect(root.hasAttribute('data-cb-printing-document')).toBe(false);
  });
});
