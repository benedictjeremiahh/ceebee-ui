import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/rating_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Rating gallery keeps the selected value application-owned', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_gallery());

    expect(find.text('3.5 of 5 stars'), findsOneWidget);
    final Rect rating = tester.getRect(find.byKey(deliveryRatingKey));
    await tester.tapAt(rating.centerRight - const Offset(4, 0));
    await tester.pump();
    expect(find.text('5 of 5 stars'), findsOneWidget);
  });

  testWidgets('compact Rating composition has no overflow', (
    WidgetTester tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(390, 800);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);
    await tester.pumpWidget(_gallery());

    expect(find.byKey(ratingGalleryKey), findsOneWidget);
    expect(find.byType(CbRating), findsNWidgets(2));
    expect(tester.takeException(), isNull);
  });
}

Widget _gallery() => MaterialApp(
  theme: cbThemeData(),
  home: const Scaffold(
    body: SingleChildScrollView(
      padding: EdgeInsets.all(CbStructure.space5),
      child: RatingGallery(),
    ),
  ),
);
