import 'dart:math' as math;

import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

const Key galleryPopoverMenuTriggerKey = Key('gallery-popover-menu-trigger');
const Key galleryPopoverPortalTriggerKey = Key(
  'gallery-popover-portal-trigger',
);
const Key galleryPopoverPortalKey = Key('gallery-popover-portal');
const Key galleryPopoverCloseKey = Key('gallery-popover-close');
const Key galleryPopoverOutsideKey = Key('gallery-popover-outside');
const Key galleryPopoverSelectionKey = Key('gallery-popover-selection');

class NativeOverlayGallery extends StatefulWidget {
  const NativeOverlayGallery({super.key});

  @override
  State<NativeOverlayGallery> createState() => _NativeOverlayGalleryState();
}

class _NativeOverlayGalleryState extends State<NativeOverlayGallery> {
  final FocusNode _menuFocusNode = FocusNode();
  final FocusNode _portalTriggerFocusNode = FocusNode();
  final FocusNode _portalFocusNode = FocusNode();
  final OverlayPortalController _portalController = OverlayPortalController(
    debugLabel: 'release details',
  );
  String _selection = 'No action selected';

  @override
  void dispose() {
    _menuFocusNode.dispose();
    _portalTriggerFocusNode.dispose();
    _portalFocusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Text('Native popovers', style: type.displaySmall),
        const SizedBox(height: CbStructure.space2),
        Text(
          'MenuAnchor owns action menus. OverlayPortal keeps richer contextual content in the inherited Ceebee Theme while the app owns its explicit dismissal policy.',
          style: type.bodyLarge,
        ),
        const SizedBox(height: CbStructure.space5),
        LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            final bool wide = constraints.maxWidth >= CbStructure.space8 * 8;
            if (wide) {
              return Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Expanded(child: _actionMenuStory(context)),
                  const SizedBox(width: CbStructure.space4),
                  Expanded(child: _richPopoverStory(context, compact: false)),
                ],
              );
            }
            return Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                _actionMenuStory(context),
                const SizedBox(height: CbStructure.space4),
                _richPopoverStory(context, compact: true),
              ],
            );
          },
        ),
      ],
    );
  }

  Widget _actionMenuStory(BuildContext context) => SizedBox(
    height: CbStructure.space8 * 5,
    child: CbSurface(
      padding: CbPad.lg,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          const Icon(Icons.touch_app_outlined),
          const SizedBox(height: CbStructure.space3),
          Text('Action menu', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: CbStructure.space2),
          const Text(
            'Use MenuAnchor when every option performs an action and arrow-key navigation is expected.',
          ),
          const Spacer(),
          MenuAnchor(
            childFocusNode: _menuFocusNode,
            builder:
                (
                  BuildContext context,
                  MenuController controller,
                  Widget? child,
                ) => OutlinedButton.icon(
                  key: galleryPopoverMenuTriggerKey,
                  focusNode: _menuFocusNode,
                  onPressed: () => controller.isOpen
                      ? controller.close()
                      : controller.open(),
                  icon: const Icon(Icons.more_horiz),
                  label: const Text('Release actions'),
                ),
            menuChildren: <Widget>[
              for (final (IconData, String) action in _menuActions)
                MenuItemButton(
                  leadingIcon: Icon(action.$1),
                  onPressed: () => setState(() => _selection = action.$2),
                  child: Text(action.$2),
                ),
            ],
          ),
          const SizedBox(height: CbStructure.space3),
          Text(
            _selection,
            key: galleryPopoverSelectionKey,
            style: Theme.of(context).textTheme.bodySmall,
          ),
        ],
      ),
    ),
  );

  Widget _richPopoverStory(BuildContext context, {required bool compact}) =>
      SizedBox(
        height: CbStructure.space8 * 5,
        child: CbSurface(
          variant: CbSurfaceVariant.tinted,
          tone: CbTone.brand,
          padding: CbPad.lg,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              const Icon(Icons.info_outline),
              const SizedBox(height: CbStructure.space3),
              Text(
                'Contextual details',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: CbStructure.space2),
              Text(
                compact
                    ? 'Use a native bottom sheet for structured details on a compact touch screen.'
                    : 'Use OverlayPortal when the overlay needs structured content, inherited Theme data, and an explicit close action.',
              ),
              const Spacer(),
              OverlayPortal.overlayChildLayoutBuilder(
                controller: _portalController,
                overlayChildBuilder: _buildPortalOverlay,
                child: FilledButton.icon(
                  key: galleryPopoverPortalTriggerKey,
                  focusNode: _portalTriggerFocusNode,
                  onPressed: compact
                      ? () => _showDetailsSheet(context)
                      : _togglePortal,
                  icon: const Icon(Icons.visibility_outlined),
                  label: const Text('View release details'),
                ),
              ),
              const SizedBox(height: CbStructure.space3),
              Text(
                compact
                    ? 'Drag down, tap outside, or use the visible action to dismiss it.'
                    : 'Outside tap, Escape, or the visible close action dismisses it.',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ),
        ),
      );

  Widget _buildPortalOverlay(
    BuildContext context,
    OverlayChildLayoutInfo info,
  ) {
    final Offset targetOrigin = MatrixUtils.transformPoint(
      info.childPaintTransform,
      Offset.zero,
    );
    final double width = math.min(
      CbStructure.space8 * 5,
      info.overlaySize.width - CbStructure.space6,
    );
    final double height = CbStructure.space8 * 5 + CbStructure.space5;
    final double left = targetOrigin.dx.clamp(
      CbStructure.space4,
      math.max(
        CbStructure.space4,
        info.overlaySize.width - width - CbStructure.space4,
      ),
    );
    final double below =
        targetOrigin.dy + info.childSize.height + CbStructure.space2;
    final bool fitsBelow =
        below + height + CbStructure.space4 <= info.overlaySize.height;
    final double top = fitsBelow
        ? below
        : math.max(
            CbStructure.space4,
            targetOrigin.dy - height - CbStructure.space2,
          );

    return Stack(
      children: <Widget>[
        Positioned.fill(
          child: GestureDetector(
            key: galleryPopoverOutsideKey,
            behavior: HitTestBehavior.translucent,
            onTap: _closePortal,
          ),
        ),
        Positioned(
          left: left,
          top: top,
          width: width,
          height: height,
          child: Focus(
            onKeyEvent: (FocusNode node, KeyEvent event) {
              if (event is KeyDownEvent &&
                  event.logicalKey == LogicalKeyboardKey.escape) {
                _closePortal();
                return KeyEventResult.handled;
              }
              return KeyEventResult.ignored;
            },
            child: CbSurface(
              key: galleryPopoverPortalKey,
              elevation: CbElevation.lg,
              padding: CbPad.lg,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Row(
                    children: <Widget>[
                      Expanded(
                        child: Text(
                          'Release 0.2.0',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                      ),
                      IconButton(
                        key: galleryPopoverCloseKey,
                        focusNode: _portalFocusNode,
                        onPressed: _closePortal,
                        tooltip: 'Close release details',
                        icon: const Icon(Icons.close),
                      ),
                    ],
                  ),
                  const Divider(),
                  const _DetailRow(
                    icon: Icons.check_circle_outline,
                    label: 'Status',
                    value: 'Ready for review',
                  ),
                  const SizedBox(height: CbStructure.space3),
                  const _DetailRow(
                    icon: Icons.person_outline,
                    label: 'Owner',
                    value: 'Grace',
                  ),
                  const SizedBox(height: CbStructure.space3),
                  const _DetailRow(
                    icon: Icons.event_outlined,
                    label: 'Target',
                    value: 'Friday',
                  ),
                  const Spacer(),
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton.icon(
                      onPressed: _closePortal,
                      icon: const Icon(Icons.open_in_new),
                      label: const Text('Open release'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  void _togglePortal() {
    if (_portalController.isShowing) {
      _closePortal();
      return;
    }
    _portalController.show();
    setState(() {});
    WidgetsBinding.instance.addPostFrameCallback((Duration _) {
      if (mounted && _portalController.isShowing) {
        _portalFocusNode.requestFocus();
      }
    });
  }

  Future<void> _showDetailsSheet(BuildContext context) =>
      showModalBottomSheet<void>(
        context: context,
        showDragHandle: true,
        useSafeArea: true,
        builder: (BuildContext context) => const _MobileReleaseDetails(),
      );

  void _closePortal() {
    if (!_portalController.isShowing) return;
    _portalController.hide();
    setState(() {});
    _portalTriggerFocusNode.requestFocus();
  }
}

class _MobileReleaseDetails extends StatelessWidget {
  const _MobileReleaseDetails();

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(
      CbStructure.space5,
      CbStructure.space2,
      CbStructure.space5,
      CbStructure.space5,
    ),
    child: Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text('Release 0.2.0', style: Theme.of(context).textTheme.titleLarge),
        const Divider(),
        const _DetailRow(
          icon: Icons.check_circle_outline,
          label: 'Status',
          value: 'Ready for review',
        ),
        const SizedBox(height: CbStructure.space3),
        const _DetailRow(
          icon: Icons.person_outline,
          label: 'Owner',
          value: 'Grace',
        ),
        const SizedBox(height: CbStructure.space3),
        const _DetailRow(
          icon: Icons.event_outlined,
          label: 'Target',
          value: 'Friday',
        ),
        const SizedBox(height: CbStructure.space4),
        Align(
          alignment: Alignment.centerRight,
          child: FilledButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Done'),
          ),
        ),
      ],
    ),
  );
}

class _DetailRow extends StatelessWidget {
  const _DetailRow({
    required this.icon,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) => Row(
    children: <Widget>[
      Icon(icon),
      const SizedBox(width: CbStructure.space3),
      Expanded(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(label, style: Theme.of(context).textTheme.labelMedium),
            Text(value),
          ],
        ),
      ),
    ],
  );
}

const List<(IconData, String)> _menuActions = <(IconData, String)>[
  (Icons.edit_outlined, 'Edit release'),
  (Icons.link, 'Copy link'),
  (Icons.person_add_outlined, 'Add reviewer'),
  (Icons.archive_outlined, 'Archive draft'),
  (Icons.history, 'View history'),
  (Icons.download_outlined, 'Export notes'),
];
