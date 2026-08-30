import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key galleryAdaptiveLayoutKey = Key('gallery-adaptive-layout');
const Key galleryLayoutRailKey = Key('gallery-layout-rail');
const Key galleryLayoutBottomBarKey = Key('gallery-layout-bottom-bar');
const Key galleryLayoutDestinationKey = Key('gallery-layout-destination');
const Key galleryLayoutScrollKey = Key('gallery-layout-scroll');
const Key galleryResponsiveGridKey = Key('gallery-responsive-grid');

class NativeLayoutGallery extends StatelessWidget {
  const NativeLayoutGallery({super.key});

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Text('Native layout', style: type.displaySmall),
        const SizedBox(height: CbStructure.space2),
        Text(
          'Flutter owns axis, constraints, safe areas, and scroll composition. Ceebee supplies the spacing rhythm and Skin.',
          style: type.bodyLarge,
        ),
        const SizedBox(height: CbStructure.space5),
        _AdaptiveFlow(),
        const SizedBox(height: CbStructure.space5),
        _ResponsiveGrid(),
        const SizedBox(height: CbStructure.space5),
        const _AdaptiveWorkspaceShell(),
      ],
    );
  }
}

class _AdaptiveFlow extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: <Widget>[
      Text('Flex and space', style: Theme.of(context).textTheme.titleLarge),
      const SizedBox(height: CbStructure.space2),
      const Text(
        'A one-dimensional handoff stays horizontal while it fits, then stacks without changing its content or reading order.',
      ),
      const SizedBox(height: CbStructure.space4),
      LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          final bool wide = constraints.maxWidth >= CbStructure.space8 * 8;
          if (wide) {
            return Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Expanded(flex: 2, child: _ReleaseSummary()),
                const SizedBox(width: CbStructure.space4),
                const Expanded(child: _HandoffActions()),
              ],
            );
          }
          return Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              _ReleaseSummary(),
              const SizedBox(height: CbStructure.space4),
              const _HandoffActions(),
            ],
          );
        },
      ),
    ],
  );
}

class _ReleaseSummary extends StatelessWidget {
  @override
  Widget build(BuildContext context) => CbSurface(
    variant: CbSurfaceVariant.tinted,
    tone: CbTone.brand,
    padding: CbPad.lg,
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        const Icon(Icons.rocket_launch_outlined),
        const SizedBox(height: CbStructure.space4),
        Text('Release handoff', style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: CbStructure.space2),
        const Text('Four checks complete. The workspace is ready for review.'),
      ],
    ),
  );
}

class _HandoffActions extends StatelessWidget {
  const _HandoffActions();

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.all(CbStructure.space4),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        Text('Next action', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: CbStructure.space2),
        const Text('Share the review link or keep a local draft.'),
        const SizedBox(height: CbStructure.space4),
        Wrap(
          spacing: CbStructure.space2,
          runSpacing: CbStructure.space2,
          children: <Widget>[
            FilledButton.icon(
              onPressed: _ignoreAction,
              icon: const Icon(Icons.send_outlined),
              label: const Text('Share review'),
            ),
            OutlinedButton.icon(
              onPressed: _ignoreAction,
              icon: const Icon(Icons.save_outlined),
              label: const Text('Save draft'),
            ),
          ],
        ),
      ],
    ),
  );
}

class _ResponsiveGrid extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: <Widget>[
      Text('Responsive grid', style: Theme.of(context).textTheme.titleLarge),
      const SizedBox(height: CbStructure.space2),
      const Text(
        'A maximum tile extent lets native GridView choose the column count from available content width.',
      ),
      const SizedBox(height: CbStructure.space4),
      GridView.builder(
        key: galleryResponsiveGridKey,
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
          maxCrossAxisExtent: CbStructure.space8 * 4,
          mainAxisExtent: CbStructure.space8 * 3,
          mainAxisSpacing: CbStructure.space4,
          crossAxisSpacing: CbStructure.space4,
        ),
        itemCount: _gridItems.length,
        itemBuilder: (BuildContext context, int index) => CbSurface(
          variant: index == 0
              ? CbSurfaceVariant.tinted
              : CbSurfaceVariant.plain,
          tone: index == 0 ? CbTone.brand : CbTone.neutral,
          padding: CbPad.md,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Icon(_gridItems[index].icon),
              const Spacer(),
              Text(
                _gridItems[index].title,
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: CbStructure.space1),
              Text(
                _gridItems[index].detail,
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ),
        ),
      ),
    ],
  );
}

class _AdaptiveWorkspaceShell extends StatefulWidget {
  const _AdaptiveWorkspaceShell();

  @override
  State<_AdaptiveWorkspaceShell> createState() =>
      _AdaptiveWorkspaceShellState();
}

class _AdaptiveWorkspaceShellState extends State<_AdaptiveWorkspaceShell> {
  int _destination = 0;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: <Widget>[
      Text(
        'Scaffold, SafeArea, and slivers',
        style: Theme.of(context).textTheme.titleLarge,
      ),
      const SizedBox(height: CbStructure.space2),
      const Text(
        'The same workspace uses a rail when width permits and a bottom bar when compact. Its grid and queue share one native scroll plane.',
      ),
      const SizedBox(height: CbStructure.space4),
      CbSurface(
        key: galleryAdaptiveLayoutKey,
        padding: CbPad.none,
        child: SizedBox(
          height: CbStructure.space8 * 8,
          child: ClipRRect(
            borderRadius: CbRadius.lg.borderRadius,
            child: LayoutBuilder(
              builder: (BuildContext context, BoxConstraints constraints) {
                final bool wide =
                    constraints.maxWidth >= CbStructure.space8 * 10;
                return Scaffold(
                  appBar: AppBar(
                    title: const Text('Workspace overview'),
                    actions: <Widget>[
                      IconButton(
                        onPressed: _ignoreAction,
                        tooltip: 'Search workspace',
                        icon: const Icon(Icons.search),
                      ),
                    ],
                  ),
                  body: SafeArea(
                    top: false,
                    child: wide
                        ? Row(
                            children: <Widget>[
                              NavigationRail(
                                key: galleryLayoutRailKey,
                                selectedIndex: _destination,
                                onDestinationSelected: _selectDestination,
                                labelType: NavigationRailLabelType.all,
                                destinations: _railDestinations,
                              ),
                              const VerticalDivider(width: CbStructure.space1),
                              Expanded(child: _workspaceScroll()),
                            ],
                          )
                        : _workspaceScroll(),
                  ),
                  bottomNavigationBar: wide
                      ? null
                      : NavigationBar(
                          key: galleryLayoutBottomBarKey,
                          selectedIndex: _destination,
                          onDestinationSelected: _selectDestination,
                          destinations: _barDestinations,
                        ),
                );
              },
            ),
          ),
        ),
      ),
    ],
  );

  Widget _workspaceScroll() => CustomScrollView(
    key: galleryLayoutScrollKey,
    slivers: <Widget>[
      SliverPadding(
        padding: const EdgeInsets.fromLTRB(
          CbStructure.space4,
          CbStructure.space4,
          CbStructure.space4,
          CbStructure.space2,
        ),
        sliver: SliverToBoxAdapter(
          child: Text(
            _destinationLabels[_destination],
            key: galleryLayoutDestinationKey,
            style: const TextStyle(
              fontSize: CbStructure.textXl,
              height: CbStructure.leadingTight,
              fontWeight: CbStructure.weightSemibold,
            ),
          ),
        ),
      ),
      SliverPadding(
        padding: const EdgeInsets.all(CbStructure.space4),
        sliver: SliverGrid.builder(
          gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
            maxCrossAxisExtent: CbStructure.space8 * 3,
            mainAxisExtent: CbStructure.space8 * 2,
            mainAxisSpacing: CbStructure.space3,
            crossAxisSpacing: CbStructure.space3,
          ),
          itemCount: 4,
          itemBuilder: (BuildContext context, int index) => CbSurface(
            variant: index == 0
                ? CbSurfaceVariant.tinted
                : CbSurfaceVariant.plain,
            tone: index == 0 ? CbTone.brand : CbTone.neutral,
            padding: CbPad.md,
            child: Align(
              alignment: Alignment.bottomLeft,
              child: Text(
                _shellMetrics[index],
                style: Theme.of(context).textTheme.titleMedium,
              ),
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
        sliver: SliverList.separated(
          itemCount: _queueItems.length,
          separatorBuilder: (BuildContext context, int index) =>
              const Divider(),
          itemBuilder: (BuildContext context, int index) => ListTile(
            leading: Icon(_queueItems[index].icon),
            title: Text(_queueItems[index].title),
            subtitle: Text(_queueItems[index].detail),
          ),
        ),
      ),
    ],
  );

  void _selectDestination(int index) => setState(() => _destination = index);
}

class _GridItem {
  const _GridItem(this.icon, this.title, this.detail);
  final IconData icon;
  final String title;
  final String detail;
}

const List<_GridItem> _gridItems = <_GridItem>[
  _GridItem(Icons.space_dashboard_outlined, 'Overview', 'Primary context'),
  _GridItem(Icons.rule_outlined, 'Reviews', 'Six awaiting input'),
  _GridItem(Icons.schedule_outlined, 'Timeline', 'Next release Friday'),
  _GridItem(Icons.group_outlined, 'Owners', 'Four active collaborators'),
  _GridItem(Icons.inventory_2_outlined, 'Archive', 'Ninety-day retention'),
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
        selectedIcon: Icon(Icons.rule),
        label: Text('Reviews'),
      ),
      NavigationRailDestination(
        icon: Icon(Icons.people_outline),
        selectedIcon: Icon(Icons.people),
        label: Text('Owners'),
      ),
    ];

const List<NavigationDestination> _barDestinations = <NavigationDestination>[
  NavigationDestination(
    icon: Icon(Icons.space_dashboard_outlined),
    selectedIcon: Icon(Icons.space_dashboard),
    label: 'Overview',
  ),
  NavigationDestination(
    icon: Icon(Icons.rule_outlined),
    selectedIcon: Icon(Icons.rule),
    label: 'Reviews',
  ),
  NavigationDestination(
    icon: Icon(Icons.people_outline),
    selectedIcon: Icon(Icons.people),
    label: 'Owners',
  ),
];

const List<String> _destinationLabels = <String>[
  'Overview',
  'Reviews',
  'Owners',
];

const List<String> _shellMetrics = <String>[
  '12 active',
  '6 reviews',
  '4 owners',
  '92% healthy',
];

const List<_GridItem> _queueItems = <_GridItem>[
  _GridItem(Icons.check_circle_outline, 'Atlas is ready', 'All checks passed'),
  _GridItem(Icons.rate_review_outlined, 'Beacon needs review', 'Owner: Grace'),
  _GridItem(Icons.block_outlined, 'Current is blocked', 'Dependency missing'),
  _GridItem(Icons.schedule_outlined, 'Delta is scheduled', 'Friday release'),
];

void _ignoreAction() {}
