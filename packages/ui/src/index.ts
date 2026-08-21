/**
 * Server-safe entry: nothing here uses a hook, an event handler, or motion, so a Next app
 * keeps these as Server Components (ADR 0004). Anything interactive lives in `@ceebee/ui/client`.
 */
export { cn } from './lib/cn.js';
export type { Tone, Size, DecorHue } from './lib/cn.js';

export { Surface } from './foundation/surface.js';
export type { SurfaceProps, SurfaceVariant } from './foundation/surface.js';
export { Stack, Grid, Container } from './foundation/layout.js';
export type { StackProps, GridProps, ContainerProps } from './foundation/layout.js';
export { Text, Heading } from './foundation/text.js';
export type { TextProps, HeadingProps } from './foundation/text.js';

export { Badge } from './feedback/badge.js';
export type { BadgeProps } from './feedback/badge.js';
export { EmptyState } from './feedback/empty-state.js';
export type { EmptyStateProps } from './feedback/empty-state.js';
export { Spinner, ProgressBar } from './feedback/progress.js';
export type { SpinnerProps, ProgressBarProps } from './feedback/progress.js';
export { Timeline } from './data/timeline.js';
export type { TimelineProps, TimelineEntry, TimelineSkeletonProps } from './data/timeline.js';
export { Skeleton } from './feedback/skeleton.js';
export type { SkeletonProps, SkeletonTextProps } from './feedback/skeleton.js';

export { ProgressRing } from './data/progress-ring.js';
export type { ProgressRingProps } from './data/progress-ring.js';
export { ringGeometry } from './data/progress-ring.math.js';
export type { RingGeometry } from './data/progress-ring.math.js';
export { Donut } from './data/donut.js';
export type { DonutProps } from './data/donut.js';
export { donutArcs } from './data/donut.math.js';
export type { DonutSlice, DonutArc } from './data/donut.math.js';
export { Sparkline, BarMini } from './data/sparkline.js';
export type { SparklineProps, BarMiniProps } from './data/sparkline.js';
export { sparklineGeometry } from './data/sparkline.math.js';
export type { SparklineGeometry } from './data/sparkline.math.js';
export { Leaderboard } from './data/leaderboard.js';
export type { LeaderboardProps, LeaderboardEntry, LeaderboardSkeletonProps } from './data/leaderboard.js';
export { Avatar, AvatarGroup } from './media/avatar.js';
export type { AvatarProps, AvatarGroupProps } from './media/avatar.js';
export { initialsOf, hueForName } from './media/avatar.util.js';
export { Breadcrumbs } from './nav/breadcrumbs.js';
export type { BreadcrumbsProps, Crumb } from './nav/breadcrumbs.js';
export { Stepper } from './nav/stepper.js';
export type { StepperProps, Step } from './nav/stepper.js';
export { StatCard } from './data/stat-card.js';
export type { StatCardProps, StatCardSkeletonProps } from './data/stat-card.js';
