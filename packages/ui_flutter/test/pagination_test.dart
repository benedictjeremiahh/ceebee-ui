import 'dart:ui' as ui;

import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Pagination exposes selected page and app-owned navigation', (
    WidgetTester tester,
  ) async {
    int? selectedPage;
    await tester.pumpWidget(
      _app(
        SizedBox(
          width: CbStructure.space8 * 12,
          child: CbPagination(
            pageCount: 12,
            currentPage: 3,
            onPageChanged: (int page) => selectedPage = page,
          ),
        ),
      ),
    );

    expect(
      tester
          .getSemantics(find.bySemanticsLabel('3 / 12'))
          .flagsCollection
          .isSelected,
      ui.Tristate.isTrue,
    );

    await tester.tap(find.text('4'));
    expect(selectedPage, 4);
  });

  testWidgets(
    'expanded Pagination truncates a long range without losing endpoints',
    (WidgetTester tester) async {
      await tester.pumpWidget(
        _app(
          const SizedBox(
            width: CbStructure.space8 * 12,
            child: CbPagination(pageCount: 24, currentPage: 12),
          ),
        ),
      );

      expect(find.text('1'), findsOneWidget);
      expect(find.text('11'), findsOneWidget);
      expect(find.text('12'), findsOneWidget);
      expect(find.text('13'), findsOneWidget);
      expect(find.text('24'), findsOneWidget);
      expect(find.text('…'), findsNWidgets(2));
    },
  );

  testWidgets('boundary and global disabled states suppress callbacks', (
    WidgetTester tester,
  ) async {
    int callbackCount = 0;
    await tester.pumpWidget(
      _app(
        SizedBox(
          width: CbStructure.space8 * 12,
          child: CbPagination(
            pageCount: 5,
            currentPage: 1,
            onPageChanged: (_) => callbackCount += 1,
          ),
        ),
      ),
    );

    expect(
      tester
          .getSemantics(
            find.byKey(const ValueKey<String>('cb-pagination-previous')),
          )
          .flagsCollection
          .isEnabled,
      ui.Tristate.isFalse,
    );
    await tester.tap(find.byKey(const ValueKey<String>('cb-pagination-next')));
    expect(callbackCount, 1);

    await tester.pumpWidget(
      _app(
        const SizedBox(
          width: CbStructure.space8 * 12,
          child: CbPagination(pageCount: 5, currentPage: 2),
        ),
      ),
    );
    await tester.tap(find.byKey(const ValueKey<String>('cb-pagination-next')));
    expect(callbackCount, 1);
  });

  testWidgets('compact Pagination preserves mobile controls without overflow', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      _app(
        SizedBox(
          width: CbStructure.space8 * 4,
          child: const CbPagination(
            pageCount: 24,
            currentPage: 12,
            semanticPageLabelBuilder: _pageLabel,
          ),
        ),
      ),
    );

    expect(find.text('12 / 24'), findsOneWidget);
    expect(find.text('11'), findsNothing);
    expect(find.text('13'), findsNothing);
    expect(find.bySemanticsLabel('Page 12 of 24'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Pagination honors component and OS reduced motion', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      _app(const CbPagination(pageCount: 5, currentPage: 2, motion: false)),
    );

    final Iterable<AnimatedContainer> containers = tester
        .widgetList<AnimatedContainer>(
          find.descendant(
            of: find.byType(CbPagination),
            matching: find.byType(AnimatedContainer),
          ),
        );
    expect(containers, isNotEmpty);
    expect(
      containers.every(
        (AnimatedContainer item) => item.duration == Duration.zero,
      ),
      isTrue,
    );
  });

  testWidgets(
    'Pagination Skeleton matches adaptive control count and excludes semantics',
    (WidgetTester tester) async {
      final SemanticsHandle semantics = tester.ensureSemantics();

      await tester.pumpWidget(
        _app(
          const SizedBox(
            width: CbStructure.space8 * 12,
            child: CbPaginationSkeleton(pageSlotCount: 5, motion: false),
          ),
        ),
      );
      expect(find.byType(CbSkeleton), findsNWidgets(7));
      expect(
        find.descendant(
          of: find.byType(CbPaginationSkeleton),
          matching: find.byType(FadeTransition),
        ),
        findsNothing,
      );

      await tester.pumpWidget(
        _app(
          const SizedBox(
            width: CbStructure.space8 * 4,
            child: CbPaginationSkeleton(pageSlotCount: 5, motion: false),
          ),
        ),
      );
      expect(find.byType(CbSkeleton), findsNWidgets(3));
      expect(
        tester.getSemantics(find.byType(CbPaginationSkeleton)).label,
        isEmpty,
      );
      semantics.dispose();
    },
  );
}

Widget _app(Widget child) => MaterialApp(
  theme: cbThemeData(),
  home: Scaffold(body: Center(child: child)),
);

String _pageLabel(int page, int pageCount) => 'Page $page of $pageCount';
