import 'package:flutter/widgets.dart';

import 'package:ceebee_ui/src/tokens/generated/data_visualization.g.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

extension CbMiniChartSize on CbSize {
  double get donutDiameter => switch (this) {
    CbSize.sm => CbDataVisualizationTokens.donutSizeSm,
    CbSize.md => CbDataVisualizationTokens.donutSizeMd,
    CbSize.lg => CbDataVisualizationTokens.donutSizeLg,
  };

  double get donutThickness => switch (this) {
    CbSize.sm => CbDataVisualizationTokens.donutThicknessSm,
    CbSize.md => CbDataVisualizationTokens.donutThicknessMd,
    CbSize.lg => CbDataVisualizationTokens.donutThicknessLg,
  };

  Size get plotSize => switch (this) {
    CbSize.sm => const Size(
      CbDataVisualizationTokens.widthSm,
      CbDataVisualizationTokens.heightSm,
    ),
    CbSize.md => const Size(
      CbDataVisualizationTokens.widthMd,
      CbDataVisualizationTokens.heightMd,
    ),
    CbSize.lg => const Size(
      CbDataVisualizationTokens.widthLg,
      CbDataVisualizationTokens.heightLg,
    ),
  };
}
