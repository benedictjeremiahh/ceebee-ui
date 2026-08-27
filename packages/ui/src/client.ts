/**
 * Client entry: everything that animates, listens, or holds state. Published with a
 * "use client" banner so a Next app never has to add one.
 *
 * Most of this surface is the pinned Ant Design 6.6.1 runtime, themed by Ceebee's ThemeProvider and
 * Skins — see THIRD_PARTY_NOTICES.md and docs/component-sources.json for what came from where.
 */
export * from 'antd';
export { ThemeBridge } from './theme/theme-bridge.js';
export type { ThemeBridgeProps } from './theme/theme-bridge.js';

/**
 * Ant publishes its locales as subpath modules rather than from its main entry, and consumers reach
 * them only through this entry.
 */
export { default as enUSLocale } from 'antd/locale/en_US';
export { default as enUSDatePickerLocale } from 'antd/es/date-picker/locale/en_US';
export { default as idIDLocale } from 'antd/locale/id_ID';
export { default as zhCNLocale } from 'antd/locale/zh_CN';
export { LabelsProvider, useLabels, DEFAULT_LABELS } from './lib/labels.js';
export type { Labels, LabelsProviderProps } from './lib/labels.js';

export { MotionProvider, useMotionSettings } from './motion/motion-provider.js';
export type { MotionProviderProps, MotionSettings, MotionHelpers, SpringPreset, DurationToken } from './motion/motion-provider.js';

export { ThemeProvider, useTheme } from './theme/theme-provider.js';
export type { ThemeChoice } from './theme/theme-provider.js';

export { CommandPalette } from './overlay/command-palette.js';
export type { CommandPaletteProps, PaletteCommand } from './overlay/command-palette.js';
export { filterCommands, groupCommands, rankCommand } from './overlay/command.util.js';
export type { Command, RankedCommand } from './overlay/command.util.js';
export { Checklist } from './onboarding/checklist.js';
export type { ChecklistProps, ChecklistTask } from './onboarding/checklist.js';

export { ToastProvider, useToast } from './feedback/toast.js';
export type { ToastProviderProps, ToastOptions, ToastPosition } from './feedback/toast.js';

export { Sidebar, TopBar } from './nav/shell.js';
export type { SidebarProps, TopBarProps, NavItem, NavSection } from './nav/shell.js';

export { Reveal, Stagger } from './motion/reveal.js';
export type { RevealProps, StaggerProps } from './motion/reveal.js';
