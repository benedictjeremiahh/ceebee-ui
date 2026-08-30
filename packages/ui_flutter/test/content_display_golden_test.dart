import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key contentDisplayGoldenKey = Key('content-display-golden');

void main() {
  testWidgets('Content display — light', (WidgetTester tester) async {
    await _pumpContentDisplay(tester, cbThemeData());
    await expectLater(
      find.byKey(contentDisplayGoldenKey),
      matchesGoldenFile('goldens/content_display_light.png'),
    );
  });

  testWidgets('Content display — dark', (WidgetTester tester) async {
    await _pumpContentDisplay(tester, cbThemeData(brightness: Brightness.dark));
    await expectLater(
      find.byKey(contentDisplayGoldenKey),
      matchesGoldenFile('goldens/content_display_dark.png'),
    );
  });
}

Future<void> _pumpContentDisplay(WidgetTester tester, ThemeData theme) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = const Size(840, 920);
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);

  await tester.pumpWidget(
    MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: theme.copyWith(
        textTheme: theme.textTheme.apply(fontFamily: 'Roboto'),
      ),
      home: const RepaintBoundary(
        key: contentDisplayGoldenKey,
        child: _ContentDisplayScene(),
      ),
    ),
  );
  await tester.pumpAndSettle();
}

class _ContentDisplayScene extends StatelessWidget {
  const _ContentDisplayScene();

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;

    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(CbStructure.space6),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Text('Content display', style: type.displaySmall),
            const SizedBox(height: CbStructure.space2),
            Text(
              'Identity, status, grouped content, and compact actions keep Material behavior.',
              style: type.bodyLarge,
            ),
            const SizedBox(height: CbStructure.space5),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Expanded(child: _IdentityCard(type: type)),
                const SizedBox(width: CbStructure.space4),
                Expanded(child: _ListCard(type: type)),
              ],
            ),
            const SizedBox(height: CbStructure.space4),
            _ChipCard(type: type),
          ],
        ),
      ),
    );
  }
}

class _IdentityCard extends StatelessWidget {
  const _IdentityCard({required this.type});

  final TextTheme type;

  @override
  Widget build(BuildContext context) => Card.outlined(
    child: Padding(
      padding: const EdgeInsets.all(CbStructure.space5),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text('Identity and status', style: type.titleLarge),
          const Divider(),
          Wrap(
            spacing: CbStructure.space4,
            runSpacing: CbStructure.space4,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: <Widget>[
              const CircleAvatar(child: Text('AL')),
              const CircleAvatar(child: Icon(Icons.person_outline)),
              Badge.count(
                count: 3,
                child: const CircleAvatar(child: Text('GH')),
              ),
              const Badge(child: Icon(Icons.notifications_outlined)),
            ],
          ),
          const SizedBox(height: CbStructure.space5),
          Text('Card variants', style: type.labelLarge),
          const SizedBox(height: CbStructure.space2),
          const _MiniCard(label: 'Elevated'),
          const SizedBox(height: CbStructure.space2),
          const _MiniCard(label: 'Filled', filled: true),
        ],
      ),
    ),
  );
}

class _MiniCard extends StatelessWidget {
  const _MiniCard({required this.label, this.filled = false});

  final String label;
  final bool filled;

  @override
  Widget build(BuildContext context) {
    final Widget content = Padding(
      padding: const EdgeInsets.all(CbStructure.space3),
      child: Row(
        children: <Widget>[
          const Icon(Icons.description_outlined),
          const SizedBox(width: CbStructure.space2),
          Text(label),
        ],
      ),
    );
    return filled ? Card.filled(child: content) : Card(child: content);
  }
}

class _ListCard extends StatelessWidget {
  const _ListCard({required this.type});

  final TextTheme type;

  @override
  Widget build(BuildContext context) => Card.outlined(
    child: Padding(
      padding: const EdgeInsets.symmetric(vertical: CbStructure.space3),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: CbStructure.space4),
            child: Text('Recent activity', style: type.titleLarge),
          ),
          const Divider(),
          const ListTile(
            leading: CircleAvatar(child: Text('AL')),
            title: Text('Ada Lovelace'),
            subtitle: Text('Shared the accessibility review'),
            trailing: Icon(Icons.chevron_right),
          ),
          const ListTile(
            selected: true,
            leading: CircleAvatar(child: Text('GH')),
            title: Text('Grace Hopper'),
            subtitle: Text(
              'Updated a long release note that truncates without shifting actions',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            trailing: Icon(Icons.chevron_right),
          ),
          const ListTile(
            enabled: false,
            leading: Icon(Icons.lock_outline),
            title: Text('Archived workspace'),
            subtitle: Text('Read-only'),
          ),
        ],
      ),
    ),
  );
}

class _ChipCard extends StatelessWidget {
  const _ChipCard({required this.type});

  final TextTheme type;

  @override
  Widget build(BuildContext context) => Card.outlined(
    child: Padding(
      padding: const EdgeInsets.all(CbStructure.space5),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text('Tags and compact actions', style: type.titleLarge),
          const Divider(),
          Wrap(
            spacing: CbStructure.space2,
            runSpacing: CbStructure.space2,
            children: const <Widget>[
              Chip(
                avatar: CircleAvatar(child: Text('A')),
                label: Text('Team'),
              ),
              FilterChip(
                label: Text('Available'),
                selected: true,
                onSelected: _ignoreSelected,
              ),
              FilterChip(
                label: Text('Disabled'),
                selected: false,
                onSelected: null,
              ),
              ChoiceChip(label: Text('Recent'), selected: true),
              InputChip(label: Text('Flutter'), onDeleted: _ignoreDelete),
              ActionChip(
                avatar: Icon(Icons.add),
                label: Text('Add label'),
                onPressed: _ignoreAction,
              ),
            ],
          ),
        ],
      ),
    ),
  );
}

void _ignoreDelete() {}
void _ignoreAction() {}
void _ignoreSelected(bool selected) {}
