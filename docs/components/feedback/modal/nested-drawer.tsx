'use client';

import React, { useState } from 'react';
import { Button, Drawer, Modal } from '@ceebee/ui/client';

const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setDrawerOpen(true)}>
        Open invoice drawer
      </Button>
      <Drawer title="Invoice INV-1" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <p>Review the invoice, then record its payment without leaving this drawer.</p>
        <Button onClick={() => setDialogOpen(true)}>Record nested payment</Button>
        <Modal
          title="Record payment"
          open={dialogOpen}
          footer={null}
          onCancel={() => setDialogOpen(false)}
        >
          <p>Confirm this focused payment before returning to the invoice drawer.</p>
          <Button onClick={() => setDialogOpen(false)}>Close payment dialog</Button>
        </Modal>
      </Drawer>
    </>
  );
};

export default App;
