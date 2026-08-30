import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key nativeLayoutGoldenKey = Key('native-layout-golden');

void main() {
  testWidgets('Native layout wide — light', (WidgetTester tester) async {
    await _pumpLayout(tester, cbThemeData(), const Size(1000, 760));
    await expectLater(
      find.byKey(nativeLayoutGoldenKey),
      matchesGoldenFile('goldens/native_layout_wide_light.png'),
    );
  });

  testWidgets('Native layout wide — dark', (WidgetTester tester) async {
    await _pumpLayout(
      tester,
      cbThemeData(brightness: Brightness.dark),
      const Size(1000, 760),
    );
    await expectLater(
      find.byKey(nativeLayoutGoldenKey),
      matchesGoldenFile('goldens/native_layout_wide_dark.png'),
    );
  });

  testWidgets('Native layout compact — light', (WidgetTester tester) async {
    await _pumpLayout(tester, cbThemeData(), const Size(420, 800));
    await expectLater(
      find.byKey(nativeLayoutGoldenKey),
      matchesGoldenFile('goldens/native_layout_compact_light.png'),
    );
  });

  testWidgets('Native layout compact — dark', (WidgetTester tester) async {
    await _pumpLayout(
      tester,
      cbThemeData(brightness: Brightness.dark),
      const Size(420, 800),
    );
    await expectLater(
      find.byKey(nativeLayoutGoldenKey),
      matchesGoldenFile('goldens/native_layout_compact_dark.png'),
    );
  });
}

Future<void> _pumpLayout(
  WidgetTester tester,
  ThemeData theme,
  Size size,
) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = size;
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);

  await tester.pumpWidget(
    MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: theme.copyWith(
        textTheme: theme.textTheme.apply(fontFamily: 'Roboto'),
        appBarTheme: theme.appBarTheme.copyWith(
          titleTextStyle: theme.appBarTheme.titleTextStyle?.copyWith(
            fontFamily: 'Roboto',
          ),
          toolbarTextStyle: theme.appBarTheme.toolbarTextStyle?.copyWith(
            fontFamily: 'Roboto',
          ),
        ),
      ),
      home: const RepaintBoundary(
        key: nativeLayoutGoldenKey,
        child: _LayoutScene(),
      ),
    ),
  );
  await tester.pump();
}

class _LayoutScene extends StatelessWidget {
  const _LayoutScene();

  @override
  Widget build(BuildContext context) => Scaffold(
    body: SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(CbStructure.space5),
        child: LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            final bool wide = constraints.maxWidth >= CbStructure.space8 * 10;
            final TextTheme type = Theme.of(context).textTheme;
            return Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                Text('Adaptive workspace', style: type.displaySmall),
                const SizedBox(height: CbStructure.space2),
                Text(
                  'One content model, composed for the space that is actually available.',
                  style: type.bodyLarge,
                ),
                const SizedBox(height: CbStructure.space4),
                _MetricStrip(wide: wide),
                const SizedBox(height: CbStructure.space4),
                Expanded(
                  child: CbSurface(
                    padding: CbPad.none,
                    child: ClipRRect(
                      borderRadius: CbRadius.lg.borderRadius,
                      child: _WorkspaceShell(wide: wide),
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    ),
  );
}

class _MetricStrip extends StatelessWidget {
  const _MetricStrip({required this.wide});
  final bool wide;

  @override
  Widget build(BuildContext context) {
    if (wide) {
      return Row(
        children: <Widget>[
          for (int index = 0; index < _metrics.length; index++) ...<Widget>[
            if (index > 0) const SizedBox(width: CbStructure.space3),
            Expanded(child: _MetricLine(_metrics[index])),
          ],
        ],
      );
    }
    return Column(
      children: <Widget>[
        for (int index = 0; index < _metrics.length; index++) ...<Widget>[
          if (index > 0) const SizedBox(height: CbStructure.space2),
          _MetricLine(_metrics[index]),
        ],
      ],
    );
  }
}

class _MetricLine extends StatelessWidget {
  const _MetricLine(this.metric);
  final (IconData, String, String) metric;

  @override
  Widget build(BuildContext context) {
    final (IconData icon, String value, String label) = metric;
    return Row(
      children: <Widget>[
        Icon(icon),
        const SizedBox(width: CbStructure.space2),
        Text(value, style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(width: CbStructure.space2),
        Expanded(child: Text(label)),
      ],
    );
  }
}

class _WorkspaceShell extends StatelessWidget {
  const _WorkspaceShell({required this.wide});
  final bool wide;

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(
      title: const Text('Release workspace'),
      actions: const <Widget>[
        IconButton(
          onPressed: _ignoreAction,
          tooltip: 'Search workspace',
          icon: Icon(Icons.search),
        ),
      ],
    ),
    body: SafeArea(
      top: false,
      child: wide
          ? Row(
              children: <Widget>[
                NavigationRail(
                  selectedIndex: 0,
                  labelType: NavigationRailLabelType.all,
                  destinations: _railDestinations,
                ),
                const VerticalDivider(width: CbStructure.space1),
                Expanded(child: _WorkspaceScroll(wide: true)),
              ],
            )
          : const _WorkspaceScroll(wide: false),
    ),
    bottomNavigationBar: wide
        ? null
        : NavigationBar(selectedIndex: 0, destinations: _barDestinations),
  );
}

class _WorkspaceScroll extends StatelessWidget {
  const _WorkspaceScroll({required this.wide});
  final bool wide;

  @override
  Widget build(BuildContext context) => CustomScrollView(
    slivers: <Widget>[
      SliverPadding(
        padding: const EdgeInsets.all(CbStructure.space4),
        sliver: SliverGrid.builder(
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: wide ? 4 : 2,
            mainAxisExtent: CbStructure.space8 * 2,
            mainAxisSpacing: CbStructure.space3,
            crossAxisSpacing: CbStructure.space3,
          ),
          itemCount: _tiles.length,
          itemBuilder: (BuildContext context, int index) => CbSurface(
            variant: index == 0
                ? CbSurfaceVariant.tinted
                : CbSurfaceVariant.plain,
            tone: index == 0 ? CbTone.brand : CbTone.neutral,
            padding: CbPad.sm,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Icon(_tiles[index].$1),
                const Spacer(),
                Text(
                  _tiles[index].$2,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                Text(
                  _tiles[index].$3,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          ),
        ),
      ),
      SliverPadding(
        padding: const EdgeInsets.fromLTRB(
          CbStructure.space4,
          CbStructure.space2,
          CbStructure.space4,
          CbStructure.space4,
        ),
        sliver: SliverList.list(
          children: const <Widget>[
            ListTile(
              leading: Icon(Icons.check_circle_outline),
              title: Text('Atlas is ready'),
              subtitle: Text('All release checks passed'),
            ),
            Divider(),
            ListTile(
              leading: Icon(Icons.rate_review_outlined),
              title: Text('Beacon needs review'),
              subtitle: Text('Owner: Grace'),
            ),
            Divider(),
            ListTile(
              leading: Icon(Icons.block_outlined),
              title: Text('Current is blocked'),
              subtitle: Text('Dependency missing'),
            ),
            Divider(),
            ListTile(
              leading: Icon(Icons.schedule_outlined),
              title: Text('Delta is scheduled'),
              subtitle: Text('Friday release'),
            ),
          ],
        ),
      ),
    ],
  );
}

const List<(IconData, String, String)> _metrics = <(IconData, String, String)>[
  (Icons.widgets_outlined, '12', 'active workspaces'),
  (Icons.rule_outlined, '6', 'awaiting review'),
  (Icons.monitor_heart_outlined, '92%', 'healthy'),
];

const List<(IconData, String, String)> _tiles = <(IconData, String, String)>[
  (Icons.rocket_launch_outlined, 'Ready', 'Primary release'),
  (Icons.schedule_outlined, 'Friday', 'Next window'),
  (Icons.people_outline, '4 owners', 'Active today'),
  (Icons.archive_outlined, '90 days', 'Retention'),
];

const List<NavigationRailDestination> _railDestinations =
    <NavigationRailDestination>[
      NavigationRailDestination(
        icon: Icon(Icons.space_dashboard_outlined),
        selectedIcon: Icon(Icons.space_dashboard),
        label: Text('Overview'),
      ),
      NavigationRailDestination(
        icon: Icon(Icons.rule_outlined),
        label: Text('Reviews'),
      ),
      NavigationRailDestination(
        icon: Icon(Icons.people_outline),
        label: Text('Owners'),
      ),
    ];

const List<NavigationDestination> _barDestinations = <NavigationDestination>[
  NavigationDestination(
    icon: Icon(Icons.space_dashboard_outlined),
    selectedIcon: Icon(Icons.space_dashboard),
    label: 'Overview',
  ),
  NavigationDestination(icon: Icon(Icons.rule_outlined), label: 'Reviews'),
  NavigationDestination(icon: Icon(Icons.people_outline), label: 'Owners'),
];

void _ignoreAction() {}
