'use client';

import { Moon, Sun, Waves } from 'lucide-react';
import { Button, useTheme } from '@ceebee/ui/client';
import { useEffect, useState } from 'react';

/** Also a live demo of the two providers: the toggles below drive the whole page. */
export function Toolbar() {
  const { choice, setChoice, resolved } = useTheme();
  const [skin, setSkin] = useState<'default' | 'astra'>('default');

  useEffect(() => {
    const id = 'cb-skin';
    document.getElementById(id)?.remove();
    if (skin === 'default') return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = '/skins/astra.css';
    document.head.append(link);
  }, [skin]);

  return (
    <div className="docs__toolbar">
      <Button
        variant="ghost"
        size="sm"
        tone="neutral"
        iconStart={<Waves size={16} />}
        onClick={() => setSkin(skin === 'default' ? 'astra' : 'default')}
      >
        {skin === 'default' ? 'Default skin' : 'Astra skin'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        tone="neutral"
        iconStart={resolved === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
        onClick={() => setChoice(choice === 'dark' ? 'light' : 'dark')}
      >
        {resolved === 'dark' ? 'Dark' : 'Light'}
      </Button>
    </div>
  );
}
