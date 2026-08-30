import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';

/// A non-interactive explanation for a collection or feature with no content.
///
/// The app supplies all copy, illustration, and actions. [CbEmpty] owns only
/// the stable inline anatomy and never infers why content is absent.
class CbEmpty extends StatelessWidget {
  const CbEmpty({
    super.key,
    required this.title,
    this.description,
    this.illustration,
    this.action,
    this.padding = CbPad.lg,
  });

  final String title;
  final String? description;
  final Widget? illustration;
  final Widget? action;
  final CbPad padding;

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;
    final Color muted = context.cb.fgMuted.toColor();

    return Semantics(
      container: true,
      explicitChildNodes: true,
      child: Padding(
        padding: padding.insets,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            ExcludeSemantics(
              child: SizedBox.square(
                dimension: CbStructure.controlHeightLg,
                child: IconTheme.merge(
                  data: IconThemeData(color: muted, size: CbStructure.text2xl),
                  child: Center(
                    child: illustration ?? const Icon(Icons.inbox_outlined),
                  ),
                ),
              ),
            ),
            const SizedBox(height: CbStructure.space4),
            Semantics(
              header: true,
              child: Text(
                title,
                textAlign: TextAlign.center,
                style: type.titleMedium,
              ),
            ),
            if (description case final String copy) ...<Widget>[
              const SizedBox(height: CbStructure.space2),
              Text(
                copy,
                textAlign: TextAlign.center,
                style: type.bodyMedium?.copyWith(color: muted),
              ),
            ],
            if (action case final Widget actionWidget) ...<Widget>[
              const SizedBox(height: CbStructure.space5),
              actionWidget,
            ],
          ],
        ),
      ),
    );
  }
}
