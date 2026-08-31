import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'foundation_gallery.dart';
import 'content_display_gallery.dart';
import 'checklist_gallery.dart';
import 'form_entries_gallery.dart';
import 'feedback_status_gallery.dart';
import 'date_time_pickers_gallery.dart';
import 'navigation_gallery.dart';
import 'native_data_display_gallery.dart';
import 'native_layout_gallery.dart';
import 'app_scroll_gallery.dart';
import 'native_overlay_gallery.dart';
import 'mini_charts_gallery.dart';
import 'motion_gallery.dart';
import 'platform_link.dart';
import 'selection_controls_gallery.dart';
import 'skeleton_gallery.dart';
import 'empty_gallery.dart';
import 'result_gallery.dart';
import 'statistic_gallery.dart';
import 'descriptions_gallery.dart';
import 'device_preview.dart';
import 'timeline_gallery.dart';
import 'steps_gallery.dart';
import 'pagination_gallery.dart';
import 'rating_gallery.dart';
import 'input_number_gallery.dart';
import 'color_picker_gallery.dart';
import 'upload_gallery.dart';

const String _webDocsUrl = String.fromEnvironment(
  'CEEBEE_WEB_DOCS_URL',
  defaultValue: 'https://ui.ceebee.biz.id',
);
const Key galleryNavigationDrawerKey = Key('gallery-navigation-drawer');

void main() => runApp(const CeebeeDocsApp());

class CeebeeDocsApp extends StatefulWidget {
  const CeebeeDocsApp({super.key, this.animateStatus = true});

  final bool animateStatus;

  @override
  State<CeebeeDocsApp> createState() => _CeebeeDocsAppState();
}

class _CeebeeDocsAppState extends State<CeebeeDocsApp> {
  CbSkin _skin = CbSkin.ceebee;
  ThemeMode _themeMode = ThemeMode.system;
  bool _reduceTransparency = false;

  @override
  Widget build(BuildContext context) {
    ThemeData theme(Brightness brightness, {bool highContrast = false}) =>
        cbThemeData(
          skin: _skin,
          brightness: brightness,
          highContrast: highContrast,
          reduceTransparency: _reduceTransparency,
        );

    return MaterialApp(
      title: 'Ceebee UI for Flutter',
      debugShowCheckedModeBanner: false,
      themeMode: _themeMode,
      theme: theme(Brightness.light),
      darkTheme: theme(Brightness.dark),
      highContrastTheme: theme(Brightness.light, highContrast: true),
      highContrastDarkTheme: theme(Brightness.dark, highContrast: true),
      home: GalleryDevicePreview(
        enabled: kIsWeb,
        child: SurfaceGalleryPage(
          animateStatus: widget.animateStatus,
          skin: _skin,
          themeMode: _themeMode,
          reduceTransparency: _reduceTransparency,
          onSkinChanged: (CbSkin skin) => setState(() => _skin = skin),
          onThemeModeChanged: (ThemeMode mode) =>
              setState(() => _themeMode = mode),
          onReduceTransparencyChanged: (bool value) =>
              setState(() => _reduceTransparency = value),
        ),
      ),
    );
  }
}

class SurfaceGalleryPage extends StatefulWidget {
  const SurfaceGalleryPage({
    super.key,
    required this.skin,
    required this.themeMode,
    required this.reduceTransparency,
    required this.onSkinChanged,
    required this.onThemeModeChanged,
    required this.onReduceTransparencyChanged,
    required this.animateStatus,
  });

  final CbSkin skin;
  final ThemeMode themeMode;
  final bool reduceTransparency;
  final ValueChanged<CbSkin> onSkinChanged;
  final ValueChanged<ThemeMode> onThemeModeChanged;
  final ValueChanged<bool> onReduceTransparencyChanged;
  final bool animateStatus;

  @override
  State<SurfaceGalleryPage> createState() => _SurfaceGalleryPageState();
}

class _SurfaceGalleryPageState extends State<SurfaceGalleryPage> {
  int _drawerIndex = 0;

  String get _drawerDestination => _drawerIndex == 0 ? 'Components' : 'Tokens';

  @override
  Widget build(BuildContext context) {
    final CbSkinTokens tokens = context.cb;

    return Scaffold(
      drawer: NavigationDrawer(
        key: galleryNavigationDrawerKey,
        selectedIndex: _drawerIndex,
        onDestinationSelected: (int index) {
          setState(() => _drawerIndex = index);
          Navigator.pop(context);
        },
        children: const <Widget>[
          Padding(
            padding: EdgeInsets.fromLTRB(
              CbStructure.space5,
              CbStructure.space5,
              CbStructure.space5,
              CbStructure.space3,
            ),
            child: Text('Ceebee UI'),
          ),
          NavigationDrawerDestination(
            icon: Icon(Icons.widgets_outlined),
            selectedIcon: Icon(Icons.widgets),
            label: Text('Components'),
          ),
          NavigationDrawerDestination(
            icon: Icon(Icons.palette_outlined),
            selectedIcon: Icon(Icons.palette),
            label: Text('Tokens'),
          ),
        ],
      ),
      appBar: AppBar(
        title: const Text('Ceebee UI · Flutter'),
        actions: <Widget>[
          if (_webDocsUrl.isNotEmpty)
            TextButton.icon(
              onPressed: () {
                if (openExternalLink(_webDocsUrl)) return;
                Clipboard.setData(const ClipboardData(text: _webDocsUrl));
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Web docs URL copied')),
                );
              },
              icon: const Icon(Icons.language),
              label: const Text('Web docs'),
            ),
          IconButton(
            onPressed: () => widget.onThemeModeChanged(
              widget.themeMode == ThemeMode.dark
                  ? ThemeMode.light
                  : ThemeMode.dark,
            ),
            tooltip: widget.themeMode == ThemeMode.dark
                ? 'Use light theme'
                : 'Use dark theme',
            icon: Icon(
              widget.themeMode == ThemeMode.dark
                  ? Icons.light_mode_outlined
                  : Icons.dark_mode_outlined,
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(CbStructure.space5),
        child: Center(
          child: ConstrainedBox(
            constraints: BoxConstraints(
              maxWidth: CbStructure.space8 * CbStructure.space3,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                Text(
                  'Surface materials',
                  style: Theme.of(context).textTheme.displaySmall,
                ),
                const SizedBox(height: CbStructure.space2),
                Text(
                  'Ceebee owns Tokens, Skins, and Surface variants. Material 3 owns native '
                  'interaction, accessibility, motion, and geometry.',
                  style: Theme.of(context).textTheme.bodyLarge,
                ),
                const SizedBox(height: CbStructure.space5),
                _GalleryControls(
                  skin: widget.skin,
                  reduceTransparency: widget.reduceTransparency,
                  onSkinChanged: widget.onSkinChanged,
                  onReduceTransparencyChanged:
                      widget.onReduceTransparencyChanged,
                ),
                const SizedBox(height: CbStructure.space5),
                CbSurface(
                  variant: CbSurfaceVariant.gradient,
                  hue: CbDecorHue.violet,
                  padding: CbPad.lg,
                  child: Stack(
                    children: <Widget>[
                      Positioned(
                        top: CbStructure.space3,
                        right: CbStructure.space7,
                        child: _BackdropOrb(color: tokens.decorRose.toColor()),
                      ),
                      Positioned(
                        bottom: CbStructure.space4,
                        left: CbStructure.space6,
                        child: _BackdropOrb(color: tokens.decorTeal.toColor()),
                      ),
                      const _SurfaceGrid(),
                    ],
                  ),
                ),
                const SizedBox(height: CbStructure.space5),
                const FoundationGallery(),
                const SizedBox(height: CbStructure.space5),
                const SelectionControlsGallery(),
                const SizedBox(height: CbStructure.space5),
                const FormEntriesGallery(),
                const SizedBox(height: CbStructure.space5),
                const DateTimePickersGallery(),
                const SizedBox(height: CbStructure.space5),
                const ContentDisplayGallery(),
                const SizedBox(height: CbStructure.space5),
                NavigationGallery(drawerDestination: _drawerDestination),
                const SizedBox(height: CbStructure.space5),
                FeedbackStatusGallery(animateStatus: widget.animateStatus),
                const SizedBox(height: CbStructure.space5),
                const NativeDataDisplayGallery(),
                const SizedBox(height: CbStructure.space5),
                const NativeLayoutGallery(),
                const SizedBox(height: CbStructure.space5),
                const AppScrollGallery(),
                const SizedBox(height: CbStructure.space5),
                const NativeOverlayGallery(),
                const SizedBox(height: CbStructure.space5),
                const MiniChartsGallery(),
                const SizedBox(height: CbStructure.space5),
                const MotionGallery(),
                const SizedBox(height: CbStructure.space5),
                SkeletonGallery(motion: widget.animateStatus),
                const SizedBox(height: CbStructure.space5),
                EmptyGallery(motion: widget.animateStatus),
                const SizedBox(height: CbStructure.space5),
                ResultGallery(motion: widget.animateStatus),
                const SizedBox(height: CbStructure.space5),
                StatisticGallery(motion: widget.animateStatus),
                const SizedBox(height: CbStructure.space5),
                DescriptionsGallery(motion: widget.animateStatus),
                const SizedBox(height: CbStructure.space5),
                TimelineGallery(motion: widget.animateStatus),
                const SizedBox(height: CbStructure.space5),
                StepsGallery(motion: widget.animateStatus),
                const SizedBox(height: CbStructure.space5),
                PaginationGallery(motion: widget.animateStatus),
                const SizedBox(height: CbStructure.space5),
                const RatingGallery(),
                const SizedBox(height: CbStructure.space5),
                const InputNumberGallery(),
                const SizedBox(height: CbStructure.space5),
                const ColorPickerGallery(),
                const SizedBox(height: CbStructure.space5),
                UploadGallery(motion: widget.animateStatus),
                const SizedBox(height: CbStructure.space5),
                const ChecklistGallery(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _GalleryControls extends StatelessWidget {
  const _GalleryControls({
    required this.skin,
    required this.reduceTransparency,
    required this.onSkinChanged,
    required this.onReduceTransparencyChanged,
  });

  final CbSkin skin;
  final bool reduceTransparency;
  final ValueChanged<CbSkin> onSkinChanged;
  final ValueChanged<bool> onReduceTransparencyChanged;

  @override
  Widget build(BuildContext context) => CbSurface(
    elevation: CbElevation.sm,
    child: Wrap(
      crossAxisAlignment: WrapCrossAlignment.center,
      spacing: CbStructure.space4,
      runSpacing: CbStructure.space3,
      children: <Widget>[
        SegmentedButton<CbSkin>(
          showSelectedIcon: false,
          segments: CbSkin.values
              .map(
                (CbSkin value) => ButtonSegment<CbSkin>(
                  value: value,
                  label: Text(value.label),
                ),
              )
              .toList(growable: false),
          selected: <CbSkin>{skin},
          onSelectionChanged: (Set<CbSkin> values) =>
              onSkinChanged(values.single),
        ),
        FilterChip(
          selected: reduceTransparency,
          onSelected: onReduceTransparencyChanged,
          label: const Text('Reduce transparency'),
        ),
      ],
    ),
  );
}

class _SurfaceGrid extends StatelessWidget {
  const _SurfaceGrid();

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (BuildContext context, BoxConstraints constraints) {
      final double targetWidth = CbStructure.space8 * CbStructure.space4;
      final int columns = (constraints.maxWidth / targetWidth).floor().clamp(
        1,
        3,
      );
      final double width =
          (constraints.maxWidth - CbStructure.space4 * (columns - 1)) / columns;

      return Wrap(
        spacing: CbStructure.space4,
        runSpacing: CbStructure.space4,
        children: _samples
            .map(
              (_SurfaceSample sample) => SizedBox(
                width: width,
                height: CbStructure.space8 * 2,
                child: CbSurface(
                  variant: sample.variant,
                  glassStyle: sample.glassStyle,
                  tone: sample.tone,
                  hue: sample.hue,
                  elevation: CbElevation.sm,
                  child: Align(
                    alignment: Alignment.bottomLeft,
                    child: Text(
                      sample.label,
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                  ),
                ),
              ),
            )
            .toList(growable: false),
      );
    },
  );
}

class _BackdropOrb extends StatelessWidget {
  const _BackdropOrb({required this.color});

  final Color color;

  @override
  Widget build(BuildContext context) => DecoratedBox(
    decoration: BoxDecoration(color: color, shape: BoxShape.circle),
    child: const SizedBox.square(dimension: CbStructure.space8 * 2),
  );
}

class _SurfaceSample {
  const _SurfaceSample(
    this.label,
    this.variant, {
    this.glassStyle = CbGlassStyle.regular,
    this.tone = CbTone.neutral,
    this.hue,
  });

  final String label;
  final CbSurfaceVariant variant;
  final CbGlassStyle glassStyle;
  final CbTone tone;
  final CbDecorHue? hue;
}

const List<_SurfaceSample> _samples = <_SurfaceSample>[
  _SurfaceSample('Plain', CbSurfaceVariant.plain),
  _SurfaceSample(
    'Tinted · success',
    CbSurfaceVariant.tinted,
    tone: CbTone.success,
  ),
  _SurfaceSample(
    'Gradient · violet',
    CbSurfaceVariant.gradient,
    hue: CbDecorHue.violet,
  ),
  _SurfaceSample('Glass · regular', CbSurfaceVariant.glass),
  _SurfaceSample(
    'Glass · clear',
    CbSurfaceVariant.glass,
    glassStyle: CbGlassStyle.clear,
  ),
  _SurfaceSample(
    'Tinted · teal hue',
    CbSurfaceVariant.tinted,
    hue: CbDecorHue.teal,
  ),
];

extension on CbSkin {
  String get label => switch (this) {
    CbSkin.ceebee => 'Default',
    CbSkin.astra => 'Astra',
    CbSkin.clarity => 'Clarity',
    CbSkin.moodboard => 'Moodboard',
  };
}
