import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key adaptiveFlexKey = Key('layout-adaptive-flex');
const Key safeAreaContentKey = Key('layout-safe-area-content');
const Key sliverScrollKey = Key('layout-sliver-scroll');

void main() {
  testWidgets('Flex changes axis where its content no longer fits', (
    WidgetTester tester,
  ) async {
    await _pumpAtSize(tester, const Size(900, 600), const _FlexHarness());
    expect(
      tester.widget<Flex>(find.byKey(adaptiveFlexKey)).direction,
      Axis.horizontal,
    );

    tester.view.physicalSize = const Size(360, 600);
    await tester.pumpAndSettle();
    expect(
      tester.widget<Flex>(find.byKey(adaptiveFlexKey)).direction,
      Axis.vertical,
    );
  });

  testWidgets('GridView reflows items instead of overflowing narrow width', (
    WidgetTester tester,
  ) async {
    await _pumpAtSize(tester, const Size(760, 600), const _GridHarness());
    expect(
      tester.getTopLeft(find.byKey(const Key('grid-item-2'))).dy,
      CbStructure.space4,
    );

    tester.view.physicalSize = const Size(360, 600);
    await tester.pumpAndSettle();
    expect(
      tester.getTopLeft(find.byKey(const Key('grid-item-2'))).dy,
      greaterThan(CbStructure.space4),
    );
  });

  testWidgets('SafeArea keeps content outside the supplied system inset', (
    WidgetTester tester,
  ) async {
    _useTestViewport(tester, const Size(500, 500));
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: MediaQuery(
          data: const MediaQueryData(
            padding: EdgeInsets.only(top: CbStructure.space6),
          ),
          child: const Scaffold(
            body: SafeArea(
              child: Align(
                alignment: Alignment.topLeft,
                child: SizedBox(
                  key: safeAreaContentKey,
                  width: CbStructure.space8,
                  height: CbStructure.space8,
                ),
              ),
            ),
          ),
        ),
      ),
    );

    expect(
      tester.getTopLeft(find.byKey(safeAreaContentKey)).dy,
      CbStructure.space6,
    );
  });

  testWidgets('CustomScrollView composes grid and list slivers in one plane', (
    WidgetTester tester,
  ) async {
    await _pumpAtSize(tester, const Size(500, 500), const _SliverHarness());
    expect(find.text('Queue item 12'), findsNothing);

    await tester.scrollUntilVisible(
      find.text('Queue item 12'),
      CbStructure.space8,
      scrollable: find.descendant(
        of: find.byKey(sliverScrollKey),
        matching: find.byType(Scrollable),
      ),
    );

    expect(find.text('Queue item 12'), findsOneWidget);
  });
}

Future<void> _pumpAtSize(WidgetTester tester, Size size, Widget child) async {
  _useTestViewport(tester, size);
  await tester.pumpWidget(
    MaterialApp(
      theme: cbThemeData(),
      home: Scaffold(body: child),
    ),
  );
  await tester.pumpAndSettle();
}

void _useTestViewport(WidgetTester tester, Size size) {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = size;
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);
}

class _FlexHarness extends StatelessWidget {
  const _FlexHarness();

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (BuildContext context, BoxConstraints constraints) => Flex(
      key: adaptiveFlexKey,
      direction: constraints.maxWidth < CbStructure.space8 * 8
          ? Axis.vertical
          : Axis.horizontal,
      children: const <Widget>[
        SizedBox(width: CbStructure.space8 * 3, height: CbStructure.space8),
        SizedBox(width: CbStructure.space8 * 3, height: CbStructure.space8),
      ],
    ),
  );
}

class _GridHarness extends StatelessWidget {
  const _GridHarness();

  @override
  Widget build(BuildContext context) => GridView.builder(
    padding: const EdgeInsets.all(CbStructure.space4),
    gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
      maxCrossAxisExtent: CbStructure.space8 * 3,
      mainAxisSpacing: CbStructure.space4,
      crossAxisSpacing: CbStructure.space4,
    ),
    itemCount: 6,
    itemBuilder: (BuildContext context, int index) =>
        SizedBox(key: Key('grid-item-$index'), child: Text('Item $index')),
  );
}

class _SliverHarness extends StatelessWidget {
  const _SliverHarness();

  @override
  Widget build(BuildContext context) => CustomScrollView(
    key: sliverScrollKey,
    slivers: <Widget>[
      SliverPadding(
        padding: const EdgeInsets.all(CbStructure.space4),
        sliver: SliverGrid.builder(
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            mainAxisSpacing: CbStructure.space4,
            crossAxisSpacing: CbStructure.space4,
          ),
          itemCount: 4,
          itemBuilder: (BuildContext context, int index) => Text('Grid $index'),
        ),
      ),
      SliverList.builder(
        itemCount: 13,
        itemBuilder: (BuildContext context, int index) => SizedBox(
          height: CbStructure.space8,
          child: Text('Queue item $index'),
        ),
      ),
    ],
  );
}
