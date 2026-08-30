import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

const Key popoverTriggerKey = Key('popover-trigger');
const Key popoverPanelKey = Key('popover-panel');
const Key popoverFocusKey = Key('popover-focus');
const Key popoverCloseKey = Key('popover-close');

void main() {
  testWidgets('OverlayPortal moves focus inside and restores its trigger', (
    WidgetTester tester,
  ) async {
    await _pumpPopover(tester);

    await tester.tap(find.byKey(popoverTriggerKey));
    await tester.pump();
    expect(find.byKey(popoverPanelKey), findsOneWidget);
    expect(
      tester
          .widget<IconButton>(find.byKey(popoverCloseKey))
          .focusNode
          ?.hasFocus,
      isTrue,
    );

    await tester.sendKeyEvent(LogicalKeyboardKey.escape);
    await tester.pump();
    expect(find.byKey(popoverPanelKey), findsNothing);
    expect(
      tester
          .widget<OutlinedButton>(find.byKey(popoverTriggerKey))
          .focusNode
          ?.hasFocus,
      isTrue,
    );
  });

  testWidgets('OverlayPortal dismisses on outside tap', (
    WidgetTester tester,
  ) async {
    await _pumpPopover(tester);

    await tester.tap(find.byKey(popoverTriggerKey));
    await tester.pump();
    expect(find.byKey(popoverPanelKey), findsOneWidget);

    await tester.tapAt(const Offset(CbStructure.space2, CbStructure.space2));
    await tester.pump();
    expect(find.byKey(popoverPanelKey), findsNothing);
  });

  testWidgets('OverlayPortal positions the panel below its trigger', (
    WidgetTester tester,
  ) async {
    await _pumpPopover(tester);
    await tester.tap(find.byKey(popoverTriggerKey));
    await tester.pump();

    final Rect trigger = tester.getRect(find.byKey(popoverTriggerKey));
    final Rect panel = tester.getRect(find.byKey(popoverPanelKey));
    expect(panel.top, trigger.bottom + CbStructure.space2);
    expect(panel.left, trigger.left);
  });
}

Future<void> _pumpPopover(WidgetTester tester) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = const Size(800, 700);
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);
  await tester.pumpWidget(
    MaterialApp(theme: cbThemeData(), home: const _PopoverHarness()),
  );
}

class _PopoverHarness extends StatefulWidget {
  const _PopoverHarness();

  @override
  State<_PopoverHarness> createState() => _PopoverHarnessState();
}

class _PopoverHarnessState extends State<_PopoverHarness> {
  final OverlayPortalController _controller = OverlayPortalController();
  final FocusNode _triggerFocus = FocusNode();
  final FocusNode _overlayFocus = FocusNode();

  @override
  void dispose() {
    _triggerFocus.dispose();
    _overlayFocus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: Center(
      child: OverlayPortal.overlayChildLayoutBuilder(
        controller: _controller,
        overlayChildBuilder: _buildOverlay,
        child: OutlinedButton(
          key: popoverTriggerKey,
          focusNode: _triggerFocus,
          onPressed: _open,
          child: const Text('Open details'),
        ),
      ),
    ),
  );

  Widget _buildOverlay(BuildContext context, OverlayChildLayoutInfo info) {
    final Offset origin = MatrixUtils.transformPoint(
      info.childPaintTransform,
      Offset.zero,
    );
    return Stack(
      children: <Widget>[
        Positioned.fill(
          child: GestureDetector(
            behavior: HitTestBehavior.translucent,
            onTap: _close,
          ),
        ),
        Positioned(
          left: origin.dx,
          top: origin.dy + info.childSize.height + CbStructure.space2,
          width: CbStructure.space8 * 4,
          height: CbStructure.space8 * 3,
          child: Focus(
            key: popoverFocusKey,
            onKeyEvent: (FocusNode node, KeyEvent event) {
              if (event is KeyDownEvent &&
                  event.logicalKey == LogicalKeyboardKey.escape) {
                _close();
                return KeyEventResult.handled;
              }
              return KeyEventResult.ignored;
            },
            child: CbSurface(
              key: popoverPanelKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  IconButton(
                    key: popoverCloseKey,
                    focusNode: _overlayFocus,
                    onPressed: _close,
                    tooltip: 'Close details',
                    icon: const Icon(Icons.close),
                  ),
                  const Text('Contextual details'),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  void _open() {
    _controller.show();
    setState(() {});
    WidgetsBinding.instance.addPostFrameCallback((Duration _) {
      if (mounted && _controller.isShowing) _overlayFocus.requestFocus();
    });
  }

  void _close() {
    if (!_controller.isShowing) return;
    _controller.hide();
    setState(() {});
    _triggerFocus.requestFocus();
  }
}
