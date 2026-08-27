'use client';

import React from 'react';
import { Alert } from '@ceebee/ui/client';

const App: React.FC = () => (
  <>
    <Alert title="Success Text" type="success" />
    <br />
    <Alert title="Info Text" type="info" />
    <br />
    <Alert title="Warning Text" type="warning" />
    <br />
    <Alert title="Error Text" type="error" />
  </>
);

export default App;
