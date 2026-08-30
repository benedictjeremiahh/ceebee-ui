import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const CbUploadItem _failed = CbUploadItem(
  id: 'brief',
  name: 'brief.pdf',
  status: CbUploadStatus.error,
  statusLabel: 'Upload failed',
  semanticLabel: 'brief.pdf, upload failed',
);

void main() {
  testWidgets('Upload delegates selection, retry, and removal to the app', (
    WidgetTester tester,
  ) async {
    int selections = 0;
    CbUploadItem? retried;
    CbUploadItem? removed;
    await tester.pumpWidget(
      _app(
        CbUpload(
          items: const <CbUploadItem>[_failed],
          selectLabel: 'Choose files',
          semanticLabel: 'Project files',
          onSelect: () => selections += 1,
          onRetry: (CbUploadItem item) => retried = item,
          onRemove: (CbUploadItem item) => removed = item,
          retryLabelBuilder: (CbUploadItem item) => 'Retry ${item.name}',
          removeLabelBuilder: (CbUploadItem item) => 'Remove ${item.name}',
        ),
      ),
    );

    await tester.tap(find.text('Choose files'));
    await tester.tap(find.byTooltip('Retry brief.pdf'));
    await tester.tap(find.byTooltip('Remove brief.pdf'));
    expect(selections, 1);
    expect(retried, same(_failed));
    expect(removed, same(_failed));
  });

  testWidgets('Upload renders determinate transfer progress and semantics', (
    WidgetTester tester,
  ) async {
    final SemanticsHandle semantics = tester.ensureSemantics();
    await tester.pumpWidget(
      _app(
        CbUpload(
          items: const <CbUploadItem>[
            CbUploadItem(
              id: 'photo',
              name: 'photo.jpg',
              status: CbUploadStatus.uploading,
              statusLabel: 'Uploading',
              semanticLabel: 'photo.jpg, uploading, 45 percent',
              progress: 0.45,
            ),
          ],
          selectLabel: 'Choose files',
          semanticLabel: 'Project files',
          removeLabelBuilder: (CbUploadItem item) => 'Remove ${item.name}',
        ),
      ),
    );

    expect(find.bySemanticsLabel('Project files'), findsOneWidget);
    expect(
      find.byWidgetPredicate(
        (Widget widget) =>
            widget is Semantics &&
            widget.properties.label == 'photo.jpg, uploading, 45 percent',
      ),
      findsOneWidget,
    );
    final LinearProgressIndicator progress = tester.widget(
      find.byType(LinearProgressIndicator),
    );
    expect(progress.value, 0.45);
    expect(progress.semanticsValue, '45%');
    semantics.dispose();
  });

  testWidgets('Upload Skeleton mirrors rows and obeys reduced motion', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const MediaQuery(
          data: MediaQueryData(disableAnimations: true),
          child: CbUploadSkeleton(itemCount: 2),
        ),
      ),
    );

    expect(find.byType(CbSkeleton), findsNWidgets(9));
    expect(
      find.descendant(
        of: find.byType(CbUploadSkeleton),
        matching: find.byType(FadeTransition),
      ),
      findsNothing,
    );
  });

  testWidgets('Upload Skeleton preserves live row container geometry', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      _app(
        Column(
          children: <Widget>[
            CbUpload(
              items: const <CbUploadItem>[
                CbUploadItem(
                  id: 'ready',
                  name: 'ready.pdf',
                  status: CbUploadStatus.success,
                  statusLabel: 'Uploaded',
                  semanticLabel: 'ready.pdf, uploaded',
                ),
              ],
              selectLabel: 'Choose files',
              semanticLabel: 'Files',
              removeLabelBuilder: (CbUploadItem item) => 'Remove ${item.name}',
            ),
            const SizedBox(height: CbStructure.space5),
            const CbUploadSkeleton(itemCount: 1, motion: false),
          ],
        ),
      ),
    );

    final Size live = tester.getSize(
      find.byKey(const ValueKey<String>('cb-upload-item-ready')),
    );
    final Size skeleton = tester.getSize(
      find.byKey(const ValueKey<String>('cb-upload-skeleton-item-0')),
    );
    expect(skeleton.width, live.width);
    expect(skeleton.height, live.height);
  });
}

Widget _app(Widget child) => MaterialApp(
  theme: cbThemeData(),
  home: Scaffold(
    body: Padding(
      padding: const EdgeInsets.all(CbStructure.space5),
      child: child,
    ),
  ),
);
