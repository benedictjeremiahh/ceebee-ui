import 'dart:math' as math;
import 'dart:ui' show lerpDouble;
import 'package:flutter/foundation.dart';
import 'package:flutter/painting.dart';

/// A colour in oklch, the space the CSS Skins are authored in.
///
/// Keeping the Token in oklch rather than a resolved sRGB value is what lets `tinted` and
/// `gradient` mix the way `color-mix(in oklch, …)` does on the web. A mix done in sRGB darkens
/// and desaturates through the middle; the same mix in oklch does not, and the pastel card set
/// depends on that difference.
@immutable
class CbOklch {
  const CbOklch(this.lightness, this.chroma, this.hue, {this.alpha = 1.0});

  /// Fully transparent, and the resolution of the CSS `transparent` keyword.
  static const CbOklch transparent = CbOklch(0.0, 0.0, 0.0, alpha: 0.0);

  /// Perceived lightness, 0 to 1.
  final double lightness;

  /// Chroma. Unbounded in principle; values beyond the sRGB gamut are mapped, never clipped raw.
  final double chroma;

  /// Hue angle in degrees.
  final double hue;

  final double alpha;

  CbOklch withAlpha(double value) =>
      CbOklch(lightness, chroma, hue, alpha: value);

  /// Multiplies the existing alpha, for a Token that already carries one.
  CbOklch scaleAlpha(double factor) => withAlpha(alpha * factor);

  /// The CSS `color-mix(in oklch, this <weight>, other)` — `weight` is this colour's share.
  ///
  /// Hue takes the shorter arc and the coordinates are premultiplied by alpha, both as CSS
  /// interpolation specifies, so a mix into a translucent Surface does not drift toward grey.
  CbOklch mix(CbOklch other, double weight) {
    final double w = weight.clamp(0.0, 1.0);
    final double a = alpha * w + other.alpha * (1 - w);

    if (a == 0) return CbOklch.transparent;

    final double l =
        (lightness * alpha * w + other.lightness * other.alpha * (1 - w)) / a;
    final double c =
        (chroma * alpha * w + other.chroma * other.alpha * (1 - w)) / a;

    // CSS treats hue as missing for an achromatic colour. Without this, mixing
    // green with white travels through red simply because white stores hue 0.
    double from = chroma <= _achromaticEpsilon ? other.hue % 360 : hue % 360;
    double to = other.chroma <= _achromaticEpsilon ? from : other.hue % 360;
    if ((to - from).abs() > 180) {
      if (to > from) {
        from += 360;
      } else {
        to += 360;
      }
    }
    final double h = (from * w + to * (1 - w)) % 360;

    return CbOklch(l, c, h, alpha: a);
  }

  /// The sRGB rendering, gamut-mapped rather than clipped.
  Color toColor() => _cache.putIfAbsent(this, _resolve);

  static final Map<CbOklch, Color> _cache = <CbOklch, Color>{};

  static const double _achromaticEpsilon = 0.000001;

  Color _resolve() {
    final _Rgb rgb = _gamutMap(lightness, chroma, hue);
    return Color.from(
      alpha: alpha.clamp(0.0, 1.0),
      red: rgb.r,
      green: rgb.g,
      blue: rgb.b,
    );
  }

  @override
  bool operator ==(Object other) =>
      other is CbOklch &&
      other.lightness == lightness &&
      other.chroma == chroma &&
      other.hue == hue &&
      other.alpha == alpha;

  @override
  int get hashCode => Object.hash(lightness, chroma, hue, alpha);

  @override
  String toString() => 'CbOklch($lightness, $chroma, $hue, alpha: $alpha)';
}

class _Rgb {
  const _Rgb(this.r, this.g, this.b);
  final double r;
  final double g;
  final double b;

  bool get inGamut =>
      r >= -_epsilon &&
      r <= 1 + _epsilon &&
      g >= -_epsilon &&
      g <= 1 + _epsilon &&
      b >= -_epsilon &&
      b <= 1 + _epsilon;

  _Rgb get clipped =>
      _Rgb(r.clamp(0.0, 1.0), g.clamp(0.0, 1.0), b.clamp(0.0, 1.0));

  static const double _epsilon = 0.000075;
}

/// Oklab to linear sRGB, then the sRGB transfer function. Ottosson's matrices, as CSS Color 4 uses.
_Rgb _oklchToRgb(double l, double c, double h) {
  final double radians = h * math.pi / 180;
  final double a = c * math.cos(radians);
  final double b = c * math.sin(radians);

  final double lp = l + 0.3963377774 * a + 0.2158037573 * b;
  final double mp = l - 0.1055613458 * a - 0.0638541728 * b;
  final double sp = l - 0.0894841775 * a - 1.2914855480 * b;

  final double lc = lp * lp * lp;
  final double mc = mp * mp * mp;
  final double sc = sp * sp * sp;

  return _Rgb(
    _encode(4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc),
    _encode(-1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc),
    _encode(-0.0041960863 * lc - 0.7034186147 * mc + 1.7076147010 * sc),
  );
}

double _encode(double channel) {
  final double sign = channel < 0 ? -1.0 : 1.0;
  final double value = channel.abs();
  return value <= 0.0031308
      ? channel * 12.92
      : sign * (1.055 * math.pow(value, 1 / 2.4) - 0.055);
}

/// The CSS Color 4 gamut mapping: hold lightness and hue, reduce chroma until the clipped result
/// is within one just-noticeable difference. Plain clipping would shift the hue of the saturated
/// end of the brand ramp, which is exactly where it would be noticed.
_Rgb _gamutMap(double l, double c, double h) {
  if (l >= 1.0) return const _Rgb(1, 1, 1);
  if (l <= 0.0) return const _Rgb(0, 0, 0);

  final _Rgb direct = _oklchToRgb(l, c, h);
  if (direct.inGamut) return direct.clipped;

  const double jnd = 0.02;
  double low = 0;
  double high = c;
  _Rgb best = _oklchToRgb(l, 0, h).clipped;

  while (high - low > 0.0001) {
    final double mid = (low + high) / 2;
    final _Rgb candidate = _oklchToRgb(l, mid, h);
    if (candidate.inGamut) {
      best = candidate.clipped;
      low = mid;
      continue;
    }
    final _Rgb clipped = candidate.clipped;
    if (_deltaEOk(candidate, clipped) < jnd) {
      best = clipped;
      break;
    }
    high = mid;
  }
  return best;
}

double _deltaEOk(_Rgb a, _Rgb b) {
  final List<double> first = _rgbToOklab(a);
  final List<double> second = _rgbToOklab(b);
  final double dl = first[0] - second[0];
  final double da = first[1] - second[1];
  final double db = first[2] - second[2];
  return math.sqrt(dl * dl + da * da + db * db);
}

List<double> _rgbToOklab(_Rgb rgb) {
  final double r = _decode(rgb.r);
  final double g = _decode(rgb.g);
  final double b = _decode(rgb.b);

  final double l = math
      .pow(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b, 1 / 3)
      .toDouble();
  final double m = math
      .pow(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b, 1 / 3)
      .toDouble();
  final double s = math
      .pow(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b, 1 / 3)
      .toDouble();

  return <double>[
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
  ];
}

double _decode(double channel) {
  final double value = channel.abs();
  final double linear = value <= 0.04045
      ? value / 12.92
      : math.pow((value + 0.055) / 1.055, 2.4).toDouble();
  return channel < 0 ? -linear : linear;
}

/// One entry of a CSS `box-shadow` list, inset or outset.
///
/// Flutter has no inset shadow, so an inset entry is kept as data and painted as an edge line by
/// whoever draws the material. Dropping it would cost glass the rim that reads as its thickness.
@immutable
class CbShadow {
  const CbShadow({
    required this.offsetX,
    required this.offsetY,
    required this.blur,
    required this.color,
    this.inset = false,
  });

  final double offsetX;
  final double offsetY;
  final double blur;
  final CbOklch color;
  final bool inset;

  BoxShadow toBoxShadow() => BoxShadow(
    color: color.toColor(),
    offset: Offset(offsetX, offsetY),
    blurRadius: blur,
  );

  @override
  bool operator ==(Object other) =>
      other is CbShadow &&
      other.offsetX == offsetX &&
      other.offsetY == offsetY &&
      other.blur == blur &&
      other.color == color &&
      other.inset == inset;

  @override
  int get hashCode => Object.hash(offsetX, offsetY, blur, color, inset);
}

/// The outset entries of a shadow list, ready for a [BoxDecoration].
List<BoxShadow> cbOutsetShadows(List<CbShadow> shadows) => <BoxShadow>[
  for (final CbShadow shadow in shadows)
    if (!shadow.inset) shadow.toBoxShadow(),
];

/// The inset entries, which a painter renders as edge lines.
List<CbShadow> cbInsetShadows(List<CbShadow> shadows) => <CbShadow>[
  for (final CbShadow shadow in shadows)
    if (shadow.inset) shadow,
];

@immutable
class CbGradientStop {
  const CbGradientStop(this.color, this.position);
  final CbOklch color;
  final double position;

  @override
  bool operator ==(Object other) =>
      other is CbGradientStop &&
      other.color == color &&
      other.position == position;

  @override
  int get hashCode => Object.hash(color, position);
}

/// A CSS `linear-gradient` with its angle preserved.
///
/// CSS measures the angle clockwise from "to top"; Flutter wants two alignments. Converting here
/// rather than at codegen time keeps the Token readable as the value the Skin actually wrote.
@immutable
class CbGradient {
  const CbGradient({required this.angle, required this.stops});

  final double angle;
  final List<CbGradientStop> stops;

  LinearGradient toLinearGradient() {
    final double radians = (angle - 90) * math.pi / 180;
    final double dx = math.cos(radians);
    final double dy = math.sin(radians);
    return LinearGradient(
      begin: Alignment(-dx, -dy),
      end: Alignment(dx, dy),
      colors: <Color>[
        for (final CbGradientStop stop in stops) stop.color.toColor(),
      ],
      stops: <double>[for (final CbGradientStop stop in stops) stop.position],
    );
  }

  @override
  bool operator ==(Object other) =>
      other is CbGradient &&
      other.angle == angle &&
      listEquals(other.stops, stops);

  @override
  int get hashCode => Object.hash(angle, Object.hashAll(stops));
}

/// Interpolates in oklch, the space the Tokens live in.
CbOklch lerpCbOklch(CbOklch a, CbOklch b, double t) => a.mix(b, 1 - t);

/// Interpolates two shadow lists. Lists of different lengths have no meaningful midpoint, so
/// they change over at the halfway mark rather than inventing entries.
List<CbShadow> lerpCbShadows(List<CbShadow> a, List<CbShadow> b, double t) {
  if (a.length != b.length) return t < 0.5 ? a : b;
  return <CbShadow>[
    for (int i = 0; i < a.length; i += 1)
      CbShadow(
        offsetX: lerpDouble(a[i].offsetX, b[i].offsetX, t)!,
        offsetY: lerpDouble(a[i].offsetY, b[i].offsetY, t)!,
        blur: lerpDouble(a[i].blur, b[i].blur, t)!,
        color: lerpCbOklch(a[i].color, b[i].color, t),
        // Inset and outset are different paintings, not two ends of a scale.
        inset: t < 0.5 ? a[i].inset : b[i].inset,
      ),
  ];
}

CbGradient lerpCbGradient(CbGradient a, CbGradient b, double t) {
  if (a.stops.length != b.stops.length) return t < 0.5 ? a : b;
  return CbGradient(
    angle: lerpDouble(a.angle, b.angle, t)!,
    stops: <CbGradientStop>[
      for (int i = 0; i < a.stops.length; i += 1)
        CbGradientStop(
          lerpCbOklch(a.stops[i].color, b.stops[i].color, t),
          lerpDouble(a.stops[i].position, b.stops[i].position, t)!,
        ),
    ],
  );
}
