'use client';

import { useState } from 'react';
import { Button, Modal } from '@ceebee/ui/client';
import { Text } from '@ceebee/ui';
import { Demo } from './demo';

const CODE = `const [open, setOpen] = useState(false);

<Modal
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
/>

// The confirmation preset takes the two actions as named slots instead of a footer.
<Modal.Confirm
  open={confirming}
  onOpenChange={setConfirming}
  title="Delete project?"
  description="This cannot be undone."
  tone="danger"
  cancelAction={<Button variant="ghost" tone="neutral" onClick={cancel}>Cancel</Button>}
  confirmAction={<Button tone="danger" onClick={remove}>Delete project</Button>}
/>`;

export function DialogDemo() {
  const [center, setCenter] = useState(false);
  const [end, setEnd] = useState(false);
  const [confirm, setConfirm] = useState(false);

  return (
    <Demo code={CODE}>
      <Button onClick={() => setCenter(true)}>Open centred</Button>
      <Button variant="outline" tone="neutral" onClick={() => setEnd(true)}>
        Open from the corner
      </Button>
      <Button tone="danger" variant="soft" onClick={() => setConfirm(true)}>
        Open confirmation
      </Button>

      <Modal
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
      </Modal>

      <Modal
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

      <Modal.Confirm
        open={confirm}
        onOpenChange={setConfirm}
        title="Delete project?"
        description="This cannot be undone."
        tone="danger"
        cancelAction={
          <Button variant="ghost" tone="neutral" onClick={() => setConfirm(false)}>
            Cancel
          </Button>
        }
        confirmAction={
          <Button tone="danger" onClick={() => setConfirm(false)}>
            Delete project
          </Button>
        }
      />
    </Demo>
  );
}
