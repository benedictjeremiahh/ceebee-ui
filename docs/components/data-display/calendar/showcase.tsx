'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import CalendarBasic from './basic';
import CalendarNoticeCalendar from './notice-calendar';
import CalendarEventRange from './event-range';
import CalendarCard from './card';
import CalendarSelect from './select';
import CalendarLunar from './lunar';
import CalendarWeek from './week';
import CalendarCustomizeHeader from './customize-header';
import CalendarStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "A basic calendar component with Year/Month switch.", Component: CalendarBasic },
  { file: "notice-calendar", title: "Notice Calendar", description: "This component can be rendered by using dateCellRender and monthCellRender with the data you need.", Component: CalendarNoticeCalendar },
  { file: "event-range", title: "Event Range", description: "Render event ranges across days with cellRender. The example calculates whether each date is the start, middle, end, or a single-day event and draws compact range bars.", Component: CalendarEventRange },
  { file: "card", title: "Card", description: "Nested inside a container element for rendering in limited space.", Component: CalendarCard },
  { file: "select", title: "Selectable Calendar", description: "A basic calendar component with Year/Month switch.", Component: CalendarSelect },
  { file: "lunar", title: "Annotated Calendar", description: "Annotate each cell with a second layer of meaning \u2014 holidays, ISO weeks, fiscal quarters \u2014 with fullCellRender and a custom header.", Component: CalendarLunar },
  { file: "week", title: "Show Week", description: "Show week number in fullscreen calendar by setting showWeek prop to true.", Component: CalendarWeek },
  { file: "customize-header", title: "Customize Header", description: "Customize Calendar header content.", Component: CalendarCustomizeHeader },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Calendar by passing objects/functions through classNames and styles.", Component: CalendarStyleClass },
];

export function CalendarShowcase() {
  return <Showcase section="data-display" component="calendar" demos={demos} sources={sources} />;
}
