'use client';

import { Check, Copy } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button, useMotionSettings } from '@ceebee/ui/client';
import { Text } from '@ceebee/ui';

export interface DemoProps {
  children: ReactNode;
  code: string;
  /** `block` when the example needs full width (tables, dashboards) rather than a row of controls. */
  layout?: 'row' | 'block';
}

export function Demo({ children, code, layout = 'row' }: DemoProps) {
  const [copied, setCopied] = useState(false);
  const { enabled } = useMotionSettings();

  return (
    <div className="demo">
      <div className="demo__stage" data-layout={layout}>
        {children}
      </div>
      <div className="demo__bar">
        <Text size="xs" tone="subtle">
          {enabled ? 'Motion on' : 'Reduced motion'}
        </Text>
        <Button
          size="sm"
          variant="ghost"
          tone="neutral"
          iconStart={copied ? <Check size={14} /> : <Copy size={14} />}
          onClick={() => {
            void navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <pre className="demo__code">
        <code>{code}</code>
      </pre>
    </div>
  );
}
