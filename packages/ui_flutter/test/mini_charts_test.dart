import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('cbDonutArcs', () {
    test('splits the circle in proportion without a gap', () {
      final List<CbDonutArc> arcs = cbDonutArcs(const <CbDonutSlice>[
        CbDonutSlice(value: 1, label: 'a'),
        CbDonutSlice(value: 3, label: 'b'),
      ], 100);

      expect(arcs.map((CbDonutArc arc) => arc.length), <double>[25, 75]);
      expect(arcs.last.offset, -25);
      expect(
        arcs.fold(0.0, (double sum, CbDonutArc arc) => sum + arc.length),
        100,
      );
    });

    test('drops values that cannot be drawn', () {
      final List<CbDonutArc> arcs = cbDonutArcs(const <CbDonutSlice>[
        CbDonutSlice(value: 5, label: 'a'),
        CbDonutSlice(value: -5, label: 'b'),
        CbDonutSlice(value: double.nan, label: 'c'),
        CbDonutSlice(value: 0, label: 'd'),
      ], 100);

      expect(arcs, hasLength(1));
      expect(arcs.single.length, 100);
      expect(
        cbDonutArcs(const <CbDonutSlice>[
          CbDonutSlice(value: 0, label: 'a'),
        ], 100),
        isEmpty,
      );
      expect(cbDonutArcs(const <CbDonutSlice>[], 100), isEmpty);
    });
  });

  group('cbSparklineGeometry', () {
    test('spans the width and inverts the y axis', () {
      final List<Offset> points = cbSparklineGeometry(
        const <double>[0, 10],
        100,
        20,
      ).points;

      expect(points.first.dx, 0);
      expect(points.last.dx, 100);
      expect(points.first.dy, greaterThan(points.last.dy));
    });

    test('centres flat and single-value series', () {
      final List<Offset> flat = cbSparklineGeometry(
        const <double>[5, 5, 5],
        100,
        20,
      ).points;
      expect(flat.map((Offset point) => point.dy).toSet(), hasLength(1));
      expect(flat.first.dy, closeTo(10, 0.1));

      final List<Offset> single = cbSparklineGeometry(
        const <double>[7],
        100,
        20,
      ).points;
      expect(single.single.dx, 50);
    });

    test('returns no geometry for unusable values', () {
      expect(cbSparklineGeometry(const <double>[], 100, 20).points, isEmpty);
      expect(
        cbSparklineGeometry(
          const <double>[double.nan, double.infinity],
          100,
          20,
        ).points,
        isEmpty,
      );
    });
  });

  group('cbBarMiniGeometry', () {
    test('starts at zero and keeps every finite bar visible', () {
      final List<RRect> bars = cbBarMiniGeometry(
        const <double>[0, 5, 10],
        100,
        20,
      );

      expect(bars, hasLength(3));
      expect(bars.last.outerRect.top, 0);
      expect(bars.last.outerRect.bottom, 20);
      expect(bars.first.outerRect.height, CbDataVisualizationTokens.minBar);
    });

    test('drops non-finite entries', () {
      expect(
        cbBarMiniGeometry(
          const <double>[1, double.nan, double.infinity, 2],
          100,
          20,
        ),
        hasLength(2),
      );
    });
  });

  testWidgets('mini charts expose one named image each', (
    WidgetTester tester,
  ) async {
    final SemanticsHandle semantics = tester.ensureSemantics();
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Row(
          children: <Widget>[
            CbDonut(
              semanticLabel: 'Spend: rent 40 percent, food 60 percent',
              slices: <CbDonutSlice>[
                CbDonutSlice(value: 4, label: 'Rent'),
                CbDonutSlice(value: 6, label: 'Food'),
              ],
            ),
            CbSparkline(
              semanticLabel: 'Sessions rose from 3 to 7 this week',
              values: <double>[3, 5, 4, 8, 6, 9, 7],
            ),
            CbBarMini(
              semanticLabel: 'Incidents by day: 2, 4, and 1',
              values: <double>[2, 4, 1],
            ),
          ],
        ),
      ),
    );

    expect(
      tester.getSemantics(find.byType(CbDonut)),
      matchesSemantics(
        label: 'Spend: rent 40 percent, food 60 percent',
        isImage: true,
      ),
    );
    expect(
      tester.getSemantics(find.byType(CbSparkline)),
      matchesSemantics(
        label: 'Sessions rose from 3 to 7 this week',
        isImage: true,
      ),
    );
    expect(
      tester.getSemantics(find.byType(CbBarMini)),
      matchesSemantics(label: 'Incidents by day: 2, 4, and 1', isImage: true),
    );
    semantics.dispose();
  });

  testWidgets('Skeleton companions preserve chart geometry without semantics', (
    WidgetTester tester,
  ) async {
    final SemanticsHandle semantics = tester.ensureSemantics();
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Row(
          children: <Widget>[
            CbDonutSkeleton(size: CbSize.sm),
            CbSparklineSkeleton(size: CbSize.sm),
            CbBarMiniSkeleton(size: CbSize.sm),
          ],
        ),
      ),
    );

    expect(
      tester.getSize(find.byType(CbDonutSkeleton)),
      const Size.square(CbDataVisualizationTokens.donutSizeSm),
    );
    expect(
      tester.getSize(find.byType(CbSparklineSkeleton)),
      const Size(
        CbDataVisualizationTokens.widthSm,
        CbDataVisualizationTokens.heightSm,
      ),
    );
    expect(
      tester.getSize(find.byType(CbBarMiniSkeleton)),
      const Size(
        CbDataVisualizationTokens.widthSm,
        CbDataVisualizationTokens.heightSm,
      ),
    );
    expect(find.bySemanticsLabel(RegExp('.+')), findsNothing);
    semantics.dispose();
  });
}
