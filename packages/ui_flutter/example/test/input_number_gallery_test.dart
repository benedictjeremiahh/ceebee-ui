import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/input_number_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('InputNumber gallery keeps edited values application-owned', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_gallery());

    await tester.tap(find.byTooltip('Add one package'));
    await tester.pump();
    expect(_fieldText(tester, quantityInputKey), '5');

    await tester.enterText(
      find.descendant(
        of: find.byKey(reviewHoursInputKey),
        matching: find.byType(TextField),
      ),
      '3,5',
    );
    await tester.pump();
    expect(_fieldText(tester, reviewHoursInputKey), '3,5');
  });

  testWidgets('compact InputNumber composition has no overflow', (
    WidgetTester tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(390, 900);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);
    await tester.pumpWidget(_gallery());

    expect(find.byKey(inputNumberGalleryKey), findsOneWidget);
    expect(find.byType(CbInputNumber), findsNWidgets(4));
    expect(tester.takeException(), isNull);
  });
}

String _fieldText(WidgetTester tester, Key key) => tester
    .widget<EditableText>(
      find.descendant(of: find.byKey(key), matching: find.byType(EditableText)),
    )
    .controller
    .text;

Widget _gallery() => MaterialApp(
  theme: cbThemeData(),
  home: const Scaffold(
    body: SingleChildScrollView(
      padding: EdgeInsets.all(CbStructure.space5),
      child: InputNumberGallery(),
    ),
  ),
);
