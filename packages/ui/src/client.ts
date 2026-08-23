/**
 * Client entry: everything that animates, listens, or holds state. Published with a
 * "use client" banner so a Next app never has to add one (ADR 0004).
 */
export { LabelsProvider, useLabels, DEFAULT_LABELS } from './lib/labels.js';
export type { Labels, LabelsProviderProps } from './lib/labels.js';

export { MotionProvider, useMotionSettings } from './motion/motion-provider.js';
export type { MotionProviderProps, MotionSettings, MotionHelpers, SpringPreset, DurationToken } from './motion/motion-provider.js';

export { ThemeProvider, useTheme } from './theme/theme-provider.js';
export type { ThemeChoice } from './theme/theme-provider.js';

export { Button } from './form/button.js';
export type { ButtonProps } from './form/button.js';
export { Field, useFieldWiring } from './form/field.js';
export type { FieldProps } from './form/field.js';
export { Input, Textarea } from './form/input.js';
export type { TextInputProps, TextareaProps } from './form/input.js';
export { Select } from './form/select.js';
export type { SelectProps, SelectOption } from './form/select.js';
export { Checkbox, RadioGroup, Switch } from './form/choice.js';
export type { CheckboxProps, RadioGroupProps, RadioOption, SwitchProps } from './form/choice.js';
export { AutoComplete } from './form/autocomplete.js';
export type { ComboboxProps, ComboboxOption } from './form/autocomplete.js';
export { DatePicker } from './form/date-picker.js';
export type { DateInputProps } from './form/date-picker.js';
export { monthMatrix, parseDateInput, formatISO, isSameDay, isOutOfRange, startOfDay } from './form/date.util.js';
export type { DayCell } from './form/date.util.js';
export { TimePicker } from './form/time-picker.js';
export type { TimeInputProps } from './form/time-picker.js';
export { parseTime, formatTime, timeOptions, timeToMinutes, isTimeOutOfRange } from './form/time.util.js';
export type { TimeValue } from './form/time.util.js';
export { Upload } from './form/upload.js';
export type { UploadProps } from './form/upload.js';
export { partitionFiles, matchesAccept, describeAccept } from './form/upload.util.js';
export type { FileRules, Rejection } from './form/upload.util.js';
export { InputNumber } from './form/input-number.js';
export type { NumberInputProps } from './form/input-number.js';
export { parseNumber, clamp, stepBy, canStep, decimalPlaces } from './form/number.js';
export type { NumberBounds } from './form/number.js';

export { Modal, DialogClose } from './overlay/modal.js';
export type { DialogProps } from './overlay/modal.js';
export { Drawer, DrawerClose } from './overlay/drawer.js';
export type { DrawerProps } from './overlay/drawer.js';
export { CommandPalette } from './overlay/command-palette.js';
export type { CommandPaletteProps, PaletteCommand } from './overlay/command-palette.js';
export { filterCommands, groupCommands, rankCommand } from './overlay/command.util.js';
export type { Command, RankedCommand } from './overlay/command.util.js';
export { Checklist } from './onboarding/checklist.js';
export type { ChecklistProps, ChecklistTask } from './onboarding/checklist.js';
export { Popover, Tooltip } from './overlay/popover.js';
export type { PopoverProps, TooltipProps, Side, Align } from './overlay/popover.js';

export { Tag } from './feedback/tag.js';
export type { TagProps } from './feedback/tag.js';
export { Rate } from './form/rate.js';
export type { RateProps } from './form/rate.js';
export { Alert } from './feedback/alert.js';
export type { AlertProps } from './feedback/alert.js';
export { ToastProvider, useToast } from './feedback/toast.js';
export type { ToastProviderProps, ToastOptions, ToastPosition } from './feedback/toast.js';

export { Tabs } from './nav/tabs.js';
export type { TabsProps, TabItem } from './nav/tabs.js';
export { Dropdown } from './nav/menu.js';
export type { DropdownMenuProps, MenuItem, MenuSection } from './nav/menu.js';
export { Sidebar, TopBar } from './nav/shell.js';
export type { SidebarProps, TopBarProps, NavItem, NavSection } from './nav/shell.js';

export { Table } from './data/table.js';
export type { DataTableProps, DataTableSkeletonProps, Column } from './data/table.js';
export { Pagination } from './data/pagination.js';
export type { PaginationProps } from './data/pagination.js';
export { nextSort, ariaSortFor, pageRange } from './data/table-sort.js';
export type { SortState, SortDirection, PageRange } from './data/table-sort.js';

export { Image } from './media/image.js';
export type { ImageProps } from './media/image.js';
export { Carousel } from './media/carousel.js';
export type { CarouselProps, CarouselSlideProps, CarouselSkeletonProps } from './media/carousel.js';
export { shouldAutoplay } from './media/autoplay.js';
export type { AutoplayConditions } from './media/autoplay.js';

export { Coachmark } from './onboarding/coachmark.js';
export type { CoachmarkProps } from './onboarding/coachmark.js';
export { Tour } from './onboarding/tour.js';
export type { TourProps, TourStep } from './onboarding/tour.js';
export { tourReducer, initialTourState, resolveTarget, hasEnded } from './onboarding/tour-machine.js';
export type { TourState, TourAction, TourStatus, StepTarget } from './onboarding/tour-machine.js';
export type { SeenStore } from './onboarding/seen-store.js';

export { Reveal, Stagger } from './motion/reveal.js';
export type { RevealProps, StaggerProps } from './motion/reveal.js';
