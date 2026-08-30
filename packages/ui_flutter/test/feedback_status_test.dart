import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

const Key bannerTriggerKey = Key('banner-trigger');
const Key messageTriggerKey = Key('message-trigger');
const Key dialogTriggerKey = Key('dialog-trigger');
const Key tooltipTriggerKey = Key('tooltip-trigger');

void main() {
  testWidgets('material banner announces information and dismisses by action', (
    WidgetTester tester,
  ) async {
    _useTestViewport(tester);
    await tester.pumpWidget(
      MaterialApp(theme: cbThemeData(), home: const _FeedbackHarness()),
    );

    await tester.tap(find.byKey(bannerTriggerKey));
    await tester.pumpAndSettle();
    expect(
      find.text('A newer workspace version is available.'),
      findsOneWidget,
    );

    await tester.tap(find.widgetWithText(TextButton, 'Dismiss'));
    await tester.pumpAndSettle();
    expect(find.text('A newer workspace version is available.'), findsNothing);
  });

  testWidgets('snackbar action updates persistent page status', (
    WidgetTester tester,
  ) async {
    _useTestViewport(tester);
    await tester.pumpWidget(
      MaterialApp(theme: cbThemeData(), home: const _FeedbackHarness()),
    );

    await tester.tap(find.byKey(messageTriggerKey));
    await tester.pumpAndSettle();
    expect(find.text('Draft moved to archive'), findsOneWidget);

    await tester.tap(find.widgetWithText(TextButton, 'Undo'));
    await tester.pumpAndSettle();
    expect(find.text('Current status: Draft restored'), findsOneWidget);
  });

  testWidgets('dialog dismisses with Escape and restores trigger focus', (
    WidgetTester tester,
  ) async {
    _useTestViewport(tester);
    await tester.pumpWidget(
      MaterialApp(theme: cbThemeData(), home: const _FeedbackHarness()),
    );

    final FilledButton trigger = tester.widget<FilledButton>(
      find.byKey(dialogTriggerKey),
    );
    trigger.focusNode?.requestFocus();
    await tester.pump();
    await tester.tap(find.byKey(dialogTriggerKey));
    await tester.pumpAndSettle();
    expect(find.text('Delete draft?'), findsOneWidget);

    await tester.sendKeyEvent(LogicalKeyboardKey.escape);
    await tester.pumpAndSettle();
    expect(find.text('Delete draft?'), findsNothing);
    expect(
      tester
          .widget<FilledButton>(find.byKey(dialogTriggerKey))
          .focusNode
          ?.hasFocus,
      isTrue,
    );
  });

  testWidgets('progress and tooltip expose native semantic labels', (
    WidgetTester tester,
  ) async {
    _useTestViewport(tester);
    await tester.pumpWidget(
      MaterialApp(theme: cbThemeData(), home: const _FeedbackHarness()),
    );

    expect(
      tester.getSemantics(find.byType(LinearProgressIndicator)),
      matchesSemantics(label: 'Upload progress', value: '65%'),
    );

    await tester.longPress(find.byKey(tooltipTriggerKey));
    await tester.pumpAndSettle();
    expect(find.text('Copy link'), findsOneWidget);
  });
}

class _FeedbackHarness extends StatefulWidget {
  const _FeedbackHarness();

  @override
  State<_FeedbackHarness> createState() => _FeedbackHarnessState();
}

class _FeedbackHarnessState extends State<_FeedbackHarness> {
  final FocusNode _dialogTriggerFocus = FocusNode();
  String _status = 'Ready';

  @override
  void dispose() {
    _dialogTriggerFocus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: Column(
      children: <Widget>[
        FilledButton(
          key: bannerTriggerKey,
          onPressed: () {
            ScaffoldMessenger.of(context)
              ..hideCurrentMaterialBanner()
              ..showMaterialBanner(
                MaterialBanner(
                  content: const Text(
                    'A newer workspace version is available.',
                  ),
                  actions: <Widget>[
                    TextButton(
                      onPressed: ScaffoldMessenger.of(
                        context,
                      ).hideCurrentMaterialBanner,
                      child: const Text('Dismiss'),
                    ),
                  ],
                ),
              );
          },
          child: const Text('Show banner'),
        ),
        FilledButton(
          key: messageTriggerKey,
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: const Text('Draft moved to archive'),
                action: SnackBarAction(
                  label: 'Undo',
                  onPressed: () => setState(() => _status = 'Draft restored'),
                ),
              ),
            );
          },
          child: const Text('Show message'),
        ),
        FilledButton(
          key: dialogTriggerKey,
          focusNode: _dialogTriggerFocus,
          onPressed: () => showDialog<void>(
            context: context,
            builder: (BuildContext context) => AlertDialog(
              title: const Text('Delete draft?'),
              content: const Text('This removes the draft from this device.'),
              actions: <Widget>[
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Cancel'),
                ),
                FilledButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Delete draft'),
                ),
              ],
            ),
          ),
          child: const Text('Open dialog'),
        ),
        Text('Current status: $_status'),
        const LinearProgressIndicator(
          value: 0.65,
          semanticsLabel: 'Upload progress',
          semanticsValue: '65%',
        ),
        const Tooltip(
          message: 'Copy link',
          child: IconButton(
            key: tooltipTriggerKey,
            onPressed: _ignoreAction,
            icon: Icon(Icons.link),
          ),
        ),
      ],
    ),
  );
}

void _ignoreAction() {}

void _useTestViewport(WidgetTester tester) {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = const Size(800, 800);
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);
}
