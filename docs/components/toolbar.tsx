'use client';

import { ExternalLink, Moon, Sun } from 'lucide-react';
import { Button, Select, Tooltip, useTheme } from '@ceebee/ui/client';
import { useEffect, useState } from 'react';

const SKINS = ['default', 'astra', 'clarity', 'moodboard'] as const;
const FLUTTER_DOCS_URL = 'https://ui-flutter.ceebee.biz.id';
type Skin = (typeof SKINS)[number];
const SKIN_LABELS: Record<Skin, string> = {
  default: 'Default skin',
  astra: 'Astra skin',
  clarity: 'Clarity skin',
  moodboard: 'Moodboard skin',
};

/** Also a live demo of the two providers: the toggles below drive the whole page. */
export function Toolbar() {
  const { choice, setChoice, resolved } = useTheme();
  const [skin, setSkin] = useState<Skin>('default');

  useEffect(() => {
    const id = 'cb-skin';
    document.getElementById(id)?.remove();
    if (skin === 'default') return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `/skins/${skin}.css`;
    document.head.append(link);
  }, [skin]);

  return (
    <div className="docs__toolbar">
      <Tooltip title="Flutter docs (opens in a new tab)">
        <Button
          aria-label="Flutter docs (opens in a new tab)"
          className="docs__toolbar-action"
          type="text"
          size="large"
          href={FLUTTER_DOCS_URL}
          target="_blank"
          rel="noreferrer"
          icon={<ExternalLink size={16} />}
        >
          <span className="docs__toolbar-action-label">Flutter docs</span>
        </Button>
      </Tooltip>
      <Select<Skin>
        aria-label="Preview skin"
        className="docs__skin-select"
        onChange={setSkin}
        options={SKINS.map((value) => ({ value, label: SKIN_LABELS[value] }))}
        size="large"
        value={skin}
      />
      <Tooltip title={resolved === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
        <Button
          aria-label={resolved === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          className="docs__toolbar-action"
          size="large"
          icon={resolved === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
          onClick={() => setChoice(choice === 'dark' ? 'light' : 'dark')}
        >
          <span className="docs__toolbar-action-label">{resolved === 'dark' ? 'Dark' : 'Light'}</span>
        </Button>
      </Tooltip>
    </div>
  );
}
