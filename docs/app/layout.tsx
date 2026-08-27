import type { ReactNode } from 'react';
import { MotionProvider, ThemeProvider, ToastProvider } from '@ceebee/ui/client';
import { DocsShell } from '../components/docs-shell';
import '@ceebee/ui/styles.css';
import './globals.css';

export const metadata = {
  title: '@ceebee/ui',
  description: "Ceebee's design system: tokens, primitives, motion, and onboarding.",
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
