import 'package:flutter/foundation.dart';

/// One named part of a [CbDonut].
@immutable
class CbDonutSlice {
  const CbDonutSlice({required this.value, required this.label});

  final double value;
  final String label;

  @override
  bool operator ==(Object other) =>
      other is CbDonutSlice && other.value == value && other.label == label;

  @override
  int get hashCode => Object.hash(value, label);
}

/// The proportional geometry of one drawable [CbDonutSlice].
@immutable
class CbDonutArc {
  const CbDonutArc({
    required this.value,
    required this.label,
    required this.fraction,
    required this.length,
    required this.offset,
    required this.index,
  });

  final double value;
  final String label;
  final double fraction;
  final double length;
  final double offset;
  final int index;

  @override
  bool operator ==(Object other) =>
      other is CbDonutArc &&
      other.value == value &&
      other.label == label &&
      other.fraction == fraction &&
      other.length == length &&
      other.offset == offset &&
      other.index == index;

  @override
  int get hashCode =>
      Object.hash(value, label, fraction, length, offset, index);
}

/// Turns positive finite values into adjacent proportional arcs.
///
/// Negative and non-finite values are dropped rather than painted backwards. A
/// zero total returns no arcs, which avoids division by zero.
List<CbDonutArc> cbDonutArcs(
  Iterable<CbDonutSlice> slices,
  double circumference,
) {
  final List<CbDonutSlice> usable = slices
      .where((CbDonutSlice slice) => slice.value.isFinite && slice.value > 0)
      .toList(growable: false);
  final double total = usable.fold(
    0,
    (double sum, CbDonutSlice slice) => sum + slice.value,
  );
  if (total <= 0) return const <CbDonutArc>[];

  double consumed = 0;
  return <CbDonutArc>[
    for (final (int index, CbDonutSlice slice) in usable.indexed)
      (() {
        final double fraction = slice.value / total;
        final double length = fraction * circumference;
        final CbDonutArc arc = CbDonutArc(
          value: slice.value,
          label: slice.label,
          fraction: fraction,
          length: length,
          offset: -consumed,
          index: index,
        );
        consumed += length;
        return arc;
      })(),
  ];
}
