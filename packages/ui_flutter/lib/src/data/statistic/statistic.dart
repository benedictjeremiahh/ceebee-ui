import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

/// A compact, non-interactive label and app-formatted value.
///
/// Formatting, locale, precision, units, and live data remain application
/// concerns. [CbStatistic] owns only visual hierarchy and grouped semantics.
class CbStatistic extends StatelessWidget {
  const CbStatistic({
    super.key,
    required this.label,
    required this.value,
    this.semanticValue,
    this.prefix,
    this.suffix,
    this.description,
    this.tone = CbTone.neutral,
  });

  final String label;

  /// The already-formatted value displayed exactly as provided.
  final String value;

  /// A localized spoken equivalent when [value] is not read naturally.
  final String? semanticValue;

  /// Decorative visual content included before [value].
  final Widget? prefix;

  /// Decorative visual content included after [value].
  final Widget? suffix;

  final String? description;
  final CbTone tone;

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;
    final Color valueColor = tone == CbTone.neutral
        ? context.cb.fg.toColor()
        : context.cb.accent(tone: tone).toColor();
    final TextStyle valueStyle = (type.displaySmall ?? const TextStyle())
        .copyWith(
          color: valueColor,
          fontFeatures: const <FontFeature>[FontFeature.tabularFigures()],
        );

    return Semantics(
      container: true,
      explicitChildNodes: true,
      label: label,
      value: semanticValue ?? value,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          ExcludeSemantics(child: Text(label, style: type.labelMedium)),
          const SizedBox(height: CbStructure.space2),
          ExcludeSemantics(
            child: IconTheme.merge(
              data: IconThemeData(color: valueColor, size: CbStructure.textXl),
              child: DefaultTextStyle.merge(
                style: valueStyle,
                child: Row(
                  children: <Widget>[
                    if (prefix case final Widget prefixWidget) ...<Widget>[
                      prefixWidget,
                      const SizedBox(width: CbStructure.space2),
                    ],
                    Flexible(
                      child: Text(value, softWrap: true, style: valueStyle),
                    ),
                    if (suffix case final Widget suffixWidget) ...<Widget>[
                      const SizedBox(width: CbStructure.space2),
                      suffixWidget,
                    ],
                  ],
                ),
              ),
            ),
          ),
          if (description case final String copy) ...<Widget>[
            const SizedBox(height: CbStructure.space2),
            Text(copy, style: type.bodySmall),
          ],
        ],
      ),
    );
  }
}
