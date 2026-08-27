'use client';

import React from 'react';
import { Button, Empty, Typography } from '@ceebee/ui/client';

const App: React.FC = () => (
  <Empty
    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
    styles={{ image: { height: 60 } }}
    description={
      <Typography.Text>
        Customize <a href="#API">Description</a>
      </Typography.Text>
    }
  >
    <Button type="primary">Create Now</Button>
  </Empty>
);

export default App;
