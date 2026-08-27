'use client';

import React from 'react';
import { Calendar } from '@ceebee/ui/client';

const App: React.FC = () => (
  <>
    <Calendar fullscreen showWeek />
    <br />
    <Calendar fullscreen={false} showWeek />
  </>
);

export default App;
