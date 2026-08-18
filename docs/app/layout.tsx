import type { ReactNode } from 'react';
import { MotionProvider, ThemeProvider, ToastProvider } from '@ceebee/ui/client';
import { Nav } from '../components/nav';
import { Toolbar } from '../components/toolbar';
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
            <div className="docs">
              <Nav />
              <main className="docs__main">
                <Toolbar />
                {children}
              </main>
            </div>
            </ToastProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
