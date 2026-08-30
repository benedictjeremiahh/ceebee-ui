import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

const Key galleryReportsTabKey = Key('gallery-reports-tab');
const Key galleryMenuAnchorKey = Key('gallery-menu-anchor');
const Key galleryOpenDrawerKey = Key('gallery-open-drawer');
const Key galleryMenuSelectionKey = Key('gallery-menu-selection');

class NavigationGallery extends StatefulWidget {
  const NavigationGallery({super.key, required this.drawerDestination});

  final String drawerDestination;

  @override
  State<NavigationGallery> createState() => _NavigationGalleryState();
}

class _NavigationGalleryState extends State<NavigationGallery> {
  final FocusNode _menuFocusNode = FocusNode();
  String _menuSelection = 'No action selected';

  void _selectMenu(String value) => setState(() => _menuSelection = value);

  @override
  void dispose() {
    _menuFocusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Text('Navigation', style: type.displaySmall),
        const SizedBox(height: CbStructure.space2),
        Text(
          'Material owns selection, focus movement, overlay dismissal, keyboard shortcuts, and '
          'drawer gestures. Ceebee supplies the active Skin through ColorScheme and Typography.',
          style: type.bodyLarge,
        ),
        const SizedBox(height: CbStructure.space5),
        DefaultTabController(
          length: 3,
          child: CbSurface(
            elevation: CbElevation.sm,
            padding: CbPad.none,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                Padding(
                  padding: const EdgeInsets.fromLTRB(
                    CbStructure.space4,
                    CbStructure.space4,
                    CbStructure.space4,
                    CbStructure.space2,
                  ),
                  child: Text('Tabs', style: type.titleLarge),
                ),
                const TabBar(
                  tabs: <Widget>[
                    Tab(text: 'Overview'),
                    Tab(key: galleryReportsTabKey, text: 'Reports'),
                    Tab(text: 'Activity'),
                  ],
                ),
                SizedBox(
                  height: CbStructure.space8 * 2,
                  child: TabBarView(
                    children: <Widget>[
                      _TabPanel(
                        icon: Icons.dashboard_outlined,
                        title: 'Overview',
                        description:
                            'A concise summary of the current workspace.',
                      ),
                      _TabPanel(
                        icon: Icons.assessment_outlined,
                        title: 'Reports',
                        description: 'Reports are visible only while this tab is active.',
                      ),
                      _TabPanel(
                        icon: Icons.history,
                        title: 'Activity',
                        description:
                            'Recent changes retain native swipe behavior.',
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: CbStructure.space5),
        CbSurface(
          padding: CbPad.lg,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text('Menus', style: type.titleLarge),
              const Divider(),
              LayoutBuilder(
                builder: (BuildContext context, BoxConstraints constraints) {
                  final bool desktop =
                      constraints.maxWidth >= CbStructure.space8 * 8;
                  if (!desktop) return const SizedBox.shrink();
                  return Padding(
                    padding: const EdgeInsets.only(bottom: CbStructure.space4),
                    child: MenuBar(
                      children: <Widget>[
                        SubmenuButton(
                          menuChildren: <Widget>[
                            MenuItemButton(
                              shortcut: const SingleActivator(
                                LogicalKeyboardKey.keyN,
                                meta: true,
                              ),
                              onPressed: () => _selectMenu('New workspace'),
                              child: const Text('New workspace'),
                            ),
                            MenuItemButton(
                              onPressed: () => _selectMenu('Open workspace'),
                              child: const Text('Open workspace'),
                            ),
                          ],
                          child: const Text('File'),
                        ),
                        SubmenuButton(
                          menuChildren: <Widget>[
                            MenuItemButton(
                              onPressed: () => _selectMenu('Invite people'),
                              child: const Text('Invite people'),
                            ),
                            MenuItemButton(
                              onPressed: () => _selectMenu('Copy link'),
                              child: const Text('Copy link'),
                            ),
                          ],
                          child: const Text('Share'),
                        ),
                      ],
                    ),
                  );
                },
              ),
              MenuAnchor(
                childFocusNode: _menuFocusNode,
                builder:
                    (
                      BuildContext context,
                      MenuController controller,
                      Widget? child,
                    ) => OutlinedButton.icon(
                      key: galleryMenuAnchorKey,
                      focusNode: _menuFocusNode,
                      onPressed: () => controller.isOpen
                          ? controller.close()
                          : controller.open(),
                      icon: const Icon(Icons.more_horiz),
                      label: const Text('More actions'),
                    ),
                menuChildren: <Widget>[
                  MenuItemButton(
                    leadingIcon: const Icon(Icons.bookmark_outline),
                    shortcut: const SingleActivator(
                      LogicalKeyboardKey.keyS,
                      meta: true,
                    ),
                    onPressed: () => _selectMenu('Saved view'),
                    child: const Text('Save view'),
                  ),
                  MenuItemButton(
                    leadingIcon: const Icon(Icons.link),
                    onPressed: () => _selectMenu('Copied link'),
                    child: const Text('Copy link'),
                  ),
                  const MenuItemButton(
                    leadingIcon: Icon(Icons.lock_outline),
                    onPressed: null,
                    child: Text('Move workspace'),
                  ),
                ],
              ),
              const SizedBox(height: CbStructure.space3),
              Text(
                _menuSelection,
                key: galleryMenuSelectionKey,
                style: type.bodySmall,
              ),
            ],
          ),
        ),
        const SizedBox(height: CbStructure.space5),
        CbSurface(
          elevation: CbElevation.sm,
          padding: CbPad.lg,
          child: Builder(
            builder: (BuildContext context) => Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text('Drawer', style: type.titleLarge),
                const Divider(),
                Text(
                  'The gallery uses a real Scaffold NavigationDrawer so modal focus, scrim, swipe, '
                  'dismissal, and back navigation remain native.',
                  style: type.bodyMedium,
                ),
                const SizedBox(height: CbStructure.space3),
                FilledButton.icon(
                  key: galleryOpenDrawerKey,
                  onPressed: Scaffold.of(context).openDrawer,
                  icon: const Icon(Icons.menu),
                  label: const Text('Open navigation drawer'),
                ),
                const SizedBox(height: CbStructure.space3),
                Text(
                  'Current destination: ${widget.drawerDestination}',
                  style: type.bodySmall,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _TabPanel extends StatelessWidget {
  const _TabPanel({
    required this.icon,
    required this.title,
    required this.description,
  });

  final IconData icon;
  final String title;
  final String description;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.all(CbStructure.space4),
    child: Row(
      children: <Widget>[
        Icon(icon),
        const SizedBox(width: CbStructure.space3),
        Expanded(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(title, style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: CbStructure.space1),
              Text(description, style: Theme.of(context).textTheme.bodySmall),
            ],
          ),
        ),
      ],
    ),
  );
}
