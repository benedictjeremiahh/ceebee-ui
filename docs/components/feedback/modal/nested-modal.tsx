'use client';

import { useState } from 'react';
import { Button, Input, Modal } from '@ceebee/ui/client';

export default function NestedModal() {
  const [review, setReview] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  return <>
    <Button onClick={() => setReview(true)}>Open review dialog</Button>
    <Modal open={review} title="Review settings" footer={null} onCancel={() => setReview(false)}>
      <p>Keep this review open while completing one focused follow-up task.</p>
      <Button onClick={() => setConfirmation(true)}>Open confirmation</Button>
      <Modal open={confirmation} title="Confirm change" footer={null} onCancel={() => setConfirmation(false)}>
        <p>The review behind this dialog is dimmed. Close this task to return to it.</p>
        <Input aria-label="Confirmation note" placeholder="Optional note" />
        <Button onClick={() => setConfirmation(false)}>Confirm and return</Button>
      </Modal>
    </Modal>
  </>;
}
