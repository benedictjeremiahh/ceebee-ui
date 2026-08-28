'use client';

import { useState } from 'react';
import { Button, StickerGroup, type StickerItem } from '@ceebee/ui/client';
import { Demo } from './demo';

const INITIAL_ITEMS: StickerItem[] = [
  { id: 'food', label: 'Food', hue: 'rose' },
  { id: 'jakarta', label: 'Jakarta', hue: 'amber' },
  { id: 'saved', label: 'Saved places', hue: 'violet' },
];

export function StickerGroupDemo() {
  const [items, setItems] = useState(INITIAL_ITEMS);

  return (
    <Demo
      layout="block"
      code={`const [items, setItems] = useState(initialItems);

<StickerGroup
  label="Active filters"
  items={items}
  onDismiss={(id) => setItems((current) => current.filter((item) => item.id !== id))}
/>`}
    >
      <StickerGroup
        label="Active filters"
        items={items}
        onDismiss={(id) => setItems((current) => current.filter((item) => item.id !== id))}
      />
      {items.length === 0 ? (
        <div className="docs__inline-controls">
          <Button size="small" onClick={() => setItems(INITIAL_ITEMS)}>Restore stickers</Button>
        </div>
      ) : null}
    </Demo>
  );
}
