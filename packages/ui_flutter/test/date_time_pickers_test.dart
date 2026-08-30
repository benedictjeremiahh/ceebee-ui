import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key inlineCalendarKey = Key('inline-calendar');
const Key openDatePickerKey = Key('open-date-picker');
const Key openTimePickerKey = Key('open-time-picker');

void main() {
  testWidgets(
    'inline calendar ignores disabled dates and selects enabled dates',
    (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(theme: cbThemeData(), home: const _PickerHarness()),
      );

      expect(find.text('Inline date: 2026-08-28'), findsOneWidget);
      await tester.tap(find.text('29'));
      await tester.pumpAndSettle();
      expect(find.text('Inline date: 2026-08-28'), findsOneWidget);

      await tester.tap(find.text('31'));
      await tester.pumpAndSettle();
      expect(find.text('Inline date: 2026-08-31'), findsOneWidget);
    },
  );

  testWidgets('modal date picker supports cancellation and selection', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(theme: cbThemeData(), home: const _PickerHarness()),
    );

    await tester.tap(find.byKey(openDatePickerKey));
    await tester.pumpAndSettle();
    expect(find.byType(DatePickerDialog), findsOneWidget);
    await tester.tap(find.text('Cancel'));
    await tester.pumpAndSettle();
    expect(find.text('Modal date: 2026-08-28'), findsOneWidget);

    await tester.tap(find.byKey(openDatePickerKey));
    await tester.pumpAndSettle();
    await tester.tap(
      find.descendant(
        of: find.byType(DatePickerDialog),
        matching: find.text('31'),
      ),
    );
    await tester.tap(find.text('OK'));
    await tester.pumpAndSettle();
    expect(find.text('Modal date: 2026-08-31'), findsOneWidget);
  });

  testWidgets('time picker input mode accepts and returns a time', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(theme: cbThemeData(), home: const _PickerHarness()),
    );

    await tester.tap(find.byKey(openTimePickerKey));
    await tester.pumpAndSettle();
    expect(find.byType(TimePickerDialog), findsOneWidget);

    final Finder fields = find.descendant(
      of: find.byType(TimePickerDialog),
      matching: find.byType(TextField),
    );
    expect(fields, findsNWidgets(2));
    await tester.enterText(fields.at(0), '10');
    await tester.enterText(fields.at(1), '45');
    await tester.tap(find.text('OK'));
    await tester.pumpAndSettle();

    expect(find.text('Modal time: 10:45 AM'), findsOneWidget);
  });
}

class _PickerHarness extends StatefulWidget {
  const _PickerHarness();

  @override
  State<_PickerHarness> createState() => _PickerHarnessState();
}

class _PickerHarnessState extends State<_PickerHarness> {
  static final DateTime _firstDate = DateTime(2026, DateTime.january, 1);
  static final DateTime _lastDate = DateTime(2027, DateTime.december, 31);

  DateTime _inlineDate = DateTime(2026, DateTime.august, 28);
  DateTime _modalDate = DateTime(2026, DateTime.august, 28);
  TimeOfDay _modalTime = const TimeOfDay(hour: 9, minute: 30);

  bool _weekday(DateTime date) => date.weekday <= DateTime.friday;

  Future<void> _pickDate() async {
    final DateTime? selected = await showDatePicker(
      context: context,
      initialDate: _modalDate,
      firstDate: _firstDate,
      lastDate: _lastDate,
      selectableDayPredicate: _weekday,
    );
    if (selected != null) setState(() => _modalDate = selected);
  }

  Future<void> _pickTime() async {
    final TimeOfDay? selected = await showTimePicker(
      context: context,
      initialTime: _modalTime,
      initialEntryMode: TimePickerEntryMode.input,
    );
    if (selected != null) setState(() => _modalTime = selected);
  }

  @override
  Widget build(BuildContext context) {
    final MaterialLocalizations localizations = MaterialLocalizations.of(
      context,
    );

    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: <Widget>[
            Text('Inline date: ${_isoDate(_inlineDate)}'),
            CalendarDatePicker(
              key: inlineCalendarKey,
              initialDate: _inlineDate,
              firstDate: _firstDate,
              lastDate: _lastDate,
              selectableDayPredicate: _weekday,
              onDateChanged: (DateTime value) =>
                  setState(() => _inlineDate = value),
            ),
            Text('Modal date: ${_isoDate(_modalDate)}'),
            FilledButton(
              key: openDatePickerKey,
              onPressed: _pickDate,
              child: const Text('Choose date'),
            ),
            Text('Modal time: ${localizations.formatTimeOfDay(_modalTime)}'),
            FilledButton(
              key: openTimePickerKey,
              onPressed: _pickTime,
              child: const Text('Choose time'),
            ),
          ],
        ),
      ),
    );
  }
}

String _isoDate(DateTime date) =>
    '${date.year}-${date.month.toString().padLeft(2, '0')}-'
    '${date.day.toString().padLeft(2, '0')}';
