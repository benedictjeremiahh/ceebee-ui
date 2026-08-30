import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/native_data_display_gallery.dart';
import 'package:ceebee_ui_example/native_overlay_gallery.dart';
import 'package:ceebee_ui_example/navigation_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  setUp(() {
    TestWidgetsFlutterBinding.ensureInitialized();
  });

  testWidgets('compact navigation omits the desktop menu bar', (
    WidgetTester tester,
  ) async {
    await _pumpCompact(
      tester,
      const NavigationGallery(drawerDestination: 'Components'),
    );

    expect(find.byType(MenuBar), findsNothing);
    expect(find.byType(MenuAnchor), findsOneWidget);
  });

  testWidgets('compact data display replaces wide tables with list rows', (
    WidgetTester tester,
  ) async {
    await _pumpCompact(tester, const NativeDataDisplayGallery());

    expect(find.byType(DataTable), findsNothing);
    expect(find.byType(PaginatedDataTable), findsNothing);
    expect(
      find.text(
        'Compact screens keep every field readable as native list rows.',
      ),
      findsOneWidget,
    );
  });

  testWidgets('compact contextual details open a native bottom sheet', (
    WidgetTester tester,
  ) async {
    await _pumpCompact(tester, const NativeOverlayGallery());
    await tester.ensureVisible(find.byKey(galleryPopoverPortalTriggerKey));
    await tester.tap(find.byKey(galleryPopoverPortalTriggerKey));
    await tester.pumpAndSettle();

    expect(find.byType(BottomSheet), findsOneWidget);
    expect(find.text('Release 0.2.0'), findsOneWidget);
    expect(find.byKey(galleryPopoverPortalKey), findsNothing);
  });
}

Future<void> _pumpCompact(WidgetTester tester, Widget child) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = const Size(420, 900);
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);
  await tester.pumpWidget(
    MaterialApp(
      theme: cbThemeData(),
      home: Scaffold(
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(CbStructure.space5),
          child: child,
        ),
      ),
    ),
  );
  await tester.pumpAndSettle();
}
