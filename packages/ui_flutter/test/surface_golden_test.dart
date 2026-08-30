import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key goldenSceneKey = Key('surface-golden-scene');

void main() {
  testWidgets('Surface materials — light', (WidgetTester tester) async {
    await pumpGoldenScene(tester, theme: cbThemeData());

    await expectLater(
      find.byKey(goldenSceneKey),
      matchesGoldenFile('goldens/surface_light.png'),
    );
  });

  testWidgets('Surface materials — dark', (WidgetTester tester) async {
    await pumpGoldenScene(
      tester,
      theme: cbThemeData(brightness: Brightness.dark),
    );

    await expectLater(
      find.byKey(goldenSceneKey),
      matchesGoldenFile('goldens/surface_dark.png'),
    );
  });

  testWidgets('Surface materials — reduced transparency', (
    WidgetTester tester,
  ) async {
    await pumpGoldenScene(tester, theme: cbThemeData(reduceTransparency: true));

    await expectLater(
      find.byKey(goldenSceneKey),
      matchesGoldenFile('goldens/surface_reduced_transparency.png'),
    );
  });

  testWidgets('Surface materials — high contrast', (WidgetTester tester) async {
    await pumpGoldenScene(tester, theme: cbThemeData(highContrast: true));

    await expectLater(
      find.byKey(goldenSceneKey),
      matchesGoldenFile('goldens/surface_high_contrast.png'),
    );
  });
}

Future<void> pumpGoldenScene(
  WidgetTester tester, {
  required ThemeData theme,
}) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = const Size(840, 660);
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);
  final ThemeData goldenTheme = theme.copyWith(
    textTheme: theme.textTheme.apply(fontFamily: 'Roboto'),
  );

  await tester.pumpWidget(
    MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: goldenTheme,
      home: const RepaintBoundary(key: goldenSceneKey, child: _SurfaceScene()),
    ),
  );
  await tester.pumpAndSettle();
}

class _SurfaceScene extends StatelessWidget {
  const _SurfaceScene();

  @override
  Widget build(BuildContext context) {
    final CbSkinTokens tokens = context.cb;

    return ColoredBox(
      color: tokens.bg.toColor(),
      child: CustomPaint(
        painter: _BackdropPattern(tokens),
        child: Padding(
          padding: const EdgeInsets.all(CbStructure.space6),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                'Surface materials',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: CbStructure.space5),
              const Wrap(
                spacing: CbStructure.space5,
                runSpacing: CbStructure.space5,
                children: <Widget>[
                  _MaterialSample(label: 'Plain'),
                  _MaterialSample(
                    label: 'Tinted · success',
                    variant: CbSurfaceVariant.tinted,
                    tone: CbTone.success,
                  ),
                  _MaterialSample(
                    label: 'Gradient · violet',
                    variant: CbSurfaceVariant.gradient,
                    hue: CbDecorHue.violet,
                  ),
                  _MaterialSample(
                    label: 'Glass · regular',
                    variant: CbSurfaceVariant.glass,
                    elevation: CbElevation.md,
                  ),
                  _MaterialSample(
                    label: 'Glass · clear',
                    variant: CbSurfaceVariant.glass,
                    glassStyle: CbGlassStyle.clear,
                    elevation: CbElevation.md,
                  ),
                  _MaterialSample(
                    label: 'Tinted · teal hue',
                    variant: CbSurfaceVariant.tinted,
                    tone: CbTone.danger,
                    hue: CbDecorHue.teal,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _MaterialSample extends StatelessWidget {
  const _MaterialSample({
    required this.label,
    this.variant = CbSurfaceVariant.plain,
    this.glassStyle = CbGlassStyle.regular,
    this.tone = CbTone.neutral,
    this.hue,
    this.elevation = CbElevation.sm,
  });

  final String label;
  final CbSurfaceVariant variant;
  final CbGlassStyle glassStyle;
  final CbTone tone;
  final CbDecorHue? hue;
  final CbElevation elevation;

  @override
  Widget build(BuildContext context) => SizedBox(
    width: 240,
    height: 150,
    child: CbSurface(
      variant: variant,
      glassStyle: glassStyle,
      tone: tone,
      hue: hue,
      elevation: elevation,
      child: Align(
        alignment: Alignment.bottomLeft,
        child: Text(label, style: Theme.of(context).textTheme.titleMedium),
      ),
    ),
  );
}

class _BackdropPattern extends CustomPainter {
  const _BackdropPattern(this.tokens);

  final CbSkinTokens tokens;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint line = Paint()
      ..color = tokens.decorBlue.scaleAlpha(0.18).toColor()
      ..strokeWidth = CbStructure.borderWidth;
    for (
      double offset = CbStructure.space6;
      offset < size.width;
      offset += CbStructure.space6
    ) {
      canvas.drawLine(Offset(offset, 0), Offset(offset, size.height), line);
    }
    for (
      double offset = CbStructure.space6;
      offset < size.height;
      offset += CbStructure.space6
    ) {
      canvas.drawLine(Offset(0, offset), Offset(size.width, offset), line);
    }

    canvas.drawCircle(
      Offset(size.width * 0.76, size.height * 0.42),
      CbStructure.space8 * 1.25,
      Paint()..color = tokens.decorRose.scaleAlpha(0.42).toColor(),
    );
    canvas.drawCircle(
      Offset(size.width * 0.38, size.height * 0.74),
      CbStructure.space8,
      Paint()..color = tokens.decorTeal.scaleAlpha(0.4).toColor(),
    );
  }

  @override
  bool shouldRepaint(covariant _BackdropPattern oldDelegate) =>
      oldDelegate.tokens != tokens;
}
