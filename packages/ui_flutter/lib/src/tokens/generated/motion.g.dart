// GENERATED FILE — DO NOT EDIT.
//
// Written by scripts/gen-flutter-tokens.mjs from packages/ui/src/tokens/motion.css, which is the source of truth.
// Regenerate with: node scripts/gen-flutter-tokens.mjs

import 'package:flutter/animation.dart';

/// Motion Tokens. A component reads one of these; it never writes a duration or a curve.
abstract final class CbMotionTokens {
  static const Duration instant = Duration(milliseconds: 80);
  static const Duration fast = Duration(milliseconds: 140);
  static const Duration base = Duration(milliseconds: 220);
  static const Duration slow = Duration(milliseconds: 380);
  static const Duration deliberate = Duration(milliseconds: 620);
  static const Duration staggerTight = Duration(milliseconds: 40);
  static const Duration staggerStandard = Duration(milliseconds: 60);
  static const Duration staggerRelaxed = Duration(milliseconds: 80);
  static const Cubic standard = Cubic(0.2, 0.0, 0.0, 1.0);
  static const Cubic entrance = Cubic(0.05, 0.7, 0.1, 1.0);
  static const Cubic exit = Cubic(0.3, 0.0, 0.8, 0.15);
  static const Cubic emphasis = Cubic(0.34, 1.56, 0.64, 1.0);
}
