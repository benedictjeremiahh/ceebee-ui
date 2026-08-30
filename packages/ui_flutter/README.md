# ceebee_ui

Ceebee's design system for Flutter. Material 3 owns native interaction,
accessibility, motion, and geometry; Ceebee supplies generated cross-platform
Tokens, Skins, Surface materials, compact data visualizations, and mobile
onboarding compositions.

- [Interactive component gallery](https://ui-flutter.ceebee.biz.id)
- [API documentation](https://pub.dev/documentation/ceebee_ui/latest/)
- [Package on pub.dev](https://pub.dev/packages/ceebee_ui)
- [Web component documentation](https://ui.ceebee.biz.id)

## Install

Add the prerelease from pub.dev:

```yaml
dependencies:
  ceebee_ui: ^0.1.0-dev.1
```

Flutter 3.35 or newer and Dart 3.8 or newer are required.

## Use

Install the Ceebee Theme at the application boundary, then compose native
Material widgets and Ceebee-owned components normally:

```dart
import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

MaterialApp(
  theme: cbThemeData(),
  darkTheme: cbThemeData(brightness: Brightness.dark),
  home: const Scaffold(
    body: CbSurface(
      variant: CbSurfaceVariant.glass,
      child: Text('Ceebee UI'),
    ),
  ),
);
```

Free-form loading layouts use tokenized shapes. Keep loading announcements on
the surrounding feature and use its geometry-matched `CbXxxSkeleton` companion
when one exists:

```dart
const Row(
  children: <Widget>[
    CbSkeleton.circle(size: CbSize.md),
    SizedBox(width: CbStructure.space3),
    Expanded(child: CbSkeleton.text()),
  ],
);
```

Empty states keep product copy and actions at the application boundary:

```dart
CbEmpty(
  title: 'No saved views',
  description: 'Create a view to keep this filter nearby.',
  action: FilledButton(
    onPressed: createView,
    child: const Text('Create view'),
  ),
);
```

Consequential outcomes carry semantic status while applications retain copy,
details, and action ownership:

```dart
CbResult(
  status: CbResultStatus.success,
  title: 'Transfer complete',
  semanticLabel: 'Success: transfer complete',
  description: 'The recipient received the full amount.',
  actions: <Widget>[
    FilledButton(
      onPressed: openReceipt,
      child: const Text('View receipt'),
    ),
  ],
);
```

Statistics accept already-formatted display and spoken values, keeping locale
and precision in the application:

```dart
const CbStatistic(
  label: 'Account balance',
  value: 'Rp 12.893.000',
  semanticValue: 'twelve million eight hundred ninety-three thousand rupiah',
  description: 'Available to spend',
);
```

Read-only records retain source order and adapt from two columns to one based
on their own container. Values and header actions remain native app widgets:

```dart
CbDescriptions(
  title: 'Transfer summary',
  action: TextButton(onPressed: review, child: const Text('Review')),
  items: const <CbDescriptionItem>[
    CbDescriptionItem(label: 'Recipient', value: Text('Ari Putra')),
    CbDescriptionItem(label: 'Amount', value: Text('Rp 12.893.000')),
    CbDescriptionItem(
      label: 'Notes',
      value: Text('Monthly operating transfer.'),
      fullWidth: true,
    ),
  ],
);
```

Event histories preserve application order and move timestamps into a separate
column only when their container has room. The same read-only contract also
fits itineraries; applications provide transport-specific markers and copy:

```dart
const CbTimeline(
  items: <CbTimelineItem>[
    CbTimelineItem(
      title: 'Transfer created',
      timestamp: '09:32',
      content: Text('The request passed validation.'),
    ),
    CbTimelineItem(
      title: 'Risk review in progress',
      timestamp: '09:41',
      tone: CbTone.warning,
      pending: true,
    ),
  ],
);
```

Multi-step progress derives default states from `current`; applications own
navigation, validation, and localized status semantics:

```dart
CbSteps(
  current: currentStep,
  onStepSelected: selectStep,
  items: const <CbStepItem>[
    CbStepItem(title: 'Sender'),
    CbStepItem(title: 'Recipient'),
    CbStepItem(
      title: 'Review',
      status: CbStepStatus.error,
      semanticLabel: 'Review, error, step 3 of 4',
    ),
    CbStepItem(title: 'Send', disabled: true),
  ],
);
```

Pagination keeps page state and data loading in the application. On compact
containers it preserves touch-sized previous/next controls and replaces the
dense page window with a current/total summary:

```dart
CbPagination(
  pageCount: 24,
  currentPage: currentPage,
  onPageChanged: selectPage,
  semanticPageLabelBuilder: (page, count) => 'Page $page of $count',
);
```

Rating is a controlled touch input. The app supplies localized semantics and
owns the selected value:

```dart
CbRating(
  value: rating,
  precision: CbRatingPrecision.half,
  semanticLabel: 'Delivery rating',
  semanticValueBuilder: (value, count) => '$value of $count stars',
  onChanged: updateRating,
);
```

Numeric input keeps exact text entry and touch-sized stepping in one controlled
field. Applications may supply locale-specific parsing and formatting:

```dart
CbInputNumber(
  value: hours,
  min: 0,
  max: 8,
  step: 0.5,
  label: 'Review time',
  suffixText: 'hours',
  formatter: formatDecimalForLocale,
  parser: parseDecimalForLocale,
  incrementSemanticLabel: 'Add half an hour',
  decrementSemanticLabel: 'Remove half an hour',
  onChanged: updateHours,
);
```

Arbitrary product colours use a controlled HSV value. Material sliders own
touch and keyboard interaction; Ceebee maps localized adjustable semantics and
applications own the channel labels:

```dart
CbColorPicker(
  value: accent,
  semanticLabel: 'Accent colour',
  hueLabel: 'Hue',
  saturationLabel: 'Saturation',
  brightnessLabel: 'Brightness',
  onChanged: updateAccent,
);
```

File selection and transfer work stay outside the design system. `CbUpload`
only renders controlled status and delegates every operation back to the app:

```dart
CbUpload(
  items: uploadItems,
  selectLabel: 'Choose files',
  semanticLabel: 'Project files',
  onSelect: chooseFiles,
  onRetry: retryUpload,
  onRemove: removeUpload,
  retryLabelBuilder: (item) => 'Retry ${item.name}',
  removeLabelBuilder: (item) => 'Remove ${item.name}',
);
```

The example app demonstrates responsive native Material families, every Skin,
accessibility fallbacks, mini charts, motion primitives, and `CbChecklist`.

## Profile repeated glass

The example includes a profile-only hardware comparison for twelve independent
versus grouped glass Surfaces. Run it on a connected Android device:

```sh
cd example
flutter drive --profile --no-dds \
  --driver=test_driver/integration_test.dart \
  --target=integration_test/glass_performance_test.dart \
  -d <device-id>
```

Keep `build/integration_response_data.json` and derived profiling reports out of
committed golden baselines. Device temperature and active refresh rate belong in
the interpretation because both can materially change frame timings.

## Source of truth

CSS Tokens under `packages/ui/src/tokens` are canonical. Generated Dart files
must be refreshed with `node scripts/gen-flutter-tokens.mjs` from the repository
root and must never be edited by hand.

See `THIRD_PARTY_NOTICES.md` for substrate attribution.
