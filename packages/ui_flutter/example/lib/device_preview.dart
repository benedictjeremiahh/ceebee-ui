import 'dart:math' as math;

import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key devicePreviewProfileKey = Key('device-preview-profile');
const Key devicePreviewOrientationKey = Key('device-preview-orientation');
const Key devicePreviewTextScaleKey = Key('device-preview-text-scale');
const Key devicePreviewSafeAreaKey = Key('device-preview-safe-area');
const Key devicePreviewViewportKey = Key('device-preview-viewport');

/// A web-only shell for checking responsive Flutter gallery layouts.
///
/// This deliberately simulates geometry only. The gallery still runs on the
/// Flutter web engine, so native input, rendering, gestures, dialogs, and
/// performance must be validated on Android or iOS.
class GalleryDevicePreview extends StatefulWidget {
  const GalleryDevicePreview({
    super.key,
    required this.enabled,
    required this.child,
  });

  final bool enabled;
  final Widget child;

  @override
  State<GalleryDevicePreview> createState() => _GalleryDevicePreviewState();
}

class _GalleryDevicePreviewState extends State<GalleryDevicePreview> {
  _DeviceProfile _profile = _DeviceProfile.responsive;
  Orientation _orientation = Orientation.portrait;
  double _textScale = 1;
  bool _safeArea = true;

  @override
  Widget build(BuildContext context) {
    if (!widget.enabled) return widget.child;

    final CbSkinTokens tokens = context.cb;

    return ColoredBox(
      color: tokens.bgSubtle.toColor(),
      child: SafeArea(
        child: Column(
          children: <Widget>[
            Material(
              color: tokens.surface.toColor(),
              child: Padding(
                padding: const EdgeInsets.all(CbStructure.space4),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[
                    Wrap(
                      spacing: CbStructure.space3,
                      runSpacing: CbStructure.space3,
                      crossAxisAlignment: WrapCrossAlignment.center,
                      children: <Widget>[
                        _PreviewLabel(tokens: tokens),
                        _ProfileMenu(
                          profile: _profile,
                          onSelected: (_DeviceProfile value) =>
                              setState(() => _profile = value),
                        ),
                        Tooltip(
                          message: _orientation == Orientation.portrait
                              ? 'Switch to landscape'
                              : 'Switch to portrait',
                          child: IconButton.outlined(
                            key: devicePreviewOrientationKey,
                            onPressed: _profile == _DeviceProfile.responsive
                                ? null
                                : () => setState(
                                    () => _orientation =
                                        _orientation == Orientation.portrait
                                        ? Orientation.landscape
                                        : Orientation.portrait,
                                  ),
                            icon: Icon(
                              _orientation == Orientation.portrait
                                  ? Icons.stay_current_landscape_outlined
                                  : Icons.stay_current_portrait_outlined,
                            ),
                          ),
                        ),
                        _TextScaleMenu(
                          scale: _textScale,
                          onSelected: (double value) =>
                              setState(() => _textScale = value),
                        ),
                        FilterChip(
                          key: devicePreviewSafeAreaKey,
                          selected: _safeArea,
                          onSelected: _profile == _DeviceProfile.responsive
                              ? null
                              : (bool value) =>
                                    setState(() => _safeArea = value),
                          avatar: const Icon(
                            Icons.crop_free,
                            size: CbStructure.textLg,
                          ),
                          label: const Text('Safe area'),
                        ),
                      ],
                    ),
                    const SizedBox(height: CbStructure.space3),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Icon(
                          Icons.info_outline,
                          size: CbStructure.textLg,
                          color: tokens.fgMuted.toColor(),
                        ),
                        const SizedBox(width: CbStructure.space2),
                        Expanded(
                          child: Text(
                            'Layout simulation only. Browser rendering, gestures, keyboard, '
                            'dialogs, and performance may differ on Android and iOS.',
                            style: Theme.of(context).textTheme.bodySmall
                                ?.copyWith(color: tokens.fgMuted.toColor()),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            Expanded(
              child: _profile == _DeviceProfile.responsive
                  ? widget.child
                  : _DeviceStage(
                      profile: _profile,
                      orientation: _orientation,
                      textScale: _textScale,
                      safeArea: _safeArea,
                      child: widget.child,
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PreviewLabel extends StatelessWidget {
  const _PreviewLabel({required this.tokens});

  final CbSkinTokens tokens;

  @override
  Widget build(BuildContext context) => Row(
    mainAxisSize: MainAxisSize.min,
    children: <Widget>[
      Icon(Icons.devices_outlined, color: tokens.toneBrand.toColor()),
      const SizedBox(width: CbStructure.space2),
      Text('Device preview', style: Theme.of(context).textTheme.titleMedium),
    ],
  );
}

class _ProfileMenu extends StatelessWidget {
  const _ProfileMenu({required this.profile, required this.onSelected});

  final _DeviceProfile profile;
  final ValueChanged<_DeviceProfile> onSelected;

  @override
  Widget build(BuildContext context) => MenuAnchor(
    menuChildren: _DeviceProfile.values
        .map(
          (_DeviceProfile value) => MenuItemButton(
            onPressed: () => onSelected(value),
            leadingIcon: Icon(value.icon),
            child: Text(value.label),
          ),
        )
        .toList(growable: false),
    builder: (BuildContext context, MenuController controller, Widget? child) =>
        OutlinedButton.icon(
          key: devicePreviewProfileKey,
          onPressed: controller.isOpen ? controller.close : controller.open,
          icon: Icon(profile.icon),
          label: Text(profile.label),
        ),
  );
}

class _TextScaleMenu extends StatelessWidget {
  const _TextScaleMenu({required this.scale, required this.onSelected});

  final double scale;
  final ValueChanged<double> onSelected;

  static const List<double> _scales = <double>[1, 1.25, 1.5];

  @override
  Widget build(BuildContext context) => MenuAnchor(
    menuChildren: _scales
        .map(
          (double value) => MenuItemButton(
            onPressed: () => onSelected(value),
            child: Text(_label(value)),
          ),
        )
        .toList(growable: false),
    builder: (BuildContext context, MenuController controller, Widget? child) =>
        OutlinedButton.icon(
          key: devicePreviewTextScaleKey,
          onPressed: controller.isOpen ? controller.close : controller.open,
          icon: const Icon(Icons.text_fields_outlined),
          label: Text('Text ${_label(scale)}'),
        ),
  );

  static String _label(double value) => '${(value * 100).round()}%';
}

class _DeviceStage extends StatelessWidget {
  const _DeviceStage({
    required this.profile,
    required this.orientation,
    required this.textScale,
    required this.safeArea,
    required this.child,
  });

  final _DeviceProfile profile;
  final Orientation orientation;
  final double textScale;
  final bool safeArea;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final CbSkinTokens tokens = context.cb;
    final Size viewport = profile.viewport(orientation);
    final EdgeInsets simulatedPadding = safeArea
        ? profile.safeInsets(orientation)
        : EdgeInsets.zero;
    final Size frame = Size(
      viewport.width + CbStructure.space4,
      viewport.height + CbStructure.space4,
    );

    return ColoredBox(
      color: tokens.bgSubtle.toColor(),
      child: Padding(
        padding: const EdgeInsets.all(CbStructure.space4),
        child: LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            final double scale = math.min(
              1,
              math.min(
                constraints.maxWidth / frame.width,
                constraints.maxHeight / frame.height,
              ),
            );

            return Center(
              child: SizedBox(
                width: frame.width * scale,
                height: frame.height * scale,
                child: FittedBox(
                  fit: BoxFit.contain,
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      color: tokens.borderStrong.toColor(),
                      borderRadius: CbRadius.xl.borderRadius,
                      boxShadow: cbOutsetShadows(tokens.shadowMd),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(CbStructure.space2),
                      child: ClipRRect(
                        borderRadius: CbRadius.lg.borderRadius,
                        child: SizedBox(
                          key: devicePreviewViewportKey,
                          width: viewport.width,
                          height: viewport.height,
                          child: MediaQuery(
                            data: MediaQuery.of(context).copyWith(
                              size: viewport,
                              padding: simulatedPadding,
                              viewPadding: simulatedPadding,
                              textScaler: TextScaler.linear(textScale),
                            ),
                            child: child,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

enum _DeviceProfile {
  responsive,
  iphone15Pro,
  pixel9,
  ipadMini;

  String get label => switch (this) {
    responsive => 'Responsive',
    iphone15Pro => 'iPhone 15 Pro',
    pixel9 => 'Pixel 9',
    ipadMini => 'iPad mini',
  };

  IconData get icon => switch (this) {
    responsive => Icons.fit_screen_outlined,
    iphone15Pro || pixel9 => Icons.smartphone_outlined,
    ipadMini => Icons.tablet_mac_outlined,
  };

  Size get _portraitSize => switch (this) {
    responsive => Size.zero,
    iphone15Pro => const Size(393, 852),
    pixel9 => const Size(412, 915),
    ipadMini => const Size(768, 1024),
  };

  Size viewport(Orientation orientation) {
    final Size portrait = _portraitSize;
    return orientation == Orientation.portrait
        ? portrait
        : Size(portrait.height, portrait.width);
  }

  EdgeInsets safeInsets(Orientation orientation) {
    if (orientation == Orientation.landscape) {
      return switch (this) {
        responsive => EdgeInsets.zero,
        iphone15Pro => const EdgeInsets.fromLTRB(
          CbStructure.space7,
          CbStructure.space0,
          CbStructure.space7,
          CbStructure.space4,
        ),
        pixel9 => const EdgeInsets.fromLTRB(
          CbStructure.space5,
          CbStructure.space0,
          CbStructure.space5,
          CbStructure.space4,
        ),
        ipadMini => const EdgeInsets.all(CbStructure.space4),
      };
    }

    return switch (this) {
      responsive => EdgeInsets.zero,
      iphone15Pro => const EdgeInsets.fromLTRB(
        CbStructure.space0,
        CbStructure.space7,
        CbStructure.space0,
        CbStructure.space6,
      ),
      pixel9 => const EdgeInsets.fromLTRB(
        CbStructure.space0,
        CbStructure.space5,
        CbStructure.space0,
        CbStructure.space5,
      ),
      ipadMini => const EdgeInsets.fromLTRB(
        CbStructure.space0,
        CbStructure.space5,
        CbStructure.space0,
        CbStructure.space4,
      ),
    };
  }
}
