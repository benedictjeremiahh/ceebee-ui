type PrintDocumentColorMode = 'light' | 'current';

const PRINTING_ATTRIBUTE = 'data-cb-printing-document';
const THEME_ATTRIBUTES = ['data-theme', 'data-cb-theme-mode'] as const;
const TOKEN_IDREF_ATTRIBUTES = new Set([
  'aria-labelledby',
  'aria-describedby',
  'aria-controls',
  'aria-owns',
  'aria-flowto',
  'headers',
  'itemref',
]);
const SINGLE_IDREF_ATTRIBUTES = new Set([
  'aria-activedescendant',
  'aria-details',
  'aria-errormessage',
  'for',
  'form',
  'list',
]);
let snapshotSequence = 0;

function restoreAttribute(element: Element, name: string, value: string | null): void {
  if (value === null) element.removeAttribute(name);
  else element.setAttribute(name, value);
}

function uniqueSnapshotId(index: number, assignedIds: Set<string>, sequence: number): string {
  let candidate = `cb-print-document-snapshot-${sequence}-${index}`;
  while (assignedIds.has(candidate) || document.getElementById(candidate) !== null) {
    candidate = `cb-print-document-snapshot-${sequence}-${++index}`;
  }
  assignedIds.add(candidate);
  return candidate;
}

function rewriteFragmentReferences(clone: HTMLElement, idMap: Map<string, string>): void {
  const elements: Element[] = [clone, ...clone.querySelectorAll('*')];
  elements.forEach((element) => {
    [...element.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      let value = attribute.value;
      if ((name === 'href' || name === 'xlink:href') && value.startsWith('#')) {
        value = `#${idMap.get(value.slice(1)) ?? value.slice(1)}`;
      } else if (TOKEN_IDREF_ATTRIBUTES.has(name)) {
        value = value.split(/\s+/).map((id) => idMap.get(id) ?? id).join(' ');
      } else if (SINGLE_IDREF_ATTRIBUTES.has(name)) {
        value = idMap.get(value) ?? value;
      }

      value = value.replace(/url\(\s*(["']?)#([^)'"\s]+)\1\s*\)/g, (match, quote: string, id: string) => {
        const replacement = idMap.get(id);
        return replacement ? `url(${quote}#${replacement}${quote})` : match;
      });
      if (value !== attribute.value) element.setAttribute(attribute.name, value);
    });
  });
}

function cloneWithRemappedIds(source: HTMLElement): HTMLElement {
  const clone = source.cloneNode(true);
  if (!(clone instanceof HTMLElement)) throw new Error('Print document clone must be an HTML element');

  clone.removeAttribute('data-cb-print-document');
  clone.querySelectorAll('[data-cb-print-document]').forEach((element) => {
    element.removeAttribute('data-cb-print-document');
  });

  const originalElements = [source, ...source.querySelectorAll('[id]')].filter((element) => element.hasAttribute('id'));
  const clonedElements = [clone, ...clone.querySelectorAll('[id]')].filter((element) => element.hasAttribute('id'));
  const idMap = new Map<string, string>();
  const assignedIds = new Set<string>();
  const sequence = ++snapshotSequence;
  originalElements.forEach((element, index) => {
    const clonedElement = clonedElements[index];
    const originalId = element.getAttribute('id');
    if (!clonedElement || originalId === null) return;
    const snapshotId = uniqueSnapshotId(index, assignedIds, sequence);
    if (!idMap.has(originalId)) idMap.set(originalId, snapshotId);
    clonedElement.setAttribute('id', snapshotId);
  });
  rewriteFragmentReferences(clone, idMap);
  // Embedded style selectors are copied as authored; rewriting CSS selector syntax needs a CSS parser.
  return clone;
}

export function createPrintDocumentSnapshot(
  source: HTMLElement,
  colorMode: PrintDocumentColorMode,
): () => void {
  const root = document.documentElement;
  const previousPrintingMarker = root.getAttribute(PRINTING_ATTRIBUTE);
  const previousTheme = THEME_ATTRIBUTES.map((attribute) => root.getAttribute(attribute));
  const snapshot = document.createElement('div');
  snapshot.className = 'cb-print-document-snapshot';
  snapshot.setAttribute('aria-hidden', 'true');
  snapshot.append(cloneWithRemappedIds(source));
  document.body.append(snapshot);

  root.setAttribute(PRINTING_ATTRIBUTE, 'active');
  if (colorMode === 'light') {
    root.setAttribute('data-theme', 'light');
    root.setAttribute('data-cb-theme-mode', 'light');
  }

  let cleaned = false;
  return () => {
    if (cleaned) return;
    cleaned = true;
    snapshot.remove();
    restoreAttribute(root, PRINTING_ATTRIBUTE, previousPrintingMarker);
    THEME_ATTRIBUTES.forEach((attribute, index) => {
      restoreAttribute(root, attribute, previousTheme[index] ?? null);
    });
  };
}
