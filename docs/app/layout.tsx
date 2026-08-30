import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { MotionProvider, ThemeProvider, ToastProvider } from '@ceebee/ui/client';
import { DocsShell } from '../components/docs-shell';
import '@ceebee/ui/styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: '@ceebee/ui',
  description: "Ceebee's design system: tokens, primitives, motion, and onboarding.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light dark',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <MotionProvider>
            <ToastProvider>
              <DocsShell>{children}</DocsShell>
            </ToastProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
