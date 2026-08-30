import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

const Key navigationOverviewGoldenKey = Key('navigation-overview-golden');
const Key navigationMenuGoldenKey = Key('navigation-menu-golden');
const Key navigationMenuTriggerKey = Key('navigation-menu-trigger');

void main() {
  testWidgets('Navigation overview — light', (WidgetTester tester) async {
    await _pumpOverview(tester, cbThemeData());
    await expectLater(
      find.byKey(navigationOverviewGoldenKey),
      matchesGoldenFile('goldens/navigation_overview_light.png'),
    );
  });

  testWidgets('Navigation overview — dark', (WidgetTester tester) async {
    await _pumpOverview(tester, cbThemeData(brightness: Brightness.dark));
    await expectLater(
      find.byKey(navigationOverviewGoldenKey),
      matchesGoldenFile('goldens/navigation_overview_dark.png'),
    );
  });

  testWidgets('Open navigation menu — light', (WidgetTester tester) async {
    await _pumpOpenMenu(tester, cbThemeData());
    await expectLater(
      find.byKey(navigationMenuGoldenKey),
      matchesGoldenFile('goldens/navigation_menu_light.png'),
    );
  });

  testWidgets('Open navigation menu — dark', (WidgetTester tester) async {
    await _pumpOpenMenu(tester, cbThemeData(brightness: Brightness.dark));
    await expectLater(
      find.byKey(navigationMenuGoldenKey),
      matchesGoldenFile('goldens/navigation_menu_dark.png'),
    );
  });
}

Future<void> _pumpOverview(WidgetTester tester, ThemeData theme) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = const Size(840, 720);
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);

  await tester.pumpWidget(
    MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: _goldenTheme(theme),
      home: const RepaintBoundary(
        key: navigationOverviewGoldenKey,
        child: _NavigationOverviewScene(),
      ),
    ),
  );
  await tester.pumpAndSettle();
}

Future<void> _pumpOpenMenu(WidgetTester tester, ThemeData theme) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = const Size(760, 600);
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);

  await tester.pumpWidget(
    RepaintBoundary(
      key: navigationMenuGoldenKey,
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: _goldenTheme(theme),
        home: const _OpenMenuScene(),
      ),
    ),
  );
  await tester.tap(find.byKey(navigationMenuTriggerKey));
  await tester.pumpAndSettle();
}

ThemeData _goldenTheme(ThemeData theme) {
  final TextStyle? buttonText = theme.filledButtonTheme.style?.textStyle
      ?.resolve(<WidgetState>{})
      ?.copyWith(fontFamily: 'Roboto');
  return theme.copyWith(
    textTheme: theme.textTheme.apply(fontFamily: 'Roboto'),
    filledButtonTheme: FilledButtonThemeData(
      style: theme.filledButtonTheme.style?.copyWith(
        textStyle: WidgetStatePropertyAll<TextStyle?>(buttonText),
      ),
    ),
  );
}

class _NavigationOverviewScene extends StatelessWidget {
  const _NavigationOverviewScene();

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;

    return DefaultTabController(
      length: 3,
      child: Scaffold(
        body: Padding(
          padding: const EdgeInsets.all(CbStructure.space6),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              Text('Navigation', style: type.displaySmall),
              const SizedBox(height: CbStructure.space2),
              Text(
                'Native selection, focus, overlays, dismissal, and responsive destinations.',
                style: type.bodyLarge,
              ),
              const SizedBox(height: CbStructure.space5),
              CbSurface(
                padding: CbPad.none,
                child: Column(
                  children: <Widget>[
                    const TabBar(
                      tabs: <Widget>[
                        Tab(text: 'Overview'),
                        Tab(text: 'Reports'),
                        Tab(text: 'Activity'),
                      ],
                    ),
                    SizedBox(
                      height: CbStructure.space8 * 2,
                      child: const TabBarView(
                        children: <Widget>[
                          _GoldenTabPanel(
                            icon: Icons.dashboard_outlined,
                            title: 'Overview',
                          ),
                          _GoldenTabPanel(
                            icon: Icons.assessment_outlined,
                            title: 'Reports',
                          ),
                          _GoldenTabPanel(
                            icon: Icons.history,
                            title: 'Activity',
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: CbStructure.space4),
              SizedBox(
                height: CbStructure.space8 * 5,
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[
                    Expanded(
                      child: CbSurface(
                        padding: CbPad.lg,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            Text('Menu bar', style: type.titleLarge),
                            const Divider(),
                            MenuBar(
                              children: const <Widget>[
                                SubmenuButton(
                                  menuChildren: <Widget>[
                                    MenuItemButton(
                                      onPressed: _ignoreAction,
                                      child: Text('New workspace'),
                                    ),
                                  ],
                                  child: Text('File'),
                                ),
                                SubmenuButton(
                                  menuChildren: <Widget>[
                                    MenuItemButton(
                                      onPressed: _ignoreAction,
                                      child: Text('Copy link'),
                                    ),
                                  ],
                                  child: Text('Share'),
                                ),
                              ],
                            ),
                            const SizedBox(height: CbStructure.space4),
                            Text(
                              'Menus collapse secondary actions while preserving keyboard paths.',
                              style: type.bodySmall,
                            ),
                            const Divider(),
                            const _NavigationCue(
                              icon: Icons.keyboard_alt_outlined,
                              label: 'Arrow keys move focus',
                            ),
                            const SizedBox(height: CbStructure.space3),
                            const _NavigationCue(
                              icon: Icons.keyboard_return,
                              label: 'Escape dismisses',
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: CbStructure.space4),
                    Expanded(
                      child: ClipRect(
                        child: NavigationDrawer(
                          selectedIndex: 1,
                          onDestinationSelected: _ignoreIndex,
                          children: const <Widget>[
                            Padding(
                              padding: EdgeInsets.fromLTRB(
                                CbStructure.space5,
                                CbStructure.space5,
                                CbStructure.space5,
                                CbStructure.space3,
                              ),
                              child: Text('Workspace'),
                            ),
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
                            NavigationDrawerDestination(
                              icon: Icon(Icons.settings_outlined),
                              selectedIcon: Icon(Icons.settings),
                              label: Text('Settings'),
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
      ),
    );
  }
}

class _GoldenTabPanel extends StatelessWidget {
  const _GoldenTabPanel({required this.icon, required this.title});

  final IconData icon;
  final String title;

  @override
  Widget build(BuildContext context) => Center(
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Icon(icon),
        const SizedBox(width: CbStructure.space2),
        Text('$title content'),
      ],
    ),
  );
}

class _NavigationCue extends StatelessWidget {
  const _NavigationCue({required this.icon, required this.label});

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) => Row(
    children: <Widget>[
      Icon(icon),
      const SizedBox(width: CbStructure.space2),
      Expanded(child: Text(label)),
    ],
  );
}

class _OpenMenuScene extends StatelessWidget {
  const _OpenMenuScene();

  @override
  Widget build(BuildContext context) => Scaffold(
    body: Center(
      child: MenuAnchor(
        menuChildren: const <Widget>[
          MenuItemButton(
            leadingIcon: Icon(Icons.bookmark_outline),
            shortcut: SingleActivator(LogicalKeyboardKey.keyS, meta: true),
            onPressed: _ignoreAction,
            child: Text('Save view'),
          ),
          MenuItemButton(
            leadingIcon: Icon(Icons.link),
            shortcut: SingleActivator(LogicalKeyboardKey.keyC, meta: true),
            onPressed: _ignoreAction,
            child: Text('Copy link'),
          ),
          MenuItemButton(
            leadingIcon: Icon(Icons.people_outline),
            onPressed: _ignoreAction,
            child: Text('Invite people'),
          ),
          MenuItemButton(
            leadingIcon: Icon(Icons.lock_outline),
            onPressed: null,
            child: Text('Move workspace'),
          ),
        ],
        builder:
            (BuildContext context, MenuController controller, Widget? child) =>
                FilledButton.icon(
                  key: navigationMenuTriggerKey,
                  onPressed: controller.open,
                  icon: const Icon(Icons.more_horiz),
                  label: const Text('Open actions'),
                ),
      ),
    ),
  );
}

void _ignoreAction() {}
void _ignoreIndex(int index) {}
