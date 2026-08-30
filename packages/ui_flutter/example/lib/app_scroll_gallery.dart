import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key galleryAnchoredScrollKey = Key('gallery-anchored-scroll');
const Key galleryPinnedAnchorKey = Key('gallery-pinned-anchor');
const Key galleryActiveAnchorKey = Key('gallery-active-anchor');
const Key galleryListViewKey = Key('gallery-native-list-view');

class AppScrollGallery extends StatelessWidget {
  const AppScrollGallery({super.key});

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Text('App composition', style: type.displaySmall),
        const SizedBox(height: CbStructure.space2),
        Text(
          'MaterialApp owns app configuration. Ceebee supplies one ThemeData bridge for every platform theme slot.',
          style: type.bodyLarge,
        ),
        const SizedBox(height: CbStructure.space5),
        const _ThemeInstallation(),
        const SizedBox(height: CbStructure.space5),
        Text('Anchor and affix', style: type.titleLarge),
        const SizedBox(height: CbStructure.space2),
        const Text(
          'Native slivers keep section navigation pinned. Scrollable.ensureVisible moves focus without introducing a second navigation contract.',
        ),
        const SizedBox(height: CbStructure.space4),
        const _AnchoredScrollDemo(),
      ],
    );
  }
}

class _ThemeInstallation extends StatelessWidget {
  const _ThemeInstallation();

  @override
  Widget build(BuildContext context) => CbSurface(
    variant: CbSurfaceVariant.tinted,
    tone: CbTone.brand,
    padding: CbPad.lg,
    child: LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final bool wide = constraints.maxWidth >= CbStructure.space8 * 8;
        final Widget introduction = Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            const Icon(Icons.settings_suggest_outlined),
            const SizedBox(height: CbStructure.space3),
            Text(
              'Install the Skin once',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: CbStructure.space2),
            const Text(
              'Pass cbThemeData() to MaterialApp. Native widgets then inherit the selected Skin without Ceebee proxy components.',
            ),
          ],
        );
        const Widget slots = _ThemeSlots();
        if (wide) {
          return Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Expanded(child: introduction),
              const SizedBox(width: CbStructure.space5),
              const Expanded(child: slots),
            ],
          );
        }
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            introduction,
            const SizedBox(height: CbStructure.space4),
            slots,
          ],
        );
      },
    ),
  );
}

class _ThemeSlots extends StatelessWidget {
  const _ThemeSlots();

  @override
  Widget build(BuildContext context) => Column(
    children: <Widget>[
      for (final (IconData, String, String) slot in _themeSlots)
        ListTile(
          dense: true,
          contentPadding: EdgeInsets.zero,
          leading: Icon(slot.$1),
          title: Text(slot.$2),
          subtitle: Text(slot.$3),
        ),
    ],
  );
}

class _AnchoredScrollDemo extends StatefulWidget {
  const _AnchoredScrollDemo();

  @override
  State<_AnchoredScrollDemo> createState() => _AnchoredScrollDemoState();
}

class _AnchoredScrollDemoState extends State<_AnchoredScrollDemo> {
  final ScrollController _controller = ScrollController();
  final List<GlobalKey> _sectionKeys = List<GlobalKey>.generate(
    _sections.length,
    (int index) => GlobalKey(debugLabel: 'anchor-section-$index'),
  );
  int _activeIndex = 0;

  @override
  void initState() {
    super.initState();
    _controller.addListener(_updateActiveSection);
  }

  @override
  void dispose() {
    _controller
      ..removeListener(_updateActiveSection)
      ..dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => CbSurface(
    padding: CbPad.none,
    child: SizedBox(
      height: CbStructure.space8 * 8,
      child: ClipRRect(
        borderRadius: CbRadius.lg.borderRadius,
        child: CustomScrollView(
          key: galleryAnchoredScrollKey,
          controller: _controller,
          slivers: <Widget>[
            SliverPersistentHeader(
              pinned: true,
              delegate: _AnchorHeaderDelegate(
                activeIndex: _activeIndex,
                onSelected: _scrollToSection,
              ),
            ),
            SliverToBoxAdapter(
              child: Column(
                children: <Widget>[
                  for (int index = 0; index < _sections.length; index++)
                    _SectionStory(key: _sectionKeys[index], index: index),
                ],
              ),
            ),
          ],
        ),
      ),
    ),
  );

  Future<void> _scrollToSection(int index) async {
    final BuildContext? sectionContext = _sectionKeys[index].currentContext;
    if (sectionContext == null) return;
    await Scrollable.ensureVisible(
      sectionContext,
      alignment: 0,
      duration: MediaQuery.disableAnimationsOf(context)
          ? Duration.zero
          : CbMotionTokens.base,
      curve: CbMotionTokens.standard,
    );
    if (mounted && _activeIndex != index) {
      setState(() => _activeIndex = index);
    }
  }

  void _updateActiveSection() {
    if (!_controller.hasClients) return;
    int candidate = 0;
    final double threshold = CbStructure.space8 + CbStructure.space4;
    for (int index = 0; index < _sectionKeys.length; index++) {
      final BuildContext? sectionContext = _sectionKeys[index].currentContext;
      final RenderObject? renderObject = sectionContext?.findRenderObject();
      if (renderObject is! RenderBox || !renderObject.attached) continue;
      final double top = renderObject.localToGlobal(Offset.zero).dy;
      if (top <= threshold) candidate = index;
    }
    if (candidate != _activeIndex && mounted) {
      setState(() => _activeIndex = candidate);
    }
  }
}

class _AnchorHeaderDelegate extends SliverPersistentHeaderDelegate {
  const _AnchorHeaderDelegate({
    required this.activeIndex,
    required this.onSelected,
  });

  final int activeIndex;
  final ValueChanged<int> onSelected;

  @override
  double get minExtent => CbStructure.space8 + CbStructure.space7;

  @override
  double get maxExtent => minExtent;

  @override
  Widget build(
    BuildContext context,
    double shrinkOffset,
    bool overlapsContent,
  ) {
    final ColorScheme colors = Theme.of(context).colorScheme;
    return Material(
      key: galleryPinnedAnchorKey,
      color: colors.surface,
      elevation: overlapsContent ? CbStructure.borderWidth : CbStructure.space0,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: CbStructure.space4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'On this page · ${_sections[activeIndex].title}',
              key: galleryActiveAnchorKey,
              style: Theme.of(context).textTheme.labelLarge,
            ),
            const SizedBox(height: CbStructure.space1),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: <Widget>[
                  for (
                    int index = 0;
                    index < _sections.length;
                    index++
                  ) ...<Widget>[
                    if (index > 0) const SizedBox(width: CbStructure.space1),
                    TextButton(
                      key: ValueKey<String>('gallery-anchor-$index'),
                      onPressed: () => onSelected(index),
                      style: TextButton.styleFrom(
                        backgroundColor: index == activeIndex
                            ? colors.primaryContainer
                            : null,
                        foregroundColor: index == activeIndex
                            ? colors.onPrimaryContainer
                            : colors.onSurfaceVariant,
                      ),
                      child: Text(_sections[index].title),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  bool shouldRebuild(_AnchorHeaderDelegate oldDelegate) =>
      oldDelegate.activeIndex != activeIndex ||
      oldDelegate.onSelected != onSelected;
}

class _SectionStory extends StatelessWidget {
  const _SectionStory({super.key, required this.index});

  final int index;

  @override
  Widget build(BuildContext context) {
    final _SectionData section = _sections[index];
    return Padding(
      padding: const EdgeInsets.fromLTRB(
        CbStructure.space4,
        CbStructure.space5,
        CbStructure.space4,
        CbStructure.space5,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Icon(section.icon),
          const SizedBox(height: CbStructure.space3),
          Text(section.title, style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: CbStructure.space2),
          Text(section.description),
          const SizedBox(height: CbStructure.space4),
          if (index == _sections.length - 1)
            SizedBox(
              height: CbStructure.space8 * 3,
              child: ListView.separated(
                key: galleryListViewKey,
                itemCount: _releaseRows.length,
                separatorBuilder: (BuildContext context, int index) =>
                    const Divider(),
                itemBuilder: (BuildContext context, int rowIndex) => ListTile(
                  leading: Icon(_releaseRows[rowIndex].$1),
                  title: Text(_releaseRows[rowIndex].$2),
                  subtitle: Text(_releaseRows[rowIndex].$3),
                ),
              ),
            )
          else
            CbSurface(
              variant: index == 0
                  ? CbSurfaceVariant.tinted
                  : CbSurfaceVariant.plain,
              tone: index == 0 ? CbTone.brand : CbTone.neutral,
              child: Row(
                children: <Widget>[
                  Icon(section.detailIcon),
                  const SizedBox(width: CbStructure.space3),
                  Expanded(child: Text(section.detail)),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

class _SectionData {
  const _SectionData({
    required this.icon,
    required this.detailIcon,
    required this.title,
    required this.description,
    required this.detail,
  });

  final IconData icon;
  final IconData detailIcon;
  final String title;
  final String description;
  final String detail;
}

const List<(IconData, String, String)> _themeSlots =
    <(IconData, String, String)>[
      (Icons.light_mode_outlined, 'theme', 'Light Skin'),
      (Icons.dark_mode_outlined, 'darkTheme', 'Dark Skin'),
      (Icons.contrast_outlined, 'highContrastTheme', 'Light · high contrast'),
      (
        Icons.brightness_high_outlined,
        'highContrastDarkTheme',
        'Dark · high contrast',
      ),
    ];

const List<_SectionData> _sections = <_SectionData>[
  _SectionData(
    icon: Icons.layers_outlined,
    detailIcon: Icons.palette_outlined,
    title: 'Install',
    description: 'MaterialApp receives every Ceebee theme slot at the application boundary.',
    detail: 'Change the Skin above Material, then let inherited ThemeData update the whole tree.',
  ),
  _SectionData(
    icon: Icons.link_outlined,
    detailIcon: Icons.ads_click_outlined,
    title: 'Navigate',
    description: 'Section actions are regular Material buttons with native semantics and focus.',
    detail: 'Scrollable.ensureVisible handles the jump while the pinned sliver preserves context.',
  ),
  _SectionData(
    icon: Icons.view_list_outlined,
    detailIcon: Icons.list_alt_outlined,
    title: 'List',
    description:
        'Listy maps to ListView rather than a Ceebee compatibility wrapper.',
    detail: 'Builders remain lazy, platform scrolling stays native, and rows compose from ListTile.',
  ),
];

const List<(IconData, String, String)> _releaseRows =
    <(IconData, String, String)>[
      (Icons.check_circle_outline, 'Foundation', 'Ready for release'),
      (Icons.rate_review_outlined, 'Navigation', 'Visual review complete'),
      (Icons.schedule_outlined, 'Feedback', 'Queued for next milestone'),
      (Icons.inventory_2_outlined, 'Archive', 'Retained for ninety days'),
    ];
