'use client';

import React, { useState } from 'react';
import { Switch, Typography } from '@ceebee/ui/client';

const { Paragraph, Text } = Typography;

const App: React.FC = () => {
  const [ellipsis, setEllipsis] = useState(true);

  return (
    <>
      <Switch
        checked={ellipsis}
        onChange={() => {
          setEllipsis(!ellipsis);
        }}
      />

      <Paragraph ellipsis={ellipsis}>
        Ceebee UI, a design language for background applications, is refined by the Ceebee team. Ant
        Design, a design language for background applications, is refined by the Ceebee team. Ant
        Design, a design language for background applications, is refined by the Ceebee team. Ant
        Design, a design language for background applications, is refined by the Ceebee team. Ant
        Design, a design language for background applications, is refined by the Ceebee team. Ant
        Design, a design language for background applications, is refined by the Ceebee team.
      </Paragraph>

      <Paragraph ellipsis={ellipsis ? { rows: 2, expandable: true, symbol: 'more' } : false}>
        Ceebee UI, a design language for background applications, is refined by the Ceebee team. Ant
        Design, a design language for background applications, is refined by the Ceebee team. Ant
        Design, a design language for background applications, is refined by the Ceebee team. Ant
        Design, a design language for background applications, is refined by the Ceebee team. Ant
        Design, a design language for background applications, is refined by the Ceebee team. Ant
        Design, a design language for background applications, is refined by the Ceebee team.
      </Paragraph>

      <Text
        style={ellipsis ? { width: 200 } : undefined}
        ellipsis={ellipsis ? { tooltip: 'I am ellipsis now!' } : false}
      >
        Ceebee UI, a design language for background applications, is refined by the Ceebee team.
      </Text>

      <Text
        code
        style={ellipsis ? { width: 200 } : undefined}
        ellipsis={ellipsis ? { tooltip: 'I am ellipsis now!' } : false}
      >
        Ceebee UI, a design language for background applications, is refined by the Ceebee team.
      </Text>
    </>
  );
};

export default App;

