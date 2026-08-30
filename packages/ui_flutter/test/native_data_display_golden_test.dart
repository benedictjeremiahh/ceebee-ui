import 'dart:convert';

import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key dataDisplayOverviewGoldenKey = Key('data-display-overview-golden');
const Key dataDisplayTableGoldenKey = Key('data-display-table-golden');

void main() {
  testWidgets('Native data display overview — light', (
    WidgetTester tester,
  ) async {
    await _pumpScene(
      tester,
      cbThemeData(),
      dataDisplayOverviewGoldenKey,
      const _OverviewScene(),
      const Size(900, 760),
    );
    await expectLater(
      find.byKey(dataDisplayOverviewGoldenKey),
      matchesGoldenFile('goldens/native_data_display_overview_light.png'),
    );
  });

  testWidgets('Native data display overview — dark', (
    WidgetTester tester,
  ) async {
    await _pumpScene(
      tester,
      cbThemeData(brightness: Brightness.dark),
      dataDisplayOverviewGoldenKey,
      const _OverviewScene(),
      const Size(900, 760),
    );
    await expectLater(
      find.byKey(dataDisplayOverviewGoldenKey),
      matchesGoldenFile('goldens/native_data_display_overview_dark.png'),
    );
  });

  testWidgets('Native data table — light', (WidgetTester tester) async {
    await _pumpScene(
      tester,
      cbThemeData(),
      dataDisplayTableGoldenKey,
      const _TableScene(),
      const Size(900, 620),
    );
    await expectLater(
      find.byKey(dataDisplayTableGoldenKey),
      matchesGoldenFile('goldens/native_data_table_light.png'),
    );
  });

  testWidgets('Native data table — dark', (WidgetTester tester) async {
    await _pumpScene(
      tester,
      cbThemeData(brightness: Brightness.dark),
      dataDisplayTableGoldenKey,
      const _TableScene(),
      const Size(900, 620),
    );
    await expectLater(
      find.byKey(dataDisplayTableGoldenKey),
      matchesGoldenFile('goldens/native_data_table_dark.png'),
    );
  });
}

Future<void> _pumpScene(
  WidgetTester tester,
  ThemeData theme,
  Key boundaryKey,
  Widget scene,
  Size size,
) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = size;
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);

  await tester.pumpWidget(
    MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: _goldenTheme(theme),
      home: RepaintBoundary(key: boundaryKey, child: scene),
    ),
  );
  await tester.pump();
}

ThemeData _goldenTheme(ThemeData theme) =>
    theme.copyWith(textTheme: theme.textTheme.apply(fontFamily: 'Roboto'));

class _OverviewScene extends StatelessWidget {
  const _OverviewScene();

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(CbStructure.space6),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Text('Native data display', style: type.displaySmall),
            const SizedBox(height: CbStructure.space2),
            Text(
              'Ordered content, progressive disclosure, and resilient media through the active Skin.',
              style: type.bodyLarge,
            ),
            const SizedBox(height: CbStructure.space5),
            SizedBox(
              height: CbStructure.space8 * 4,
              child: CarouselView(
                itemExtent: CbStructure.space8 * 6,
                children: const <Widget>[
                  _GoldenStory(
                    icon: Icons.inventory_2_outlined,
                    title: 'Collect source material',
                    detail:
                        'Gather decisions and evidence in one visible place.',
                  ),
                  _GoldenStory(
                    icon: Icons.account_tree_outlined,
                    title: 'Connect the work',
                    detail: 'Show how each release depends on the next.',
                  ),
                  _GoldenStory(
                    icon: Icons.fact_check_outlined,
                    title: 'Review with context',
                    detail: 'Keep the relevant state beside every decision.',
                  ),
                ],
              ),
            ),
            const SizedBox(height: CbStructure.space5),
            Expanded(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  Expanded(
                    child: SingleChildScrollView(
                      child: ExpansionPanelList.radio(
                        initialOpenPanelValue: 'retention',
                        children: <ExpansionPanelRadio>[
                          ExpansionPanelRadio(
                            value: 'retention',
                            canTapOnHeader: true,
                            headerBuilder: _retentionHeader,
                            body: const Padding(
                              padding: EdgeInsets.only(
                                left: CbStructure.space4,
                                right: CbStructure.space4,
                                bottom: CbStructure.space4,
                              ),
                              child: Text(
                                'Completed releases remain available for 90 days.',
                              ),
                            ),
                          ),
                          ExpansionPanelRadio(
                            value: 'access',
                            canTapOnHeader: true,
                            headerBuilder: _accessHeader,
                            body: const SizedBox.shrink(),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: CbStructure.space4),
                  Expanded(
                    child: CbSurface(
                      padding: CbPad.none,
                      child: Stack(
                        fit: StackFit.expand,
                        children: <Widget>[
                          Image.memory(
                            base64Decode(
                              'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAARGVYSWZNTQAqAAAACAABh2kABAAAAAEAAAAaAAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAAIoAMABAAAAAEAAAAIAAAAAJWEe1IAAAC1SURBVBgZLY9bbgIxDEWPQx4w8IGq7qX7Xwp/RUVUotA8ZibGKbUcJTmyde+VR26ac8E5xzTtALFW6K+nR9VQp3el9WoU1rJl44SQOlLqojE4VITz95kQIvUS2U2e/THgx+bX9UaKkY1u0dmxP8xIUroE3Lws/NzulDZzf2T6alLJ09wQM/lcVx2eTuWXz1r4OL6ZIwPWYrLezl+9p8TB+/8QI8mLS2mrWhCbHmzksc+ocRl7AoOsVIdUTQI2AAAAAElFTkSuQmCC',
                            ),
                            semanticLabel: 'Teal workspace preview',
                            color: context.cb.decorTeal.toColor(),
                            colorBlendMode: BlendMode.srcIn,
                            fit: BoxFit.cover,
                          ),
                          const Center(child: Icon(Icons.image_outlined)),
                          const Positioned(
                            left: CbStructure.space4,
                            bottom: CbStructure.space4,
                            child: Text('Loaded preview'),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _GoldenStory extends StatelessWidget {
  const _GoldenStory({
    required this.icon,
    required this.title,
    required this.detail,
  });

  final IconData icon;
  final String title;
  final String detail;

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (BuildContext context, BoxConstraints constraints) {
      if (constraints.maxWidth < CbStructure.space8 * 2) {
        return Padding(
          padding: const EdgeInsets.all(CbStructure.space2),
          child: FittedBox(child: Icon(icon)),
        );
      }
      return Padding(
        padding: const EdgeInsets.all(CbStructure.space5),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Icon(icon, size: CbStructure.space7),
            const Spacer(),
            Text(title, style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: CbStructure.space2),
            Text(detail),
          ],
        ),
      );
    },
  );
}

class _TableScene extends StatelessWidget {
  const _TableScene();

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(CbStructure.space6),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Text('Workspace health', style: type.displaySmall),
            const SizedBox(height: CbStructure.space2),
            Text(
              'A sortable, selectable table preserves meaningful row context.',
              style: type.bodyLarge,
            ),
            const SizedBox(height: CbStructure.space5),
            CbSurface(
              padding: CbPad.none,
              child: DataTable(
                sortColumnIndex: 0,
                sortAscending: true,
                columns: const <DataColumn>[
                  DataColumn(label: Text('Workspace')),
                  DataColumn(label: Text('Owner')),
                  DataColumn(label: Text('Status')),
                  DataColumn(numeric: true, label: Text('Health')),
                ],
                rows: const <DataRow>[
                  DataRow(
                    selected: true,
                    cells: <DataCell>[
                      DataCell(Text('Atlas')),
                      DataCell(Text('Ada')),
                      DataCell(_GoldenStatus(Icons.check_circle, 'Ready')),
                      DataCell(Text('92%')),
                    ],
                  ),
                  DataRow(
                    cells: <DataCell>[
                      DataCell(Text('Beacon')),
                      DataCell(Text('Grace')),
                      DataCell(_GoldenStatus(Icons.rate_review, 'Review')),
                      DataCell(Text('76%')),
                    ],
                  ),
                  DataRow(
                    cells: <DataCell>[
                      DataCell(Text('Current')),
                      DataCell(Text('Linus')),
                      DataCell(_GoldenStatus(Icons.block, 'Blocked')),
                      DataCell(Text('41%')),
                    ],
                  ),
                ],
              ),
            ),
            const Spacer(),
            const Row(
              children: <Widget>[
                Icon(Icons.swipe),
                SizedBox(width: CbStructure.space2),
                Expanded(
                  child: Text(
                    'On narrow screens, the native table remains horizontally scrollable.',
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _GoldenStatus extends StatelessWidget {
  const _GoldenStatus(this.icon, this.label);
  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) => Row(
    mainAxisSize: MainAxisSize.min,
    children: <Widget>[
      Icon(icon),
      const SizedBox(width: CbStructure.space2),
      Text(label),
    ],
  );
}

Widget _retentionHeader(BuildContext context, bool isExpanded) =>
    const ListTile(
      leading: Icon(Icons.archive_outlined),
      title: Text('Release retention'),
    );

Widget _accessHeader(BuildContext context, bool isExpanded) => const ListTile(
  leading: Icon(Icons.admin_panel_settings_outlined),
  title: Text('Workspace access'),
);
