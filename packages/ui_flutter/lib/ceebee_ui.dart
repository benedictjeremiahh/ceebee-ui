/// Ceebee's design system for Flutter.
///
/// The Tokens are generated from the CSS Skins in `packages/ui`, which stay the source of truth,
/// so a colour or a duration has one definition for both platforms. Material owns component
/// geometry, interaction, and accessibility; Ceebee owns the Skin and the Surface variants.
library;

export 'src/foundation/surface.dart';
export 'src/form/input_number/input_number.dart';
export 'src/form/rating/rating.dart';
export 'src/form/color_picker/color_picker.dart';
export 'src/form/upload/upload.dart';
export 'src/form/upload/upload_skeleton.dart';
export 'src/feedback/result/result.dart';
export 'src/feedback/result/result_skeleton.dart';
export 'src/loading/skeleton.dart';
export 'src/motion/reveal.dart';
export 'src/nav/pagination/pagination.dart';
export 'src/nav/pagination/pagination_skeleton.dart';
export 'src/nav/steps/steps.dart';
export 'src/nav/steps/steps_skeleton.dart';
export 'src/onboarding/checklist.dart';
export 'src/onboarding/checklist_skeleton.dart';
export 'src/data/mini_charts/bar_mini.dart';
export 'src/data/mini_charts/bar_mini_math.dart';
export 'src/data/mini_charts/bar_mini_skeleton.dart';
export 'src/data/mini_charts/donut.dart';
export 'src/data/mini_charts/donut_math.dart';
export 'src/data/mini_charts/donut_skeleton.dart';
export 'src/data/mini_charts/sparkline.dart';
export 'src/data/mini_charts/sparkline_math.dart';
export 'src/data/mini_charts/sparkline_skeleton.dart';
export 'src/data/empty/empty.dart';
export 'src/data/empty/empty_skeleton.dart';
export 'src/data/descriptions/descriptions.dart';
export 'src/data/descriptions/descriptions_skeleton.dart';
export 'src/data/statistic/statistic.dart';
export 'src/data/statistic/statistic_skeleton.dart';
export 'src/data/timeline/timeline.dart';
export 'src/data/timeline/timeline_skeleton.dart';
export 'src/theme/cb_theme.dart';
export 'src/theme/material_bridge.dart'
    show cbColorScheme, cbTextTheme, cbThemeData;
export 'src/tokens/generated/motion.g.dart';
export 'src/tokens/generated/data_visualization.g.dart';
export 'src/tokens/generated/structure.g.dart';
export 'src/tokens/generated/surface.g.dart';
export 'src/tokens/generated/skeleton.g.dart';
export 'src/tokens/oklch.dart';
export 'src/tokens/skin_tokens.dart' show CbSkin, CbSkinTokens;
export 'src/tokens/tone.dart';
