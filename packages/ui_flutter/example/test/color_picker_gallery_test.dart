import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/color_picker_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('ColorPicker gallery updates controlled preview', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_gallery());

    final Finder firstSlider = find.byType(Slider).first;
    await tester.tapAt(tester.getRect(firstSlider).centerRight);
    await tester.pump();

    expect(find.byKey(colorPickerGalleryKey), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('compact ColorPicker gallery has no overflow', (
    WidgetTester tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(390, 1100);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);
    await tester.pumpWidget(_gallery());

    expect(find.byType(CbColorPicker), findsNWidgets(2));
    expect(tester.takeException(), isNull);
  });
}

Widget _gallery() => MaterialApp(
  theme: cbThemeData(),
  home: const Scaffold(
    body: SingleChildScrollView(
      padding: EdgeInsets.all(CbStructure.space5),
      child: ColorPickerGallery(),
    ),
  ),
);
