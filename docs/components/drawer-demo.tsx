'use client';

import { useState } from 'react';
import { Button, Drawer, DrawerClose } from '@ceebee/ui/client';
import { Demo } from './demo';

const CODE = `<Drawer open={open} onOpenChange={setOpen} title="Pages">
  <nav>...</nav>
</Drawer>`;

export function DrawerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Demo code={CODE}>
      <Button onClick={() => setOpen(true)}>Open navigation</Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Pages"
        description="Move between top-level areas."
        footer={<DrawerClose render={<Button variant="outline" tone="neutral">Close</Button>} />}
      >
        <nav aria-label="Pages">
          <Button variant="ghost" tone="neutral">List</Button>
          <Button variant="ghost" tone="neutral">Plans</Button>
          <Button variant="ghost" tone="neutral">Finance</Button>
        </nav>
      </Drawer>
    </Demo>
  );
}
