import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key inlinePickerGoldenKey = Key('inline-picker-golden');
const Key pickerDialogGoldenKey = Key('picker-dialog-golden');
const Key openPickerDialogKey = Key('open-picker-dialog');

void main() {
  testWidgets('Inline calendar — light', (WidgetTester tester) async {
    await _pumpInlineCalendar(tester, cbThemeData());
    await expectLater(
      find.byKey(inlinePickerGoldenKey),
      matchesGoldenFile('goldens/inline_calendar_light.png'),
    );
  });

  testWidgets('Inline calendar — dark', (WidgetTester tester) async {
    await _pumpInlineCalendar(tester, cbThemeData(brightness: Brightness.dark));
    await expectLater(
      find.byKey(inlinePickerGoldenKey),
      matchesGoldenFile('goldens/inline_calendar_dark.png'),
    );
  });

  testWidgets('Date picker dialog — light', (WidgetTester tester) async {
    await _pumpPickerDialog(tester, cbThemeData(), date: true);
    await expectLater(
      find.byKey(pickerDialogGoldenKey),
      matchesGoldenFile('goldens/date_picker_dialog_light.png'),
    );
  });

  testWidgets('Date picker dialog — dark', (WidgetTester tester) async {
    await _pumpPickerDialog(
      tester,
      cbThemeData(brightness: Brightness.dark),
      date: true,
    );
    await expectLater(
      find.byKey(pickerDialogGoldenKey),
      matchesGoldenFile('goldens/date_picker_dialog_dark.png'),
    );
  });

  testWidgets('Time picker dialog — light', (WidgetTester tester) async {
    await _pumpPickerDialog(tester, cbThemeData(), date: false);
    await expectLater(
      find.byKey(pickerDialogGoldenKey),
      matchesGoldenFile('goldens/time_picker_dialog_light.png'),
    );
  });

  testWidgets('Time picker dialog — dark', (WidgetTester tester) async {
    await _pumpPickerDialog(
      tester,
      cbThemeData(brightness: Brightness.dark),
      date: false,
    );
    await expectLater(
      find.byKey(pickerDialogGoldenKey),
      matchesGoldenFile('goldens/time_picker_dialog_dark.png'),
    );
  });
}

Future<void> _pumpInlineCalendar(WidgetTester tester, ThemeData theme) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = const Size(760, 760);
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);

  await tester.pumpWidget(
    MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: _goldenTheme(theme),
      home: const RepaintBoundary(
        key: inlinePickerGoldenKey,
        child: _InlineCalendarScene(),
      ),
    ),
  );
  await tester.pumpAndSettle();
}

Future<void> _pumpPickerDialog(
  WidgetTester tester,
  ThemeData theme, {
  required bool date,
}) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = const Size(760, 720);
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);

  await tester.pumpWidget(
    RepaintBoundary(
      key: pickerDialogGoldenKey,
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: _goldenTheme(theme),
        home: Scaffold(
          body: Center(
            child: FilledButton(
              key: openPickerDialogKey,
              onPressed: () => date
                  ? showDatePicker(
                      context: tester.element(find.byKey(openPickerDialogKey)),
                      initialDate: DateTime(2026, DateTime.august, 28),
                      currentDate: DateTime(2026, DateTime.august, 28),
                      firstDate: DateTime(2026, DateTime.january, 1),
                      lastDate: DateTime(2027, DateTime.december, 31),
                      selectableDayPredicate: _weekday,
                    )
                  : showTimePicker(
                      context: tester.element(find.byKey(openPickerDialogKey)),
                      initialTime: const TimeOfDay(hour: 9, minute: 30),
                    ),
              child: Text(date ? 'Choose date' : 'Choose time'),
            ),
          ),
        ),
      ),
    ),
  );
  await tester.tap(find.byKey(openPickerDialogKey));
  await tester.pumpAndSettle();
}

ThemeData _goldenTheme(ThemeData theme) {
  final TextStyle? buttonText = theme.textButtonTheme.style?.textStyle
      ?.resolve(<WidgetState>{})
      ?.copyWith(fontFamily: 'Roboto');
  return theme.copyWith(
    textTheme: theme.textTheme.apply(fontFamily: 'Roboto'),
    textButtonTheme: TextButtonThemeData(
      style: theme.textButtonTheme.style?.copyWith(
        textStyle: WidgetStatePropertyAll<TextStyle?>(buttonText),
      ),
    ),
  );
}

class _InlineCalendarScene extends StatelessWidget {
  const _InlineCalendarScene();

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;
    final DateTime selected = DateTime(2026, DateTime.august, 28);

    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(CbStructure.space6),
        child: CbSurface(
          elevation: CbElevation.sm,
          padding: CbPad.lg,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              Text('Schedule date', style: type.titleLarge),
              const SizedBox(height: CbStructure.space2),
              Text(
                'Weekends are unavailable for this workflow.',
                style: type.bodySmall,
              ),
              const Divider(),
              CalendarDatePicker(
                initialDate: selected,
                currentDate: selected,
                firstDate: DateTime(2026, DateTime.january, 1),
                lastDate: DateTime(2027, DateTime.december, 31),
                selectableDayPredicate: _weekday,
                onDateChanged: _ignoreDate,
              ),
              const SizedBox(height: CbStructure.space3),
              Text('Selected: Friday, August 28, 2026', style: type.bodyMedium),
            ],
          ),
        ),
      ),
    );
  }
}

bool _weekday(DateTime date) => date.weekday <= DateTime.friday;
void _ignoreDate(DateTime date) {}
