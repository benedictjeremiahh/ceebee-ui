import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('default Surface renders the plain material and token geometry', (
    WidgetTester tester,
  ) async {
    final ThemeData theme = cbThemeData();
    final CbSkinTokens tokens = theme.extension<CbTheme>()!.tokens;

    await tester.pumpWidget(
      MaterialApp(
        theme: theme,
        home: const Center(
          child: CbSurface(child: SizedBox(width: 20, height: 10)),
        ),
      ),
    );

    expect(tester.getSize(find.byType(CbSurface)), const Size(68, 58));
    final DecoratedBox box = tester.widget<DecoratedBox>(
      find
          .descendant(
            of: find.byType(CbSurface),
            matching: find.byType(DecoratedBox),
          )
          .first,
    );
    final BoxDecoration decoration = box.decoration as BoxDecoration;
    expect(decoration.color, tokens.surface.toColor());
    expect(decoration.borderRadius, CbRadius.lg.borderRadius);
    expect(decoration.boxShadow, cbOutsetShadows(tokens.shadowSm));
    expect(
      decoration.border,
      Border.all(
        color: tokens.border.toColor(),
        width: CbStructure.borderWidth,
      ),
    );
    expect(
      find.descendant(
        of: find.byType(CbSurface),
        matching: find.byType(Material),
      ),
      findsOneWidget,
    );
  });

  testWidgets('Surface exposes a Material ancestor for interactive children', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: CbSurface(
          child: SwitchListTile(
            title: const Text('Automatic updates'),
            value: true,
            onChanged: (_) {},
          ),
        ),
      ),
    );

    expect(tester.takeException(), isNull);
  });

  testWidgets('tinted Surface mixes hue into its fill and border', (
    WidgetTester tester,
  ) async {
    final ThemeData theme = cbThemeData();
    final CbSkinTokens tokens = theme.extension<CbTheme>()!.tokens;

    await tester.pumpWidget(
      MaterialApp(
        theme: theme,
        home: const Center(
          child: CbSurface(
            variant: CbSurfaceVariant.tinted,
            tone: CbTone.danger,
            hue: CbDecorHue.teal,
            child: SizedBox(width: 20, height: 10),
          ),
        ),
      ),
    );

    final BoxDecoration decoration = surfaceDecoration(tester);
    expect(
      decoration.color,
      tokens.decorTeal.mix(tokens.surface, tokens.tintStrength).toColor(),
    );
    expect(
      decoration.border,
      Border.all(
        color: tokens.decorTeal
            .mix(CbOklch.transparent, CbSurfaceTokens.tintedEdgeStrength)
            .toColor(),
        width: CbStructure.borderWidth,
      ),
    );
  });

  testWidgets('gradient Surface uses the canonical angle and mix strengths', (
    WidgetTester tester,
  ) async {
    final ThemeData theme = cbThemeData();
    final CbSkinTokens tokens = theme.extension<CbTheme>()!.tokens;

    await tester.pumpWidget(
      MaterialApp(
        theme: theme,
        home: const Center(
          child: CbSurface(
            variant: CbSurfaceVariant.gradient,
            tone: CbTone.brand,
            child: SizedBox(width: 20, height: 10),
          ),
        ),
      ),
    );

    final BoxDecoration decoration = surfaceDecoration(tester);
    final CbOklch accent = tokens.toneBrand;
    final CbGradient expected = CbGradient(
      angle: tokens.gradientAngle,
      stops: <CbGradientStop>[
        CbGradientStop(
          accent.mix(tokens.surface, CbSurfaceTokens.gradientStartStrength),
          0,
        ),
        CbGradientStop(
          accent.mix(tokens.surface, CbSurfaceTokens.gradientEndStrength),
          1,
        ),
      ],
    );
    expect(decoration.color, isNull);
    expect(decoration.gradient, expected.toLinearGradient());
    expect(
      decoration.border,
      Border.all(
        color: accent
            .mix(CbOklch.transparent, CbSurfaceTokens.gradientEdgeStrength)
            .toColor(),
        width: CbStructure.borderWidth,
      ),
    );
  });

  testWidgets('glass Surface becomes opaque when transparency is reduced', (
    WidgetTester tester,
  ) async {
    final ThemeData theme = cbThemeData(reduceTransparency: true);
    final CbSkinTokens tokens = theme.extension<CbTheme>()!.tokens;

    await tester.pumpWidget(
      MaterialApp(
        theme: theme,
        home: const Center(
          child: CbSurface(
            variant: CbSurfaceVariant.glass,
            glassStyle: CbGlassStyle.clear,
            child: SizedBox(width: 20, height: 10),
          ),
        ),
      ),
    );

    expect(
      find.descendant(
        of: find.byType(CbSurface),
        matching: find.byType(BackdropFilter),
      ),
      findsNothing,
    );
    final BoxDecoration decoration = surfaceDecoration(tester);
    expect(decoration.color, tokens.glassBgOpaque.toColor());
    expect(decoration.gradient, isNull);
    expect(
      decoration.border,
      Border.all(
        color: tokens.glassClearBorder.toColor(),
        width: CbStructure.borderWidth,
      ),
    );
  });

  testWidgets('high contrast glass uses the strong edge', (
    WidgetTester tester,
  ) async {
    final ThemeData theme = cbThemeData(highContrast: true);
    final CbSkinTokens tokens = theme.extension<CbTheme>()!.tokens;

    await tester.pumpWidget(
      MaterialApp(
        theme: theme,
        home: const Center(
          child: CbSurface(
            variant: CbSurfaceVariant.glass,
            glassStyle: CbGlassStyle.clear,
            child: SizedBox(width: 20, height: 10),
          ),
        ),
      ),
    );

    final BoxDecoration decoration = surfaceDecoration(tester);
    expect(
      decoration.border,
      Border.all(
        color: tokens.glassBorderStrong.toColor(),
        width: CbStructure.borderWidth,
      ),
    );
  });

  testWidgets('clear glass clips and filters its backdrop', (
    WidgetTester tester,
  ) async {
    final ThemeData theme = cbThemeData();
    final CbSkinTokens tokens = theme.extension<CbTheme>()!.tokens;

    await tester.pumpWidget(
      MaterialApp(
        theme: theme,
        home: const Center(
          child: CbSurface(
            variant: CbSurfaceVariant.glass,
            glassStyle: CbGlassStyle.clear,
            child: SizedBox(width: 20, height: 10),
          ),
        ),
      ),
    );

    expect(tester.getSize(find.byType(CbSurface)), const Size(68, 58));
    expect(
      find.descendant(
        of: find.byType(CbSurface),
        matching: find.byType(ClipRRect),
      ),
      findsOneWidget,
    );
    expect(
      find.descendant(
        of: find.byType(CbSurface),
        matching: find.byType(BackdropFilter),
      ),
      findsOneWidget,
    );
    final BoxDecoration decoration = surfaceDecoration(tester);
    expect(decoration.color, tokens.glassClearBg.toColor());
    expect(decoration.gradient, tokens.glassClearSpecular.toLinearGradient());
    expect(
      decoration.border,
      Border.all(
        color: tokens.glassClearBorder.toColor(),
        width: CbStructure.borderWidth,
      ),
    );
  });
}

BoxDecoration surfaceDecoration(WidgetTester tester) {
  final DecoratedBox box = tester.widget<DecoratedBox>(
    find
        .descendant(
          of: find.byType(CbSurface),
          matching: find.byType(DecoratedBox),
        )
        .last,
  );
  return box.decoration as BoxDecoration;
}
