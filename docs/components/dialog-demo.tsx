'use client';

import { useState } from 'react';
import { Button, Dialog } from '@ceebee/ui/client';
import { Text } from '@ceebee/ui';

const CODE = `const [open, setOpen] = useState(false);

<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Delete workspace"
  description="This removes every project inside it."
  footer={
    <>
      <Button variant="ghost" tone="neutral" onClick={() => setOpen(false)}>Cancel</Button>
      <Button tone="danger" onClick={confirm}>Delete</Button>
    </>
  }
/>`;

export function DialogDemo() {
  const [center, setCenter] = useState(false);
  const [end, setEnd] = useState(false);

  return (
    <div className="demo">
      <div className="demo__stage">
        <Button onClick={() => setCenter(true)}>Open centred</Button>
        <Button variant="outline" tone="neutral" onClick={() => setEnd(true)}>
          Open from the corner
        </Button>

        <Dialog
          open={center}
          onOpenChange={setCenter}
          title="Delete workspace"
          description="This removes every project inside it. It cannot be undone."
          footer={
            <>
              <Button variant="ghost" tone="neutral" onClick={() => setCenter(false)}>
                Cancel
              </Button>
              <Button tone="danger" onClick={() => setCenter(false)}>
                Delete
              </Button>
            </>
          }
        >
          <Text size="sm" tone="muted">
            Try Escape, or click the backdrop — both close it, and focus returns to the button.
          </Text>
        </Dialog>

        <Dialog
          open={end}
          onOpenChange={setEnd}
          placement="end"
          size="sm"
          title="Saved"
          description="Your changes are live."
          footer={
            <Button size="sm" variant="soft" onClick={() => setEnd(false)}>
              Dismiss
            </Button>
          }
        />
      </div>
      <pre className="demo__code">
        <code>{CODE}</code>
      </pre>
    </div>
  );
}
