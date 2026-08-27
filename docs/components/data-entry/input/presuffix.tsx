'use client';

import React from 'react';
import { InfoCircleOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Input, Tooltip } from '@ceebee/ui/client';

const App: React.FC = () => (
  <>
    <Input
      placeholder="Enter your username"
      prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
      suffix={
        <Tooltip title="Extra information">
          <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
        </Tooltip>
      }
    />
    <br />
    <br />
    <Input prefix="$" suffix="USD" />
    <br />
    <br />
    <Input prefix="$" suffix="USD" disabled />
    <br />
    <br />
    <Input.Password
      suffix={<LockOutlined />} // `suffix` available since `5.27.0`
      placeholder="input password support suffix"
    />
  </>
);

export default App;
