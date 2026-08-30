'use client';

import { ExternalLink, Moon, Sun, Waves } from 'lucide-react';
import { Button } from '@ceebee/ui/client';
import { useTheme } from '@ceebee/ui/client';
import { useEffect, useState } from 'react';

const SKINS = ['default', 'astra', 'clarity'] as const;
type Skin = (typeof SKINS)[number];
const SKIN_LABELS: Record<Skin, string> = {
  default: 'Default skin',
  astra: 'Astra skin',
  clarity: 'Clarity skin',
};

/** Also a live demo of the two providers: the toggles below drive the whole page. */
export function Toolbar() {
  const { choice, setChoice, resolved } = useTheme();
  const [skin, setSkin] = useState<Skin>('default');
  const flutterDocsUrl = process.env.NEXT_PUBLIC_CEEBEE_FLUTTER_DOCS_URL;

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
      {flutterDocsUrl ? (
        <Button
          type="text"
          size="small"
          href={flutterDocsUrl}
          target="_blank"
          rel="noreferrer"
          icon={<ExternalLink size={16} />}
        >
          Flutter docs
        </Button>
      ) : null}
      <Button
        type="text"
        size="small"
        icon={<Waves size={16} />}
        onClick={() => {
          const next = SKINS[(SKINS.indexOf(skin) + 1) % SKINS.length];
          setSkin(next ?? 'default');
        }}
      >
        {SKIN_LABELS[skin]}
      </Button>
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
