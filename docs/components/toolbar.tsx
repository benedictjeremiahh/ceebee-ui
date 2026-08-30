'use client';

import { ExternalLink, Moon, Sun } from 'lucide-react';
import { Button, Select, useTheme } from '@ceebee/ui/client';
import { useEffect, useState } from 'react';

const SKINS = ['default', 'astra', 'clarity', 'moodboard'] as const;
const FLUTTER_DOCS_URL = 'https://ui-flutter.ceebee.biz.id';
type Skin = (typeof SKINS)[number];
const SKIN_LABELS: Record<Skin, string> = {
  default: 'Default skin',
  astra: 'Astra skin',
  clarity: 'Clarity skin',
  moodboard: 'Moodboard · Ceebee List',
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
      <Button
        type="text"
        size="small"
        href={FLUTTER_DOCS_URL}
        target="_blank"
        rel="noreferrer"
        icon={<ExternalLink size={16} />}
      >
        Flutter docs
      </Button>
      <Select<Skin>
        aria-label="Preview skin"
        className="docs__skin-select"
        onChange={setSkin}
        options={SKINS.map((value) => ({ value, label: SKIN_LABELS[value] }))}
        size="small"
        value={skin}
      />
      <Button
        size="small"
        icon={resolved === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
        onClick={() => setChoice(choice === 'dark' ? 'light' : 'dark')}
      >
        {resolved === 'dark' ? 'Dark' : 'Light'}
      </Button>
    </div>
  );
}
