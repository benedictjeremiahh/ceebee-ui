/** Hide only siblings along the ancestor path; the active schedule and its portals stay reachable. */
export function isolateSchedule(root: HTMLElement): () => void {
  const previous: { element: Element; inert: boolean }[] = [];
  let current: Element | null = root;
  while (current?.parentElement) {
    for (const sibling of current.parentElement.children) {
      if (sibling === current) continue;
      previous.push({ element: sibling, inert: sibling.hasAttribute('inert') });
      sibling.setAttribute('inert', '');
    }
    current = current.parentElement;
  }
  return () => {
    for (const entry of previous) if (!entry.inert) entry.element.removeAttribute('inert');
  };
}
