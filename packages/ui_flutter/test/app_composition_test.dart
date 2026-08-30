import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key _themeProbeKey = Key('app-theme-probe');
const Key _scrollKey = Key('app-anchor-scroll');
const Key _pinnedKey = Key('app-anchor-pinned');
const Key _targetKey = Key('app-anchor-target');

void main() {
  testWidgets(
    'MaterialApp selects Ceebee dark theme from platform brightness',
    (WidgetTester tester) async {
      tester.platformDispatcher.platformBrightnessTestValue = Brightness.dark;
      addTearDown(tester.platformDispatcher.clearPlatformBrightnessTestValue);

      await tester.pumpWidget(_themedApp());

      final BuildContext context = tester.element(find.byKey(_themeProbeKey));
      expect(Theme.of(context).brightness, Brightness.dark);
      expect(context.cbTheme.skin, CbSkin.astra);
      expect(context.cbTheme.highContrast, isFalse);
    },
  );

  testWidgets('MaterialApp selects Ceebee high-contrast theme slot', (
    WidgetTester tester,
  ) async {
    tester.binding.platformDispatcher.accessibilityFeaturesTestValue =
        const FakeAccessibilityFeatures(highContrast: true);
    addTearDown(
      tester.binding.platformDispatcher.clearAccessibilityFeaturesTestValue,
    );

    await tester.pumpWidget(_themedApp());

    final BuildContext context = tester.element(find.byKey(_themeProbeKey));
    expect(context.cbTheme.highContrast, isTrue);
    expect(context.cbTheme.reduceTransparency, isTrue);
  });

  testWidgets('ensureVisible navigates while a sliver remains pinned', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(body: _AnchorHarness()),
      ),
    );

    expect(
      tester.getTopLeft(find.byKey(_pinnedKey)).dy,
      tester.getTopLeft(find.byKey(_scrollKey)).dy,
    );
    await tester.tap(find.text('Jump to list'));
    await tester.pumpAndSettle();

    expect(find.byKey(_targetKey), findsOneWidget);
    expect(
      tester.getTopLeft(find.byKey(_pinnedKey)).dy,
      tester.getTopLeft(find.byKey(_scrollKey)).dy,
    );
  });

  testWidgets('ListView.builder lazily creates native rows', (
    WidgetTester tester,
  ) async {
    int buildCount = 0;
    final ScrollController controller = ScrollController();
    addTearDown(controller.dispose);
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: Scaffold(
          body: ListView.builder(
            controller: controller,
            itemCount: 100,
            itemBuilder: (BuildContext context, int index) {
              buildCount += 1;
              return SizedBox(
                height: CbStructure.space8,
                child: Text('Native row $index'),
              );
            },
          ),
        ),
      ),
    );

    expect(buildCount, lessThan(100));
    controller.jumpTo(controller.position.maxScrollExtent);
    await tester.pump();
    expect(find.text('Native row 99'), findsOneWidget);
  });
}

Widget _themedApp() => MaterialApp(
  themeMode: ThemeMode.system,
  theme: cbThemeData(skin: CbSkin.astra),
  darkTheme: cbThemeData(skin: CbSkin.astra, brightness: Brightness.dark),
  highContrastTheme: cbThemeData(skin: CbSkin.astra, highContrast: true),
  highContrastDarkTheme: cbThemeData(
    skin: CbSkin.astra,
    brightness: Brightness.dark,
    highContrast: true,
  ),
  home: const Scaffold(body: SizedBox(key: _themeProbeKey)),
);

class _AnchorHarness extends StatefulWidget {
  const _AnchorHarness();

  @override
  State<_AnchorHarness> createState() => _AnchorHarnessState();
}

class _AnchorHarnessState extends State<_AnchorHarness> {
  final GlobalKey _target = GlobalKey();

  @override
  Widget build(BuildContext context) => CustomScrollView(
    key: _scrollKey,
    slivers: <Widget>[
      SliverPersistentHeader(
        pinned: true,
        delegate: _PinnedDelegate(
          onPressed: () {
            final BuildContext? targetContext = _target.currentContext;
            if (targetContext == null) return;
            Scrollable.ensureVisible(
              targetContext,
              duration: CbMotionTokens.fast,
              curve: CbMotionTokens.standard,
            );
          },
        ),
      ),
      SliverToBoxAdapter(
        child: Column(
          children: <Widget>[
            const SizedBox(height: CbStructure.space8 * 10),
            SizedBox(
              key: _target,
              height: CbStructure.space8,
              child: const Text('Target list', key: _targetKey),
            ),
          ],
        ),
      ),
    ],
  );
}

class _PinnedDelegate extends SliverPersistentHeaderDelegate {
  const _PinnedDelegate({required this.onPressed});

  final VoidCallback onPressed;

  @override
  double get minExtent => CbStructure.space8;

  @override
  double get maxExtent => minExtent;

  @override
  Widget build(
    BuildContext context,
    double shrinkOffset,
    bool overlapsContent,
  ) => Material(
    key: _pinnedKey,
    color: Theme.of(context).colorScheme.surface,
    child: Align(
      alignment: Alignment.centerLeft,
      child: TextButton(
        onPressed: onPressed,
        child: const Text('Jump to list'),
      ),
    ),
  );

  @override
  bool shouldRebuild(_PinnedDelegate oldDelegate) =>
      oldDelegate.onPressed != onPressed;
}
