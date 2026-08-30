import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('typography, icon, and divider roles resolve from Ceebee Tokens', () {
    final ThemeData theme = cbThemeData();
    final CbSkinTokens tokens = theme.extension<CbTheme>()!.tokens;

    expect(theme.textTheme.displayLarge?.fontSize, CbStructure.text3xl);
    expect(theme.textTheme.displayLarge?.height, CbStructure.leadingTight);
    expect(
      theme.textTheme.displayLarge?.fontWeight,
      CbStructure.weightSemibold,
    );
    expect(theme.textTheme.bodyMedium?.fontSize, CbStructure.textMd);
    expect(theme.textTheme.bodyMedium?.height, CbStructure.leadingNormal);
    expect(theme.textTheme.bodySmall?.color, tokens.fgMuted.toColor());
    expect(theme.iconTheme.color, tokens.fg.toColor());
    expect(theme.dividerTheme.color, tokens.border.toColor());
    expect(theme.dividerTheme.thickness, CbStructure.borderWidth);
  });

  test('button bridge preserves Material-owned geometry and hierarchy', () {
    final ThemeData theme = cbThemeData();
    final List<ButtonStyle?> styles = <ButtonStyle?>[
      theme.filledButtonTheme.style,
      theme.elevatedButtonTheme.style,
      theme.outlinedButtonTheme.style,
      theme.textButtonTheme.style,
    ];

    for (final ButtonStyle? style in styles) {
      final TextStyle? buttonText = style?.textStyle?.resolve(<WidgetState>{});
      expect(buttonText?.fontSize, CbStructure.textMd);
      expect(buttonText?.fontWeight, CbStructure.weightMedium);
      expect(buttonText?.height, CbStructure.leadingNormal);
      expect(buttonText?.color, isNull);
      expect(style?.minimumSize, isNull);
      expect(style?.padding, isNull);
      expect(style?.shape, isNull);
      expect(style?.side, isNull);
      expect(style?.elevation, isNull);
    }

    expect(theme.floatingActionButtonTheme.backgroundColor, isNull);
    expect(theme.floatingActionButtonTheme.foregroundColor, isNull);
    expect(theme.floatingActionButtonTheme.shape, isNull);
  });

  test('input bridge preserves Material-owned geometry and state styling', () {
    final ThemeData theme = cbThemeData();
    final CbSkinTokens tokens = theme.extension<CbTheme>()!.tokens;
    final InputDecorationThemeData input = theme.inputDecorationTheme;

    expect(input.filled, isFalse);
    expect(input.fillColor, isNull);
    expect(input.hintStyle?.color, tokens.fgSubtle.toColor());
    expect(input.contentPadding, isNull);
    expect(input.border, isNull);
    expect(input.enabledBorder, isNull);
    expect(input.disabledBorder, isNull);
    expect(input.focusedBorder, isNull);
    expect(input.errorBorder, isNull);
    expect(input.focusedErrorBorder, isNull);
    expect(input.labelStyle, isNull);
  });

  test('content bridge preserves Material-owned geometry and state colors', () {
    final ThemeData theme = cbThemeData();
    final CbSkinTokens tokens = theme.extension<CbTheme>()!.tokens;
    final CardThemeData card = theme.cardTheme;
    final ChipThemeData chip = theme.chipTheme;
    final ListTileThemeData listTile = theme.listTileTheme;

    expect(card.color, tokens.surface.toColor());
    expect(card.surfaceTintColor, Colors.transparent);
    expect(card.shape, isNull);
    expect(card.margin, isNull);
    expect(card.elevation, isNull);

    expect(chip.labelStyle, isNull);
    expect(chip.backgroundColor, isNull);
    expect(chip.side, isNull);
    expect(chip.shape, isNull);
    expect(chip.padding, isNull);

    expect(listTile.textColor, isNull);
    expect(listTile.iconColor, isNull);
    expect(listTile.shape, isNull);
    expect(listTile.contentPadding, isNull);
  });

  test('navigation bridge preserves native geometry and state resolution', () {
    final ThemeData theme = cbThemeData();
    final TabBarThemeData tabs = theme.tabBarTheme;
    final MenuThemeData menu = theme.menuTheme;
    final MenuBarThemeData menuBar = theme.menuBarTheme;
    final DrawerThemeData drawer = theme.drawerTheme;
    final NavigationDrawerThemeData navigationDrawer =
        theme.navigationDrawerTheme;

    expect(tabs.indicator, isNull);
    expect(tabs.indicatorColor, isNull);
    expect(tabs.labelColor, isNull);
    expect(tabs.labelPadding, isNull);
    expect(tabs.overlayColor, isNull);
    expect(tabs.splashBorderRadius, isNull);

    expect(menu.style, isNull);
    expect(menu.submenuIcon, isNull);
    expect(menuBar.style, isNull);
    expect(menuBar.submenuIcon, isNull);

    expect(drawer.backgroundColor, isNull);
    expect(drawer.scrimColor, isNull);
    expect(drawer.elevation, isNull);
    expect(drawer.shape, isNull);
    expect(drawer.width, isNull);

    expect(navigationDrawer.tileHeight, isNull);
    expect(navigationDrawer.backgroundColor, isNull);
    expect(navigationDrawer.indicatorColor, isNull);
    expect(navigationDrawer.indicatorShape, isNull);
    expect(navigationDrawer.indicatorSize, isNull);
    expect(navigationDrawer.labelTextStyle, isNull);
    expect(navigationDrawer.iconTheme, isNull);
  });

  test(
    'feedback bridge preserves native geometry, timing, and state colors',
    () {
      final ThemeData theme = cbThemeData();
      final DialogThemeData dialog = theme.dialogTheme;
      final TooltipThemeData tooltip = theme.tooltipTheme;
      final SnackBarThemeData snackBar = theme.snackBarTheme;
      final ProgressIndicatorThemeData progress = theme.progressIndicatorTheme;

      expect(dialog.backgroundColor, isNull);
      expect(dialog.surfaceTintColor, isNull);
      expect(dialog.elevation, isNull);
      expect(dialog.shape, isNull);
      expect(dialog.titleTextStyle, isNull);
      expect(dialog.contentTextStyle, isNull);

      expect(tooltip.decoration, isNull);
      expect(tooltip.textStyle, isNull);
      expect(tooltip.padding, isNull);
      expect(tooltip.waitDuration, isNull);

      expect(snackBar.backgroundColor, isNull);
      expect(snackBar.contentTextStyle, isNull);
      expect(snackBar.behavior, isNull);
      expect(snackBar.shape, isNull);
      expect(snackBar.elevation, isNull);

      expect(progress.color, isNull);
      expect(progress.linearTrackColor, isNull);
      expect(progress.circularTrackColor, isNull);
    },
  );

  test(
    'data-display bridge preserves native geometry and state resolution',
    () {
      final ThemeData theme = cbThemeData();
      final CarouselViewThemeData carousel = theme.carouselViewTheme;
      final DataTableThemeData table = theme.dataTableTheme;

      expect(carousel.backgroundColor, isNull);
      expect(carousel.elevation, isNull);
      expect(carousel.shape, isNull);
      expect(carousel.overlayColor, isNull);
      expect(carousel.padding, isNull);
      expect(carousel.itemClipBehavior, isNull);

      expect(table.decoration, isNull);
      expect(table.dataRowColor, isNull);
      expect(table.dataRowMinHeight, isNull);
      expect(table.dataRowMaxHeight, isNull);
      expect(table.dataTextStyle, isNull);
      expect(table.headingRowColor, isNull);
      expect(table.headingRowHeight, isNull);
      expect(table.headingTextStyle, isNull);
      expect(table.horizontalMargin, isNull);
      expect(table.columnSpacing, isNull);
      expect(table.dividerThickness, isNull);
      expect(table.checkboxHorizontalMargin, isNull);
      expect(table.headingCellCursor, isNull);
      expect(table.dataRowCursor, isNull);
      expect(table.headingRowAlignment, isNull);
    },
  );
}
