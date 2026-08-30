import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key contentListTileKey = Key('content-list-tile');
const Key contentFilterChipKey = Key('content-filter-chip');
const Key contentChoiceChipKey = Key('content-choice-chip');
const Key contentInputChipKey = Key('content-input-chip');

void main() {
  testWidgets('Material content controls retain their native state model', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(theme: cbThemeData(), home: const _ContentStateHarness()),
    );

    expect(find.text('Selected list item: none'), findsOneWidget);
    expect(find.text('Filter: off'), findsOneWidget);
    expect(find.text('Choice: recent'), findsOneWidget);
    expect(find.byKey(contentInputChipKey), findsOneWidget);

    await tester.tap(find.byKey(contentListTileKey));
    await tester.tap(find.byKey(contentFilterChipKey));
    await tester.tap(find.byKey(contentChoiceChipKey));
    await tester.tap(find.byTooltip('Delete'));
    await tester.pumpAndSettle();

    expect(find.text('Selected list item: Ada'), findsOneWidget);
    expect(find.text('Filter: on'), findsOneWidget);
    expect(find.text('Choice: archived'), findsOneWidget);
    expect(find.byKey(contentInputChipKey), findsNothing);
  });

  testWidgets('avatar and badge expose an authored accessible identity', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: Scaffold(
          body: Center(
            child: Semantics(
              label: 'Ada Lovelace, 3 unread messages',
              image: true,
              child: ExcludeSemantics(
                child: Badge.count(
                  count: 3,
                  child: CircleAvatar(child: Text('AL')),
                ),
              ),
            ),
          ),
        ),
      ),
    );

    expect(
      tester.getSemantics(find.byType(Badge)),
      matchesSemantics(label: 'Ada Lovelace, 3 unread messages', isImage: true),
    );
  });
}

class _ContentStateHarness extends StatefulWidget {
  const _ContentStateHarness();

  @override
  State<_ContentStateHarness> createState() => _ContentStateHarnessState();
}

class _ContentStateHarnessState extends State<_ContentStateHarness> {
  bool _listSelected = false;
  bool _filterSelected = false;
  bool _archivedSelected = false;
  bool _showInputChip = true;

  @override
  Widget build(BuildContext context) => Scaffold(
    body: Column(
      children: <Widget>[
        ListTile(
          key: contentListTileKey,
          selected: _listSelected,
          leading: const CircleAvatar(child: Text('AL')),
          title: const Text('Ada Lovelace'),
          onTap: () => setState(() => _listSelected = true),
        ),
        FilterChip(
          key: contentFilterChipKey,
          label: const Text('Available'),
          selected: _filterSelected,
          onSelected: (bool value) => setState(() => _filterSelected = value),
        ),
        ChoiceChip(
          key: contentChoiceChipKey,
          label: const Text('Archived'),
          selected: _archivedSelected,
          onSelected: (bool value) => setState(() => _archivedSelected = value),
        ),
        if (_showInputChip)
          InputChip(
            key: contentInputChipKey,
            label: const Text('Flutter'),
            onDeleted: () => setState(() => _showInputChip = false),
          ),
        Text('Selected list item: ${_listSelected ? 'Ada' : 'none'}'),
        Text('Filter: ${_filterSelected ? 'on' : 'off'}'),
        Text('Choice: ${_archivedSelected ? 'archived' : 'recent'}'),
      ],
    ),
  );
}
