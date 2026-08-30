import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/motion.g.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

typedef CbPaginationSemanticLabelBuilder =
    String Function(int page, int pageCount);

/// Controlled page navigation that adapts its density to the available width.
class CbPagination extends StatelessWidget {
  const CbPagination({
    super.key,
    required this.pageCount,
    this.currentPage = 1,
    this.onPageChanged,
    this.semanticLabel,
    this.semanticPageLabelBuilder,
    this.motion = true,
  }) : assert(pageCount > 0),
       assert(currentPage > 0 && currentPage <= pageCount);

  /// Total number of pages. Pages are one-based.
  final int pageCount;

  /// Application-owned current page, using one-based indexing.
  final int currentPage;

  /// Application callback. When absent, the entire control is disabled.
  final ValueChanged<int>? onPageChanged;

  /// Optional localized label for the whole navigation region.
  final String? semanticLabel;

  /// Optional localized spoken label for an individual page.
  final CbPaginationSemanticLabelBuilder? semanticPageLabelBuilder;

  /// Whether color state changes may animate. OS reduced motion always wins.
  final bool motion;

  @override
  Widget build(BuildContext context) {
    final bool reduceMotion =
        MediaQuery.maybeOf(context)?.disableAnimations ?? false;
    final Duration duration = motion && !reduceMotion
        ? CbMotionTokens.fast
        : Duration.zero;

    return Semantics(
      container: true,
      explicitChildNodes: true,
      label: semanticLabel,
      child: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          final bool expanded =
              constraints.hasBoundedWidth &&
              constraints.maxWidth >= CbStructure.space8 * 8;
          return Align(
            alignment: AlignmentDirectional.center,
            child: expanded
                ? _ExpandedPagination(
                    pageCount: pageCount,
                    currentPage: currentPage,
                    onPageChanged: onPageChanged,
                    semanticPageLabelBuilder: semanticPageLabelBuilder,
                    duration: duration,
                  )
                : _CompactPagination(
                    pageCount: pageCount,
                    currentPage: currentPage,
                    onPageChanged: onPageChanged,
                    semanticPageLabelBuilder: semanticPageLabelBuilder,
                    duration: duration,
                  ),
          );
        },
      ),
    );
  }
}

class _ExpandedPagination extends StatelessWidget {
  const _ExpandedPagination({
    required this.pageCount,
    required this.currentPage,
    required this.onPageChanged,
    required this.semanticPageLabelBuilder,
    required this.duration,
  });

  final int pageCount;
  final int currentPage;
  final ValueChanged<int>? onPageChanged;
  final CbPaginationSemanticLabelBuilder? semanticPageLabelBuilder;
  final Duration duration;

  @override
  Widget build(BuildContext context) {
    final List<int?> pages = _visiblePages(pageCount, currentPage);
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        _ArrowControl(
          previous: true,
          enabled: onPageChanged != null && currentPage > 1,
          onTap: () => onPageChanged!(currentPage - 1),
          duration: duration,
        ),
        for (final int? page in pages) ...<Widget>[
          const SizedBox(width: CbStructure.space2),
          if (page == null)
            const _PaginationGap()
          else
            _PageControl(
              page: page,
              selected: page == currentPage,
              enabled: onPageChanged != null,
              semanticLabel:
                  semanticPageLabelBuilder?.call(page, pageCount) ??
                  '$page / $pageCount',
              onTap: page == currentPage ? null : () => onPageChanged!(page),
              duration: duration,
            ),
        ],
        const SizedBox(width: CbStructure.space2),
        _ArrowControl(
          previous: false,
          enabled: onPageChanged != null && currentPage < pageCount,
          onTap: () => onPageChanged!(currentPage + 1),
          duration: duration,
        ),
      ],
    );
  }
}

class _CompactPagination extends StatelessWidget {
  const _CompactPagination({
    required this.pageCount,
    required this.currentPage,
    required this.onPageChanged,
    required this.semanticPageLabelBuilder,
    required this.duration,
  });

  final int pageCount;
  final int currentPage;
  final ValueChanged<int>? onPageChanged;
  final CbPaginationSemanticLabelBuilder? semanticPageLabelBuilder;
  final Duration duration;

  @override
  Widget build(BuildContext context) => Row(
    mainAxisSize: MainAxisSize.min,
    children: <Widget>[
      _ArrowControl(
        previous: true,
        enabled: onPageChanged != null && currentPage > 1,
        onTap: () => onPageChanged!(currentPage - 1),
        duration: duration,
      ),
      const SizedBox(width: CbStructure.space2),
      Semantics(
        selected: true,
        label:
            semanticPageLabelBuilder?.call(currentPage, pageCount) ??
            '$currentPage / $pageCount',
        child: ExcludeSemantics(
          child: AnimatedContainer(
            duration: duration,
            curve: CbMotionTokens.standard,
            constraints: const BoxConstraints(
              minWidth: CbStructure.space8,
              minHeight: CbStructure.controlHeightLg,
            ),
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: context.cb.surface.toColor(),
              border: Border.all(
                color: context.cb.border.toColor(),
                width: CbStructure.borderWidth,
              ),
              borderRadius: CbRadius.md.borderRadius,
            ),
            child: Text(
              '$currentPage / $pageCount',
              style: Theme.of(context).textTheme.labelLarge?.copyWith(
                color: context.cb.fg.toColor(),
                fontFeatures: const <FontFeature>[FontFeature.tabularFigures()],
              ),
            ),
          ),
        ),
      ),
      const SizedBox(width: CbStructure.space2),
      _ArrowControl(
        previous: false,
        enabled: onPageChanged != null && currentPage < pageCount,
        onTap: () => onPageChanged!(currentPage + 1),
        duration: duration,
      ),
    ],
  );
}

class _PageControl extends StatelessWidget {
  const _PageControl({
    required this.page,
    required this.selected,
    required this.enabled,
    required this.semanticLabel,
    required this.onTap,
    required this.duration,
  });

  final int page;
  final bool selected;
  final bool enabled;
  final String semanticLabel;
  final VoidCallback? onTap;
  final Duration duration;

  @override
  Widget build(BuildContext context) => _PaginationControl(
    key: ValueKey<String>('cb-pagination-page-$page'),
    semanticLabel: semanticLabel,
    selected: selected,
    enabled: enabled,
    onTap: enabled ? onTap : null,
    duration: duration,
    child: Text(
      '$page',
      style: Theme.of(context).textTheme.labelLarge?.copyWith(
        color: selected
            ? context.cb.onTone(CbTone.brand).toColor()
            : enabled
            ? context.cb.fg.toColor()
            : context.cb.fgMuted.toColor(),
        fontFeatures: const <FontFeature>[FontFeature.tabularFigures()],
      ),
    ),
  );
}

class _ArrowControl extends StatelessWidget {
  const _ArrowControl({
    required this.previous,
    required this.enabled,
    required this.onTap,
    required this.duration,
  });

  final bool previous;
  final bool enabled;
  final VoidCallback onTap;
  final Duration duration;

  @override
  Widget build(BuildContext context) {
    final MaterialLocalizations localizations = MaterialLocalizations.of(
      context,
    );
    final bool rtl = Directionality.of(context) == TextDirection.rtl;
    final String label = previous
        ? localizations.previousPageTooltip
        : localizations.nextPageTooltip;
    final IconData icon = switch ((previous, rtl)) {
      (true, false) || (false, true) => Icons.chevron_left_rounded,
      _ => Icons.chevron_right_rounded,
    };
    return Tooltip(
      message: label,
      child: _PaginationControl(
        key: ValueKey<String>(
          previous ? 'cb-pagination-previous' : 'cb-pagination-next',
        ),
        semanticLabel: label,
        enabled: enabled,
        onTap: enabled ? onTap : null,
        duration: duration,
        child: Icon(
          icon,
          size: CbStructure.textXl,
          color: enabled
              ? context.cb.fg.toColor()
              : context.cb.fgMuted.toColor(),
        ),
      ),
    );
  }
}

class _PaginationControl extends StatelessWidget {
  const _PaginationControl({
    super.key,
    required this.semanticLabel,
    required this.enabled,
    required this.onTap,
    required this.duration,
    required this.child,
    this.selected = false,
  });

  final String semanticLabel;
  final bool enabled;
  final VoidCallback? onTap;
  final Duration duration;
  final Widget child;
  final bool selected;

  @override
  Widget build(BuildContext context) => Semantics(
    container: true,
    button: true,
    enabled: enabled,
    selected: selected,
    label: semanticLabel,
    child: ExcludeSemantics(
      child: Material(
        type: MaterialType.transparency,
        child: InkWell(
          borderRadius: CbRadius.md.borderRadius,
          onTap: onTap,
          child: AnimatedContainer(
            duration: duration,
            curve: CbMotionTokens.standard,
            width: CbStructure.controlHeightLg,
            height: CbStructure.controlHeightLg,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: selected
                  ? context.cb.accent(tone: CbTone.brand).toColor()
                  : Colors.transparent,
              border: Border.all(
                color: selected
                    ? context.cb.accent(tone: CbTone.brand).toColor()
                    : context.cb.border.toColor(),
                width: CbStructure.borderWidth,
              ),
              borderRadius: CbRadius.md.borderRadius,
            ),
            child: child,
          ),
        ),
      ),
    ),
  );
}

class _PaginationGap extends StatelessWidget {
  const _PaginationGap();

  @override
  Widget build(BuildContext context) => ExcludeSemantics(
    child: SizedBox.square(
      dimension: CbStructure.controlHeightLg,
      child: Center(
        child: Text(
          '…',
          style: Theme.of(
            context,
          ).textTheme.labelLarge?.copyWith(color: context.cb.fgMuted.toColor()),
        ),
      ),
    ),
  );
}

List<int?> _visiblePages(int pageCount, int currentPage) {
  if (pageCount <= 7) {
    return <int?>[for (int page = 1; page <= pageCount; page++) page];
  }
  if (currentPage <= 4) {
    return <int?>[1, 2, 3, 4, 5, null, pageCount];
  }
  if (currentPage >= pageCount - 3) {
    return <int?>[
      1,
      null,
      for (int page = pageCount - 4; page <= pageCount; page++) page,
    ];
  }
  return <int?>[
    1,
    null,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    null,
    pageCount,
  ];
}
