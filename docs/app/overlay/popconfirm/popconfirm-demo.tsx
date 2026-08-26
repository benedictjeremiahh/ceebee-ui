'use client';

import { Button, Popconfirm } from '@ceebee/ui/client';

export function PopconfirmDemo() {
  return (
    <Popconfirm
      trigger={<Button variant="outline">Delete draft</Button>}
      title="Delete this draft?"
      description="This action cannot be undone."
      cancelAction={<Button variant="ghost">Keep draft</Button>}
      confirmAction={<Button tone="danger">Delete</Button>}
    />
  );
}

