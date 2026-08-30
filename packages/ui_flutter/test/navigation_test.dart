import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

const Key navigationDetailsTabKey = Key('navigation-details-tab');
const Key navigationMenuButtonKey = Key('navigation-menu-button');
const Key navigationDrawerButtonKey = Key('navigation-drawer-button');
const Key navigationDrawerKey = Key('navigation-drawer');
const Key navigationFileMenuKey = Key('navigation-file-menu');

void main() {
  testWidgets('tabs switch one visible panel through native interaction', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(theme: cbThemeData(), home: const _NavigationHarness()),
    );

    expect(find.text('Overview content'), findsOneWidget);
    expect(find.text('Details content'), findsNothing);

    await tester.tap(find.byKey(navigationDetailsTabKey));
    await tester.pumpAndSettle();

    expect(find.text('Overview content'), findsNothing);
    expect(find.text('Details content'), findsOneWidget);
  });

  testWidgets('menu supports keyboard selection and restores trigger focus', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(theme: cbThemeData(), home: const _NavigationHarness()),
    );

    await tester.tap(find.byKey(navigationMenuButtonKey));
    await tester.pumpAndSettle();
    expect(find.text('Save view'), findsOneWidget);

    await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pumpAndSettle();
    expect(find.text('Menu selection: Save view'), findsOneWidget);

    await tester.tap(find.byKey(navigationMenuButtonKey));
    await tester.pumpAndSettle();
    await tester.sendKeyEvent(LogicalKeyboardKey.escape);
    await tester.pumpAndSettle();
    expect(find.text('Save view'), findsNothing);
    expect(
      tester
          .widget<FilledButton>(find.byKey(navigationMenuButtonKey))
          .focusNode
          ?.hasFocus,
      isTrue,
    );
  });

  testWidgets('menu bar opens a submenu and dismisses after selection', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(theme: cbThemeData(), home: const _NavigationHarness()),
    );

    await tester.tap(find.byKey(navigationFileMenuKey));
    await tester.pumpAndSettle();
    expect(find.text('New workspace'), findsOneWidget);

    await tester.tap(find.text('New workspace'));
    await tester.pumpAndSettle();
    expect(find.text('Menu bar selection: New workspace'), findsOneWidget);
    expect(find.text('Open workspace'), findsNothing);
  });

  testWidgets('drawer selection dismisses the modal navigation plane', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(theme: cbThemeData(), home: const _NavigationHarness()),
    );

    await tester.tap(find.byKey(navigationDrawerButtonKey));
    await tester.pumpAndSettle();
    expect(find.byKey(navigationDrawerKey), findsOneWidget);

    await tester.tap(find.text('Library'));
    await tester.pumpAndSettle();

    expect(find.text('Drawer selection: Library'), findsOneWidget);
    expect(find.byKey(navigationDrawerKey), findsNothing);
  });
}

class _NavigationHarness extends StatefulWidget {
  const _NavigationHarness();

  @override
  State<_NavigationHarness> createState() => _NavigationHarnessState();
}

class _NavigationHarnessState extends State<_NavigationHarness> {
  final FocusNode _menuFocusNode = FocusNode();
  int _drawerIndex = 0;
  String _menuSelection = 'none';
  String _menuBarSelection = 'none';

  @override
  void dispose() {
    _menuFocusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => DefaultTabController(
    length: 3,
    child: Scaffold(
      drawer: NavigationDrawer(
        key: navigationDrawerKey,
        selectedIndex: _drawerIndex,
        onDestinationSelected: (int index) {
          setState(() => _drawerIndex = index);
          Navigator.pop(context);
        },
        children: const <Widget>[
          NavigationDrawerDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: Text('Home'),
          ),
          NavigationDrawerDestination(
            icon: Icon(Icons.folder_outlined),
            selectedIcon: Icon(Icons.folder),
            label: Text('Library'),
          ),
        ],
      ),
      appBar: AppBar(title: const Text('Navigation harness')),
      body: Builder(
        builder: (BuildContext context) => Column(
          children: <Widget>[
            const TabBar(
              tabs: <Widget>[
                Tab(text: 'Overview'),
                Tab(key: navigationDetailsTabKey, text: 'Details'),
                Tab(text: 'History'),
              ],
            ),
            const SizedBox(
              height: CbStructure.space8 * 2,
              child: TabBarView(
                children: <Widget>[
                  Center(child: Text('Overview content')),
                  Center(child: Text('Details content')),
                  Center(child: Text('History content')),
                ],
              ),
            ),
            MenuBar(
              children: <Widget>[
                SubmenuButton(
                  key: navigationFileMenuKey,
                  menuChildren: <Widget>[
                    MenuItemButton(
                      onPressed: () =>
                          setState(() => _menuBarSelection = 'New workspace'),
                      child: const Text('New workspace'),
                    ),
                    MenuItemButton(
                      onPressed: () =>
                          setState(() => _menuBarSelection = 'Open workspace'),
                      child: const Text('Open workspace'),
                    ),
                  ],
                  child: const Text('File'),
                ),
              ],
            ),
            Text('Menu bar selection: $_menuBarSelection'),
            MenuAnchor(
              childFocusNode: _menuFocusNode,
              builder:
                  (
                    BuildContext context,
                    MenuController controller,
                    Widget? child,
                  ) => FilledButton(
                    key: navigationMenuButtonKey,
                    focusNode: _menuFocusNode,
                    onPressed: () => controller.isOpen
                        ? controller.close()
                        : controller.open(),
                    child: const Text('Open actions'),
                  ),
              menuChildren: <Widget>[
                MenuItemButton(
                  onPressed: () => setState(() => _menuSelection = 'Save view'),
                  child: const Text('Save view'),
                ),
                MenuItemButton(
                  onPressed: () =>
                      setState(() => _menuSelection = 'Share view'),
                  child: const Text('Share view'),
                ),
              ],
            ),
            Text('Menu selection: $_menuSelection'),
            FilledButton(
              key: navigationDrawerButtonKey,
              onPressed: Scaffold.of(context).openDrawer,
              child: const Text('Open drawer'),
            ),
            Text('Drawer selection: ${_drawerIndex == 0 ? 'Home' : 'Library'}'),
          ],
        ),
      ),
    ),
  );
}
