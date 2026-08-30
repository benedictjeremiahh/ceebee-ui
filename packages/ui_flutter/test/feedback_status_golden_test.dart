import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key feedbackOverviewGoldenKey = Key('feedback-overview-golden');
const Key feedbackDialogGoldenKey = Key('feedback-dialog-golden');
const Key feedbackMessageGoldenKey = Key('feedback-message-golden');
const Key feedbackDialogTriggerKey = Key('feedback-dialog-trigger');
const Key feedbackMessageTriggerKey = Key('feedback-message-trigger');

void main() {
  testWidgets('Feedback overview — light', (WidgetTester tester) async {
    await _pumpOverview(tester, cbThemeData());
    await expectLater(
      find.byKey(feedbackOverviewGoldenKey),
      matchesGoldenFile('goldens/feedback_overview_light.png'),
    );
  });

  testWidgets('Feedback overview — dark', (WidgetTester tester) async {
    await _pumpOverview(tester, cbThemeData(brightness: Brightness.dark));
    await expectLater(
      find.byKey(feedbackOverviewGoldenKey),
      matchesGoldenFile('goldens/feedback_overview_dark.png'),
    );
  });

  testWidgets('Open dialog — light', (WidgetTester tester) async {
    await _pumpDialog(tester, cbThemeData());
    await expectLater(
      find.byKey(feedbackDialogGoldenKey),
      matchesGoldenFile('goldens/feedback_dialog_light.png'),
    );
  });

  testWidgets('Open dialog — dark', (WidgetTester tester) async {
    await _pumpDialog(tester, cbThemeData(brightness: Brightness.dark));
    await expectLater(
      find.byKey(feedbackDialogGoldenKey),
      matchesGoldenFile('goldens/feedback_dialog_dark.png'),
    );
  });

  testWidgets('Transient message — light', (WidgetTester tester) async {
    await _pumpMessage(tester, cbThemeData());
    await expectLater(
      find.byKey(feedbackMessageGoldenKey),
      matchesGoldenFile('goldens/feedback_message_light.png'),
    );
  });

  testWidgets('Transient message — dark', (WidgetTester tester) async {
    await _pumpMessage(tester, cbThemeData(brightness: Brightness.dark));
    await expectLater(
      find.byKey(feedbackMessageGoldenKey),
      matchesGoldenFile('goldens/feedback_message_dark.png'),
    );
  });
}

Future<void> _pumpOverview(WidgetTester tester, ThemeData theme) async {
  _setViewport(tester, const Size(840, 720));
  await tester.pumpWidget(
    MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: _goldenTheme(theme),
      home: const RepaintBoundary(
        key: feedbackOverviewGoldenKey,
        child: _FeedbackOverviewScene(),
      ),
    ),
  );
  await tester.pump();
}

Future<void> _pumpDialog(WidgetTester tester, ThemeData theme) async {
  _setViewport(tester, const Size(760, 600));
  await tester.pumpWidget(
    RepaintBoundary(
      key: feedbackDialogGoldenKey,
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: _goldenTheme(theme),
        home: const _DialogScene(),
      ),
    ),
  );
  await tester.tap(find.byKey(feedbackDialogTriggerKey));
  await tester.pumpAndSettle();
}

Future<void> _pumpMessage(WidgetTester tester, ThemeData theme) async {
  _setViewport(tester, const Size(760, 600));
  await tester.pumpWidget(
    RepaintBoundary(
      key: feedbackMessageGoldenKey,
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: _goldenTheme(theme),
        home: const _MessageScene(),
      ),
    ),
  );
  await tester.tap(find.byKey(feedbackMessageTriggerKey));
  await tester.pumpAndSettle();
}

void _setViewport(WidgetTester tester, Size size) {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = size;
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);
}

ThemeData _goldenTheme(ThemeData theme) {
  TextStyle? textFor(ButtonStyle? style) => style?.textStyle
      ?.resolve(<WidgetState>{})
      ?.copyWith(fontFamily: 'Roboto');

  return theme.copyWith(
    textTheme: theme.textTheme.apply(fontFamily: 'Roboto'),
    filledButtonTheme: FilledButtonThemeData(
      style: theme.filledButtonTheme.style?.copyWith(
        textStyle: WidgetStatePropertyAll<TextStyle?>(
          textFor(theme.filledButtonTheme.style),
        ),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: theme.outlinedButtonTheme.style?.copyWith(
        textStyle: WidgetStatePropertyAll<TextStyle?>(
          textFor(theme.outlinedButtonTheme.style),
        ),
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: theme.textButtonTheme.style?.copyWith(
        textStyle: WidgetStatePropertyAll<TextStyle?>(
          textFor(theme.textButtonTheme.style),
        ),
      ),
    ),
  );
}

class _FeedbackOverviewScene extends StatelessWidget {
  const _FeedbackOverviewScene();

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;

    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(CbStructure.space6),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Text('Feedback and status', style: type.displaySmall),
            const SizedBox(height: CbStructure.space2),
            Text(
              'Native Material feedback rendered through the active Ceebee Skin.',
              style: type.bodyLarge,
            ),
            const SizedBox(height: CbStructure.space5),
            CbSurface(
              padding: CbPad.none,
              child: MaterialBanner(
                leading: const Icon(Icons.system_update_outlined),
                content: const Text('A newer workspace version is available.'),
                actions: <Widget>[
                  TextButton(
                    onPressed: _ignoreAction,
                    child: const Text('Dismiss'),
                  ),
                  FilledButton(
                    onPressed: _ignoreAction,
                    child: const Text('Schedule update'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: CbStructure.space4),
            Expanded(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  Expanded(
                    child: CbSurface(
                      padding: CbPad.lg,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Text('Known progress', style: type.titleLarge),
                          const SizedBox(height: CbStructure.space2),
                          Text(
                            'Uploading assets · 65%',
                            style: type.bodyMedium,
                          ),
                          const SizedBox(height: CbStructure.space4),
                          const LinearProgressIndicator(value: 0.65),
                          const Spacer(),
                          const Center(
                            child: CircularProgressIndicator(value: 0.65),
                          ),
                          const Spacer(),
                          Center(
                            child: Text('65% complete', style: type.bodySmall),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: CbStructure.space4),
                  Expanded(
                    child: CbSurface(
                      padding: CbPad.lg,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Text('Loading and help', style: type.titleLarge),
                          const SizedBox(height: CbStructure.space2),
                          Text(
                            'A spinner signals active work. Tooltips name icon-only actions.',
                            style: type.bodyMedium,
                          ),
                          const Spacer(),
                          const Center(
                            child: CircularProgressIndicator(
                              value: 0.25,
                              semanticsLabel: 'Syncing workspace',
                            ),
                          ),
                          const Spacer(),
                          const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              Text('Copy workspace link'),
                              SizedBox(width: CbStructure.space2),
                              Tooltip(
                                message: 'Copy workspace link',
                                child: IconButton(
                                  onPressed: _ignoreAction,
                                  icon: Icon(Icons.link),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DialogScene extends StatelessWidget {
  const _DialogScene();

  @override
  Widget build(BuildContext context) => Scaffold(
    body: Center(
      child: FilledButton(
        key: feedbackDialogTriggerKey,
        onPressed: () => showDialog<void>(
          context: context,
          builder: (BuildContext dialogContext) => AlertDialog(
            title: Row(
              children: <Widget>[
                const Expanded(child: Text('Delete local draft?')),
                IconButton(
                  tooltip: 'Close dialog',
                  onPressed: () => Navigator.pop(dialogContext),
                  icon: const Icon(Icons.close),
                ),
              ],
            ),
            content: const Text(
              'The draft “Release notes” will be removed from this device. This action cannot be undone.',
            ),
            actions: <Widget>[
              TextButton(
                onPressed: () => Navigator.pop(dialogContext),
                child: const Text('Cancel'),
              ),
              FilledButton(
                onPressed: () => Navigator.pop(dialogContext),
                child: const Text('Delete draft'),
              ),
            ],
          ),
        ),
        child: const Text('Review deletion'),
      ),
    ),
  );
}

class _MessageScene extends StatelessWidget {
  const _MessageScene();

  @override
  Widget build(BuildContext context) => Scaffold(
    body: Padding(
      padding: const EdgeInsets.all(CbStructure.space6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text('Workspace', style: Theme.of(context).textTheme.displaySmall),
          const SizedBox(height: CbStructure.space2),
          const Text(
            'The page keeps a durable status while the transient message is visible.',
          ),
          const SizedBox(height: CbStructure.space5),
          FilledButton(
            key: feedbackMessageTriggerKey,
            onPressed: () => ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: const Text('Draft moved to archive'),
                action: SnackBarAction(label: 'Undo', onPressed: _ignoreAction),
              ),
            ),
            child: const Text('Archive draft'),
          ),
          const SizedBox(height: CbStructure.space4),
          const Text('Current status: Draft archived'),
        ],
      ),
    ),
  );
}

void _ignoreAction() {}
