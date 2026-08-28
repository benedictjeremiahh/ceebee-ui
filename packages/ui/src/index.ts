/**
 * Server-safe entry: nothing here uses a hook, an event handler, or motion, so a Next app
 * keeps these as Server Components. Anything interactive lives in `@ceebee/ui/client`.
 */
export { cn } from './lib/cn.js';
export type { Tone, Size, DecorHue } from './lib/cn.js';

export { Surface } from './foundation/surface.js';
export type { GlassStyle, PaperTilt, SurfaceProps, SurfaceVariant } from './foundation/surface.js';
export { Flex, Grid, Container } from './foundation/layout.js';
export type { StackProps, GridProps, ContainerProps } from './foundation/layout.js';
export { Text, Heading } from './foundation/text.js';
export type { TextProps, HeadingProps } from './foundation/text.js';
export { PageContainer, PageContainerSkeleton } from './foundation/page-container/index.js';
export type { PageContainerProps, PageContainerSkeletonProps } from './foundation/page-container/index.js';

export { Donut } from './data/donut.js';
export type { DonutProps } from './data/donut.js';
export { donutArcs } from './data/donut.math.js';
export type { DonutSlice, DonutArc } from './data/donut.math.js';
export { Sparkline, BarMini } from './data/sparkline.js';
export type { SparklineProps, BarMiniProps } from './data/sparkline.js';
export { sparklineGeometry } from './data/sparkline.math.js';
export type { SparklineGeometry } from './data/sparkline.math.js';
export { Leaderboard } from './data/leaderboard.js';
export type { LeaderboardProps, LeaderboardEntry } from './data/leaderboard.js';
