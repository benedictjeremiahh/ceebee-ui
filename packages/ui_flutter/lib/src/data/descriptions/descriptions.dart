import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';

/// One ordered label and app-owned value in [CbDescriptions].
@immutable
class CbDescriptionItem {
  const CbDescriptionItem({
    this.key,
    required this.label,
    required this.value,
    this.semanticValue,
    this.fullWidth = false,
  });

  /// Stable identity forwarded to the rendered item boundary.
  final Key? key;
  final String label;
  final Widget value;

  /// A localized spoken equivalent for visually complex [value] content.
  final String? semanticValue;

  /// Whether this item spans the complete wide layout.
  ///
  /// Compact layouts are always one column regardless of this value.
  final bool fullWidth;
}

/// A responsive, non-interactive summary of ordered read-only fields.
class CbDescriptions extends StatelessWidget {
  const CbDescriptions({
    super.key,
    required this.items,
    this.title,
    this.action,
  });

  final List<CbDescriptionItem> items;
  final String? title;

  /// An optional native action owned entirely by the application.
  final Widget? action;

  @override
  Widget build(BuildContext context) => Semantics(
    container: true,
    explicitChildNodes: true,
    child: Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        if (title != null || action != null) ...<Widget>[
          _DescriptionsHeader(title: title, action: action),
          const SizedBox(height: CbStructure.space5),
        ],
        LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            final bool compact =
                !constraints.hasBoundedWidth ||
                constraints.maxWidth < CbStructure.space8 * 8;
            if (compact) {
              return Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  for (
                    int index = 0;
                    index < items.length;
                    index++
                  ) ...<Widget>[
                    if (index > 0) const SizedBox(height: CbStructure.space4),
                    _DescriptionItem(item: items[index]),
                  ],
                ],
              );
            }

            final double itemWidth =
                (constraints.maxWidth - CbStructure.space5) / 2;
            return Wrap(
              spacing: CbStructure.space5,
              runSpacing: CbStructure.space5,
              children: <Widget>[
                for (final CbDescriptionItem item in items)
                  SizedBox(
                    width: item.fullWidth ? constraints.maxWidth : itemWidth,
                    child: _DescriptionItem(item: item),
                  ),
              ],
            );
          },
        ),
      ],
    ),
  );
}

class _DescriptionsHeader extends StatelessWidget {
  const _DescriptionsHeader({this.title, this.action});

  final String? title;
  final Widget? action;

  @override
  Widget build(BuildContext context) {
    final Widget? heading = title == null
        ? null
        : Semantics(
            header: true,
            child: Text(title!, style: Theme.of(context).textTheme.titleMedium),
          );
    if (heading == null) {
      return Align(alignment: AlignmentDirectional.centerEnd, child: action);
    }
    if (action == null) return heading;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        Expanded(child: heading),
        const SizedBox(width: CbStructure.space4),
        action!,
      ],
    );
  }
}

class _DescriptionItem extends StatelessWidget {
  const _DescriptionItem({required this.item});

  final CbDescriptionItem item;

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;
    final Widget visual = Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        ExcludeSemantics(
          child: Text(
            item.label,
            style: type.labelMedium?.copyWith(
              color: context.cb.fgMuted.toColor(),
            ),
          ),
        ),
        const SizedBox(height: CbStructure.space2),
        IconTheme.merge(
          data: IconThemeData(
            color: context.cb.fg.toColor(),
            size: CbStructure.textLg,
          ),
          child: DefaultTextStyle.merge(
            style: type.bodyMedium,
            child: item.value,
          ),
        ),
      ],
    );

    if (item.semanticValue case final String spokenValue) {
      return Semantics(
        key: item.key,
        container: true,
        label: item.label,
        value: spokenValue,
        child: ExcludeSemantics(child: visual),
      );
    }
    return Semantics(
      key: item.key,
      container: true,
      explicitChildNodes: true,
      label: item.label,
      child: visual,
    );
  }
}
