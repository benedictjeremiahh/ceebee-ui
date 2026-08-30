# Flutter port inventory

This is the completion ledger for `ceebee_ui`. It accounts for every component in the web catalog
without pretending that Ant Design and Material 3 share the same geometry or public API.

Classifications:

- `material-native` — consumers use the named Flutter Material API directly; `cbThemeData()` owns
  the Ceebee rendering.
- `ceebee-native` — Ceebee owns a cross-platform contract that Material does not provide.
- `replaced` — Flutter has a different composition that fulfills the same job.
- `deliberately-absent` — a web-only implementation detail with no public Flutter counterpart.

`Done` means implementation, documentation, and the listed compatibility proof exist. A
Composition is not done until its explicit `CbXxxSkeleton` companion exists when required.

## Catalog baseline

| Web catalog entry | Classification | Flutter API or replacement | Status | Required proof |
|---|---|---|---|---|
| Button | material-native | Material button family | Done | Theme + widget + light/dark golden |
| FloatButton | material-native | `FloatingActionButton` | Done | Theme + widget + light/dark golden |
| Typography | material-native | `Text`, `TextTheme` | Done | Theme + light/dark golden |
| Icon | material-native | `Icon`, `IconTheme` | Done | Theme + light/dark golden |
| Divider | material-native | `Divider`, `VerticalDivider` | Done | Theme + light/dark golden |
| Flex | material-native | `Flex`, `Row`, `Column` | Done | Axis reflow test + responsive gallery + light/dark golden |
| Grid | material-native | `GridView`, sliver grids | Done | Narrow/wide reflow + shared sliver-scroll proof + light/dark golden |
| Layout | replaced | `Scaffold`, slivers, safe areas | Done | Safe-area/sliver tests + rail-to-bottom-bar responsive gallery + light/dark golden |
| Masonry | replaced | `GridView`/sliver grids; specialized irregular feeds stay product-owned | Done | Contract audit: no consumer usage; no Flutter SDK masonry substrate |
| Space | replaced | `Wrap`, `Row`, `Column` | Done | Token spacing rhythm + wrapping action gallery + responsive golden |
| Splitter | replaced | `LayoutBuilder` + adaptive navigation/master-detail | Done | Mobile contract audit; pointer/keyboard pane resizing excluded |
| Slider | material-native | `Slider`, `RangeSlider` | Done | Theme + drag interaction + light/dark golden |
| TreeSelect | replaced | selection route/sheet + `ExpansionTile`/`CheckboxListTile` | Done | Mobile progressive-disclosure contract audit |
| DatePicker | material-native | `showDatePicker`, `CalendarDatePicker` | Done | Modal/inline selection + disabled dates + light/dark golden |
| TimePicker | material-native | `showTimePicker`, `TimePickerDialog` | Done | Dial/input selection + dismissal + light/dark golden |
| Switch | material-native | `Switch` | Done | Theme + interaction/disabled semantics + light/dark golden |
| Checkbox | material-native | `Checkbox` | Done | Theme + checked/indeterminate interaction + light/dark golden |
| InputNumber | ceebee-native | `CbInputNumber` | Done | Controlled edit/step + bounds + locale parser/formatter + disabled/read-only semantics + light/dark responsive golden |
| Radio | material-native | `Radio`, `RadioGroup` | Done | Theme + group interaction + light/dark golden |
| Rate | ceebee-native | `CbRating` | Done | Controlled tap/drag + whole/half precision + clear + disabled/RTL adjustable semantics + light/dark golden |
| Dropdown | material-native | `DropdownMenu` | Done | Theme + selection/keyboard + light/dark overlay golden |
| Menu | material-native | `MenuAnchor`, `MenuBar` | Done | Keyboard/focus + cascading dismissal + light/dark golden |
| Pagination | ceebee-native | `CbPagination` + `CbPaginationSkeleton` | Done | Controlled state + endpoint truncation + adaptive compact summary + disabled semantics + reduced motion + light/dark golden |
| Steps | ceebee-native | `CbSteps` + `CbStepsSkeleton` | Done | Derived/override status + optional app navigation + adaptive orientation + disabled/error semantics + reduced motion + light/dark golden |
| Breadcrumb | replaced | `Navigator` route stack + `AppBar` back/up navigation | Done | Native route recovery + semantics; desktop trail, overflow menus, and separator customization deliberately absent |
| Tabs | material-native | `TabBar`, `TabBarView` | Done | Selection + one-visible-panel + light/dark golden |
| Anchor | replaced | sliver navigation + `Scrollable.ensureVisible` | Done | Scroll-state + docs |
| AutoComplete | material-native | `Autocomplete` | Done | Theme + filtering/selection + light/dark golden |
| Cascader | replaced | successive selection routes or modal sheets | Done | Mobile hierarchical-navigation contract audit |
| ColorPicker | ceebee-native | `CbColorPicker` | Done | Controlled HSV gesture + localized semantics + light/dark responsive golden |
| Form | material-native | `Form`, `FormField` | Done | Submit validation + first-error focus + gallery |
| Transfer | replaced | selection route + `CheckboxListTile`/chips | Done | Mobile selection contract audit; dual-list desktop geometry excluded |
| Mentions | replaced | `TextField` + `RawAutocomplete`; app-owned insertion and suggestions | Done | Native editing/overlay contract audit |
| Input | material-native | `TextField`, `TextFormField` | Done | Theme + input/read-only/disabled + light/dark golden |
| Upload | ceebee-native | `CbUpload` + `CbUploadSkeleton` | Done | Injected callbacks + controlled status/progress + reduced-motion Skeleton + light/dark responsive golden |
| Select | material-native | `DropdownMenu` | Done | Theme + selection/keyboard + light/dark overlay golden |
| Avatar | material-native | `CircleAvatar` | Done | Theme + semantics + light/dark golden |
| Badge | material-native | `Badge` | Done | Theme + semantics + light/dark golden |
| Calendar | replaced | `CalendarDatePicker`; event agendas stay product-owned | Done | Native locale/date-state proof already retained under DatePicker |
| Card | material-native | `Card` | Done | Theme + native variants + light/dark golden |
| Carousel | material-native | `CarouselView` | Done | Native controller/index + reduced-motion controls + light/dark golden |
| Collapse | material-native | `ExpansionPanelList` | Done | Native radio disclosure interaction + light/dark golden |
| Descriptions | ceebee-native | `CbDescriptions` + `CbDescriptionsSkeleton` | Done | Ordered semantics + container-responsive one/two-column layout + app-owned values/actions + reduced motion + light/dark golden |
| Empty | ceebee-native | `CbEmpty` + `CbEmptySkeleton` | Done | Semantics + action ownership + light/dark responsive golden |
| Image | material-native | `Image` | Done | Semantics + decode error/retry gallery + light/dark golden |
| List | material-native | `ListView`, `ListTile` | Done | Theme + selection/disabled state + responsive gallery |
| Listy | replaced | `ListView` composition | Done | Migration docs |
| Popover | material-native | `MenuAnchor`, `OverlayPortal` | Done | Focus + dismissal + golden |
| QRCode | deliberately-absent | app-owned encoder package + `Image`/`CustomPaint` | Done | Flutter SDK has no QR encoder; package policy forbids an unrecorded runtime dependency |
| Segmented | material-native | `SegmentedButton` | Done | Theme + selection/disabled interaction + light/dark golden |
| Statistic | ceebee-native | `CbStatistic` + `CbStatisticSkeleton` | Done | App-owned formatting + grouped semantics + tabular figures + reduced motion + light/dark responsive golden |
| Table | material-native | `DataTable`, `PaginatedDataTable` | Done | Sort/select/paginate interaction + horizontal affordance + light/dark golden |
| Tag | material-native | `Chip` family | Done | Native state interaction + light/dark golden |
| Timeline | ceebee-native | `CbTimeline` + `CbTimelineSkeleton` | Done | Ordered event semantics + compact/wide timestamp adaptation + pending/reduced motion + app-owned content/order + light/dark golden |
| Tooltip | material-native | `Tooltip` | Done | Native long-press/semantics + light/dark golden |
| Tour | replaced | onboarding routes, `Dialog`, or app-owned `OverlayPortal` sequence | Done | Product sequencing/target ownership audit; desktop coachmark focus contract excluded |
| Tree | material-native | `ExpansionTile`, `ExpansionPanelList`, nested slivers | Done | Native disclosure semantics; product owns hierarchy data and lazy loading |
| Alert | material-native | `MaterialBanner` | Done | Native announcement/dismissal + light/dark golden |
| Drawer | material-native | `Drawer`, `NavigationDrawer` | Done | Modal selection/dismissal + responsive gallery + light/dark golden |
| Message | material-native | `SnackBar`, `ScaffoldMessenger` | Done | Native action/dismissal + light/dark golden |
| Modal | material-native | `Dialog`, `showDialog` | Done | Native focus/dismissal + light/dark golden |
| Notification | replaced | `MaterialBanner`/`SnackBar`; OS notifications stay app/plugin-owned | Done | Native transient/persistent feedback contract audit |
| Popconfirm | replaced | `showDialog` or `showModalBottomSheet` confirmation | Done | Native modal focus/dismissal contract audit; anchored desktop prompt excluded |
| Progress | material-native | linear and circular progress indicators | Done | Native semantics + light/dark golden |
| Result | ceebee-native | `CbResult` + `CbResultSkeleton` | Done | Status semantics + app-owned actions/details + reduced motion + light/dark responsive golden |
| Skeleton | ceebee-native | `CbSkeleton` | Done | Reduced motion + light/dark responsive golden |
| Spin | material-native | `CircularProgressIndicator` | Done | Essential native loading motion + light/dark golden |
| Watermark | deliberately-absent | app-owned `Stack`/`CustomPaint` decoration | Done | Decorative/security policy is product-specific and has no interaction contract |
| Affix | replaced | pinned slivers | Done | Scroll + docs |
| App | material-native | `MaterialApp` | Done | Theme installation docs |
| BorderBeam | deliberately-absent | no Flutter counterpart | Done | Web-only decorative border motion; no mobile behavior contract |
| ConfigProvider | replaced | `MaterialApp` + `cbThemeData()` | Done | Theme tests + docs |
| Util | deliberately-absent | internal Flutter helpers only | Done | Inventory rationale |

## Ceebee-owned additions

| Component | Classification | Status | Required proof |
|---|---|---|---|
| `CbSurface` | ceebee-native | Done | Widget tests + light/dark/accessibility goldens |
| `CbDonut` | ceebee-native | Done | Math tests + painter golden |
| `CbSparkline` | ceebee-native | Done | Math tests + painter golden |
| `CbBarMini` | ceebee-native | Done | Math tests + painter golden |
| `CbReveal` / `CbStagger` | ceebee-native | Done | Sequencing + OS reduced-motion tests |
| `CbSkeleton` | ceebee-native | Done | Shape geometry + semantics + reduced motion + golden |
| `CbEmpty` | ceebee-native | Done | Semantics + app-owned action + Skeleton + golden |
| `CbCommandPalette` | deliberately-absent | Done | Desktop keyboard-command contract has no mobile port |
| `CbChecklist` | ceebee-native | Done | State + semantics + Skeleton + golden |
| Shell navigation | replaced | Done | `Scaffold` + adaptive Material navigation proof |

## Release gates

- Generated Dart Tokens match the canonical CSS without diff.
- `flutter analyze`, all unit/widget tests, and deterministic goldens pass.
- Minimum supported Flutter and current stable both pass CI.
- Example/docs app builds for web and compiles for Android, iOS, and desktop targets.
- Android hardware and iOS simulator visual review are retained as release evidence.
- `dart pub publish --dry-run` passes before removing `publish_to: none` for `1.0.0`.
