import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key galleryDatePickerKey = Key('gallery-date-picker');
const Key galleryTimePickerKey = Key('gallery-time-picker');
const Key gallerySelectedDateKey = Key('gallery-selected-date');

class DateTimePickersGallery extends StatefulWidget {
  const DateTimePickersGallery({super.key});

  @override
  State<DateTimePickersGallery> createState() => _DateTimePickersGalleryState();
}

class _DateTimePickersGalleryState extends State<DateTimePickersGallery> {
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
      helpText: 'Select a workday',
    );
    if (selected != null) setState(() => _modalDate = selected);
  }

  Future<void> _pickTime() async {
    final TimeOfDay? selected = await showTimePicker(
      context: context,
      initialTime: _modalTime,
      helpText: 'Select start time',
    );
    if (selected != null) setState(() => _modalTime = selected);
  }

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;
    final MaterialLocalizations localizations = MaterialLocalizations.of(
      context,
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Text('Date and time pickers', style: type.displaySmall),
        const SizedBox(height: CbStructure.space2),
        Text(
          'Material owns calendar navigation, modal focus, keyboard entry, dismissal, and locale '
          'formatting. Ceebee supplies the active Skin through the Theme bridge.',
          style: type.bodyLarge,
        ),
        const SizedBox(height: CbStructure.space5),
        CbSurface(
          elevation: CbElevation.sm,
          padding: CbPad.lg,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              Text('Modal pickers', style: type.titleLarge),
              const Divider(),
              Text('Date', style: type.labelLarge),
              const SizedBox(height: CbStructure.space1),
              Text(
                'Selected date: ${localizations.formatMediumDate(_modalDate)}',
                key: gallerySelectedDateKey,
                style: type.bodyMedium,
              ),
              const SizedBox(height: CbStructure.space2),
              Text(
                'Weekends are unavailable for this workflow.',
                style: type.bodySmall,
              ),
              const SizedBox(height: CbStructure.space3),
              Align(
                alignment: Alignment.centerLeft,
                child: FilledButton.icon(
                  key: galleryDatePickerKey,
                  onPressed: _pickDate,
                  icon: const Icon(Icons.calendar_month_outlined),
                  label: const Text('Choose date'),
                ),
              ),
              const SizedBox(height: CbStructure.space5),
              Text('Time', style: type.labelLarge),
              const SizedBox(height: CbStructure.space1),
              Text(
                'Selected time: ${localizations.formatTimeOfDay(_modalTime)}',
                style: type.bodyMedium,
              ),
              const SizedBox(height: CbStructure.space3),
              Align(
                alignment: Alignment.centerLeft,
                child: OutlinedButton.icon(
                  key: galleryTimePickerKey,
                  onPressed: _pickTime,
                  icon: const Icon(Icons.schedule_outlined),
                  label: const Text('Choose time'),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: CbStructure.space5),
        CbSurface(
          padding: CbPad.lg,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              Text('Inline calendar', style: type.titleLarge),
              const SizedBox(height: CbStructure.space2),
              Text(
                'Use an inline calendar when choosing a date is the primary task.',
                style: type.bodySmall,
              ),
              const Divider(),
              CalendarDatePicker(
                initialDate: _inlineDate,
                firstDate: _firstDate,
                lastDate: _lastDate,
                selectableDayPredicate: _weekday,
                onDateChanged: (DateTime value) =>
                    setState(() => _inlineDate = value),
              ),
              const SizedBox(height: CbStructure.space3),
              Text(
                'Selected: ${localizations.formatFullDate(_inlineDate)}',
                style: type.bodyMedium,
              ),
            ],
          ),
        ),
      ],
    );
  }
}
