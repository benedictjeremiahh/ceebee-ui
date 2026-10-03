/** The local storage key shared by the pre-paint bootstrap and ThemeProvider. */
export const THEME_CHOICE_STORAGE_KEY = 'cb-theme';

/**
 * Returns a fixed, DOM-free script for restoring a saved theme before the first paint.
 * Storage and browser API failures are ignored so the server-rendered theme remains usable.
 */
export function getThemeBootstrapScript(): string {
  return `(()=>{try{const choice=localStorage.getItem('cb-theme');if(choice!=='light'&&choice!=='dark'&&choice!=='system')return;const root=document.documentElement;if(choice==='system')root.removeAttribute('data-theme');else root.setAttribute('data-theme',choice);const resolved=choice==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):choice;root.setAttribute('data-cb-theme-mode',resolved)}catch{}})()`;
}
