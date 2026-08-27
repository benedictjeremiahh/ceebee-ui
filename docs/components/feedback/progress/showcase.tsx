'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import ProgressLine from './line';
import ProgressCircle from './circle';
import ProgressLineMini from './line-mini';
import ProgressCircleMicro from './circle-micro';
import ProgressCircleMini from './circle-mini';
import ProgressDynamic from './dynamic';
import ProgressFormat from './format';
import ProgressDashboard from './dashboard';
import ProgressSegment from './segment';
import ProgressLinecap from './linecap';
import ProgressGradientLine from './gradient-line';
import ProgressSteps from './steps';
import ProgressCircleSteps from './circle-steps';
import ProgressSize from './size';
import ProgressInfoPosition from './info-position';
import ProgressStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "line", title: "Progress bar", description: "A standard progress bar.", Component: ProgressLine },
  { file: "circle", title: "Circular progress bar", description: "A circular progress bar.", Component: ProgressCircle },
  { file: "line-mini", title: "Mini size progress bar", description: "Appropriate for a narrow area.", Component: ProgressLineMini },
  { file: "circle-micro", title: "Responsive circular progress bar", description: "Responsive circular progress bar. When width is smaller than 20, progress information will be displayed in Tooltip.", Component: ProgressCircleMicro },
  { file: "circle-mini", title: "Mini size circular progress bar", description: "A smaller circular progress bar.", Component: ProgressCircleMini },
  { file: "dynamic", title: "Dynamic", description: "A dynamic progress bar is better.", Component: ProgressDynamic },
  { file: "format", title: "Custom text format", description: "You can set a custom text by setting the format prop.", Component: ProgressFormat },
  { file: "dashboard", title: "Dashboard", description: "By setting type=dashboard, you can get a dashboard style of progress easily.", Component: ProgressDashboard },
  { file: "segment", title: "Progress bar with success segment", description: "Show several parts of progress with different status.", Component: ProgressSegment },
  { file: "linecap", title: "Stroke Linecap", description: "By setting strokeLinecap=\"butt\", you can change the linecaps from round to butt, see stroke-linecap for more information.", Component: ProgressLinecap },
  { file: "gradient-line", title: "Custom line gradient", description: "Gradient encapsulation, circle and dashboard will ignore strokeLinecap when setting gradient.", Component: ProgressGradientLine },
  { file: "steps", title: "Progress bar with steps", description: "A progress bar with steps.", Component: ProgressSteps },
  { file: "circle-steps", title: "Circular progress bar with steps", description: "A circular progress bar that support steps and color segments, default gap is 2px.", Component: ProgressCircleSteps },
  { file: "size", title: "Progress size", description: "The size of progress.", Component: ProgressSize },
  { file: "info-position", title: "Change progress value position", description: "Change the position of the progress value, you can use percentPosition to adjust it so that the progress bar value is inside, outside or at the bottom of the progress bar.", Component: ProgressInfoPosition },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Progress by passing objects or functions through classNames and styles.", Component: ProgressStyleClass },
];

export function ProgressShowcase() {
  return <Showcase section="feedback" component="progress" demos={demos} sources={sources} cols={2} />;
}
