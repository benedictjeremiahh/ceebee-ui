import 'dart:convert';
import 'dart:typed_data';

import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key carouselKey = Key('data-carousel');
const Key expansionKey = Key('data-expansion');
const Key sortableTableKey = Key('data-sortable-table');
const Key paginatedTableKey = Key('data-paginated-table');
const Key previewImageKey = Key('data-preview-image');

void main() {
  testWidgets('carousel controller changes the leading native item', (
    WidgetTester tester,
  ) async {
    _useTestViewport(tester);
    await tester.pumpWidget(
      MaterialApp(theme: cbThemeData(), home: const _DataDisplayHarness()),
    );

    expect(find.text('Carousel index: 0'), findsOneWidget);
    final _DataDisplayHarnessState state = tester
        .state<_DataDisplayHarnessState>(find.byType(_DataDisplayHarness));
    final Future<void> animation = state.carouselController.animateToItem(
      1,
      duration: CbMotionTokens.deliberate,
      curve: Curves.easeOut,
    );
    await tester.pumpAndSettle();
    await animation;
    expect(find.text('Carousel index: 1'), findsOneWidget);
  });

  testWidgets('expansion panel reveals and hides only its owned content', (
    WidgetTester tester,
  ) async {
    _useTestViewport(tester);
    await tester.pumpWidget(
      MaterialApp(theme: cbThemeData(), home: const _DataDisplayHarness()),
    );

    expect(find.text('Retention details').hitTestable(), findsNothing);
    await tester.tap(find.text('Retention policy'));
    await tester.pumpAndSettle();
    expect(find.text('Retention details').hitTestable(), findsOneWidget);

    await tester.tap(find.text('Retention policy'));
    await tester.pumpAndSettle();
    expect(find.text('Retention details').hitTestable(), findsNothing);
  });

  testWidgets('image exposes a semantic label and recoverable error state', (
    WidgetTester tester,
  ) async {
    _useTestViewport(tester);
    await tester.pumpWidget(
      MaterialApp(theme: cbThemeData(), home: const _DataDisplayHarness()),
    );
    await tester.pumpAndSettle();

    final Image preview = tester.widget<Image>(find.byKey(previewImageKey));
    expect(preview.semanticLabel, 'Workspace preview');
    expect(preview.excludeFromSemantics, isFalse);
    expect(find.text('Preview unavailable'), findsOneWidget);
    expect(find.widgetWithText(TextButton, 'Retry'), findsOneWidget);
  });

  testWidgets('data table sorts and selects rows through native callbacks', (
    WidgetTester tester,
  ) async {
    _useTestViewport(tester);
    await tester.pumpWidget(
      MaterialApp(theme: cbThemeData(), home: const _DataDisplayHarness()),
    );

    await tester.tap(find.text('Name'));
    await tester.pumpAndSettle();
    expect(find.text('Sort: descending'), findsOneWidget);

    await tester.tap(find.text('Atlas').last);
    await tester.pumpAndSettle();
    expect(find.text('Selected: Atlas'), findsOneWidget);
  });

  testWidgets('paginated data table reveals the next source page', (
    WidgetTester tester,
  ) async {
    _useTestViewport(tester);
    await tester.pumpWidget(
      MaterialApp(theme: cbThemeData(), home: const _DataDisplayHarness()),
    );

    expect(find.text('Gamma'), findsNothing);
    await tester.tap(find.byTooltip('Next page'));
    await tester.pumpAndSettle();
    expect(find.text('Gamma'), findsOneWidget);
  });
}

class _DataDisplayHarness extends StatefulWidget {
  const _DataDisplayHarness();

  @override
  State<_DataDisplayHarness> createState() => _DataDisplayHarnessState();
}

class _DataDisplayHarnessState extends State<_DataDisplayHarness> {
  final _WorkspaceSource _source = _WorkspaceSource();
  final CarouselController carouselController = CarouselController();
  int _carouselIndex = 0;
  bool _expanded = false;
  bool _sortAscending = true;
  String _selected = 'none';

  @override
  void dispose() {
    carouselController.dispose();
    _source.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: SingleChildScrollView(
      child: Column(
        children: <Widget>[
          SizedBox(
            height: CbStructure.space8 * 2,
            child: CarouselView(
              key: carouselKey,
              controller: carouselController,
              itemExtent: CbStructure.space8 * 4,
              itemSnapping: true,
              onIndexChanged: (int index) =>
                  setState(() => _carouselIndex = index),
              children: const <Widget>[
                Center(child: Text('First story')),
                Center(child: Text('Second story')),
                Center(child: Text('Third story')),
                Center(child: Text('Fourth story')),
                Center(child: Text('Fifth story')),
              ],
            ),
          ),
          Text('Carousel index: $_carouselIndex'),
          ExpansionPanelList(
            key: expansionKey,
            expansionCallback: (int index, bool isExpanded) =>
                setState(() => _expanded = isExpanded),
            children: <ExpansionPanel>[
              ExpansionPanel(
                canTapOnHeader: true,
                isExpanded: _expanded,
                headerBuilder: (BuildContext context, bool isExpanded) =>
                    const ListTile(title: Text('Retention policy')),
                body: const ListTile(title: Text('Retention details')),
              ),
            ],
          ),
          Image.memory(
            _whitePixel,
            key: previewImageKey,
            semanticLabel: 'Workspace preview',
            width: CbStructure.space8,
            height: CbStructure.space8,
          ),
          Image.memory(
            Uint8List.fromList(const <int>[0, 1, 2]),
            errorBuilder:
                (BuildContext context, Object error, StackTrace? stack) => Row(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    const Text('Preview unavailable'),
                    TextButton(
                      onPressed: _ignoreAction,
                      child: const Text('Retry'),
                    ),
                  ],
                ),
          ),
          DataTable(
            key: sortableTableKey,
            sortColumnIndex: 0,
            sortAscending: _sortAscending,
            columns: <DataColumn>[
              DataColumn(
                label: const Text('Name'),
                onSort: (int index, bool ascending) =>
                    setState(() => _sortAscending = ascending),
              ),
              const DataColumn(label: Text('Status')),
            ],
            rows: <DataRow>[
              DataRow(
                selected: _selected == 'Atlas',
                onSelectChanged: (bool? selected) => setState(
                  () => _selected = selected == true ? 'Atlas' : 'none',
                ),
                cells: const <DataCell>[
                  DataCell(Text('Atlas')),
                  DataCell(Text('Ready')),
                ],
              ),
            ],
          ),
          Text('Sort: ${_sortAscending ? 'ascending' : 'descending'}'),
          Text('Selected: $_selected'),
          PaginatedDataTable(
            key: paginatedTableKey,
            header: const Text('Workspaces'),
            rowsPerPage: 2,
            availableRowsPerPage: const <int>[2],
            source: _source,
            columns: const <DataColumn>[
              DataColumn(label: Text('Workspace')),
              DataColumn(label: Text('Status')),
            ],
          ),
        ],
      ),
    ),
  );
}

class _WorkspaceSource extends DataTableSource {
  static const List<(String, String)> _rows = <(String, String)>[
    ('Alpha', 'Ready'),
    ('Beta', 'Review'),
    ('Gamma', 'Ready'),
  ];

  @override
  DataRow? getRow(int index) {
    if (index >= _rows.length) return null;
    final (String name, String status) = _rows[index];
    return DataRow.byIndex(
      index: index,
      cells: <DataCell>[DataCell(Text(name)), DataCell(Text(status))],
    );
  }

  @override
  bool get isRowCountApproximate => false;

  @override
  int get rowCount => _rows.length;

  @override
  int get selectedRowCount => 0;
}

final Uint8List _whitePixel = base64Decode(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2n0YAAAAASUVORK5CYII=',
);

void _ignoreAction() {}

void _useTestViewport(WidgetTester tester) {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = const Size(900, 1600);
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);
}
