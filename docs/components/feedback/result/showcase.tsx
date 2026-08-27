'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import ResultSuccess from './success';
import ResultInfo from './info';
import ResultWarning from './warning';
import Result403 from './403';
import Result404 from './404';
import Result500 from './500';
import ResultError from './error';
import ResultCustomIcon from './customIcon';
import ResultStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "success", title: "Success", description: "Show successful results.", Component: ResultSuccess },
  { file: "info", title: "Info", description: "Show processing results.", Component: ResultInfo },
  { file: "warning", title: "Warning", description: "The result of the warning.", Component: ResultWarning },
  { file: "403", title: "403", description: "you are not authorized to access this page.", Component: Result403 },
  { file: "404", title: "404", description: "The page you visited does not exist.", Component: Result404 },
  { file: "500", title: "500", description: "Something went wrong on server.", Component: Result500 },
  { file: "error", title: "Error", description: "Complex error feedback.", Component: ResultError },
  { file: "customIcon", title: "Custom icon", description: "Custom icon.", Component: ResultCustomIcon },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Result by passing objects/functions through classNames and styles.", Component: ResultStyleClass },
];

export function ResultShowcase() {
  return <Showcase section="feedback" component="result" demos={demos} sources={sources} />;
}
