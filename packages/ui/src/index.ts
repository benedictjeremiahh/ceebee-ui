/**
 * Server-safe entry: nothing here uses a hook, an event handler, or motion, so a Next app
 * keeps these as Server Components (ADR 0004). Anything interactive lives in `@ceebee/ui/client`.
 */
export { cn } from './lib/cn.js';
export type { Tone, Size, DecorHue } from './lib/cn.js';

export { Surface } from './foundation/surface.js';
export type { GlassStyle, SurfaceProps, SurfaceVariant } from './foundation/surface.js';
export { Flex, Grid, Container } from './foundation/layout.js';
export type { StackProps, GridProps, ContainerProps } from './foundation/layout.js';
export { Text, Heading } from './foundation/text.js';
export type { TextProps, HeadingProps } from './foundation/text.js';
export { Space, SpaceSkeleton } from './foundation/space/index.js';
export type {
  SpaceAlign,
  SpaceCompactProps,
  SpaceDirection,
  SpaceProps,
  SpaceSize,
  SpaceSkeletonProps,
  SpaceStep,
} from './foundation/space/index.js';
export { Masonry, MasonrySkeleton } from './foundation/masonry/index.js';
export type {
  MasonryColumns,
  MasonryProps,
  MasonrySkeletonProps,
  MasonryStep,
} from './foundation/masonry/index.js';
export { Affix } from './foundation/affix/index.js';
export type { AffixEdge, AffixOffset, AffixProps } from './foundation/affix/index.js';
export { PageContainer, PageContainerSkeleton } from './foundation/page-container/index.js';
export type { PageContainerProps, PageContainerSkeletonProps } from './foundation/page-container/index.js';

export { LinkButton } from './nav/link-button.js';
export type { LinkButtonProps } from './nav/link-button.js';
export { Anchor, AnchorSkeleton } from './nav/anchor/index.js';
export type {
  AnchorItem,
  AnchorOrientation,
  AnchorProps,
  AnchorSize,
  AnchorSkeletonProps,
  AnchorTone,
} from './nav/anchor/index.js';
export { Divider } from './foundation/divider.js';
export type { DividerProps } from './foundation/divider.js';
export { Badge } from './feedback/badge.js';
export type { BadgeProps } from './feedback/badge.js';
export { Empty } from './feedback/empty.js';
export type { EmptyStateProps } from './feedback/empty.js';
export { Result, ResultSkeleton } from './feedback/result/index.js';
export type { ResultProps, ResultStatus } from './feedback/result/index.js';
export { Notification, NotificationSkeleton } from './feedback/notification/index.js';
export type {
  NotificationProps,
  NotificationSkeletonProps,
  NotificationTone,
} from './feedback/notification/index.js';
export { QRCode } from './data/qr-code/index.js';
export type { QRCodeErrorCorrection, QRCodeProps } from './data/qr-code/index.js';
export { Spin, ProgressBar } from './feedback/progress.js';
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
export { Breadcrumb } from './nav/breadcrumbs.js';
export type { BreadcrumbsProps, Crumb } from './nav/breadcrumbs.js';
export { Steps } from './nav/stepper.js';
export type { StepperProps, Step } from './nav/stepper.js';
export { Statistic } from './data/statistic.js';
export type { StatCardProps, StatCardSkeletonProps } from './data/statistic.js';
export { Card } from './data/card/index.js';
export type { CardProps, CardMetaProps, CardGridProps, CardSkeletonProps } from './data/card/index.js';
export { Descriptions } from './data/descriptions/index.js';
export type {
  DescriptionsItemProps,
  DescriptionsProps,
  DescriptionsSize,
  DescriptionsSkeletonProps,
} from './data/descriptions/index.js';
export { Listy, ListySkeleton } from './data/listy/index.js';
export type { ListyGroup, ListyProps, ListySkeletonProps } from './data/listy/index.js';
