import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/upload_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Upload gallery delegates selection, retry, and removal', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_gallery());

    await tester.tap(find.text('Choose files'));
    await tester.pump();
    expect(find.text('selected-file.zip'), findsOneWidget);

    await tester.tap(find.byTooltip('Retry research-notes.txt'));
    await tester.pump();
    expect(find.text('Waiting to retry'), findsOneWidget);

    await tester.tap(find.byTooltip('Remove campaign-cover.png'));
    await tester.pump();
    expect(find.text('campaign-cover.png'), findsNothing);
  });

  testWidgets('compact Upload gallery has no overflow', (
    WidgetTester tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(390, 1300);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);
    await tester.pumpWidget(_gallery());

    expect(find.byKey(uploadGalleryKey), findsOneWidget);
    expect(find.byType(CbUpload), findsOneWidget);
    expect(find.byType(CbUploadSkeleton), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}

Widget _gallery() => MaterialApp(
  theme: cbThemeData(),
  home: const Scaffold(
    body: SingleChildScrollView(
      padding: EdgeInsets.all(CbStructure.space5),
      child: UploadGallery(motion: false),
    ),
  ),
);
