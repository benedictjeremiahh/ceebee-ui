import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/device_preview.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('device preview labels its web-only accuracy boundary', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_previewApp());

    expect(find.text('Device preview'), findsOneWidget);
    expect(
      find.textContaining('Browser rendering, gestures, keyboard'),
      findsOneWidget,
    );
    expect(find.byKey(const Key('preview-content')), findsOneWidget);
    expect(find.byKey(devicePreviewViewportKey), findsNothing);
  });

  testWidgets('device preview applies profile, orientation, and text scale', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_previewApp());

    await tester.tap(find.byKey(devicePreviewProfileKey));
    await tester.pumpAndSettle();
    await tester.tap(find.text('iPhone 15 Pro').last);
    await tester.pumpAndSettle();

    expect(find.byKey(devicePreviewViewportKey), findsOneWidget);
    expect(find.text('393 × 852 · 100% · top 48'), findsOneWidget);

    await tester.tap(find.byKey(devicePreviewOrientationKey));
    await tester.pumpAndSettle();
    expect(find.text('852 × 393 · 100% · top 0'), findsOneWidget);

    await tester.tap(find.byKey(devicePreviewTextScaleKey));
    await tester.pumpAndSettle();
    await tester.tap(find.text('150%').last);
    await tester.pumpAndSettle();
    expect(find.text('852 × 393 · 150% · top 0'), findsOneWidget);
  });

  testWidgets('safe area simulation can be disabled', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_previewApp());

    await tester.tap(find.byKey(devicePreviewProfileKey));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Pixel 9').last);
    await tester.pumpAndSettle();
    expect(find.text('412 × 915 · 100% · top 24'), findsOneWidget);

    await tester.tap(find.byKey(devicePreviewSafeAreaKey));
    await tester.pumpAndSettle();
    expect(find.text('412 × 915 · 100% · top 0'), findsOneWidget);
  });
}

Widget _previewApp() => MaterialApp(
  theme: cbThemeData(),
  home: GalleryDevicePreview(
    enabled: true,
    child: Builder(
      builder: (BuildContext context) {
        final MediaQueryData media = MediaQuery.of(context);
        return Scaffold(
          body: Center(
            child: Text(
              key: const Key('preview-content'),
              '${media.size.width.round()} × ${media.size.height.round()} · '
              '${(media.textScaler.scale(1) * 100).round()}% · '
              'top ${media.padding.top.round()}',
            ),
          ),
        );
      },
    ),
  ),
);
